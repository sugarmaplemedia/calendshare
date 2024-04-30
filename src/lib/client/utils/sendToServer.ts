import { browser } from "$app/environment"

export async function serverFetch(url: string, method: "POST" | "PATCH" | "DELETE", body?: any) {
	if (browser) {
		const res = await fetch(url, {
			method,
			headers: {
				"Content-Type": "application/json"
			},
			body: body ? JSON.stringify(body) : undefined
		})

		if (!res.ok) {
			throw new Error("Failed to update calendshare.")
		}
	}
}
