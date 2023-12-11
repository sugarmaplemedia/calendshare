import type { Day, HourRange } from "./time"
import db from ".."

export type DayWeekCalendarData = {
	name?: string
	description?: string
	users: Array<DayWeekCalendarUserData>
	options: DayWeekCalendarOptions
}

export type DayWeekCalendarUserData = {
	uid: string
	data: Record<Day, HourStatus[]>
}

export type HourStatus = {
	hour: number
	status: "available" | "preferred" | "unavailable"
}

type DayWeekCalendarOptions = {
	id?: string
	days: DayOptions
	hours: HourOptions
	customDays?: Day[]
	customHours?: HourRange
}

export type DayOptions = "all" | "week" | "weekend" | "custom"
export type HourOptions = "all" | "business" | "custom"

export class DayWeekCalendar {
	id?: string
	name?: string
	description?: string
	template: {
		days: DayOptions
		hours: HourOptions
	}
	users: Array<{
		uid: string
		data: Record<Day, HourStatus[]>
	}> = []
	days!: Day[]
	hours!: HourRange

	constructor(options: DayWeekCalendarOptions = { days: "all", hours: "all" }) {
		this.id = options.id

		this.template = {
			days: options.days,
			hours: options.hours
		}

		this.setDays(options.days, options.customDays)
		this.setHours(options.hours, options.customHours)
	}

	setDays(template: DayOptions, customDays?: Day[]) {
		switch (template) {
			case "all":
				this.template.days = "all"
				this.days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
				break
			case "week":
				this.template.days = "week"
				this.days = ["monday", "tuesday", "wednesday", "thursday", "friday"]
				break
			case "weekend":
				this.template.days = "weekend"
				this.days = ["saturday", "sunday"]
				break
			case "custom":
				this.template.days = "custom"
				this.days = customDays!
				break
		}
	}

	setHours(template: HourOptions, customHours?: HourRange) {
		switch (template) {
			case "all":
				this.hours = { min: 0, max: 23 }
				break
			case "business":
				this.hours = { min: 9, max: 17 }
				break
			case "custom":
				this.hours = customHours!
				break
		}
	}

	addUser(userId: string) {
		if (!this.users.find((user) => user.uid == userId)) {
			this.users.push({
				uid: userId,
				data: {
					monday: [],
					tuesday: [],
					wednesday: [],
					thursday: [],
					friday: [],
					saturday: [],
					sunday: []
				}
			})
		}

		this.save()
	}

	removeUser(userId: string) {
		this.users = this.users.filter((user) => user.uid != userId)
	}

	async save() {
		await db.calendar.set(this.id!, this.toData()).then(() => {})
	}

	async syncHourForDayForUser(userId: string, day: Day, hour: number) {
		this.addUser(userId)

		const hoursForDayForUser = this.users.find((user) => user.uid == userId)?.data[day]
		const hourStatusIndex = hoursForDayForUser?.findIndex((hourStatus) => hourStatus.hour == hour)

		if (typeof hourStatusIndex == "number" && hourStatusIndex != -1) {
			hoursForDayForUser?.splice(hourStatusIndex, 1)
		} else {
			hoursForDayForUser?.push({
				hour,
				status: "available"
			})
		}

		console.log(this.users)

		this.save()
	}

	toData(): DayWeekCalendarData {
		return {
			name: this.name ?? "",
			description: this.description ?? "",
			users: this.users,
			options: {
				id: this.id,
				days: this.template.days,
				hours: this.template.hours,
				customDays: this.days,
				customHours: this.hours
			}
		}
	}

	convertHourRangeToHours(): Array<number> {
		const hours = []

		let min = this.hours.min
		while (min < this.hours.max) {
			hours.push(min)
			min += 1
		}

		return hours
	}

	static fromData(calendarData: DayWeekCalendarData) {
		const calendar = new DayWeekCalendar(calendarData.options)
		calendar.name = calendarData.name
		calendar.description = calendarData.description
		calendar.users = calendarData.users

		return calendar
	}

	static async getFromId(calendarId: string) {
		try {
			const calendarData = await db.calendar.retrieveOne(calendarId)

			return DayWeekCalendar.fromData(calendarData as DayWeekCalendarData)
		} catch (error) {
			console.log(error)
			return new DayWeekCalendar()
		}
	}

	static async hasId(calendarId: string) {
		return await db.calendar.has(calendarId)
	}
}