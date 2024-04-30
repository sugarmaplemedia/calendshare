import { browser } from "$app/environment"

export const ssr = false

export function load({ data }) {
	if (browser && !data.user) {
		const guest = sessionStorage.getItem("guest")
		if (guest) {
			data.user = JSON.parse(guest)
		}
	}

	return {
		...data
	}
}
