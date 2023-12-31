import type { RequestHandler } from "@sveltejs/kit"

export const POST: RequestHandler = async ({ request, cookies }) => {
	const payload = await request.json()
	const token: string = payload.token || ""
	if (token) {
		cookies.set("token", token, {
			path: "/",
			httpOnly: true
		})
	} else {
		cookies.delete("token", { path: "/" })
	}

	return new Response()
}
