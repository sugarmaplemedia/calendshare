import { createSupabaseFrontendClient } from "$lib/supabase/index.js"

export const load = async ({ fetch, data, depends }) => {
	depends("supabase:auth")

	// Sharing public supabase client with all client-side routes and components
	const supabase = createSupabaseFrontendClient(data.session, { fetch })

	const {
		data: { session }
	} = await supabase.auth.getSession()

	return { supabase, session }
}
