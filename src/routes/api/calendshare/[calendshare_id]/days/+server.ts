import {
	calendshares,
	calendsharesCustomDays,
	days,
	records,
	type Day,
	type Record
} from "$lib/drizzle/schema.js"
import { error } from "@sveltejs/kit"
import { and, eq, notInArray } from "drizzle-orm"

export async function POST({ locals: { drizzle, session }, params, request }) {
	const { calendshare_id } = params

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

	const { insertDay: httpDay } = (await request.json()) as { insertDay: Day }

	let dbDay = await drizzle.query.days.findFirst({
		where: eq(days.name, httpDay.name)
	})

	if (!dbDay) {
		dbDay = (
			await drizzle
				.insert(days)
				.values({
					name: httpDay.name
				})
				.returning()
		)[0]
	}

	await drizzle.insert(calendsharesCustomDays).values({
		calendshareId: calendshare.id,
		dayId: dbDay.id
	})

	return new Response(null, { status: 204 })
}
