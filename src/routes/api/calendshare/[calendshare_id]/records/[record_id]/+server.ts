import { calendshares, records, type Record } from "$lib/drizzle/schema"
import { error } from "@sveltejs/kit"
import { eq } from "drizzle-orm"

export async function PATCH({ locals: { drizzle, session }, params, request }) {
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

	const { updateRecord: httpRecord } = (await request.json()) as { updateRecord: Record }

	if (session && session.user.id !== dbRecord.userId) {
		error(403, "You do not have permission to perform this action.")
	}

	if (dbRecord.color !== httpRecord.color) {
		await drizzle
			.update(records)
			.set({ color: httpRecord.color })
			.where(eq(records.id, dbRecord.id))
	}

	return new Response(null, { status: 204 })
}

export async function DELETE({ locals: { drizzle, session }, params }) {
	const { calendshare_id, record_id } = params

	const calendshare = await drizzle.query.calendshares.findFirst({
		where: eq(calendshares.id, calendshare_id),
		with: {
			owner: true
		}
	})

	if (!calendshare) {
		error(404, "Calendshare not found")
	}

	if (!calendshare.owner.guest && session!.user.id !== calendshare.ownerId) {
		error(403, "You do not have permission to perform this action.")
	}

	const removedRecordId = (
		await drizzle
			.delete(records)
			.where(eq(records.id, Number(record_id)))
			.returning({ id: records.id })
	)[0]?.id

	if (!removedRecordId) {
		error(404, "Record not found")
	}

	return new Response(null, { status: 204 })
}
