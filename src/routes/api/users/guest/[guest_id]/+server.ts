import { users } from "$lib/drizzle/schema"
import { error, json } from "@sveltejs/kit"
import { and, eq } from "drizzle-orm"

export async function PATCH({ locals: { drizzle, session }, params, request }) {
	if (session) {
		error(400, "You are already a user.")
	}

	const { guest_id } = params

	const guest = await drizzle.query.users.findFirst({
		where: and(eq(users.id, guest_id), eq(users.guest, true))
	})

	if (!guest) {
		error(404, "User not found.")
	}

	const { firstName, lastName } = (await request.json()) as {
		firstName?: string
		lastName?: string
	}

	if (!firstName && !lastName) {
		error(400, "Please provide a first and last name.")
	} else if (!firstName || typeof firstName !== "string") {
		error(400, "first name of type string is required.")
	} else if (!lastName || typeof lastName !== "string") {
		error(400, "last name of type string is required.")
	}

	await drizzle
		.update(users)
		.set({
			firstName,
			lastName
		})
		.where(eq(users.id, guest_id))

	return new Response(null, { status: 204 })
}
