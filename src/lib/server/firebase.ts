import { getAuth, type DecodedIdToken } from "firebase-admin/auth"
import admin from "firebase-admin"
import { PUBLIC_FIREBASE_PROJECT_ID } from "$env/static/public"
import { FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY } from "$env/static/private"

function initializeFirebase() {
	if (!admin.apps.length) {
		admin.initializeApp({
			credential: admin.credential.cert({
				clientEmail: FIREBASE_ADMIN_CLIENT_EMAIL,
				privateKey: FIREBASE_ADMIN_PRIVATE_KEY,
				projectId: PUBLIC_FIREBASE_PROJECT_ID
			})
		})
	}
}

export async function decodeToken(token: string): Promise<DecodedIdToken | null> {
	if (!token || token === "null" || token === "undefined") return null
	try {
		initializeFirebase()
		return await getAuth().verifyIdToken(token)
	} catch (err) {
		console.log(err)

		return null
	}
}
