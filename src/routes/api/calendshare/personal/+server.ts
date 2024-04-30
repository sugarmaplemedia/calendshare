import { error, json } from "@sveltejs/kit"

export async function GET({ locals: { getSession, drizzle } }) {
	const session = await getSession()

	if (!session) {
		error(400, "You must be logged in to retrieve your personal calendshares.")
	}

	const personalCalendshares = await drizzle.query.calendshares.findMany({
		where: (calendshares, { eq, and }) =>
			and(eq(calendshares.ownerId, session.user.id), eq(calendshares.visibility, "personal")),
		with: {
			records: {
				with: {
					entries: {
						with: {
							day: true
						}
					}
				}
			}
		}
	})

	return json(personalCalendshares)
}
