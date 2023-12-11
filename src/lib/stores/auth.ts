import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"
import { writable } from "svelte/store"
import { auth } from "../firebase/client"
import validate from "$lib/calendshare/utils/validate"
import type { UserData } from "$lib/calendshare/db/collections/CalendshareUsers"
import { browser } from "$app/environment"
import crypto from "crypto"
import db from "$lib/calendshare/db"

export async function validateAndCreateUser(email: string, password: string) {
	validate.email(email?.toString())
	validate.password(password?.toString())

	// Also signs in user
	const cred = await createUserWithEmailAndPassword(auth, email, password)

	return cred.user
}

export async function validateAndSignIn(email: string, password: string) {
	validate.email(email?.toString())
	validate.password(password?.toString())

	const cred = await signInWithEmailAndPassword(auth, email, password)

	return cred.user
}

export async function signOut() {
	return auth.signOut()
}

export const user = writable<UserData | null>({
	uid: "0039965",
	email: "bouharri@nmu.edu",
	firstName: "Harrison",
	lastName: "bouche"
})

function generateString(length: number) {
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

	let result = " "
	const charactersLength = characters.length
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength))
	}

	return result
}

export function generateGuestUser({
	firstName,
	lastName
}: {
	firstName: string
	lastName: string
}) {
	const uid = generateString(16)
	db.user.set({
		uid: uid,
		email: "guest",
		firstName,
		lastName
	})

	user.set({
		uid: uid,
		email: "guest",
		firstName,
		lastName
	})
}

if (browser) {
	document.cookie = "uid=00399965; SameSite=Lax"
}
