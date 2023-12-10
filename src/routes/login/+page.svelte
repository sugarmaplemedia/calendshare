<script lang="ts">
	import { page } from "$app/stores"
</script>

<main class="w-full p-4 flex items-center flex-col gap-8">
	<h1 class="h1">Login</h1>
	<form method="POST" class="card p-4 gap-4 flex flex-col" action="?/login">
		<label for="login-email" class="label">
			<span>Email</span>
			<input id="login-email" type="email" name="email" class="input" />
		</label>
		<label for="login-password" class="label">
			<span>Password</span>
			<input id="login-password" type="password" name="password" class="input" />
		</label>
		<div class="grid grid-cols-2 gap-2 mt-2">
			<button class="btn variant-ghost">Login</button>
			<a href="/register" class="btn variant-ghost">Register</a>
		</div>
	</form>
	{#if $page.error}
		<div class=" border-2 border-red-700 bg-red-200 w-full p-4">
			<p>{$page.error.message}</p>
		</div>
	{/if}
</main>
