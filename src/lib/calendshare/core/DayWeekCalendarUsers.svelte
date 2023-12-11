<script lang="ts">
	import { getContext, onMount } from "svelte"
	import type { DayWeekCalendarContext } from "./DayWeekCalendarStateTypes"
	import type { UserData } from "../db/collections/CalendshareUsers"
	import type { Day } from "../db/collections/time"
	import type { DayWeekCalendarUserData, HourStatus } from "../db/collections/DayWeekCalendars"

	const { store: state } = getContext<DayWeekCalendarContext>("dayWeekCalendarState")

	$: users = $state.calendar ? fetchUsers($state.calendar.users) : []

	async function fetchUsers(users: Array<DayWeekCalendarUserData>) {
		const usersData: UserData[] = []
		for (const user of users) {
			const res = await fetch(`/api/users/${user.uid}`)
			const userData = (await res.json()) as UserData
			usersData.push(userData)
		}

		return usersData
	}
</script>

{#await users}
	<p>loading...</p>
{:then loadedUsers}
	{#each loadedUsers as user}
		<ul class="list-disc text-left ml-8">
			<li>{user.firstName}</li>
		</ul>
	{/each}
{/await}
