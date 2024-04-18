import { CalendshareClient, UserClient } from "$lib/calendshare/api.js"
import { palette } from "$lib/calendshare/color"
import { error } from "@sveltejs/kit"

export async function load({ locals: { getSession }, params }) {
	const calendshare = await CalendshareClient.get(params.calendshare_id)

	if (!calendshare) {
		throw error(404)
	}

	const session = await getSession()

	const user = session ? await UserClient.get(session!.user.id) : undefined

	return {
		calendshare,
		user,
		palette
	}
}
