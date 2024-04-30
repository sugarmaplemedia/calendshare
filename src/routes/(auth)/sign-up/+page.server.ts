import { users } from "$lib/drizzle/schema"
import { error, fail, redirect } from "@sveltejs/kit"
import { eq } from "drizzle-orm"

export async function load({ locals: { session } }) {
	if (session) {
		redirect(303, "/dashboard")
	}
}

export const actions = {
	default: async ({ request, locals: { drizzle, supabase } }) => {
		const form = await request.formData()
		const firstName = (form.get("firstName") as string) ?? (form.get("firstNameGuest") as string)
		const lastName =
			(form.get("lastName") as string | undefined) ??
			(form.get("lastNameGuest") as string | undefined)
		const email = form.get("email") as string
		const password = form.get("password") as string
		const passwordConfirm = form.get("passwordConfirm") as string
		const guestImport = form.get("guestImport") === "on"
		const guestId = form.get("guestId") as string

		const errors: Record<string, { value?: string; message: string }> = {}

		if (!firstName) {
			errors.firstName = {
				value: firstName,
				message: "First name is required"
			}
		}

		if (!email) {
			errors.email = {
				value: email,
				message: "Email is required"
			}
		}

		if (!password) {
			errors.password = {
				message: "Password is required"
			}
		}

		if (!passwordConfirm || password !== passwordConfirm) {
			errors.passwordConfirm = {
				message: "Passwords do not match."
			}
		}

		if (guestImport && !guestId) {
			errors.guestId = {
				message: "Guest ID is required"
			}
		}

		if (Object.keys(errors).length) {
			return fail(400, errors)
		}

		const { data, error: supaError } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					firstName,
					lastName: lastName ?? ""
				}
			}
		})

		if (supaError) {
			error(supaError.status!, supaError.message)
		}

		if (guestImport) {
			await drizzle
				.update(users)
				.set({
					id: data!.user!.id,
					guest: false
				})
				.where(eq(users.id, guestId))
		} else {
			await drizzle.insert(users).values({
				id: data!.user!.id,
				firstName,
				lastName
			})
		}

		return { success: true, sentTo: email }
	}
}
