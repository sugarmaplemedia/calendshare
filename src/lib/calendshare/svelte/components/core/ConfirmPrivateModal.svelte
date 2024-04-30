<script lang="ts">
	import { getModalStore } from "@skeletonlabs/skeleton"

	let passPhrase = ""
	let passPhraseError = ""

	const modalStore = getModalStore()

	function handleCancel() {
		$modalStore[0].response!({ confirmed: false })
		modalStore.close()
	}

	function handleSubmit() {
		if (passPhrase.length < 6) {
			passPhraseError = "Passphrase must be at least 6 characters long"
			return
		}

		passPhraseError = ""

		$modalStore[0].response!({ confirmed: true, passPhrase })
		modalStore.close()
	}
</script>

<form class="card max-w-lg p-12 gap-4 flex flex-col" on:submit|preventDefault={handleSubmit}>
	<h2 class="font-bold text-3xl">Set a passphrase.</h2>

	<div class="card p-4 variant-ghost-warning">
		<p>
			While set to <span class="font-bold">Private,</span> this passphrase must be entered to view the
			calendshare.
		</p>
	</div>

	<p>The passphrase must be at least <span class="font-bold">6 characters long.</span></p>

	<label for="private-passphrase" class="grid gap-2">
		<input
			type="password"
			name="private-passphrase"
			id="private-passphrase"
			class="input {passPhraseError.length ? 'variant-ghost-error' : ''}"
			bind:value={passPhrase}
		/>
		{#if passPhraseError.length}
			<div class="text-sm card variant-ghost-error p-2">
				<p>{passPhraseError}</p>
			</div>
		{/if}
	</label>

	<div class="grid grid-cols-2 gap-2 mt-2">
		<button type="button" on:click={handleCancel} class="btn variant-ghost-primary">Cancel</button>
		<button type="submit" class="btn variant-ghost-error"> Confirm </button>
	</div>
</form>
