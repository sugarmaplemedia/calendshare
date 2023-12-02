<script lang="ts">
	import DayWeekSelector from "$lib/calendshare/core/DayWeekSelector.svelte"
	import { setContext } from "svelte"

	setContext("currentUser", {
		id: 1,
		name: "Harrison",
		email: "harrison@example.com"
	} as User)
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-10 text-center flex flex-col items-center">
		<h2 class="h2">Input your calendar.</h2>
		<!-- Calendar box -->
		<DayWeekSelector />
		<!-- / -->
	</div>
</div>
