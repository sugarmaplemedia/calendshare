import { error, redirect } from "@sveltejs/kit"
import { type EmailOtpType } from "@supabase/supabase-js"

export async function GET({ url, locals: { supabase } }) {
	const token_hash = url.searchParams.get("token_hash") as string
	const type = url.searchParams.get("type") as EmailOtpType | null
	const next = url.searchParams.get("next") ?? "/"

	if (!token_hash) {
		error(400, "Missing token_hash")
	}

	if (!type) {
		error(400, "Missing type")
	}

	const { error: supaError } = await supabase.auth.verifyOtp({ token_hash, type })

	if (supaError) {
		error(supaError.status!, supaError.message)
	}

	redirect(303, `/${next.slice(1)}`)
}
