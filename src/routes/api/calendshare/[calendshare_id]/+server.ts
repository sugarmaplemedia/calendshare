import { records } from "$lib/drizzle/schema.js"
import { error, json } from "@sveltejs/kit"
import { eq } from "drizzle-orm"

export async function DELETE({ params, locals: { getSession, drizzle } }) {
	const { calendshare_id } = params

	const session = await getSession()

	if (!session) {
		error(401)
	}

	const calendshare = await drizzle.query.calendshares.findFirst({
		where: (calendshares, { eq }) => eq(calendshares.id, calendshare_id)
	})

	if (!calendshare) {
		error(404, "Calendshare not found")
	}

	const removedRecordId = (
		await drizzle
			.delete(records)
			.where(eq(records.userId, session.user.id))
			.returning({ id: records.id })
	)[0]?.id

	if (!removedRecordId) {
		error(404, "Record not found")
	}

	return json({ id: removedRecordId })
}
