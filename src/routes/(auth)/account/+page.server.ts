import { users } from "$lib/drizzle/schema.js"
import { fail, redirect } from "@sveltejs/kit"
import { eq } from "drizzle-orm"

export const load = async ({ locals: { getSession, drizzle } }) => {
	const session = await getSession()

	if (!session) {
		redirect(303, "/login")
	}

	const user = await drizzle.query.users.findFirst({
		where: (users, { eq }) => eq(users.id, session.user.id)
	})

	const calendshareRecords = await drizzle.query.records.findMany({
		where: (records, { eq }) => eq(records.userId, user!.id),
		with: {
			calendshare: {
				with: {
					owner: true
				}
			}
		}
	})

	return { session, user, calendshareRecords }
}

export const actions = {
	update: async ({ request, locals: { getSession, drizzle } }) => {
		const formData = await request.formData()
		const firstName = formData.get("firstName") as string
		const lastName = formData.get("lastName") as string

		console.log("Hit", firstName, lastName)

		const session = await getSession()

		if (!session) {
			return fail(401)
		}

		await drizzle.update(users).set({ firstName, lastName }).where(eq(users.id, session!.user.id))

		return {
			firstName: firstName,
			lastName: lastName
		}
	}
}
