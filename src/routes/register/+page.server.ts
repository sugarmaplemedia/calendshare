import { fail, redirect } from "@sveltejs/kit"
import { doc, getDoc } from "firebase/firestore/lite"
import { firestore } from "$lib/firebase/client"
import { CalendshareUser } from "$lib/calendshare/db/collections/CalendshareUsers"
import { validateAndCreateUser } from "$lib/stores/auth"

export const actions: import("./$types").Actions = {
	default: async ({ request }) => {
		const data = await request.formData()
		const firstName = data.get("fname")
		const lastName = data.get("lname")
		const email = data.get("email")
		const password = data.get("password")

		// Validate args exist
		if (!firstName || !lastName || !email || !password) {
			fail(400, { error: "Missing required fields" })
		}

		const user = await validateAndCreateUser(email!.toString(), password!.toString())

		// Save user details to DB
		const newUser = new CalendshareUser(user!.uid, firstName!.toString(), lastName!.toString())
		await newUser.save()

		// Validate user saved to DB
		const userFromDBSnapshot = await getDoc(doc(firestore, "users", newUser.uid))
		if (!userFromDBSnapshot.exists()) fail(500, { error: "User not saved to DB" })

		throw redirect(303, "/dashboard")
	}
}
