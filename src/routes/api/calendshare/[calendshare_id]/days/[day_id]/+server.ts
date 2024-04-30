import {
	calendshares,
	calendsharesCustomDays,
	days,
	recordEntries,
	records
} from "$lib/drizzle/schema"
import { error, json } from "@sveltejs/kit"
import { and, eq } from "drizzle-orm"

export async function GET({ locals: { drizzle }, params, url }) {
	const fromRemove = url.searchParams.get("from") === "remove"

	const { calendshare_id, day_id } = params

	const calendshare = await drizzle.query.calendshares.findFirst({
		where: eq(calendshares.id, calendshare_id)
	})

	if (!calendshare) {
		error(404, "Calendshare not found")
	}

	const customDay = await drizzle.query.calendsharesCustomDays.findFirst({
		where: and(
			eq(calendsharesCustomDays.calendshareId, calendshare_id),
			eq(calendsharesCustomDays.dayId, Number(day_id))
		)
	})

	if (!customDay && !fromRemove) {
		error(400, "Calendshare does not have that day attached")
	}

	return json({
		day: (await drizzle.query.days.findFirst({ where: eq(days.id, Number(day_id)) }))!
	})
}

export async function DELETE({ locals: { drizzle, session }, params }) {
	const { calendshare_id, day_id } = params

	const calendshare = await drizzle.query.calendshares.findFirst({
		where: eq(calendshares.id, calendshare_id),
		with: { owner: true }
	})

	if (!calendshare) {
		error(404, "Calendshare not found")
	}

	if (!calendshare.owner.guest && session!.user.id !== calendshare.ownerId) {
		error(403, "You do not have permission to perform this action.")
	}

	const removedCustomDayId = (
		await drizzle
			.delete(calendsharesCustomDays)
			.where(
				and(
					eq(calendsharesCustomDays.calendshareId, calendshare_id),
					eq(calendsharesCustomDays.dayId, Number(day_id))
				)
			)
			.returning({ id: calendsharesCustomDays.dayId })
	)[0]?.id

	if (!removedCustomDayId) {
		error(404, "Custom day not found")
	}

	return new Response(null, { status: 204 })
}
