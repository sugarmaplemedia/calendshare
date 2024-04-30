import { goto, invalidateAll } from "$app/navigation"
import { getRandomColorFromPalette } from "$lib/calendshare/color.js"
import { calendshares, records } from "$lib/drizzle/schema.js"
import { error, redirect } from "@sveltejs/kit"

export async function load({ url, locals: { drizzle, session } }) {
	const guestId = url.searchParams.get("guestId")

	if (session || guestId) {
		const newCalendshare = (
			await drizzle
				.insert(calendshares)
				.values({ ownerId: session?.user.id! ?? guestId })
				.returning()
		)[0]

		await drizzle.insert(records).values({
			calendshareId: newCalendshare.id,
			userId: session?.user.id! ?? guestId,
			color: getRandomColorFromPalette().hex
		})

		redirect(303, `/${newCalendshare.id}`)
	}
}
