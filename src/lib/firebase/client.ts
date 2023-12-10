import { PUBLIC_FIREBASE_PROJECT_ID } from "$env/static/public"
import { initializeApp, getApps } from "firebase/app"
import {
	browserLocalPersistence,
	connectAuthEmulator,
	getAuth,
	setPersistence
} from "firebase/auth"
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore/lite"

function getFirebase() {
	const firebaseConfig = {
		apiKey: "AIzaSyDYJyU51u3TKB77dA35bXU-XnvMT93P2fk",
		authDomain: "calendshare-2eb17.firebaseapp.com",
		projectId: PUBLIC_FIREBASE_PROJECT_ID,
		storageBucket: "calendshare-2eb17.appspot.com",
		messagingSenderId: "612883188207",
		appId: "1:612883188207:web:01dfea66e4adf190bf0e1a",
		measurementId: "G-71E3VFDV73"
	}

	const apps = getApps()
	if (apps.length > 0) {
		return apps[0]!
	}

	return initializeApp(firebaseConfig)
}

function getFirebaseAuth() {
	const firebase = getFirebase()
	const auth = getAuth(firebase)
	setPersistence(auth, browserLocalPersistence)

	if (import.meta.env.DEV) {
		connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true })
	}

	return auth
}

function getFirebaseFirestore() {
	const firebase = getFirebase()
	const firestore = getFirestore(firebase)

	if (import.meta.env.DEV) {
		connectFirestoreEmulator(firestore, "localhost", 8080)
	}

	return firestore
}

export const firebase = getFirebase()
export const auth = getFirebaseAuth()
export const firestore = getFirebaseFirestore()
