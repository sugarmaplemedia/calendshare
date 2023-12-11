<script>
	import { getModalStore } from "@skeletonlabs/skeleton"
	import Login from "./Login.svelte"

	const modalStore = getModalStore()

	function handleButtonClick() {
		modalStore.close()
	}
</script>

<div class="card max-w-lg p-12 gap-4 flex flex-col">
	<h2 class="font-bold text-3xl">Login</h2>
	<Login on:click={handleButtonClick} />
</div>
