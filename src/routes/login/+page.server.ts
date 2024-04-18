import { fail, redirect } from "@sveltejs/kit"

export const load = async ({ locals: { supabase, getSession, drizzle } }) => {
	const session = await getSession()

	if (session) {
		redirect(303, "/account");
	}
}
