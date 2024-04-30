<script lang="ts">
	import { getModalStore } from "@skeletonlabs/skeleton"

	const modalStore = getModalStore()

	function handleCancel() {
		$modalStore[0].response!({ confirmed: false })
		modalStore.close()
	}

	function handleSubmit() {
		$modalStore[0].response!({ confirmed: true })
		modalStore.close()
	}
</script>

<form class="card max-w-lg p-12 gap-4 flex flex-col" on:submit|preventDefault={handleSubmit}>
	<h2 class="font-bold text-3xl">Are you sure?</h2>

	<div class="card p-4 variant-ghost-warning">
		<p>
			Setting this Calendshare's visibility to <span class="font-bold">Personal</span> will remove all
			other users besides you.
		</p>
	</div>

	<div class="grid grid-cols-2 gap-2 mt-2">
		<button type="button" on:click={handleCancel} class="btn variant-ghost-primary">Cancel</button>
		<button type="submit" class="btn variant-ghost-error"> Confirm </button>
	</div>
</form>
