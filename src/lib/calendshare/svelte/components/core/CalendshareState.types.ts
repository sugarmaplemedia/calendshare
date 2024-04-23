import type { Palette } from "$lib/calendshare/color"
import type {
	CalendshareWithRelations,
	Day,
	RecordEntryStatusType,
	RecordsWithRelations,
	User
} from "$lib/drizzle/schema"
import type { Readable, Writable } from "svelte/store"

export type CalendshareState = Writable<CalendshareWithRelations>
export type CurrentMode = Writable<RecordEntryStatusType>
export type CalendshareUser = Writable<User | undefined>
export type CalendshareUserRecord = Readable<RecordsWithRelations | undefined>
export type InvisibleRecords = Writable<Array<number>>

export type CalendshareContext = {
	state: CalendshareState
	user: CalendshareUser
	userRecord: CalendshareUserRecord
	currentMode: CurrentMode
	invisibleRecords: InvisibleRecords
	activeUser: User | undefined
	getActiveUserRecord: () => RecordsWithRelations | undefined
	colors: Palette
	updateRecordEntry: (
		day: string,
		hour: number,
		status: "available" | "unavailable" | "preferred",
		options: { mode: "add" | "remove" | "toggle" }
	) => void
	handleGuestLogin: () => void
	updateRecordColor: (color: string) => void
}

// TODO: Use typeof and set context within an object to avoid all of this
