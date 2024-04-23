import { redirect } from "@sveltejs/kit"

export async function GET({ locals: { getSession, supabase } }) {
	const session = await getSession()

	if (session) {
		await supabase.auth.signOut()
	}

	redirect(303, "/")
}
