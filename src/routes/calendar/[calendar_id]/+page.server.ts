import { DayWeekCalendar } from "$lib/calendshare/db/collections/DayWeekCalendars.js"
import { error } from "@sveltejs/kit"
import type { Actions } from "./$types"
import { initializeFirebase } from "$lib/client/firebase"

export async function load({ params }) {
	initializeFirebase()
	const calendar = await DayWeekCalendar.getFromId(params.calendar_id)
	if (!calendar.id) {
		throw error(404, "Calendar not found")
	}

	return {
		calendar_id: params.calendar_id
	}
}
