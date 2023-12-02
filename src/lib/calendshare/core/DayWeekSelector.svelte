<script lang="ts">
	import { getContext } from "svelte"
	import { getSelectorDays, getSelectorHours } from "./logic"
	import type { DayWeekSelectorOptions } from "./types"
	import { DayWeekSelectorState as state, syncDayHoursForUser } from "$lib/stores"
	import { clickOrDrag } from "./actions"

	export let options: DayWeekSelectorOptions = {
		days: "all",
		times: "business",
		increment: "hour"
	}

	const user: User = getContext("currentUser")

	state.update((state) => ({
		...state,
		days: getSelectorDays(options.days),
		hours: getSelectorHours(options.times)
	}))

	function handleSelectHourInDay(day: string, hour: string) {
		syncDayHoursForUser(user, day, hour)
	}

	function save() {
		fetch("/api/day-week-calendar", {
			method: "POST",
			body: JSON.stringify($state)
		})
	}
</script>

<div class="grid grid-cols-7 gap-2">
	{#each $state.days as day}
		<div class="flex flex-col gap-2 items-center">
			<p class="">{day}</p>
			<div class="grid gap-2">
				{#each $state.hours as hour (`${day}:${hour}`)}
					<button
						use:clickOrDrag={() => handleSelectHourInDay(day, hour)}
						class="w-24 bg-white h-8 grid-flow-row"
					>
						{#if $state.users[user.id]?.dayHours[day]?.includes(hour)}
							<span class="bg-red-400 block w-full h-full pointer-events-none"></span>
						{/if}
					</button>
				{/each}
			</div>
		</div>
	{/each}
	<button class="btn variant-filled" on:click={save}>Save</button>
</div>
