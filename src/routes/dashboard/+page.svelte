<script lang="ts">
	import type { PageData } from "./$types"

	export let data: PageData
</script>

<main>
	<h2 class="text-xl font-bold">My Calendars</h2>
	<ul>
		{#each data.calendars as calendar}
			<li>
				<a href="/calendar/{calendar.options.id}">
					{calendar.options.id}
				</a>
			</li>
		{/each}
	</ul>
</main>
