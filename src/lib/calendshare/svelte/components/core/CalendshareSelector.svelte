<script lang="ts">
	import { getContext } from "svelte"
	import { clickOrDrag } from "$lib/calendshare/svelte/actions"
	import { hourNumberToString } from "$lib/utils/timeConvert"
	import { popup, type PopupSettings } from "@skeletonlabs/skeleton"
	import { fade } from "svelte/transition"
	import type { CalendshareContext } from "./CalendshareState.types"
	import type {
		Calendshare,
		CalendshareWithRelations,
		RecordEntryStatusType
	} from "$lib/drizzle/schema"
	import CalendshareAvailabilityMode from "./CalendshareAvailabilityMode.svelte"
	import { derived } from "svelte/store"

	const { state, user, currentMode, invisibleRecords, updateRecordEntry, userRecord } =
		getContext<CalendshareContext>("CalendshareContext")

	function handleSelectHour(day: string, hour: number) {
		if (tool == "view") {
			return
		}

		if ($user && !$invisibleRecords.includes($userRecord!.id)) {
			if (tool == "toggle") {
				updateRecordEntry(day, hour, $currentMode, { mode: "toggle" })
			} else if (tool == "add") {
				updateRecordEntry(day, hour, $currentMode, { mode: "add" })
			} else if (tool == "remove") {
				updateRecordEntry(day, hour, $currentMode, { mode: "remove" })
			}
		} else {
		}
	}

	const getAvailabilityPopup = (key: string): PopupSettings => ({
		event: "click",
		target: `popup-${key}`,
		placement: "bottom"
	})

	const hours = derived(state, ($state) => {
		switch ($state.hoursTemplate) {
			case "all_hours":
				// 0:00 to 23:00
				return Array.from({ length: 24 }, (_, i) => i)
			case "business_hours":
				// 8:00 to 16:00
				return Array.from({ length: 10 }, (_, i) => i + 8)
			case "custom":
				return Array.from(
					{ length: ($state.endHour ?? 8) - ($state.startHour ?? 17) + 1 },
					(_, i) => i + ($state.startHour ?? 8)
				)
		}
	})

	const days = derived(state, ($state) => {
		switch ($state.daysTemplate) {
			case "all_week":
				return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
			case "business_days":
				return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
			case "weekend_only":
				return ["Saturday", "Sunday"]
			case "custom":
				const sortedDayNames = $state.days
					.toSorted((a, b) => (a.dayId < b.dayId ? -1 : 1))
					.map((day) => day.day.name)
				return sortedDayNames
		}
	})

	function usersAvailableAtHour(day: string, hour: number) {
		return (
			$state.records.filter((record) => {
				let existingHourStatus = record.entries.find(
					(entry) => entry.day.name === day && entry.hour == hour
				)
				return (
					existingHourStatus?.status == "available" || existingHourStatus?.status == "preferred"
				)
			}) ?? []
		)
	}

	function usersUnavailableAtHour(day: string, hour: number) {
		return (
			$state.records.filter((record) => {
				let existingHourStatus = record.entries.find(
					(entry) => entry.day.name === day && entry.hour == hour
				)
				return existingHourStatus?.status == "unavailable" || !existingHourStatus
			}) ?? []
		)
	}

	function getOverallAvailability(day: string, hour: number): RecordEntryStatusType | undefined {
		const allEntriesForDayAndHour = $state.records
			.flatMap((record) => record.entries)
			.filter((entry) => entry.day.name == day && entry.hour == hour)

		if (!allEntriesForDayAndHour.length) {
			return
		}

		const noneAvailable = !allEntriesForDayAndHour.some(
			(entry) =>
				entry.day.name == day &&
				entry.hour == hour &&
				(entry.status == "available" || entry.status == "preferred")
		)

		if (noneAvailable) {
			return "unavailable"
		}

		const allPreferredAvailable = !allEntriesForDayAndHour.some(
			(entry) =>
				entry.day.name == day &&
				entry.hour == hour &&
				(entry.status == "unavailable" || entry.status == "available")
		)

		if (allPreferredAvailable) {
			return "preferred"
		}

		const allAvailable = !allEntriesForDayAndHour.some(
			(entry) =>
				entry.day.name == day &&
				entry.hour == hour &&
				(entry.status == "unavailable" || entry.status == "preferred")
		)

		if (allAvailable) {
			return "available"
		}
	}

	let tool = $user ? "toggle" : "view"

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

<div class="grid grid-flow-col gap-2 card p-4 w-full xl:min-w-[416px]">
	<div class="grid justify-self-end gap-2 -mt-0.5">
		<div class="h-8"></div>
		{#each $hours as hour (hour)}
			<div class="h-8 text-sm text-left w-20">
				<p>{hourNumberToString(hour, { militaryTime: false })}</p>
			</div>
		{/each}
	</div>
	{#each $days as day (day)}
		<div class="flex flex-col gap-2 items-center">
			<p class="">{day.slice(0, 3)}</p>
			<div class="grid gap-2">
				{#each $hours as hour (`${day}:${hour}`)}
					{@const overallAbility = getOverallAvailability(day, hour)}
					<button
						use:clickOrDrag={() => {
							handleSelectHour(day, hour)
						}}
						use:popup={getAvailabilityPopup(`${day}:${hour}`)}
						class="w-8 sm:w-12 md:w-16 lg:w-20 xl:w-24 [&>*]:pointer-events-none bg-white h-8 grid-flow-row flex relative rounded-md overflow-hidden
                        {overallAbility === 'unavailable'
							? 'scale-95 brightness-75'
							: overallAbility === 'preferred'
							  ? 'scale-110 shadow-lg shadow-surface-600'
							  : overallAbility === 'available'
							    ? 'scale-105'
							    : ''}"
					>
						{#each $state.records as record (`${record.userId}:${day}:${hour}`)}
							{@const entry = record.entries.find(
								(entry) => entry.day.name == day && entry.hour == hour
							)}
							{#if entry}
								<span
									transition:fade={{ duration: 100 }}
									style={`background-color: ${record.color};`}
									class="
                                        flex items-center justify-center w-full h-full flex-grow top-0 transition-all origin-left
                                        {!$invisibleRecords.includes(record.id)
										? 'scale-x-100'
										: 'scale-x-0'}
                                    "
								>
									{#if entry.status === "available"}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="ionicon w-6"
											viewBox="0 0 512 512"
											><path
												d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"
												fill="none"
												stroke="currentColor"
												stroke-miterlimit="10"
												stroke-width="32"
											/><path
												fill="none"
												stroke="currentColor"
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="32"
												d="M352 176L217.6 336 160 272"
											/></svg
										>
									{:else if entry.status === "preferred"}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="ionicon w-6"
											viewBox="0 0 512 512"
											><path
												d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"
												fill="none"
												stroke="currentColor"
												stroke-miterlimit="10"
												stroke-width="32"
											/><path
												fill="none"
												stroke="currentColor"
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="32"
												d="M368 192L256.13 320l-47.95-48M191.95 320L144 272M305.71 192l-51.55 59"
											/></svg
										>
									{:else}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="ionicon w-6"
											viewBox="0 0 512 512"
											><path
												d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"
												fill="none"
												stroke="currentColor"
												stroke-miterlimit="10"
												stroke-width="32"
											/><path
												fill="none"
												stroke="currentColor"
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="32"
												d="M320 320L192 192M192 320l128-128"
											/></svg
										>
									{/if}
								</span>
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
							{#if usersAvailableAtHour(day, hour).length == $state.records.length}
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
										{#each usersAvailableAtHour(day, hour) as { user: { firstName, lastName } }}
											<li>{firstName} {lastName}</li>
										{/each}
									</ul>
									<p class="font-bold uppercase">Unavailable</p>
									<ul class="list-disc ml-4">
										{#each usersUnavailableAtHour(day, hour) as { user: { firstName, lastName } }}
											<li>{firstName} {lastName}</li>
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

<div class="mt-2 w-full flex gap-2">
	<div class="grow flex">
		<button
			on:click={handleSetToolView}
			class="btn py-2 px-4 w-fit {tool == 'view' ? 'variant-filled' : ' variant-ghost'}"
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

	<CalendshareAvailabilityMode />

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
		class="btn py-2 px-4 {tool == 'add' ? 'variant-filled' : ' variant-ghost-success'}"
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
		class="btn py-2 px-4 {tool == 'remove' ? 'variant-filled' : ' variant-ghost-error'}"
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
</div>
