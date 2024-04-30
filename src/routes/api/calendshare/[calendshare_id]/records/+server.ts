import { calendshares, records, type Record } from "$lib/drizzle/schema.js"
import { error } from "@sveltejs/kit"
import { and, eq, notInArray } from "drizzle-orm"

export async function POST({ locals: { drizzle }, params, request }) {
	const { calendshare_id } = params

	const dbCalendshare = await drizzle.query.calendshares.findFirst({
		where: eq(calendshares.id, calendshare_id)
	})

	if (!dbCalendshare) {
		error(404, "Calendshare not found")
	}

	const { insertRecord: httpRecord } = (await request.json()) as { insertRecord: Record }

	await drizzle.insert(records).values({
		calendshareId: dbCalendshare.id,
		userId: httpRecord.userId,
		color: httpRecord.color
	})

	return new Response(null, { status: 204 })
}
