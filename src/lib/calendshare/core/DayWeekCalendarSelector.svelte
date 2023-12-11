<script lang="ts">
	import { getContext } from "svelte"
	import { clickOrDrag } from "./actions"
	import type { Day } from "../db/collections/time"
	import type { DayWeekCalendarContext } from "./DayWeekCalendarStateTypes"
	import { hourNumberToString } from "../utils/timeConvert"
	import { popup, type PopupSettings } from "@skeletonlabs/skeleton"
	import { fade } from "svelte/transition"

	const {
		store: state,
		activeUserData,
		otherUserData,
		syncHourForDay
	} = getContext<DayWeekCalendarContext>("dayWeekCalendarState")

	function handleSelectHour(day: Day, hour: number) {
		if (tool == "toggle") {
			syncHourForDay(day, hour)
		} else if (tool == "add") {
			syncHourForDay(day, hour, "available")
		} else if (tool == "remove") {
			syncHourForDay(day, hour, "unavailable")
		}
	}

	const getAvailabilityPopup = (key: string): PopupSettings => ({
		event: "click",
		target: `popup-${key}`,
		placement: "bottom"
	})

	function usersAvailableAtHour(day: Day, hour: number) {
		return (
			$state.calendar?.users.filter((calendarUser) => {
				let existingHourStatus = calendarUser.data[day].find(
					(hourStatus) => hourStatus.hour == hour
				)
				return existingHourStatus?.status == "available"
			}) ?? []
		)
	}

	let tool = "toggle"

	function handleSetToolToggle() {
		tool = "toggle"
	}

	function handleSetToolAdd() {
		tool = "add"
	}

	function handleSetToolRemove() {
		tool = "remove"
	}

	function handleSetToolView() {
		tool = "view"
	}
</script>

<div class="grid grid-flow-col gap-2 card p-4 min-w-[416px]">
	<div class="grid justify-self-end gap-2 -mt-0.5">
		<div class="h-8"></div>
		{#each $state.calendar?.convertHourRangeToHours() ?? [] as hour}
			<div class="h-8 text-sm text-left w-20">
				<p>{hourNumberToString(hour, { militaryTime: false })}</p>
			</div>
		{/each}
	</div>
	{#each $state.calendar?.days ?? [] as day (day)}
		<div class="flex flex-col gap-2 items-center">
			<p class="">{day}</p>
			<div class="grid gap-2">
				{#each $state.calendar?.convertHourRangeToHours() ?? [] as hour (`${day}:${hour}`)}
					<button
						use:clickOrDrag={() => {
							handleSelectHour(day, hour)
						}}
						use:popup={getAvailabilityPopup(`${day}:${hour}`)}
						class="w-24 [&>*]:pointer-events-none bg-white h-8 grid-flow-row relative rounded-md overflow-hidden"
					>
						{#if $activeUserData?.data[day].find((hourStatus) => hourStatus.hour == hour) && !$state.invisibleUsersById.includes($activeUserData.uid)}
							<span
								transition:fade={{ duration: 100 }}
								style={`background-color: ${$activeUserData.color};`}
								class="opacity-50 block w-full h-full"
							></span>
						{/if}
						{#each $otherUserData ?? [] as anotherUsersData}
							{#if anotherUsersData.data[day].find((hourStatus) => hourStatus.hour == hour) && !$state.invisibleUsersById.includes(anotherUsersData.uid)}
								<span
									transition:fade={{ duration: 100 }}
									style={`background-color: ${anotherUsersData.color};`}
									class=" absolute opacity-50 block w-full h-full top-0"
								></span>
							{/if}
						{/each}
					</button>
					<div
						class="card z-10 w-64 p-4 variant-filled-tertiary text-lg rounded-lg {tool != 'view' &&
							'invisible pointer-events-none'}"
						data-popup="popup-{`${day}:${hour}`}"
					>
						<div class="flex flex-col gap-2">
							<h3 class="text-left font-bold">
								{`${day[0].toUpperCase()}${day.slice(1).toLowerCase()}`} at {hourNumberToString(
									hour,
									{ militaryTime: false }
								)}
							</h3>
							{#if usersAvailableAtHour(day, hour).length == $state.calendar?.users.length}
								<div
									class="card border-2 border-primary-200 rounded-md text-sm variant-filled-success p-2 text-left"
								>
									<p class="font-bold uppercase">All Available!</p>
								</div>
							{:else if usersAvailableAtHour(day, hour).length}
								<div
									class="card border-2 border-primary-200 rounded-md text-sm variant-filled-primary p-2 text-left"
								>
									<p class="font-bold uppercase">Available</p>
									<ul class="list-disc ml-4">
										{#each usersAvailableAtHour(day, hour) as availableUser}
											<li>{availableUser.uid}</li>
										{/each}
									</ul>
								</div>
							{:else}
								<div
									class="card border-2 border-primary-200 rounded-md text-sm variant-filled-error p-2 text-left"
								>
									<p class="font-bold uppercase">None Available</p>
								</div>
							{/if}
						</div>
						<div class="arrow bg-tertiary-500"></div>
					</div>
				{/each}
			</div>
		</div>
	{/each}
</div>

<div class="mt-2 w-full">
	<button
		on:click={handleSetToolToggle}
		class="btn py-2 px-4 {tool == 'toggle' ? 'variant-filled' : ' variant-ghost'}"
	>
		<span class="w-4 h-4 {tool == 'toggle' ? 'fill-surface-900' : 'fill-primary-50'}">
			<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"
				><path
					d="M384 224v184a40 40 0 01-40 40H104a40 40 0 01-40-40V168a40 40 0 0140-40h167.48"
					fill="none"
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="32"
				/><path
					d="M459.94 53.25a16.06 16.06 0 00-23.22-.56L424.35 65a8 8 0 000 11.31l11.34 11.32a8 8 0 0011.34 0l12.06-12c6.1-6.09 6.67-16.01.85-22.38zM399.34 90L218.82 270.2a9 9 0 00-2.31 3.93L208.16 299a3.91 3.91 0 004.86 4.86l24.85-8.35a9 9 0 003.93-2.31L422 112.66a9 9 0 000-12.66l-9.95-10a9 9 0 00-12.71 0z"
				/></svg
			>
		</span>
		<span>Toggle</span>
	</button>

	<button
		on:click={handleSetToolAdd}
		class="btn py-2 px-4 {tool == 'add' ? 'variant-filled' : ' variant-ghost'}"
	>
		<span class="w-4 h-4 {tool == 'add' ? 'fill-surface-900' : 'fill-primary-500'}">
			<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"
				><path
					fill="none"
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="32"
					d="M256 112v288M400 256H112"
				/></svg
			>
		</span>
		<span>Add</span>
	</button>

	<button
		on:click={handleSetToolRemove}
		class="btn py-2 px-4 {tool == 'remove' ? 'variant-filled' : ' variant-ghost'}"
	>
		<span class="w-4 h-4 {tool == 'remove' ? 'fill-surface-900' : 'fill-primary-500'}">
			<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512">
				<path
					fill="none"
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="32"
					d="M368 368L144 144M368 144L144 368"
				/>
			</svg>
		</span>
		<span>Remove</span>
	</button>
	<button
		on:click={handleSetToolView}
		class="btn py-2 px-4 {tool == 'view' ? 'variant-filled' : ' variant-ghost'}"
	>
		<span class="w-4 h-4 {tool == 'view' ? 'fill-surface-900' : 'fill-primary-500'}">
			<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"
				><path
					d="M255.66 112c-77.94 0-157.89 45.11-220.83 135.33a16 16 0 00-.27 17.77C82.92 340.8 161.8 400 255.66 400c92.84 0 173.34-59.38 221.79-135.25a16.14 16.14 0 000-17.47C428.89 172.28 347.8 112 255.66 112z"
					fill="none"
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="32"
				/><circle
					cx="256"
					cy="256"
					r="80"
					fill="none"
					stroke="currentColor"
					stroke-miterlimit="10"
					stroke-width="32"
				/></svg
			>
		</span>
		<span>View</span>
	</button>
</div>
