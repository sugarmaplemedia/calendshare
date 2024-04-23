import { error, json } from "@sveltejs/kit"
import { CalendshareClient } from "$lib/calendshare/api"
import {
	calendshares,
	calendsharesCustomDays,
	days,
	daysRelations,
	recordEntries,
	records,
	type CalendshareInsertValues,
	type CalendshareWithRelations
} from "$lib/drizzle/schema"
import { and, eq, ne, notInArray } from "drizzle-orm"

export async function POST({ locals: { getSession }, request }) {
	const session = await getSession()
	const { userId } = await request.json()

	if (!session && !userId) {
		error(400, "You must either be logged in or supply a guest ID.")
	}

	const newCalendshareId = session
		? await CalendshareClient.create({ ownerId: session.user.id })
		: await CalendshareClient.create({ ownerId: userId })

	return json({ id: newCalendshareId })
}

export async function PUT({ locals: { drizzle }, request }) {
	const httpCalendshare = (await request.json()) as CalendshareWithRelations
	const dbCalendshare = await CalendshareClient.get(httpCalendshare.id)

	if (!dbCalendshare) {
		error(400, "A calendshare of that ID does not exist.")
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

	if (dbCalendshare.startHour != httpCalendshare.startHour) {
		calendshareUpdates.startHour = httpCalendshare.startHour
		successfulUpdates.push("Calendshare start hour has been updated.")
	}

	if (dbCalendshare.endHour != httpCalendshare.endHour) {
		calendshareUpdates.endHour = httpCalendshare.endHour
		successfulUpdates.push("Calendshare end hour has been updated.")
	}

	if (Object.keys(calendshareUpdates).length > 1) {
		await drizzle
			.update(calendshares)
			.set(calendshareUpdates)
			.where(eq(calendshares.id, httpCalendshare.id))
	}

	const newIds: Record<string, Array<[number, number]>> = {
		// [oldId, newId]
		records: [],
		entries: [],
		days: [],
		daysRelations: []
	}

	const newRelations: Record<
		string,
		Array<[[number | string, number], [number | string, number]]>
	> = {
		calendsharesDays: []
	}

	for (const record of httpCalendshare.records) {
		const dbRecordId = (
			await drizzle
				.insert(records)
				.values({
					id: record.id <= 0 ? undefined : record.id,
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

		if (record.id != dbRecordId) {
			newIds.records.push([record.id, dbRecordId])
		}

		// Track IDs of all entries being pushed to DB for the purpose of removing anything that isn't sent from client side (i.e., removed)
		const entriesToSave: Array<number> = []
		for (const entry of record.entries) {
			const newEntryId = (
				await drizzle
					.insert(recordEntries)
					.values({
						id: entry.id <= 0 ? undefined : entry.id,
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

			if (entry.id != newEntryId) {
				newIds.entries.push([entry.id, newEntryId])
			}

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

	// Adding new days to calendshare...
	for (const { day, calendshareId, dayId } of httpCalendshare.days) {
		const newDayId = (
			await drizzle
				.insert(days)
				.values({
					id: day.id < 0 ? undefined : day.id,
					name: day.name
				})
				.onConflictDoUpdate({
					target: days.name,
					set: { name: day.name }
				})
				.returning({ id: days.id })
		)[0].id

		// let newDayId = newDay?.id

		// if (!newDayId) {
		// 	newDayId = (await drizzle.query.days.findFirst({ where: eq(days.name, day.name) }))!.id
		// }

		const newCustomDayRelationId = (
			await drizzle
				.insert(calendsharesCustomDays)
				.values({
					calendshareId: dbCalendshare.id,
					dayId: newDayId
				})
				.onConflictDoUpdate({
					target: [calendsharesCustomDays.calendshareId, calendsharesCustomDays.dayId],
					set: { dayId: newDayId }
				})
				.returning({
					calendshareId: calendsharesCustomDays.calendshareId,
					dayId: calendsharesCustomDays.dayId
				})
		)[0]

		if (day.id != newDayId) {
			newIds.days.push([day.id, newDayId])
		}

		if (newCustomDayRelationId.dayId != dayId) {
			newRelations.calendsharesDays.push([
				[calendshareId, dayId],
				[newCustomDayRelationId.calendshareId, newCustomDayRelationId.dayId]
			])
		}
	}

	for (const _ of newRelations.calendsharesDays) {
		successfulUpdates.push("Calendshare custom days have been added.")
	}

	// ...and removing days that are no longer in the calendshare
	for (const { day: dbDay } of dbCalendshare.days) {
		if (!httpCalendshare.days.find(({ day }) => day.name == dbDay.name)) {
			await drizzle
				.delete(calendsharesCustomDays)
				.where(
					and(
						eq(calendsharesCustomDays.calendshareId, dbCalendshare.id),
						eq(calendsharesCustomDays.dayId, dbDay.id)
					)
				)

			successfulUpdates.push("Calendshare custom days have been removed.")
		}
	}

	return json({ updates: successfulUpdates, newIds, newRelations })
}
