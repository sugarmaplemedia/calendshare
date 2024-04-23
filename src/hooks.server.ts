import type { Handle } from "@sveltejs/kit"
import { createSupabaseBackendClient } from "$lib/supabase"
import { createDrizzleClient } from "$lib/drizzle"

// Declared outside hook to (hopefully) prevent multiple connections
const dbConnection = await createDrizzleClient()

export const handle: Handle = async ({ event, resolve }) => {
	// Sharing supabase client with all server-side routes
	event.locals.supabase = createSupabaseBackendClient(event)

	// Sharing getSession function with all routes
	event.locals.getSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession()
		return session
	}

	event.locals.drizzle = dbConnection

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === "content-range"
		}
	})
}
