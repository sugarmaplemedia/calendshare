<script lang="ts">
	import { getContext } from "svelte"
	import { derived, type Readable } from "svelte/store"
	import { fade } from "svelte/transition"
	import { popup, type PopupSettings } from "@skeletonlabs/skeleton"
	import { clickOrDrag } from "$lib/calendshare/svelte/actions"
	import { hourNumberToString } from "$lib/utils/timeConvert"
	import type { Day, Record, RecordEntryStatusType, User } from "$lib/drizzle/schema"
	import type { Context } from "./CalendshareState.svelte"
	import CalendshareAvailabilityMode from "./CalendshareAvailabilityMode.svelte"
	import { palette } from "$lib/calendshare/color"

	const {
		calendshareStore,
		daysStore,
		recordsStore,
		recordEntriesStore,
		user,
		userRecord,
		currentMode,
		invisibleRecords,
		handleJoinCalendshare
	} = getContext<Context>("calendshare:context")

	const hoursToDisplay = derived(calendshareStore, ($state) => {
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

	const daysToDisplay = derived([calendshareStore, daysStore], ([$state, $daysStore]) => {
		switch ($state.daysTemplate) {
			case "all_week":
				return [
					{ id: 1, name: "Monday" },
					{ id: 2, name: "Tuesday" },
					{ id: 3, name: "Wednesday" },
					{ id: 4, name: "Thursday" },
					{ id: 5, name: "Friday" },
					{ id: 6, name: "Saturday" },
					{ id: 7, name: "Sunday" }
				]
			case "business_days":
				return [
					{ id: 1, name: "Monday" },
					{ id: 2, name: "Tuesday" },
					{ id: 3, name: "Wednesday" },
					{ id: 4, name: "Thursday" },
					{ id: 5, name: "Friday" }
				]
			case "weekend_only":
				return [
					{ id: 6, name: "Saturday" },
					{ id: 7, name: "Sunday" }
				]
			case "custom":
				return $daysStore.toSorted((a, b) => (a.id < b.id ? -1 : 1))
		}
	})

	function handleSelect(day: Day, hour: number) {
		if (tool !== "view" && $userRecord) {
			switch (tool) {
				case "add":
					recordEntriesStore.insert({
						id: -1,
						recordId: $userRecord.id,
						dayId: day.id,
						hour,
						minute: 0,
						status: $currentMode
					})
					break
				case "remove":
				case "toggle":
					const recordEntryToRemove = $recordEntriesStore.find(
						(entry) =>
							entry.recordId === $userRecord.id && entry.dayId === day.id && entry.hour === hour
					)

					if (recordEntryToRemove) {
						recordEntriesStore.remove(recordEntryToRemove)
					} else if (tool === "toggle") {
						recordEntriesStore.insert({
							id: -1,
							recordId: $userRecord.id,
							dayId: day.id,
							hour,
							minute: 0,
							status: $currentMode
						})
					}
					break
			}
		} else if (tool !== "view") {
			handleJoinCalendshare()
		} else {
			viewedDay = day
			viewedHour = hour
		}
	}

	type AvailabilitySum = {
		status: RecordEntryStatusType | "mixed"
		hex: string
		classes: string
	}

	function getSumOfAvailability(day: Day, hour: number): AvailabilitySum {
		const entriesAtDayAndTime = $recordEntriesStore.filter(
			(entry) => entry.dayId === day.id && entry.hour === hour
		)

		const returnStatus: { [key: string]: AvailabilitySum } = {
			unavailable: {
				status: "unavailable",
				hex: "#D50000",
				classes: "bg-tomato focus-within:outline-tomato"
			},
			mixed: {
				status: "mixed",
				hex: "#F6BF26",
				classes: "bg-banana focus-within:outline-banana"
			},
			available: {
				status: "available",
				hex: "#33B679",
				classes: "bg-sage focus-within:outline-sage"
			},
			preferred: {
				status: "preferred",
				hex: "#0B8043",
				classes: "bg-basil focus-within:outline-basil"
			}
		}

		if (!entriesAtDayAndTime.length) {
			return returnStatus.unavailable
		}

		const sumOfAvailability = {
			unavailable: 0,
			available: 0,
			preferred: 0
		}

		entriesAtDayAndTime.forEach((entry) => {
			sumOfAvailability[entry.status]++
		})

		if (sumOfAvailability.preferred === $recordsStore.length) {
			return returnStatus.preferred
		} else if (sumOfAvailability.available + sumOfAvailability.preferred === $recordsStore.length) {
			return returnStatus.available
		} else if (sumOfAvailability.available === 0 && sumOfAvailability.preferred === 0) {
			return returnStatus.unavailable
		}

		return returnStatus.mixed
	}

	let viewedDay: Day
	let viewedHour: number

	let viewingEntries: Array<{
		record: Record & { user: User }
		status: RecordEntryStatusType
	}> = []

	$: if (viewedDay && viewedHour) {
		viewingEntries = $recordsStore.map((record) => {
			const entry = $recordEntriesStore.find(
				(entry) =>
					entry.recordId === record.id && entry.dayId === viewedDay.id && entry.hour === viewedHour
			)

			return {
				record,
				status: entry?.status ?? "unavailable"
			}
		})
	}

	const getAvailabilityPopup = (key: string): PopupSettings => ({
		event: "click",
		target: `popup-${key}`,
		placement: "bottom"
	})

	let tool = $user ? "toggle" : "view"
	$: if ($user) tool = "toggle"
</script>

<div class="grid grid-flow-col gap-2 card p-4 w-full xl:min-w-[416px]">
	<div class="grid justify-self-end gap-2 -mt-0.5">
		<div class="h-8"></div>
		{#each $hoursToDisplay as hour (hour)}
			<div class="h-8 text-sm text-left w-20">
				<p>{hourNumberToString(hour, { militaryTime: false })}</p>
			</div>
		{/each}
	</div>
	{#each $daysToDisplay as day (day.name)}
		<div class="flex flex-col gap-2 items-center">
			<p>{day.name.slice(0, 3)}</p>
			<div class="grid gap-2">
				{#each $hoursToDisplay as hour (`${day.name}:${hour}`)}
					{@const sumOfAvailability = getSumOfAvailability(day, hour)}

					<button
						use:clickOrDrag={() => handleSelect(day, hour)}
						use:popup={getAvailabilityPopup(`${day.name}:${hour}`)}
						class="
                            w-8 sm:w-12 md:w-16 lg:w-20 xl:w-24 [&>*]:pointer-events-none bg-white h-8 flex relative rounded-md overflow-hidden
                            {tool === 'view' &&
							(sumOfAvailability.status === 'unavailable'
								? 'scale-95 brightness-75'
								: sumOfAvailability.status === 'preferred'
								  ? 'scale-105 drop-shadow-xl shadow-white/100'
								  : '')}
                        "
					>
						{#if tool !== "view"}
							{#each $recordsStore as record (`${record.userId}:${day.name}:${hour}`)}
								{@const entry = $recordEntriesStore.find(
									(entry) =>
										entry.recordId === record.id && entry.dayId === day.id && entry.hour === hour
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
												class="ionicon max-w-[1.5rem]"
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
												class="ionicon max-w-[1.5rem]"
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
												class="ionicon max-w-[1.5rem]"
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
						{:else if sumOfAvailability.status === "available"}
							<span
								transition:fade={{ duration: 100 }}
								class="flex items-center justify-center w-full h-full flex-grow top-0 transition-all origin-left {sumOfAvailability.classes}"
							>
								<svg xmlns="http://www.w3.org/2000/svg" class="ionicon w-6" viewBox="0 0 512 512"
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
							</span>
						{:else if sumOfAvailability.status === "preferred"}
							<span
								transition:fade={{ duration: 100 }}
								class="flex items-center justify-center w-full h-full flex-grow top-0 transition-all origin-left {sumOfAvailability.classes}"
							>
								<svg xmlns="http://www.w3.org/2000/svg" class="ionicon w-6" viewBox="0 0 512 512"
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
							</span>
						{:else if sumOfAvailability.status === "mixed"}
							<span
								transition:fade={{ duration: 100 }}
								class="flex items-center justify-center w-full h-full flex-grow top-0 transition-all origin-left {sumOfAvailability.classes}"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="ionicon w-6 fill-white"
									viewBox="0 0 512 512"
									><circle cx="256" cy="256" r="26" /><circle cx="346" cy="256" r="26" /><circle
										cx="166"
										cy="256"
										r="26"
									/><path
										d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"
										fill="none"
										stroke="currentColor"
										stroke-miterlimit="10"
										stroke-width="32"
									/></svg
								>
							</span>
						{:else}
							<span
								transition:fade={{ duration: 100 }}
								class="flex items-center justify-center w-full h-full flex-grow top-0 transition-all origin-left {sumOfAvailability.classes}"
							>
								<svg xmlns="http://www.w3.org/2000/svg" class="ionicon w-6" viewBox="0 0 512 512"
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
							</span>
						{/if}
					</button>

					<div
						class="card z-10 w-64 p-4 variant-filled-tertiary text-lg rounded-lg {tool != 'view' &&
							'invisible pointer-events-none'}"
						data-popup="popup-{`${day.name}:${hour}`}"
					>
						<div class="flex flex-col gap-2">
							<h3 class="text-left font-bold">
								{`${day.name[0].toUpperCase()}${day.name.slice(1)}`} at {hourNumberToString(hour, {
									militaryTime: false
								})}
							</h3>
							{#if viewingEntries}
								{#if !viewingEntries.some((viewingEntry) => viewingEntry.status === "unavailable")}
									<div
										class="card border-2 border-primary-200 rounded-md text-sm variant-filled-success p-2 text-left"
									>
										<p class="font-bold uppercase">All Available!</p>
									</div>
								{:else if !viewingEntries.some((viewingEntry) => viewingEntry.status === "available" || viewingEntry.status === "preferred")}
									<div
										class="card border-2 border-primary-200 rounded-md text-sm variant-filled-error p-2 text-left"
									>
										<p class="font-bold uppercase">None Available</p>
									</div>
								{:else}
									<div
										class="card border-2 border-primary-200 rounded-md text-sm variant-filled-primary p-2 text-left"
									>
										<p class="font-bold uppercase">Available</p>
										<ul class="list-disc ml-4">
											{#each viewingEntries.filter((viewingEntry) => viewingEntry.status !== "unavailable") as { record: { id, user: { firstName, lastName } } } (id)}
												<li>{firstName} {lastName}</li>
											{/each}
										</ul>
										<p class="font-bold uppercase">Unavailable</p>
										<ul class="list-disc ml-4">
											{#each viewingEntries.filter((viewingEntry) => viewingEntry.status === "unavailable") as { record: { id, user: { firstName, lastName } } } (id)}
												<li>{firstName} {lastName}</li>
											{/each}
										</ul>
									</div>
								{/if}
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
			on:click={() => (tool = "view")}
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

	<CalendshareAvailabilityMode disabled={!$userRecord} />

	<button
		on:click={() => (tool = "toggle")}
		disabled={!$userRecord}
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
		on:click={() => (tool = "add")}
		disabled={!$userRecord}
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
		on:click={() => (tool = "remove")}
		disabled={!$userRecord}
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
