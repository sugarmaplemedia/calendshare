import { error, json } from "@sveltejs/kit"
import { CalendshareClient } from "$lib/calendshare/api"
import {
	calendshares,
	days,
	recordEntries,
	records,
	type CalendshareInsertValues,
	type CalendshareWithRelations
} from "$lib/drizzle/schema"
import { and, eq, ne, notInArray } from "drizzle-orm"

export async function POST({ locals: { getSession }, request }) {
	const session = await getSession()
	const { guestId } = await request.json()

	if (!session && !guestId) {
		error(400, "You must either be logged in or supply a guest ID.");
	}

	const newCalendshareId = session
		? await CalendshareClient.create({ ownerId: session.user.id })
		: await CalendshareClient.create({ ownerId: guestId })

	return json({ id: newCalendshareId })
}

export async function PUT({ locals: { drizzle }, request }) {
	const httpCalendshare = (await request.json()) as CalendshareWithRelations
	const dbCalendshare = await CalendshareClient.get(httpCalendshare.id)

	console.log("PUT Requested")

	if (!dbCalendshare) {
		error(400, "A calendshare of that ID does not exist.");
	}

	const calendshareUpdates: CalendshareInsertValues = {
		ownerId: dbCalendshare.ownerId
	}

	const successfulUpdates: Array<string> = []

	if (dbCalendshare.name != httpCalendshare.name) {
		calendshareUpdates.name = httpCalendshare.name
		successfulUpdates.push("Calendshare name has been updated.")
	}

	if (dbCalendshare.description != httpCalendshare.description) {
		calendshareUpdates.description = httpCalendshare.description
		successfulUpdates.push("Calendshare description has been updated.")
	}

	if (dbCalendshare.daysTemplate != httpCalendshare.daysTemplate) {
		calendshareUpdates.daysTemplate = httpCalendshare.daysTemplate
		successfulUpdates.push("Calendshare days template has been updated.")
	}

	if (dbCalendshare.hoursTemplate != httpCalendshare.hoursTemplate) {
		calendshareUpdates.hoursTemplate = httpCalendshare.hoursTemplate
		successfulUpdates.push("Calendshare hours template has been updated.")
	}

	if (dbCalendshare.visibility != httpCalendshare.visibility) {
		calendshareUpdates.visibility = httpCalendshare.visibility
		successfulUpdates.push("Calendshare visibility has been updated.")
	}

	if (Object.keys(calendshareUpdates).length > 1) {
		await drizzle
			.update(calendshares)
			.set(calendshareUpdates)
			.where(eq(calendshares.id, httpCalendshare.id))
	}

	for (const record of httpCalendshare.records) {
		const dbRecordId = (
			await drizzle
				.insert(records)
				.values({
					id: record.id == null ? undefined : record.id,
					calendshareId: dbCalendshare.id,
					userId: record.userId,
					color: record.color
				})
				.onConflictDoUpdate({
					target: records.id,
					set: { color: record.color }
				})
				.returning({ id: records.id })
		)[0].id

		// Track IDs of all entries being pushed to DB for the purpose of removing anything that isn't sent from client side (i.e., removed)
		const entriesToSave: Array<number> = []
		for (const entry of record.entries) {
			const newEntryId = (
				await drizzle
					.insert(recordEntries)
					.values({
						id: entry.id == -1 ? undefined : entry.id,
						recordId: dbRecordId,
						dayId:
							entry.dayId != -1
								? entry.dayId
								: (await drizzle.query.days.findFirst({ where: eq(days.name, entry.day.name) }))!
										.id,
						hour: entry.hour,
						minute: entry.minute,
						status: entry.status
					})
					.onConflictDoUpdate({
						target: recordEntries.id,
						set: {
							status: entry.status
						}
					})
					.returning({ id: recordEntries.id })
			)[0].id

			entriesToSave.push(newEntryId)
		}

		await drizzle
			.delete(recordEntries)
			.where(
				and(
					eq(recordEntries.recordId, dbRecordId),
					notInArray(recordEntries.id, entriesToSave.length ? entriesToSave : [-1])
				)
			)
	}

	return json({ updates: successfulUpdates })
}
