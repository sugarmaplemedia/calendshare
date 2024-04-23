<script lang="ts">
	import { getContext } from "svelte"
	import type { CalendshareContext } from "./CalendshareState.types"

	const { state } = getContext<CalendshareContext>("CalendshareContext")
</script>

<svelte:head>
	<title>{$state.name} | Calendshare</title>
</svelte:head>

<header class="mb-6 flex flex-col gap-2">
	<h1 class="text-left w-full block text-4xl font-black tracking-wide">
		{$state.name}
	</h1>

	{#if $state.description.length}
		<p>{$state.description}</p>
	{/if}
</header>
