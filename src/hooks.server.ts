import type { Handle } from "@sveltejs/kit"
import { createSupabaseBackendClient } from "$lib/supabase"
import { createDrizzleClient } from "$lib/drizzle"

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

	event.locals.drizzle = await createDrizzleClient()

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === "content-range"
		}
	})
}
