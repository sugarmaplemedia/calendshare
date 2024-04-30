<script lang="ts">
	import { getModalStore } from "@skeletonlabs/skeleton"
	import { hourNumberToString } from "$lib/utils/timeConvert"

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

	<div class="grid grid-cols-2 gap-2 mt-2">
		<button type="button" on:click={handleCancel} class="btn variant-ghost-primary">Cancel</button>
		<button type="submit" class="btn variant-ghost-success"> Confirm </button>
	</div>
</form>
