import { browser } from "$app/environment"
import { calendshares, users } from "$lib/drizzle/schema.js"
import { error, redirect } from "@sveltejs/kit"
import { eq } from "drizzle-orm"

export async function load({ locals: { session, drizzle }, params, cookies }) {
	const { calendshare_id } = params

	const calendshare = await drizzle.query.calendshares.findFirst({
		where: eq(calendshares.id, calendshare_id),
		with: {
			days: { with: { day: true } },
			records: {
				with: {
					entries: { with: { day: true } },
					user: true
				}
			}
		}
	})

	if (!calendshare) {
		error(404)
	}

	const user = session
		? await drizzle.query.users.findFirst({
				where: eq(users.id, session.user.id)
		  })
		: undefined

	// Personal: only let owner view the calendshare
	if (calendshare.visibility === "personal" && user?.id !== calendshare.ownerId) {
		error(403, "This calendshare can only be viewed by its owner.")
	}

	// Private: only let registered users and those with the password view the file
	if (calendshare.visibility === "private") {
		const isVerified = cookies.get("verified") === calendshare.id

		if (!calendshare.records.map(({ userId }) => userId).includes(user?.id ?? "") && !isVerified) {
			redirect(303, `/locked/${calendshare.id}`)
		}
	}

	return {
		calendshare,
		user
	}
}
