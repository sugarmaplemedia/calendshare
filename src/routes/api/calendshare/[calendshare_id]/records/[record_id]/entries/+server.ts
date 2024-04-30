import { calendshares, recordEntries, records, type RecordEntry } from "$lib/drizzle/schema.js"
import { error } from "@sveltejs/kit"
import { eq } from "drizzle-orm"

export async function POST({ locals: { drizzle }, params, request }) {
	const { calendshare_id, record_id } = params

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

	const { insertRecordEntry: httpRecordEntry } = (await request.json()) as {
		insertRecordEntry: RecordEntry
	}

	await drizzle.insert(recordEntries).values({
		recordId: httpRecordEntry.recordId,
		dayId: httpRecordEntry.dayId,
		hour: httpRecordEntry.hour,
		minute: httpRecordEntry.minute,
		status: httpRecordEntry.status
	})

	return new Response(null, { status: 204 })
}
