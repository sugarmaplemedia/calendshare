import { error, redirect } from "@sveltejs/kit"

export async function GET({ fetch, url }) {
	const guestId = url.searchParams.get("guestId")

	if (!guestId) {
		throw error(400, "You must provide a guest ID or be logged in.")
	}

	const newCalendshareRes = await fetch("/api/calendshare", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ guestId })
	})

	if (!newCalendshareRes.ok) {
		throw error(400, "Failed to create new calendshare")
	}

	const { id: newCalendshareId } = await newCalendshareRes.json()

	throw redirect(303, `/${newCalendshareId}`)
}
