import { writable } from "svelte/store"
import type { UserData } from "$lib/calendshare/db/collections/CalendshareUsers"
import db from "$lib/calendshare/db"

export const user = writable<UserData | null>(
	// {
	//     uid: "0039965",
	//     email: "bouharri@nmu.edu",
	//     firstName: "Harrison",
	//     lastName: "Bouche"
	// }
	null
)

function generateString(length: number) {
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

	let result = " "
	const charactersLength = characters.length
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength))
	}

	return result
}

export async function generateGuestUser({
	firstName,
	lastName
}: {
	firstName: string
	lastName: string
}) {
	const uid = generateString(16)
	await db.user.set({
		uid: uid,
		email: "guest",
		firstName,
		lastName
	})

	await loginAsGuest(uid)
}

export async function loginAsGuest(guestId: string) {
	const guest = await db.user.retrieveOne(guestId)
	if (guest) {
		user.set(guest)
	}
}
