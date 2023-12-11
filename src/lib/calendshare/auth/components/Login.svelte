<script lang="ts">
	import { enhance } from "$app/forms"
	import { createEventDispatcher } from "svelte"

	const dispatch = createEventDispatcher()
</script>

<form use:enhance method="POST" class="flex flex-col gap-2" action="/login?/login">
	<label for="login-email" class="label">
		<span>Email</span>
		<input id="login-email" type="email" name="email" class="input" />
	</label>
	<label for="login-password" class="label">
		<span>Password</span>
		<input id="login-password" type="password" name="password" class="input" />
	</label>
	<div class="grid grid-cols-2 gap-4 mt-2">
		<button on:click class="btn variant-ghost">Login</button>
		<a on:click href="/register" class="btn variant-ghost">Register</a>
	</div>
</form>
