import type { CalendshareCustomDay, Day } from "$lib/drizzle/schema"
import type { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js"
import { writable, type Writable } from "svelte/store"
import setupRealtimeChannel from "../realtime/setupRealtimeChannel"
import { serverFetch } from "../utils/sendToServer"

let days: Writable<Array<Day>>
let calendshareId: string
let actionSource: "client" | "server" = "server"

export function getDaysStore(
	initialDays: Array<Day>,
	initialCalendshareId: string,
	supabase: SupabaseClient
) {
	calendshareId = initialCalendshareId

	if (!days) {
		days = writable(initialDays, () => {
			return setupRealtimeChannel<CalendshareCustomDay, number>(
				supabase,
				"calendshare_custom_days",
				initialCalendshareId,
				{
					filter: `calendshareId=eq.${calendshareId}`,
					async insertHandler(payload) {
						actionSource = "server"
						const insertDayRes = await fetch(
							`/api/calendshare/${initialCalendshareId}/days/${payload.new.dayId}`
						)

						if (insertDayRes.ok) {
							const { day } = (await insertDayRes.json()) as { day: Day }
							await insert(day)
						}
					},
					async removeHandler(payload) {
						actionSource = "server"
						const removeDayRes = await fetch(
							//@ts-ignore
							`/api/calendshare/${initialCalendshareId}/days/${payload.old.dayId}?from=remove`
						)

						if (removeDayRes.ok) {
							const { day } = (await removeDayRes.json()) as { day: Day }
							await remove(day)
						}
					}
				}
			)
		})
	}

	return {
		subscribe: days.subscribe, // Implicitly readonly due to returning no set function
		async insert(insertDay: Day) {
			actionSource = "client"
			await insert(insertDay)
		},
		async remove(removeDay: Day) {
			actionSource = "client"
			await remove(removeDay)
		}
	}
}
export type DaysStore = ReturnType<typeof getDaysStore>

async function insert(insertDay: Day) {
	let successfulInsert = false

	days.update(($days) => {
		const dayAlreadyInserted = $days.find((day) => day.name === insertDay.name)

		if (dayAlreadyInserted) {
			if (dayAlreadyInserted.id !== -1) {
				console.info(`Day named ${dayAlreadyInserted.name} already exists.`)
				return $days
			} else {
				console.info(`Day named ${dayAlreadyInserted.name} with placeholder ID. Updating instead.`)
				dayAlreadyInserted.id = insertDay.id
				return $days
			}
		}

		$days.push(insertDay)

		successfulInsert = true
		return $days
	})

	if (successfulInsert) {
		await sendInsertToServer(insertDay)
	}
}

async function remove(removeDay: { id: number }) {
	days.update(($days) => {
		const dayToRemoveIndex = $days.findIndex(
			//@ts-ignore
			(day) => day.id === removeDay.id
		)

		if (dayToRemoveIndex === -1) {
			console.info(`No day found. Perhaps it was already removed?`)
			return $days
		}

		$days.splice(dayToRemoveIndex, 1)

		return $days
	})

	await sendRemoveToServer(removeDay)
}

async function sendInsertToServer(insertDay: Day) {
	if (actionSource === "client") {
		await serverFetch(`/api/calendshare/${calendshareId}/days`, "POST", {
			insertDay
		})
	}
}

async function sendRemoveToServer(removeDay: { id: number }) {
	if (actionSource === "client") {
		await serverFetch(`/api/calendshare/${calendshareId}/days/${removeDay.id}`, "DELETE")
	}
}
