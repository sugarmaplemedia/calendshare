import { createServerClient } from "@supabase/ssr"
import { type Handle } from "@sveltejs/kit"
import { sequence } from "@sveltejs/kit/hooks"

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "$env/static/public"
import { createDrizzleClient } from "$lib/drizzle"

const supabase: Handle = async ({ event, resolve }) => {
	/**
	 * Creates a Supabase client specific to this server request.
	 *
	 * The Supabase client gets the Auth token from the request cookies.
	 */
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			get: (key) => event.cookies.get(key),
			set: (key, value, options) => {
				event.cookies.set(key, value, { ...options, path: "/" })
			},
			remove: (key, options) => {
				event.cookies.delete(key, { ...options, path: "/" })
			}
		}
	})

	event.locals.getSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession()
		return session
	}

	/**
	 * Unlike `supabase.auth.getSession()`, which returns the session _without_
	 * validating the JWT, this function also calls `getUser()` to validate the
	 * JWT before returning the session.
	 */
	event.locals.safeGetSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession()
		if (!session) {
			return { session: null, user: null }
		}

		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser()
		if (error) {
			// JWT validation has failed
			return { session: null, user: null }
		}

		return { session, user }
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			/**
			 * Supabase libraries use the `content-range` header, so we need to
			 * tell SvelteKit to pass it through.
			 */
			return name === "content-range"
		}
	})
}

const authGuard: Handle = async ({ event, resolve }) => {
	const { session, user } = await event.locals.safeGetSession()
	event.locals.session = session
	event.locals.user = user

	return resolve(event)
}

const dbConnection = await createDrizzleClient()

export const drizzle: Handle = async ({ event, resolve }) => {
	event.locals.drizzle = dbConnection

	return resolve(event)
}

export const handle: Handle = sequence(supabase, authGuard, drizzle)
