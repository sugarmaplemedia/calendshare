import type { Palette } from "$lib/calendshare/color"
import type { CalendshareWithRelations, RecordsWithRelations, User } from "$lib/drizzle/schema"
import type { Readable, Writable } from "svelte/store"

export type CalendshareState = Writable<{
	calendshare: CalendshareWithRelations
	activeUser: User | undefined
}>

export type CalendshareContext = {
	state: CalendshareState
	activeUserRecord: Readable<RecordsWithRelations | undefined>
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
