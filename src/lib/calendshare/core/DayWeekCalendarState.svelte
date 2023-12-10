<script lang="ts">
	import { setContext } from "svelte"
	import { derived, writable } from "svelte/store"
	import { DayWeekCalendar, type DayWeekCalendarData } from "../db/collections/DayWeekCalendars"
	import type { UserData } from "../db/collections/CalendshareUsers"
	import type { DayWeekCalendarStore, DayWeekCalendarContext } from "./DayWeekCalendarStateTypes"
	import type { Day } from "../db/collections/time"
	import { fade } from "svelte/transition"

	export let calendarId: string
	export let activeUser: UserData

	const calendarStore: DayWeekCalendarStore = writable({
		id: calendarId,
		currentUser: activeUser,
		activeUsers: [activeUser]
	})

	async function loadCalendar() {
		const calendar = await DayWeekCalendar.getFromId(calendarId)
		calendarStore.update((previousState) => {
			previousState.calendar = calendar
			return previousState
		})
	}

	const activeUserData = derived(calendarStore, (storeData) => {
		return storeData.calendar?.users.find((user) => user.uid == activeUser.uid)
	})

	const otherUserData = derived(calendarStore, (storeData) => {
		return storeData.calendar?.users.filter((user) => user.uid != activeUser.uid) ?? []
	})

	function syncHourForDay(day: Day, hour: number) {
		$calendarStore.calendar?.addUser($calendarStore.currentUser.uid)

		calendarStore.update((previousState) => {
			previousState.calendar?.syncHourForDayForUser(previousState.currentUser.uid, day, hour)

			return previousState
		})
	}

	setContext<DayWeekCalendarContext>("dayWeekCalendarState", {
		store: calendarStore,
		activeUserData,
		otherUserData,
		syncHourForDay
	})
</script>

{#await loadCalendar()}
	<p out:fade={{ duration: 100 }}>Loading... please wait...</p>
{:then}
	<div in:fade={{ delay: 101, duration: 500 }}>
		<slot />
	</div>
{/await}
