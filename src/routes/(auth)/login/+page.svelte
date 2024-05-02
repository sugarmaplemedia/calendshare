<script lang="ts">
	import { enhance } from "$app/forms"
	import { page } from "$app/stores"

	export let form
</script>

<div class="w-full flex justify-center p-4 items-center h-full flex-col gap-8">
	<form use:enhance method="post" class="card h-fit p-4 w-full xl:w-96 flex flex-col gap-4">
		<h2 class="h2-flat">Login</h2>

		{#if $page.status === 400}
			<div class="card p-2 text-sm variant-ghost-error">
				{#if form?.missing}
					<p class="error">The email field is required</p>
				{/if}
				{#if form?.incorrect}
					<p class="error">The provided credentials are invalid.</p>
				{/if}
			</div>
		{/if}

		<label for="email">
			<span>Email</span>
			<input name="email" type="email" value={form?.email ?? ""} class="input" />
		</label>

		<label for="password" class="pb-8">
			<span>Password</span>
			<input id="password" name="password" type="password" class="input" />
		</label>

		<button type="submit" class="btn variant-ghost-primary">Sign In</button>
	</form>
</div>
