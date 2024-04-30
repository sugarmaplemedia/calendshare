import { goto } from "$app/navigation"
import { verify } from "$lib/server/auth/utils/hashAndVerify.js"
import { error, fail, redirect } from "@sveltejs/kit"

export async function load({ params, locals: { drizzle } }) {
	const { calendshare_id } = params

	const calendshare = await drizzle.query.calendshares.findFirst({
		where: (calendshares, { eq }) => eq(calendshares.id, calendshare_id)
	})

	if (!calendshare) {
		return error(404)
	}

	if (calendshare.visibility !== "private") {
		redirect(303, `/${calendshare_id}`)
	}
}

export const actions = {
	default: async ({ locals: { drizzle }, request, params, cookies }) => {
		const { calendshare_id } = params

		const form = await request.formData()
		const password = form.get("password") as string

		if (!password) {
			return fail(400, { password })
		}

		const calendshare = await drizzle.query.calendshares.findFirst({
			where: (calendshares, { eq }) => eq(calendshares.id, calendshare_id)
		})

		if (!calendshare) {
			return error(404)
		}

		if (calendshare.visibility === "private") {
			const verified = await verify(password, calendshare.passPhraseHash!)

			if (!verified) {
				return fail(400, { password })
			}

			cookies.set("verified", calendshare_id, {
				path: `/${calendshare_id}`,
				httpOnly: true
			})
		}

		redirect(303, `/${calendshare_id}`)
	}
}
