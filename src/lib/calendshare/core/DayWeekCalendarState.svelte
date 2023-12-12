<script lang="ts">
	import { createEventDispatcher, setContext } from "svelte"
	import { derived, writable } from "svelte/store"
	import { DayWeekCalendar, type DayWeekCalendarData } from "../db/collections/DayWeekCalendars"
	import type { UserData } from "../db/collections/CalendshareUsers"
	import type { DayWeekCalendarStore, DayWeekCalendarContext } from "./DayWeekCalendarStateTypes"
	import type { Day } from "../db/collections/time"
	import { fade } from "svelte/transition"
	import { ConicGradient, type ConicStop } from "@skeletonlabs/skeleton"

	export let calendarId: string
	export let activeUser: UserData | null

	const dispatch = createEventDispatcher()

	const calendarStore: DayWeekCalendarStore = writable({
		id: calendarId,
		currentUser: activeUser!,
		activeUsers: [activeUser!],
		invisibleUsersById: []
	})

	$: activeUser,
		calendarStore.update((previousState) => {
			previousState.currentUser = activeUser!
			if (previousState.calendar?.users.length == 0) {
				previousState.calendar!.addUser(activeUser!.uid)
				previousState.calendar!.save()
			}

			if (previousState.calendar?.ownerId == activeUser?.uid) {
				dispatch("setOwner")
			}

			return previousState
		})

	async function loadCalendar() {
		const calendar = await DayWeekCalendar.getFromId(calendarId)
		calendarStore.update((previousState) => {
			previousState.calendar = calendar

			return previousState
		})
	}

	const activeUserData = derived(calendarStore, (storeData) => {
		return storeData.calendar?.users.find((user) => user.uid == activeUser?.uid)
	})

	const otherUserData = derived(calendarStore, (storeData) => {
		return storeData.calendar?.users.filter((user) => user.uid != activeUser?.uid) ?? []
	})

	function toggleVisibilityForUser(uid: string) {
		calendarStore.update((previousState) => {
			previousState.invisibleUsersById = previousState.invisibleUsersById.includes(uid)
				? previousState.invisibleUsersById.filter((id) => id != uid)
				: [...previousState.invisibleUsersById, uid]
			return previousState
		})
	}

	function syncHourForDay(day: Day, hour: number, status?: "available" | "unavailable") {
		calendarStore.update((previousState) => {
			previousState.calendar?.syncHourForDayForUser(
				previousState.currentUser.uid,
				day,
				hour,
				status
			)

			return previousState
		})
	}

	const conicStops: ConicStop[] = [
		{ color: "transparent", start: 0, end: 25 },
		{ color: "rgb(var(--color-primary-500))", start: 75, end: 100 }
	]

	setContext<DayWeekCalendarContext>("dayWeekCalendarState", {
		store: calendarStore,
		activeUserData,
		otherUserData,
		syncHourForDay,
		toggleVisibilityForUser
	})
</script>

{#await loadCalendar()}
	<div out:fade={{ duration: 100 }} class="absolute">
		<ConicGradient stops={conicStops} spin />
	</div>
{:then}
	<div in:fade={{ delay: 101, duration: 500 }}>
		<slot />
	</div>
{/await}
