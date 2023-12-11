import type { FirebaseApp } from "firebase/app"
import type { Firestore } from "firebase/firestore"
import { initializeApp } from "firebase/app"
import {
	collection,
	getFirestore,
	query,
	where,
	addDoc,
	doc,
	onSnapshot,
	setDoc,
	deleteDoc,
	connectFirestoreEmulator
} from "firebase/firestore"
import {
	getAuth,
	signInWithRedirect,
	signOut as _signOut,
	GoogleAuthProvider,
	onIdTokenChanged,
	connectAuthEmulator,
	type Auth
} from "firebase/auth"
import type { Document } from "$lib/models/Document"
import { readable } from "svelte/store"
import { browser } from "$app/environment"
import type { AnyObject } from "$lib/models/types"
import { invalidateAll } from "$app/navigation"
import { PUBLIC_FIREBASE_PROJECT_ID } from "$env/static/public"

async function setToken(token: string) {
	await fetch("/api/token", {
		method: "POST",
		headers: {
			"Content-Type": "application/json;charset=utf-8"
		},
		body: JSON.stringify({ token })
	})
}

export let auth: Auth
function listenForAuthChanges() {
	auth = getAuth(app)
	if (import.meta.env.DEV) {
		connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true })
	}

	onIdTokenChanged(
		auth,
		async (user) => {
			if (user) {
				const token = await user.getIdToken()
				await setToken(token)
			} else {
				await setToken("")
			}
			await invalidateAll()
		},
		(err) => console.error(err.message)
	)
}

export let app: FirebaseApp
export let db: Firestore
export function initializeFirebase() {
	if (!browser) {
		throw new Error("Can't use the Firebase client on the server.")
	}
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

		listenForAuthChanges()
	}
}

function getDbObject(document: Document): Partial<Document> {
	const obj: AnyObject = {}
	Object.keys(document)
		.filter((k) => document._dbFields.includes(k))
		.forEach((k) => {
			obj[k] = document[k as keyof Document]
		})
	return obj
}

export async function saveDocument(document: Document) {
	const dbObject = getDbObject(document)
	if (!document._collection) throw Error("Objects that extends Document must specify __collection")

	if (document._id) {
		await setDoc(doc(db, document._collection, document._id), dbObject)
	} else {
		const todoRef = await addDoc(collection(db, document._collection), dbObject)
		document._id = todoRef.id
	}
}

export function getDocumentStore<T extends Document>(
	type: { new (data: AnyObject): T },
	document: T,
	onDeleted: () => void = () => undefined
) {
	return readable<T>(document, (set) => {
		let dbUnsubscribe: () => void
		let unsubbed = false
		const unsub = () => {
			unsubbed = true
			if (dbUnsubscribe) {
				dbUnsubscribe()
			}
		}
		if (browser) {
			;(async () => {
				if (unsubbed) return
				dbUnsubscribe = onSnapshot(doc(db, document._collection, document._id), (doc) => {
					if (doc.exists()) {
						const newDoc = new type(doc.data())
						newDoc._id = doc.id
						set(newDoc)
					} else {
						onDeleted()
						dbUnsubscribe()
					}
				})
			})()
		}

		return unsub
	})
}

function providerFor(name: string) {
	switch (name) {
		case "google":
			return new GoogleAuthProvider()
		default:
			throw "unknown provider " + name
	}
}

export async function signInWith(name: string) {
	const auth = getAuth(app)
	const provider = providerFor(name)
	await signInWithRedirect(auth, provider)
}

export async function signOut() {
	const auth = getAuth(app)
	await _signOut(auth)
}

export async function deleteDocument(document: Document) {
	if (!document._collection) throw Error("Objects that extends Document must specify __collection")

	await deleteDoc(doc(db, document._collection, document._id))
}

export function getCollectionStore<T extends Document>(
	type: { new (data: AnyObject): T },
	collectionPath: string,
	uid: string,
	initialData: Array<T> = []
) {
	return readable<Array<T>>(initialData, (set) => {
		let dbUnsubscribe: () => void
		let unsubbed = false
		const unsub = () => {
			unsubbed = true
			if (dbUnsubscribe) {
				dbUnsubscribe()
			}
		}
		if (browser) {
			;(async () => {
				if (unsubbed) return
				const q = query(collection(db, collectionPath), where("uid", "==", uid))
				dbUnsubscribe = onSnapshot(q, (docs) => {
					const newDocuments: Array<T> = []
					docs.forEach((doc) => {
						const newDoc = new type(doc.data())
						newDoc._id = doc.id
						newDocuments.push(newDoc)
					})
					set(newDocuments)
				})
			})()
		}

		return unsub
	})
}
