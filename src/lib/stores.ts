import { modeUserPrefers } from "@skeletonlabs/skeleton"
import { writable } from "svelte/store"

type DayWeekSelectorUserData = {
	user: User
	dayHours: Record<string, Array<string>>
}

type DayWeekSelectorStateData = {
	users: Record<number, DayWeekSelectorUserData>
	days: Array<string>
	hours: Array<string>
}

export const DayWeekSelectorState = writable<DayWeekSelectorStateData>({
	users: {},
	days: [],
	hours: []
})

/**
 * @description Syncs the days and hours for a given user on the DayWeekSelector
 */
export function syncDayHoursForUser(user: User, day: string, hour: string): void {
	DayWeekSelectorState.update((state) => {
		let userState = state.users[user.id]
		if (!userState) {
			userState = state.users[user.id] = {
				user,
				dayHours: {}
			}
		}

		if (!userState.dayHours[day]) {
			userState.dayHours[day] = [hour]
		} else if (!userState.dayHours[day].includes(hour)) {
			userState.dayHours[day].push(hour)
		} else {
			userState.dayHours[day].splice(userState.dayHours[day].indexOf(hour), 1)
		}

		userState.dayHours[day].sort()

		console.log(userState.dayHours)

		return state
	})
}
