<script lang="ts">
	import { getModalStore } from "@skeletonlabs/skeleton"

	let password = ""
	let passwordError = ""

	const modalStore = getModalStore()

	function handleCancel() {
		modalStore.close()
	}

	function handleSubmit() {
		$modalStore[0].response!({ password })
	}
</script>

<form class="card max-w-lg p-12 gap-4 flex flex-col" on:submit|preventDefault={handleSubmit}>
	<h2 class="font-bold text-3xl">Confirm new password.</h2>

	<label for="private-passphrase" class="grid gap-2 label">
		<p>Type your original password.</p>
		<input
			type="password"
			name="private-passphrase"
			id="private-passphrase"
			class="input {passwordError.length ? 'variant-ghost-error' : ''}"
			bind:value={password}
		/>
		{#if passwordError.length}
			<div class="text-sm card variant-ghost-error p-2">
				<p>{passwordError}</p>
			</div>
		{/if}
	</label>

	<div class="grid grid-cols-2 gap-2 mt-2">
		<button type="button" on:click={handleCancel} class="btn variant-ghost-primary">Cancel</button>
		<button type="submit" class="btn variant-ghost-error"> Confirm </button>
	</div>
</form>
