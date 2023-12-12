<script lang="ts">
	import { page } from "$app/stores"
</script>

<main class="flex flex-col gap-4 justify-center items-center w-full">
	<div style="margin-top: 384px;">
		<h1 class="h1">ERROR {$page.status}</h1>
		<aside class="alert flex justify-center variant-filled-error">
			<p>{$page.error?.message}</p>
		</aside>
	</div>
</main>
