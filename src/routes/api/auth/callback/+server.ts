import { redirect } from "@sveltejs/kit"

export const GET = async ({ url, request, locals: { supabase } }) => {
	const code = url.searchParams.get("code")

	console.log("HIT!", request.json())

	if (code) {
		await supabase.auth.exchangeCodeForSession(code)
	}

	throw redirect(303, "/account")
}
