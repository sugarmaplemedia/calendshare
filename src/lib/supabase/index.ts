import type { LoadEvent, RequestEvent } from "@sveltejs/kit"
import type { Session, SupabaseClient } from "@supabase/supabase-js"
import {
	createSupabaseLoadClient,
	createSupabaseServerClient
} from "@supabase/auth-helpers-sveltekit"
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from "$env/static/public"

export function createSupabaseBackendClient(
	event: RequestEvent<Partial<Record<string, string>>, string | null>
): SupabaseClient {
	return createSupabaseServerClient({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event
	})
}

export function createSupabaseFrontendClient(
	serverSession: Session | null,
	event: Pick<
		LoadEvent<
			Partial<Record<string, string>>,
			Record<string, any> | null,
			Record<string, any>,
			string | null
		>,
		"fetch"
	>
): SupabaseClient {
	return createSupabaseLoadClient({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event,
		serverSession
	})
}
