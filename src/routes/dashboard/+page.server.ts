import type { DayWeekCalendarData } from "$lib/calendshare/db/collections/DayWeekCalendars.js"
import db from "$lib/calendshare/db/index.js"

export async function load({ cookies }) {
	db.user.set({
		uid: "0039965",
		email: "bouharri@nmu.edu",
		firstName: "Harrison",
		lastName: "bouche"
	})

	const calendars = (await db.calendar.retrieveAll()) as DayWeekCalendarData[]

	return {
		calendars: calendars.filter((calendar) =>
			calendar.users.find((calendarUser) => calendarUser.uid === "0039965")
		)
	}
}
