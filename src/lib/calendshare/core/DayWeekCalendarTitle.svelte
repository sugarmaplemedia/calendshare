<script lang="ts">
	import { getContext } from "svelte"
	import type { DayWeekCalendarContext } from "./DayWeekCalendarStateTypes"

	const { store: state } = getContext<DayWeekCalendarContext>("dayWeekCalendarState")
</script>

<svelte:head>
	<title>{$state.calendar?.name ? $state.calendar.name : "New Calendshare Calendar"}</title>
</svelte:head>

<header class="mb-6 flex flex-col gap-2">
	<h1 class="text-left w-full block text-4xl font-black tracking-wide">
		{$state.calendar?.name ? $state.calendar.name : "Calendshare Calendar"}
	</h1>

	{#if $state.calendar?.description}
		<p>{$state.calendar?.description}</p>
	{/if}
</header>
