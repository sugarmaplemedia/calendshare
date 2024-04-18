import { users } from "$lib/drizzle/schema"
import { error, json } from "@sveltejs/kit"

export async function POST({ locals: { drizzle, getSession }, request }) {
	const session = await getSession()
	const data = await request.json()

	console.log("HIT GUEST", data)

	if (session) {
		throw error(400, "You are already a user.")
	}

	const firstName = data.firstName
	const lastName = data.lastName

	if (!firstName && !lastName) {
		throw error(400, "Please provide a first and last name.")
	} else if (!firstName || typeof firstName !== "string") {
		throw error(400, "first name of type string is required.")
	} else if (!lastName || typeof lastName !== "string") {
		throw error(400, "last name of type string is required.")
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
