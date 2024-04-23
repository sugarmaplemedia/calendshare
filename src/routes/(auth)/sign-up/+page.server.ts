import { users } from "$lib/drizzle/schema"
import { error, redirect } from "@sveltejs/kit"

export async function load({ locals: { getSession, drizzle } }) {
	const session = await getSession()

	// Handling redirect/creating user from auth user details
	if (session) {
		redirect(303, "/account")
	}

	return {}
}

export const actions = {
	default: async ({ request, locals: { getSession, drizzle, supabase }, url }) => {
		const form = await request.formData()
		const firstName = form.get("firstName") as string
		const lastName = form.get("lastName") as string
		const email = form.get("email") as string
		const password = form.get("password") as string

		const { data, error: supaError } = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: `${url.origin}/api/auth/confirm`
			}
		})

		if (supaError) {
			error(supaError.status!, supaError.message)
		}

		await drizzle.insert(users).values({
			id: data!.user!.id,
			firstName,
			lastName,
			guest: false
		})

		redirect(303, "/account")
	}
}
