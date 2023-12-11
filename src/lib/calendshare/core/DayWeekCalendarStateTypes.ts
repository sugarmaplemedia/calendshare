import type { Readable, Writable } from "svelte/store"
import type { UserData } from "../db/collections/CalendshareUsers"
import type { DayWeekCalendar, DayWeekCalendarUserData } from "../db/collections/DayWeekCalendars"
import type { Day } from "../db/collections/time"

export type DayWeekCalendarStateData = {
	id: string
	currentUser: UserData
	activeUsers: Array<UserData>
	calendar?: DayWeekCalendar
	invisibleUsersById: Array<string>
}
export type DayWeekCalendarStore = Writable<DayWeekCalendarStateData>

export type ActiveUserData = Readable<DayWeekCalendarUserData | undefined>
export type OtherUserData = Readable<Array<DayWeekCalendarUserData>>

export type DayWeekCalendarContext = {
	store: DayWeekCalendarStore
	activeUserData: ActiveUserData
	otherUserData: OtherUserData
	toggleVisibilityForUser: (uid: string) => void
	syncHourForDay: (day: Day, hour: number, status?: "available" | "unavailable") => void
}
