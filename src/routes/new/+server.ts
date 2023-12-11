import { DayWeekCalendar } from "$lib/calendshare/db/collections/DayWeekCalendars"
import db from "$lib/calendshare/db/index.js"
import { redirect } from "@sveltejs/kit"
import crypto from "crypto"

export async function GET() {
	const id = crypto.randomBytes(12).toString("hex")
	await db.calendar
		.set(id, { users: [], options: { id: id, days: "all", hours: "all" } })
		.then(() => {
			throw redirect(303, `/calendar/${id}`)
		})
}
