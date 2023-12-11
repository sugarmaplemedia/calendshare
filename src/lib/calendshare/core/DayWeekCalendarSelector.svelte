<script lang="ts">
	import { getContext } from "svelte"
	import { clickOrDrag } from "./actions"
	import type { Day } from "../db/collections/time"
	import type { DayWeekCalendarContext } from "./DayWeekCalendarStateTypes"
	import { hourNumberToString } from "../utils/timeConvert"

	const {
		store: state,
		activeUserData,
		otherUserData,
		syncHourForDay
	} = getContext<DayWeekCalendarContext>("dayWeekCalendarState")

	function handleSelectHour(day: Day, hour: number) {
		syncHourForDay(day, hour)
	}

	// TODO: add modes (toggle, add, remove)
</script>

<div class="grid grid-flow-col gap-2 card p-4">
	<div class="grid justify-self-end gap-2 -mt-0.5">
		<div class="h-8"></div>
		{#each $state.calendar?.convertHourRangeToHours() ?? [] as hour}
			<div class="h-8 w-20">
				<p>{hourNumberToString(hour, { militaryTime: false })}</p>
			</div>
		{/each}
	</div>
	{#each $state.calendar?.days ?? [] as day}
		<div class="flex flex-col gap-2 items-center">
			<p class="">{day}</p>
			<div class="grid gap-2">
				{#each $state.calendar?.convertHourRangeToHours() ?? [] as hour (`${day}:${hour}`)}
					<button
						use:clickOrDrag={() => {
							handleSelectHour(day, hour)
						}}
						class="w-20 bg-white h-8 grid-flow-row relative rounded-md overflow-hidden"
					>
						{#if $activeUserData?.data[day].find((hourStatus) => hourStatus.hour == hour)}
							<span class="bg-red-400 opacity-50 block w-full h-full pointer-events-none"></span>
						{/if}
						{#each $otherUserData ?? [] as anotherUsersData}
							{#if anotherUsersData.data[day].find((hourStatus) => hourStatus.hour == hour)}
								<span
									class="bg-blue-400 absolute opacity-50 block w-full h-full pointer-events-none top-0"
								></span>
							{/if}
						{/each}
					</button>
				{/each}
			</div>
		</div>
	{/each}
</div>
