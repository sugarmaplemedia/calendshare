import db from "$lib/calendshare/db"
import { error } from "@sveltejs/kit"

/** @type {import('./$types').RequestHandler} */
export async function POST({ url, request }) {
	let data = await request?.json()

	// TODO: Data is received here! Now we need to save it to the database.
	db.save(data)

	throw error(500, data)
}
