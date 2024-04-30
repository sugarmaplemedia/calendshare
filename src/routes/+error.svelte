<script lang="ts">
	import { page } from "$app/stores"
</script>

<div class="flex flex-col items-center gap-6 md:gap-12 justify-center h-full p-4">
	<h1 class="h1-flat">Error: {$page.status}</h1>
	<div class="card p-12 w-full max-w-xl grid align-middle gap-4">
		<h2 class="h2-flat">We're sorry.</h2>
		<p>{$page.error?.message}</p>
		<a href="/" class="btn variant-ghost-primary">Return to Home</a>
	</div>
</div>
