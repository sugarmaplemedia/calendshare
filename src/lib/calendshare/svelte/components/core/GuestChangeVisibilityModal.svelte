<script lang="ts">
	import { goto } from "$app/navigation"
	import { getModalStore } from "@skeletonlabs/skeleton"

	const modalStore = getModalStore()

	function handleCancel() {
		modalStore.close()
	}

	function handleCreateAccount() {
		modalStore.close()
		goto("/sign-up")
	}
</script>

<div class="card max-w-lg p-12 gap-4 flex flex-col">
	<h2 class="font-bold text-3xl">Guests cannot set calendshare visibility</h2>

	<div class="card p-4 variant-ghost-warning">
		<p>
			If you would like to set the visibility of this calendshare, please create an account and
			leave "Import records" checked.
		</p>
	</div>

	<div class="grid grid-flow-col gap-2 mt-2">
		<button on:click={handleCancel} class="btn variant-ghost-surface">Go back</button>
		<button on:click={handleCreateAccount} class="btn p-2 variant-ghost-primary w-fit">
			Create account
		</button>
	</div>
</div>
