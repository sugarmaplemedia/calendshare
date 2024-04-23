<script lang="ts">
	import { getModalStore } from "@skeletonlabs/skeleton"
	import type { Day } from "$lib/drizzle/schema"
	import { hourNumberToString } from "$lib/utils/timeConvert"

	let mode: "hour range" | "custom hours" = "hour range"

	const modalStore = getModalStore()
	let isOpen = false

	let startHour = 8
	let endHour = 17
	$: if (startHour > endHour) {
		endHour = startHour + 1
	}

	$: if ($modalStore[0] && !isOpen) {
		startHour = $modalStore[0].meta.startHour
		endHour = $modalStore[0].meta.endHour
		isOpen = true
	}

	function handleCancel() {
		isOpen = false
		modalStore.close()
	}

	function handleSubmit() {
		$modalStore[0].response!({ startHour, endHour })

		isOpen = false
		modalStore.close()
	}
</script>

<form class="card max-w-lg p-12 gap-4 flex flex-col" on:submit|preventDefault={handleSubmit}>
	<h2 class="font-bold text-3xl">Custom Hours Selector</h2>

	<!-- <div class="card variant-ghost-surface p-4 grid grid-cols-2">
		<label for="template-hours-hour-range" class="flex gap-2 items-center">
			<input
				id="template-hours-hour-range"
				type="radio"
				name="template-hours"
				checked={mode === "hour range"}
				on:input={() => (mode = "hour range")}
				class="radio"
			/>
			<span>Hour Range</span>
		</label>
		<label for="template-hours-custom-hours" class="flex gap-2 items-center">
			<input
				id="template-hours-custom-hours"
				name="template-hours"
				type="radio"
				class="radio"
				checked={mode === "custom hours"}
				on:input={() => (mode = "custom hours")}
			/>
			<span>Custom Hours</span>
		</label>
	</div> -->

	{#if mode === "hour range"}
		<!-- <h3 class="h3">Hour Range</h3> -->
		<div class="grid grid-cols-2 gap-4 mb-4">
			<label for="custom-hour-range-start" class="label">
				<p>Start Time</p>
				<select id="custom-hour-range-start" bind:value={startHour} class="select">
					{#each Array.from({ length: 25 }, (_, i) => i) as hour}
						<option value={hour}>{hourNumberToString(hour, { militaryTime: false })}</option>
					{/each}
				</select>
			</label>
			<label for="custom-hour-range-end" class="label">
				<p>End time</p>
				<select id="custom-hour-range-end" bind:value={endHour} class="select">
					{#each Array.from({ length: 25 - startHour }, (_, i) => i + startHour) as hour}
						<option value={hour}>{hourNumberToString(hour, { militaryTime: false })}</option>
					{/each}
				</select>
			</label>
		</div>
	{:else}
		<h3 class="h3">Custom Hours</h3>
		<div class="grid grid-cols-2 gap-4 mb-4"></div>
	{/if}

	<!-- <h3 class="h3">Custom Days</h3>
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
	</div> -->

	<div class="grid grid-cols-2 gap-2 mt-2">
		<button type="button" on:click={handleCancel} class="btn variant-ghost-primary">Cancel</button>
		<button type="submit" class="btn variant-ghost-success"> Confirm </button>
	</div>
</form>
