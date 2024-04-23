<script lang="ts">
	import { getContext } from "svelte"
	import type { CalendshareContext } from "./CalendshareState.types"
	import { RecordEntryStatus, type RecordEntryStatusType } from "$lib/drizzle/schema"

	const modes = RecordEntryStatus.enumValues

	const { currentMode } = getContext<CalendshareContext>("CalendshareContext")

	function setAvailabilityMode(mode: RecordEntryStatusType) {
		$currentMode = mode
	}
</script>

<select
	id="availability-mode"
	name="availability-mode"
	class="select w-fit"
	bind:value={$currentMode}
>
	{#each modes as mode (mode)}
		<option value={mode} class="capitalize">
			{mode}
		</option>
	{/each}
</select>
