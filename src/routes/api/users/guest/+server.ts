import { users } from "$lib/drizzle/schema"
import { error, json } from "@sveltejs/kit"
import { and, eq } from "drizzle-orm"

export async function POST({ locals: { drizzle, getSession }, request }) {
	const session = await getSession()
	const data = await request.json()

	if (session) {
		error(400, "You are already a user.")
	}

	const id = data.id
	if (id) {
		const guest = await drizzle.query.users.findFirst({
			where: and(eq(users.id, id), eq(users.guest, true))
		})

		if (!guest) {
			error(400, "User not found.")
		}

		console.log("FOUND GUEST", guest)

		return json(guest)
	}

	const firstName = data.firstName
	const lastName = data.lastName

	if (!firstName && !lastName) {
		error(400, "Please provide a first and last name.")
	} else if (!firstName || typeof firstName !== "string") {
		error(400, "first name of type string is required.")
	} else if (!lastName || typeof lastName !== "string") {
		error(400, "last name of type string is required.")
	}

	const guest = (
		await drizzle
			.insert(users)
			.values({
				firstName,
				lastName,
				guest: true
			})
			.returning()
	)[0]

	return json(guest)
}
