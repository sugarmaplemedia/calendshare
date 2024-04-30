import type { RecordEntry, RecordsWithRelations } from "$lib/drizzle/schema"
import type { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js"
import { writable, type Writable } from "svelte/store"
import setupRealtimeChannel from "../realtime/setupRealtimeChannel"
import { serverFetch } from "../utils/sendToServer"

let recordEntries: Writable<Array<RecordEntry>>
let actionSource: "client" | "server" = "server"
let calendshareId: string

export function getRecordEntriesStore(
	initialRecordsWithEntries: Array<RecordsWithRelations>,
	initialCalendshareId: string,
	supabase: SupabaseClient
) {
	calendshareId = initialCalendshareId

	if (!recordEntries) {
		recordEntries = writable(
			initialRecordsWithEntries.flatMap((record) => record.entries),
			() => {
				return setupRealtimeChannel<RecordEntry, number>(
					supabase,
					"calendshare_record_entries",
					initialCalendshareId,
					{
						async insertHandler({ new: insertedRecordEntry }) {
							actionSource = "server"
							await insert(insertedRecordEntry)
						},
						async updateHandler({ new: updatedRecordEntry }) {
							actionSource = "server"
							await update(updatedRecordEntry)
						},
						async removeHandler({ old: removeRecordEntry }) {
							actionSource = "server"
							await remove({ id: removeRecordEntry.id, recordId: -1 })
						}
					}
				)
			}
		)
	}
	return {
		subscribe: recordEntries.subscribe, // Implicitly readonly due to returning no set function
		async insert(insertRecordEntry: RecordEntry) {
			actionSource = "client"
			await insert(insertRecordEntry)
		},
		async update(updateRecordEntry: RecordEntry) {
			actionSource = "client"
			await update(updateRecordEntry)
		},
		async remove(removeRecordEntry: RecordEntry) {
			actionSource = "client"
			await remove(removeRecordEntry)
		}
	}
}
export type RecordEntriesStore = ReturnType<typeof getRecordEntriesStore>

async function insert(insertRecordEntry: RecordEntry) {
	let successfulInsert: "insert" | "error" | "update" = "error"

	recordEntries.update(($recordEntries) => {
		const recordEntryAlreadyInserted = $recordEntries.find(
			(recordEntry) =>
				recordEntry.recordId === insertRecordEntry.recordId &&
				recordEntry.dayId === insertRecordEntry.dayId &&
				recordEntry.hour === insertRecordEntry.hour &&
				recordEntry.minute === insertRecordEntry.minute
		)

		if (recordEntryAlreadyInserted) {
			if (recordEntryAlreadyInserted.id !== -1) {
				if (recordEntryAlreadyInserted.status !== insertRecordEntry.status) {
					console.info(`Record entry already exists. Updating status instead.`)
					recordEntryAlreadyInserted.status = insertRecordEntry.status
					insertRecordEntry.id = recordEntryAlreadyInserted.id
					successfulInsert = "update"
				} else {
					console.error(`Record entry already exists.`)
					successfulInsert = "error"
				}

				return $recordEntries
			} else {
				console.info(`Record entry already exists with placeholder ID. Updating instead.`)
				recordEntryAlreadyInserted.id = insertRecordEntry.id
				recordEntryAlreadyInserted.status = insertRecordEntry.status
				successfulInsert = "update"

				return $recordEntries
			}
		}

		successfulInsert = "insert"

		return [...$recordEntries, insertRecordEntry]
	})

	//@ts-ignore
	if (successfulInsert === "insert") {
		await sendInsertToServer(insertRecordEntry)
		//@ts-ignore
	} else if (successfulInsert === "update") {
		await sendUpdateToServer(insertRecordEntry)
	}
}

async function update(updateRecordEntry: RecordEntry) {
	recordEntries.update(($recordEntries) => {
		const recordEntryToUpdate = $recordEntries.find(
			(recordEntry) => recordEntry.id === updateRecordEntry.id
		)

		if (!recordEntryToUpdate) {
			console.error(`No record entry found to update.`)
			return $recordEntries
		}

		recordEntryToUpdate.id = updateRecordEntry.id
		recordEntryToUpdate.status = updateRecordEntry.status

		return $recordEntries
	})

	await sendUpdateToServer(updateRecordEntry)
}

async function remove(removeRecordEntry: { id: number; recordId: number }) {
	recordEntries.update(($recordEntries) => {
		const recordEntrytoRemoveIndex = $recordEntries.findIndex(
			(recordEntry) => recordEntry.id === removeRecordEntry.id
		)

		if (recordEntrytoRemoveIndex === -1) {
			console.info(`No record entry found to remove.`)
			return $recordEntries
		}

		$recordEntries.splice(recordEntrytoRemoveIndex, 1)

		return $recordEntries
	})

	await sendRemoveToServer(removeRecordEntry)
}

async function sendInsertToServer(insertRecordEntry: RecordEntry) {
	if (actionSource === "client") {
		await serverFetch(
			`/api/calendshare/${calendshareId}/records/${insertRecordEntry.recordId}/entries`,
			"POST",
			{ insertRecordEntry }
		)
	}
}

async function sendUpdateToServer(updateRecordEntry: RecordEntry) {
	if (actionSource === "client") {
		await serverFetch(
			`/api/calendshare/${calendshareId}/records/${updateRecordEntry.recordId}/entries/${updateRecordEntry.id}`,
			"PATCH",
			{ updateRecordEntry }
		)
	}
}

async function sendRemoveToServer(removeRecordEntry: { id: number; recordId: number }) {
	if (actionSource === "client") {
		await serverFetch(
			`/api/calendshare/${calendshareId}/records/${removeRecordEntry.recordId}/entries/${removeRecordEntry.id}`,
			"DELETE"
		)
	}
}
