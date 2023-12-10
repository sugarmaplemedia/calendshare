import type { Readable, Writable } from "svelte/store"
import type { UserData } from "../db/collections/CalendshareUsers"
import type { DayWeekCalendar, HourStatus } from "../db/collections/DayWeekCalendars"
import type { Day } from "../db/collections/time"

export type DayWeekCalendarStateData = {
	id: string
	currentUser: UserData
	activeUsers: Array<UserData>
	calendar?: DayWeekCalendar
}
export type DayWeekCalendarStore = Writable<DayWeekCalendarStateData>

export type ActiveUserData = Readable<{ uid: string; data: Record<Day, HourStatus[]> } | undefined>
export type OtherUserData = Readable<Array<{ uid: string; data: Record<Day, HourStatus[]> }>>

export type DayWeekCalendarContext = {
	store: DayWeekCalendarStore
	activeUserData: ActiveUserData
	otherUserData: OtherUserData
	syncHourForDay: (day: Day, hour: number) => void
}
