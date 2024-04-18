import { SupabaseClient, Session } from "@supabase/supabase-js"
import { PostgresJsDatabase } from "drizzle-orm/postgres-js"
import * as schema from "$lib/drizzle/schema"

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient
			drizzle: PostgresJsDatabase<typeof schema>
			getSession(): Promise<Session | null>
		}
		interface PageData {
			session: Session | null
		}
		// interface Error {}
		// interface Platform {}
	}
}
