<script lang="ts">
	import type { Day } from "$lib/drizzle/schema"
	import { getModalStore } from "@skeletonlabs/skeleton"
	import { onMount } from "svelte"

	const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

	let selectedDays: Array<Day> = []
	let customDays: Array<Day> = []
	let isOpen = false

	$: if ($modalStore[0]) {
		if (!isOpen) {
			selectedDays = $modalStore[0].meta.selectedDays
			customDays = selectedDays.filter((day) => !days.includes(day.name))

			isOpen = true
		}
	}

	const modalStore = getModalStore()

	function handleCustomDaysInputKeydown(event: KeyboardEvent) {
		if (event.key === "Enter") {
			event.preventDefault()
			handleCustomDaysAdd()
		}
	}

	function selectDaysAdd(day: string) {
		const uniqueSelectDays = new Set(selectedDays.map((day) => day.name))
		uniqueSelectDays.add(day)

		const newSelectDays: Array<Day> = []
		for (const day of uniqueSelectDays) {
			newSelectDays.push({ id: days.indexOf(day) + 1, name: day })
		}

		selectedDays = [...newSelectDays]
	}

	function selectDaysRemove(day: string) {
		selectedDays = selectedDays.filter((d) => d.name !== day)
	}

	function selectDaysToggle(day: string) {
		if (!selectedDays.map((d) => d.name).includes(day)) {
			selectDaysAdd(day)
		} else {
			selectDaysRemove(day)
		}
	}

	function handleCustomDaysRemove(day: string) {
		customDays = customDays.filter((d) => d.name !== day)
	}

	function handleCustomDaysAdd() {
		// Checking for weekdays
		if (customDays.length) {
			const dayInWeekdaysIndex = days.findIndex(
				(day) => day.toLowerCase() == customDays[customDays.length - 1].name.toLowerCase()
			)
			if (dayInWeekdaysIndex !== -1) {
				selectDaysAdd(days[dayInWeekdaysIndex])

				customDays[customDays.length - 1].name = ""

				return
			}
		}

		const uniqueCustomDays = new Set(customDays.map((day) => day.name))
		uniqueCustomDays.add("")

		const newCustomDays: Array<Day> = []
		for (const day of uniqueCustomDays) {
			newCustomDays.push({
				id: -1 - newCustomDays.length,
				name: day
			})
		}

		customDays = [...newCustomDays]

		setTimeout(() => {
			const newInput = document.querySelector(
				`#day-template-custom-${customDays[customDays.length - 1].name}`
			) as HTMLInputElement | null
			if (newInput) {
				newInput.focus()
			}
		}, 0)
	}

	function handleCancel() {
		isOpen = false
		modalStore.close()
	}

	function handleSubmit() {
		if (customDays.length) {
			const lastInputIndex = customDays.length - 1

			if (
				customDays[lastInputIndex].name === "" ||
				customDays.findIndex(
					(day) => day.name.toLowerCase() === customDays[lastInputIndex].name.toLowerCase()
				) !== lastInputIndex
			) {
				customDays = customDays.slice(0, customDays.length - 1)
			}
		}

		for (const day of selectedDays) {
			const existingCustomDayIndex = customDays.findIndex((d) => d.name === day.name)

			if (
				existingCustomDayIndex !== -1 ||
				(existingCustomDayIndex === -1 && !days.includes(day.name))
			) {
				// Adding new custom days to selected days
				selectedDays = selectedDays.filter((d) => d.name !== day.name)
			}
		}

		if ($modalStore[0]) {
			$modalStore[0].response!([...selectedDays, ...customDays])
		}

		isOpen = false
		modalStore.close()
	}
</script>

<form class="card max-w-lg p-12 gap-4 flex flex-col" on:submit|preventDefault={handleSubmit}>
	<h2 class="font-bold text-3xl">Custom Days Selector</h2>

	<h3 class="h3">Days in the Week</h3>
	<div class="grid grid-cols-2 gap-4 mb-4">
		{#each days as day, i (day)}
			<label for="day-template-{day}" class="flex gap-2 items-center">
				<input
					id="day-template-{day}"
					type="checkbox"
					on:input={() => selectDaysToggle(day)}
					checked={selectedDays.map((day) => day.name).includes(day)}
				/>
				<span>{day}</span>
			</label>
		{/each}
	</div>

	<h3 class="h3">Custom Days</h3>
	<div class="flex card variant-soft-surface p-4 flex-col gap-4 max-h-72 overflow-y-scroll">
		{#each customDays as customDay (customDay.id)}
			<div class="flex gap-1">
				<input
					id="day-template-custom-{customDay.name}"
					type="text"
					on:keydown={handleCustomDaysInputKeydown}
					bind:value={customDay.name}
					class="input"
				/>
				<button
					type="button"
					on:click={() => handleCustomDaysRemove(customDay.name)}
					class="btn variant-ghost-error px-3"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="ionicon w-6" viewBox="0 0 512 512">
						<path
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="32"
							d="M368 368L144 144M368 144L144 368"
						/>
					</svg>
				</button>
			</div>
		{/each}
		<button type="button" on:click={handleCustomDaysAdd} class="btn variant-ghost-surface"
			>Add New</button
		>
	</div>

	<div class="grid grid-cols-2 gap-2 mt-2">
		<button type="button" on:click={handleCancel} class="btn variant-ghost-primary">Cancel</button>
		<button type="submit" class="btn variant-ghost-success"> Confirm </button>
	</div>
</form>
