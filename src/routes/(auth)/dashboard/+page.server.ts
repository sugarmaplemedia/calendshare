import { users, records } from "$lib/drizzle/schema.js"
import { fail, redirect } from "@sveltejs/kit"
import { eq } from "drizzle-orm"

export const load = async ({ locals: { session, drizzle } }) => {
	if (!session) {
		redirect(303, "/login")
	}

	const user = await drizzle.query.users.findFirst({
		where: eq(users.id, session.user.id)
	})

	const calendshareRecords = await drizzle.query.records.findMany({
		where: eq(records.userId, user!.id),
		with: {
			calendshare: {
				with: {
					owner: true
				}
			}
		}
	})

	return { session, user, calendshareRecords }
}

export const actions = {
	update: async ({ request, locals: { session, drizzle, supabase } }) => {
		const formData = await request.formData()
		const firstName = formData.get("firstName") as string
		const lastName = formData.get("lastName") as string
		const password = formData.get("password") as string
		const originalPassword = formData.get("originalPassword") as string

		if (!session) {
			return fail(401)
		}

		if (password) {
			if (!originalPassword) {
				return fail(400, { password: "Original password is required" })
			}

			async function updatePassword(oldPassword: string, newPassword: string) {
				// Verify the current password
				const verifyResponse = await supabase.rpc("verify_user_password", { password: oldPassword })

				if (verifyResponse.data === true) {
					const updateResponse = await supabase.auth.updateUser({ password: newPassword })
					return !updateResponse.error
				}

				return false
			}

			const passwordUpdated = await updatePassword(originalPassword, password)

			if (!passwordUpdated) {
				return fail(400, { originalPassword: "Incorrect password" })
			}
		}

		await drizzle.update(users).set({ firstName, lastName }).where(eq(users.id, session!.user.id))

		return {
			firstName: firstName,
			lastName: lastName
		}
	}
}
