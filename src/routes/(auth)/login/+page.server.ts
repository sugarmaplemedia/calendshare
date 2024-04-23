import { users } from "$lib/drizzle/schema.js"
import { redirect } from "@sveltejs/kit"

export const load = async ({ locals: { getSession, drizzle } }) => {
	const session = await getSession()

	// Handling redirect/creating user from auth user details
	if (session) {
		const user = await drizzle.query.users.findFirst({
			where: (users, { eq }) => eq(users.id, session!.user.id)
		})

		if (!user) {
			await drizzle.insert(users).values({ id: session.user.id, guest: false })
		}

		redirect(303, "/account")
	}
}
