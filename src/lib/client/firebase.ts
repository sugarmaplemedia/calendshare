import type { FirebaseApp } from "firebase/app"
import type { Firestore } from "firebase/firestore/lite"
import { initializeApp } from "firebase/app"
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore/lite"
import { PUBLIC_FIREBASE_PROJECT_ID } from "$env/static/public"

export let app: FirebaseApp
export let db: Firestore

export function initializeFirebase() {
	if (!app) {
		const firebaseConfig = {
			apiKey: "AIzaSyDYJyU51u3TKB77dA35bXU-XnvMT93P2fk",
			authDomain: "calendshare-2eb17.firebaseapp.com",
			projectId: PUBLIC_FIREBASE_PROJECT_ID,
			storageBucket: "calendshare-2eb17.appspot.com",
			messagingSenderId: "612883188207",
			appId: "1:612883188207:web:01dfea66e4adf190bf0e1a",
			measurementId: "G-71E3VFDV73"
		}

		app = initializeApp(firebaseConfig)
		db = getFirestore(app)

		if (import.meta.env.DEV) {
			connectFirestoreEmulator(db, "localhost", 8080)
		}
	}
}
