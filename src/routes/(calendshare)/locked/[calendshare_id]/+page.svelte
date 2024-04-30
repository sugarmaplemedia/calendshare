<script lang="ts">
	import { enhance } from "$app/forms"

	export let form
</script>

<div class="w-full h-full flex flex-col p-4 gap-8 items-center justify-center">
	<h1 class="h1-flat">This Calendshare is locked.</h1>
	<form use:enhance method="post" class="card p-8 grid max-w-xl w-full gap-4 variant-ghost-surface">
		<h2 class="h2-flat !text-lg !scale-y-95">Please enter the passphrase to continue.</h2>

		<label for="password" class="grid gap-1">
			<p class="label">Password</p>
			<input id="password" name="password" type="password" class="input" />
		</label>
		{#if form?.password}
			<div class="card p-4 variant-ghost-error">
				<p>The provided password was incorrect.</p>
			</div>
		{/if}

		<button class="btn variant-ghost-primary">Submit</button>
	</form>
</div>
