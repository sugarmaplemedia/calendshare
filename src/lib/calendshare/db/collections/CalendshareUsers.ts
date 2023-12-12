import type { DocumentData } from "firebase/firestore/lite"
import type { DayWeekCalendar } from "./DayWeekCalendars"
import db from ".."

export interface UserData extends DocumentData {
	uid: string
	email: string
	firstName: string
	lastName: string
}

export class CalendshareUser {
	uid: string
	firstName: string
	lastName: string
	_schedules?: string[] // DayWeekCalendar IDs

	constructor(uid: string, firstName: string, lastName: string) {
		this.uid = uid
		this.firstName = firstName
		this.lastName = lastName
	}

	get fullName(): string {
		return `${this.firstName} ${this.lastName}`
	}

	get schedules(): DayWeekCalendar[] {
		// TODO: implement DB call
		return /* this._schedules ?? */ []
	}

	toFirestore(): UserData {
		return {
			uid: this.uid,
			email: "",
			firstName: this.firstName,
			lastName: this.lastName
		}
	}

	static async getFromId(uid: string): Promise<UserData> {
		const user = await db.user.retrieveOne(uid)
		return user
	}

	async save() {
		await db.user.set(this.toFirestore())
	}
}
