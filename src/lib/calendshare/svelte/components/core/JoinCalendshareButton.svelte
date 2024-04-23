<script lang="ts">
	import { getContext } from "svelte"
	import type { CalendshareContext } from "./CalendshareState.types"

	const { handleJoinCalendshare } = getContext<CalendshareContext>("CalendshareContext")
</script>

<button on:click={handleJoinCalendshare} class="btn variant-ghost-surface w-full">
	Join Calendar
</button>
