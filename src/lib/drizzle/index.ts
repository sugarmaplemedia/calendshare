import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

export async function createDrizzleClient(): Promise<PostgresJsDatabase<typeof schema>> {
	const { DB_URL } = await import("$env/static/private")

	const client = postgres(DB_URL, { prepare: false })
	return drizzle(client, { schema })
}
