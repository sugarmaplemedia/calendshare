import { calendshares, recordEntries, records, type RecordEntry } from "$lib/drizzle/schema.js"
import { error } from "@sveltejs/kit"
import { and, eq } from "drizzle-orm"

export async function PATCH({ locals: { drizzle }, params, request }) {
	const { calendshare_id, record_id, entry_id } = params

	const dbCalendshare = await drizzle.query.calendshares.findFirst({
		where: eq(calendshares.id, calendshare_id)
	})

	if (!dbCalendshare) {
		error(404, "Calendshare not found")
	}

	const dbRecord = await drizzle.query.records.findFirst({
		where: eq(records.id, Number(record_id))
	})

	if (!dbRecord) {
		error(404, "Record not found")
	}

	const dbEntry = await drizzle.query.recordEntries.findFirst({
		where: eq(recordEntries.id, Number(entry_id))
	})

	if (!dbEntry) {
		error(404, "Entry not found")
	}

	const { updateRecordEntry: httpRecordEntry } = (await request.json()) as {
		updateRecordEntry: RecordEntry
	}

	if (dbEntry.status !== httpRecordEntry.status) {
		await drizzle
			.update(recordEntries)
			.set({ status: httpRecordEntry.status })
			.where(eq(recordEntries.id, dbEntry.id))
	}

	return new Response(null, { status: 204 })
}

export async function DELETE({ locals: { drizzle, session }, params }) {
	const { calendshare_id, record_id, entry_id } = params

	const calendshare = await drizzle.query.calendshares.findFirst({
		where: eq(calendshares.id, calendshare_id)
	})

	if (!calendshare) {
		error(404, "Calendshare not found")
	}

	const dbRecord = await drizzle.query.records.findFirst({
		where: eq(records.id, Number(record_id))
	})

	if (!dbRecord) {
		error(404, "Record not found")
	}

	if (session && session.user.id !== dbRecord.userId) {
		error(403, "You do not have permission to do this action.")
	}

	const removedRecordEntryId = (
		await drizzle
			.delete(recordEntries)
			.where(eq(recordEntries.id, Number(entry_id)))
			.returning({ id: recordEntries.id })
	)[0]?.id

	if (!removedRecordEntryId) {
		error(404, "Record entry not found")
	}

	return new Response(null, { status: 204 })
}
