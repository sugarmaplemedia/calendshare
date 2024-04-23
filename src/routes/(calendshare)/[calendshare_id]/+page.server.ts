import { CalendshareClient } from "$lib/calendshare/api.js"
import { palette } from "$lib/calendshare/color"
import { users } from "$lib/drizzle/schema.js"
import { error } from "@sveltejs/kit"
import { eq } from "drizzle-orm"

export async function load({ locals: { getSession, drizzle }, params }) {
	const calendshare = await CalendshareClient.get(params.calendshare_id)

	if (!calendshare) {
		error(404)
	}

	const session = await getSession()

	const user = session
		? await drizzle.query.users.findFirst({
				where: eq(users.id, session.user.id)
		  })
		: undefined

	return {
		calendshare,
		user,
		palette
	}
}
