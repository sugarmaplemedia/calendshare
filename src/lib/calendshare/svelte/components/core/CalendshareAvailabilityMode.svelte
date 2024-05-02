<script lang="ts">
	import { getContext } from "svelte"
	import { RecordEntryStatus, type RecordEntryStatusType } from "$lib/drizzle/schema"
	import type { Context } from "./CalendshareState.svelte"

	const { currentMode } = getContext<Context>("calendshare:context")

	export let disabled = false

	const modes = RecordEntryStatus.enumValues
</script>

<select
	id="availability-mode"
	name="availability-mode"
	class="select w-full md:w-fit"
	bind:value={$currentMode}
	{disabled}
>
	{#each modes as mode (mode)}
		<option value={mode} class="capitalize">
			{mode}
		</option>
	{/each}
</select>
