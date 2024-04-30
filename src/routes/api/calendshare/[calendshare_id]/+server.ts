import {
	calendshares,
	records,
	users,
	type Calendshare,
	type CalendshareInsertValues
} from "$lib/drizzle/schema.js"
import { hash } from "$lib/server/auth/utils/hashAndVerify.js"
import { error, json, redirect } from "@sveltejs/kit"
import { and, eq, ne } from "drizzle-orm"

export async function PATCH({ locals: { drizzle, session }, params, request }) {
	const { calendshare_id } = params

	const dbCalendshare = await drizzle.query.calendshares.findFirst({
		where: eq(calendshares.id, calendshare_id)
	})

	if (!dbCalendshare) {
		error(404, "Calendshare not found")
	}

	const owner = await drizzle.query.users.findFirst({
		where: eq(users.id, dbCalendshare.ownerId)
	})

	if (!owner!.guest && session?.user.id !== dbCalendshare.ownerId) {
		error(403, "You do not have permission to perform this action.")
	}

	const { calendshare: httpCalendshare, passPhrase } = (await request.json()) as {
		calendshare: Calendshare
		passPhrase?: string
	}

	const calendshareUpdates: CalendshareInsertValues = {
		ownerId: dbCalendshare.ownerId
	}

	if (dbCalendshare.name != httpCalendshare.name) {
		calendshareUpdates.name = httpCalendshare.name
	}

	if (dbCalendshare.description != httpCalendshare.description) {
		calendshareUpdates.description = httpCalendshare.description
	}

	if (dbCalendshare.daysTemplate != httpCalendshare.daysTemplate) {
		calendshareUpdates.daysTemplate = httpCalendshare.daysTemplate
	}

	if (dbCalendshare.hoursTemplate != httpCalendshare.hoursTemplate) {
		calendshareUpdates.hoursTemplate = httpCalendshare.hoursTemplate
	}

	if (dbCalendshare.startHour != httpCalendshare.startHour) {
		calendshareUpdates.startHour = httpCalendshare.startHour
	}

	if (dbCalendshare.endHour != httpCalendshare.endHour) {
		calendshareUpdates.endHour = httpCalendshare.endHour
	}

	if (dbCalendshare.visibility != httpCalendshare.visibility) {
		if (httpCalendshare.visibility === "private" && !passPhrase) {
			error(400, "No passphrase provided.")
		}

		if (httpCalendshare.visibility === "private" && passPhrase!.length < 6) {
			error(400, "Passphrase must be at least 6 characters long.")
		}

		calendshareUpdates.visibility = httpCalendshare.visibility

		switch (httpCalendshare.visibility) {
			case "personal":
				await drizzle
					.delete(records)
					.where(
						and(eq(records.calendshareId, calendshare_id), ne(records.userId, session!.user.id))
					)
				break
			case "private":
				calendshareUpdates.passPhraseHash = await hash(passPhrase!)
		}
	}

	if (Object.keys(calendshareUpdates).length > 1) {
		await drizzle
			.update(calendshares)
			.set(calendshareUpdates)
			.where(eq(calendshares.id, httpCalendshare.id))
	}

	return new Response(null, { status: 204 })
}

export async function DELETE({ params, locals: { drizzle, session } }) {
	const { calendshare_id } = params

	const calendshare = await drizzle.query.calendshares.findFirst({
		where: eq(calendshares.id, calendshare_id)
	})

	if (!calendshare) {
		error(404, "Calendshare not found")
	}

	if (session!.user.id !== calendshare.ownerId) {
		error(403, "You do not have permission to perform this action.")
	}

	await drizzle.delete(calendshares).where(eq(calendshares.id, calendshare_id))

	redirect(303, "/dashboard")
}
