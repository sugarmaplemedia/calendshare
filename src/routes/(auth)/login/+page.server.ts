import { fail, redirect } from "@sveltejs/kit"
import { error } from "console"

export const load = async ({ locals: { session }, url }) => {
	if (session) {
		redirect(303, "/dashboard")
	}
}

export const actions = {
	default: async ({ request, locals: { supabase } }) => {
		const form = await request.formData()
		const email = form.get("email") as string
		const password = form.get("password") as string

		if (!email) {
			return fail(400, { email, missing: true })
		}

		if (!password) {
			return fail(400, { password, missing: true })
		}

		const {
			data: { user },
			error: supaError
		} = await supabase.auth.signInWithPassword({ email, password })

		if (!user) {
			return fail(400, { incorrect: true })
		}

		if (supaError && supaError.status) {
			return error(supaError.status, { message: supaError.message })
		}

		redirect(303, "/dashboard")
	}
}
