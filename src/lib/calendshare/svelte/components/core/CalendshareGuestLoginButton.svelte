<script lang="ts">
	import { getContext } from "svelte"
	import type { CalendshareContext } from "./CalendshareState.types"

	const { handleGuestLogin } = getContext<CalendshareContext>("CalendshareContext")
</script>

<button on:click={handleGuestLogin} class="btn variant-ghost-surface w-full">
	Join Calendar
</button>
