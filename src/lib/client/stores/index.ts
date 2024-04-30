import { onDestroy } from "svelte"
import type { CalendshareWithRelations, User } from "$lib/drizzle/schema"
import type { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js"
import { getCalendshareStore } from "./CalendshareStore"
import { getRecordsStore } from "./recordsStore"
import { getRecordEntriesStore } from "./recordEntriesStore"
import { getDaysStore } from "./daysStore"
import { get } from "svelte/store"

export function getCalendshareStores(
	initialCalendshare: CalendshareWithRelations,
	supabase: SupabaseClient
) {
	const calendshareStore = getCalendshareStore(initialCalendshare, supabase)

	const recordsStore = getRecordsStore(initialCalendshare.records, initialCalendshare.id, supabase)

	const recordEntriesStore = getRecordEntriesStore(
		initialCalendshare.records,
		initialCalendshare.id,
		supabase
	)

	const daysStore = getDaysStore(
		initialCalendshare.days.map((customDay) => customDay.day),
		initialCalendshare.id,
		supabase
	)

	onDestroy(async () => {
		console.log("Hello!")
		await supabase.removeAllChannels()
	})

	return {
		calendshareStore,
		recordsStore,
		recordEntriesStore,
		daysStore
	}
}
