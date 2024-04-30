import type { Calendshare, CalendshareInsertValues } from "$lib/drizzle/schema"
import { writable, type Writable } from "svelte/store"
import setupRealtimeChannel from "../realtime/setupRealtimeChannel"
import type { SupabaseClient } from "@supabase/supabase-js"
import { serverFetch } from "../utils/sendToServer"

let calendshare: Writable<Calendshare>
let passPhrase: string = ""
let actionSource: "client" | "server" = "server"

export function getCalendshareStore(initialCalendshare: Calendshare, supabase: SupabaseClient) {
	if (!calendshare) {
		// Set initial value of calendshare store and set up realtime channel
		calendshare = writable(initialCalendshare, () => {
			return setupRealtimeChannel<Calendshare, string>(
				supabase,
				"calendshares",
				initialCalendshare.id,
				{
					filter: `id=eq.${initialCalendshare.id}`,
					updateHandler({ new: updatedCalendshare }) {
						actionSource = "server"
						update(updatedCalendshare)
					}
				}
			)
		})
	}

	let debounceTimeout: ReturnType<typeof setTimeout>
	let justMounted = true

	const unsubscribe = calendshare.subscribe(async ($calendshare) => {
		if (justMounted) {
			justMounted = false
			return
		}

		clearTimeout(debounceTimeout)
		debounceTimeout = setTimeout(async () => await sendUpdateToServer($calendshare), 300)
	})

	return {
		subscribe: calendshare.subscribe, // Implicitly readonly due to returning no set function
		update(
			propertiesToUpdate: Omit<CalendshareInsertValues, "ownerId">,
			newPassPhrase: string = ""
		) {
			passPhrase = newPassPhrase
			actionSource = "client"
			update(propertiesToUpdate)
		}
	}
}
export type CalendshareStore = ReturnType<typeof getCalendshareStore>

function update(
	propertiesToUpdate: Omit<CalendshareInsertValues, "ownerId" | "id">,
	passPhrase?: string
) {
	calendshare.update(($calendshare) => {
		$calendshare = {
			...$calendshare,
			...propertiesToUpdate
		}

		return $calendshare
	})
}

async function sendUpdateToServer(calendshare: Calendshare) {
	if (actionSource === "client") {
		serverFetch(`/api/calendshare/${calendshare.id}`, "PATCH", { calendshare, passPhrase })
	}
}
