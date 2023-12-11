import { decodeToken } from "$lib/server/firebase"
import type { Handle } from "@sveltejs/kit"

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get("token") || ""
	const decodedToken = await decodeToken(token)
	if (decodedToken) {
		const { uid, email, firstName, lastName } = decodedToken
		event.locals.user = { uid, email, firstName, lastName }
	}

	const response = await resolve(event)

	return response
}
