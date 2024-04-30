<script lang="ts">
	import { getContext } from "svelte"
	import type { Context } from "./CalendshareState.svelte"

	const { calendshareStore } = getContext<Context>("calendshare:context")
</script>

<svelte:head>
	<title>{$calendshareStore.name} | Calendshare</title>
</svelte:head>

<header class="mb-6 flex flex-col gap-2">
	<h1 class="text-left w-full block text-4xl font-black tracking-wide">
		{$calendshareStore.name}
	</h1>

	{#if $calendshareStore.description.length}
		<p>{$calendshareStore.description}</p>
	{/if}
</header>
