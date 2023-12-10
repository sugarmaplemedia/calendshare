import { error, redirect } from "@sveltejs/kit"
import { validateAndSignIn, signOut } from "$lib/stores/auth"
import type { Actions } from "./$types"

export const actions: Actions = {
	login: async ({ request }) => {
		const data = await request.formData()
		const email = data.get("email")
		const password = data.get("password")

		try {
			await validateAndSignIn(email!.toString(), password!.toString())
		} catch (theError) {
			console.log(theError)
			throw error(400, "Invalid email or password")
		}

		throw redirect(308, "/dashboard")
	},

	logout: async () => {
		await signOut()

		throw redirect(303, "/")
	}
}
