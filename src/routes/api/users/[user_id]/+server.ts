import { error, json } from "@sveltejs/kit"

export async function GET({ locals: { drizzle }, params }) {
	const { user_id } = params

	const user = await drizzle.query.users.findFirst({
		where: (users, { eq }) => eq(users.id, user_id)
	})

	if (!user) {
		error(404, "User not found")
	}

	const { guestPassword, ...userWithoutGuestPassword } = user

	return json({ user: userWithoutGuestPassword })
}
