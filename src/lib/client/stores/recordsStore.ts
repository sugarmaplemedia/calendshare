import type { Record, User } from "$lib/drizzle/schema"
import type { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js"
import { get, writable, type Writable } from "svelte/store"
import setupRealtimeChannel from "../realtime/setupRealtimeChannel"
import { serverFetch } from "../utils/sendToServer"

let records: Writable<Array<Record & { user: User }>>
let calendshareId: string
let actionSource: "client" | "server" = "server"

export function getRecordsStore(
	initialRecords: Array<Record & { user: User }>,
	initialCalendshareId: string,
	supabase: SupabaseClient
) {
	calendshareId = initialCalendshareId

	if (!records) {
		records = writable(initialRecords, () => {
			return setupRealtimeChannel<Record, number>(supabase, "calendshare_records", calendshareId, {
				filter: `calendshareId=eq.${calendshareId}`,
				async insertHandler({ new: newRecord }) {
					const userRes = await fetch(`/api/users/${newRecord.userId}`)
					const { user } = (await userRes.json()) as { user: User }
					actionSource = "server"
					await insert(newRecord, user)
				},
				async updateHandler({ new: updatedRecord }) {
					actionSource = "server"
					await update(updatedRecord)
				},
				async removeHandler({ old: removeRecord }) {
					actionSource = "server"
					await remove(removeRecord)
				}
			})
		})
	}

	supabase
		.channel(`calendshare-${calendshareId}-users`)
		.on(
			//@ts-ignore
			"postgres_changes",
			{
				event: "UPDATE",
				schema: "public",
				table: "users"
			},
			(payload: { new: User }) => {
				console.log("New User Update!")
				if (get(records).find((record) => record.userId === payload.new.id)) {
					records.update(($records) => {
						const recordToUpdate = $records.find((record) => record.userId === payload.new.id)!
						recordToUpdate.user.firstName = payload.new.firstName
						recordToUpdate.user.lastName = payload.new.lastName

						return $records
					})
				}
			}
		)
		.subscribe()

	return {
		subscribe: records.subscribe, // Implicitly readonly due to returning no set function
		async insert(insertRecord: Record, insertUser: User) {
			actionSource = "client"
			await insert(insertRecord, insertUser)
		},
		async update(updateRecord: Record) {
			actionSource = "client"
			await update(updateRecord)
		},
		async remove(removeRecord: Record) {
			actionSource = "client"
			await remove(removeRecord)
		}
	}
}
export type RecordsStore = ReturnType<typeof getRecordsStore>

async function insert(insertRecord: Record, insertUser: User) {
	records.update(($records) => {
		const recordAlreadyInserted = $records.find((record) => record.userId === insertRecord.userId)

		if (recordAlreadyInserted) {
			if (recordAlreadyInserted.id !== -1) {
				console.error(`Record already exists for user ID ${insertRecord.userId}.`)
				return $records
			} else {
				console.info(
					`Record already exists for user ID ${insertRecord.userId} with placeholder ID. Updating instead.`
				)
				recordAlreadyInserted.id = insertRecord.id
				return $records
			}
		}

		console.info("Inserting New Record: ", insertRecord)
		const combinedRecord = { ...insertRecord, user: insertUser }

		return [...$records, combinedRecord]
	})

	await sendInsertToServer(insertRecord)
}

async function update(updateRecord: Record) {
	records.update(($records) => {
		const recordToUpdate = $records.find((record) => record.id === updateRecord.id)

		if (!recordToUpdate) {
			console.error(`No record found for user ID ${updateRecord.userId}.`)
			return $records
		}

		recordToUpdate.color = updateRecord.color

		return $records
	})

	await sendUpdateToServer(updateRecord)
}

async function remove(removeRecord: { id: number }) {
	let successfulRemove = false

	records.update(($records) => {
		const recordtoRemoveIndex = $records.findIndex((record) => record.id === removeRecord.id)

		if (recordtoRemoveIndex === -1) {
			console.error(`No record found.`)
			return $records
		}

		$records.splice(recordtoRemoveIndex, 1)

		successfulRemove = true
		return $records
	})

	if (successfulRemove) {
		await sendRemoveToServer(removeRecord)
	}
}

async function sendInsertToServer(insertRecord: Record) {
	if (actionSource === "client") {
		await serverFetch(`/api/calendshare/${calendshareId}/records`, "POST", {
			insertRecord
		})
	}
}

async function sendUpdateToServer(updateRecord: Record) {
	if (actionSource === "client") {
		await serverFetch(`/api/calendshare/${calendshareId}/records/${updateRecord.id}`, "PATCH", {
			updateRecord
		})
	}
}

async function sendRemoveToServer(removeRecord: { id: number }) {
	if (actionSource === "client") {
		await serverFetch(`/api/calendshare/${calendshareId}/records/${removeRecord.id}`, "DELETE")
	}
}
