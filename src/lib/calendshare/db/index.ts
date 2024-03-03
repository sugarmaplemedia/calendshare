import {
	collection,
	type DocumentData,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	setDoc
} from "firebase/firestore/lite"
import { CalendshareUser, type UserData } from "./collections/CalendshareUsers"
import type { DayWeekCalendarData } from "./collections/DayWeekCalendars"

async function add(collectionName: string, documentData: DocumentData, specifiedId: string = "") {
	return setDoc(doc(db, collectionName, specifiedId), documentData)
}

async function retrieve(collectionName: string, documentId: string) {
	const docRef = doc(db, collectionName, documentId)
	const docSnap = await getDoc(docRef)

	if (docSnap.exists()) {
		return docSnap.data()
	} else {
		throw new Error("No such document")
	}
}

async function retrieveAll(collectionName: string) {
	const querySnapshot = await getDocs(collection(db, collectionName))
	return querySnapshot.docs.map((doc) => doc.data())
}

async function remove(collectionName: string, documentId: string) {
	return deleteDoc(doc(db, collectionName, documentId))
}

async function has(collectionName: string, documentId: string) {
	const docRef = doc(db, collectionName, documentId)
	const docSnap = await getDoc(docRef)
	return docSnap.exists()
}

export default {
	user: {
		retrieveOne: async (userId: string): Promise<UserData> =>
			(await retrieve("users", userId)) as UserData,
		retrieveAll: async () =>
			(await retrieveAll("users")).map(
				(user) => new CalendshareUser(user.uid, user.firstName, user.lastName)
			),
		set: async (user: UserData) => await add("users", user, user.uid),
		remove: async (userId: string) => remove("users", userId)
	},
	calendar: {
		retrieveOne: async (calendarId: string) => await retrieve("dw-calendars", calendarId),
		retrieveAll: async () => (await retrieveAll("dw-calendars")) as DayWeekCalendarData[],
		set: async (calendarId: string, calendar: DayWeekCalendarData) =>
			await add("dw-calendars", calendar, calendarId),
		remove: async (calendarId: string) => remove("dw-calendars", calendarId),
		has: async (calendarId: string) => has("dw-calendars", calendarId)
	}
}
