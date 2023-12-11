<script lang="ts">
	import { page } from "$app/stores"
	import Login from "$lib/calendshare/auth/components/Login.svelte"
</script>

<main class="w-full p-4 flex items-center flex-col gap-8">
	<h1 class="h1">Login</h1>

	<div class="card p-4 gap-4 flex flex-col">
		<Login />
	</div>

	{#if $page.error}
		<div class=" border-2 border-red-700 bg-red-200 w-full p-4">
			<p>{$page.error.message}</p>
		</div>
	{/if}
</main>
