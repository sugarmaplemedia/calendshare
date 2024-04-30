import { error, json } from "@sveltejs/kit"

export async function GET({ locals: { drizzle, session }, params }) {
	const { user_id } = params

	if (!session) {
		error(400, "You must be logged in to retrieve your personal calendshares.")
	}

	if (session.user.id !== user_id) {
		error(403, "You do not have permission to perform this action.")
	}

	const personalCalendshares = await drizzle.query.calendshares.findMany({
		where: (calendshares, { eq }) => eq(calendshares.ownerId, session.user.id),
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
