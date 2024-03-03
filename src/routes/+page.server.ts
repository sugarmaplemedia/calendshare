import postgres from "postgres"
import { drizzle } from "drizzle-orm/postgres-js"
import { DB_URL } from "$env/static/private"
import { profile } from "$lib/db/schema"

export async function load() {
	const client = postgres(DB_URL)
	const db = drizzle(client)

	const allUsers = (await db.select().from(profile)) ?? []

	return {
		allUsers
	}
}
