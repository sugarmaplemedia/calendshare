<script lang="ts">
	import { enhance } from "$app/forms"
	import { generateGuestUser } from "$lib/stores/auth"
	import { getModalStore } from "@skeletonlabs/skeleton"
	import { createEventDispatcher } from "svelte"

	const dispatch = createEventDispatcher()
	const modalStore = getModalStore()

	let firstName: string = ""
	let lastName: string = ""

	function handleCancel() {
		modalStore.close()
	}

	function handleGuestLogin() {
		generateGuestUser({ firstName, lastName })
		modalStore.close()
	}
</script>

<form
	use:enhance
	method="POST"
	class="card max-w-lg p-12 gap-4 flex flex-col"
	action="?/loginAsGuest"
>
	<h2 class="font-bold text-3xl">Guest Login</h2>
	<aside class="alert variant-ghost-warning">
		<p class="alert-message">
			<span class="font-bold">Warning: guest accounts are not secure.</span> Anybody with access to this
			calendar can log in and change your times.
		</p>
	</aside>
	<label for="guest-fname" class="label">
		<span>First Name</span>
		<input id="guest-fname" type="text" name="guest-fname" class="input" bind:value={firstName} />
	</label>
	<label for="guest-lname" class="label">
		<span>Last Name</span>
		<input id="guest-lname" type="text" name="guest-lname" class="input" bind:value={lastName} />
	</label>
	<div class="grid grid-cols-2 gap-2 mt-2">
		<button type="button" on:click={handleCancel} class="btn variant-ghost">Cancel</button>
		<button type="button" on:click={handleGuestLogin} class="btn variant-ghost">
			Log in as guest
		</button>
	</div>
</form>
