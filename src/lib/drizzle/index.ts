import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js"
import { DB_URL } from "$env/static/private"
import postgres from "postgres"
import * as schema from "./schema"

export async function createDrizzleClient(): Promise<PostgresJsDatabase<typeof schema>> {
	const client = postgres(DB_URL, { prepare: false })
	return drizzle(client, { schema })
}
