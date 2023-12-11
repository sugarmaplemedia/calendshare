import db from "$lib/calendshare/db"
import { error } from "@sveltejs/kit"

export async function GET({ params: { id } }) {
	try {
		return new Response(JSON.stringify(await db.user.retrieveOne(id)))
	} catch (theError) {
		console.log(theError)
		throw error(404, "User not found")
	}
}
