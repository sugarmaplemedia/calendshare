<script lang="ts">
	import { getModalStore } from "@skeletonlabs/skeleton"

	const modalStore = getModalStore()
	let firstName = ""
	let lastName = ""

	$: if ($modalStore[0] && $modalStore[0].meta.record) {
		firstName = $modalStore[0].meta.record.user.firstName
		lastName = $modalStore[0].meta.record.user.lastName
	}

	function handleCancel() {
		modalStore.close()
	}

	function handleRemoveRecord() {
		$modalStore[0].response!({ confirmed: true })
		modalStore.close()
	}
</script>

<div class="card max-w-lg p-12 gap-4 flex flex-col">
	<h2 class="font-bold text-3xl">Remove user</h2>

	<div class="card p-4 variant-ghost-warning">
		<p>
			Are you sure you want to remove <span class="font-bold">{firstName} {lastName}</span>?
		</p>
	</div>

	<div class="grid grid-cols-2 gap-2 mt-2">
		<button on:click={handleCancel} class="btn variant-ghost-surface">Go back</button>
		<button on:click={handleRemoveRecord} class="btn variant-ghost-error">Remove User</button>
	</div>
</div>
