<script lang="ts">
	import { invalidateAll } from "$app/navigation"
	import type { User } from "$lib/drizzle/schema"
	import { getModalStore } from "@skeletonlabs/skeleton"

	const modalStore = getModalStore()

	let id = 0
	let firstName = ""
	let lastName = ""
	let justOpened = false

	$: if ($modalStore[0] && !justOpened) {
		justOpened = true

		id = $modalStore[0].meta!.id
		firstName = $modalStore[0].meta!.firstName
		lastName = $modalStore[0].meta!.lastName
	}

	async function handleGuestNameChange() {
		const guestRes = await fetch(`/api/users/guest/${id}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ firstName, lastName })
		})

		if (guestRes.ok) {
			const guestData = JSON.parse(sessionStorage.getItem("guest")!)
			guestData.firstName = firstName
			guestData.lastName = lastName

			sessionStorage.setItem("guest", JSON.stringify(guestData))

			firstName = ""
			lastName = ""

			invalidateAll()

			justOpened = false
			modalStore.close()
		}
	}

	function handleCancel() {
		justOpened = false
		modalStore.close()
	}
</script>

<form
	class="card max-w-lg p-12 gap-4 flex flex-col"
	on:submit|preventDefault={handleGuestNameChange}
>
	<h2 class="font-bold text-3xl">Guest Login</h2>

	<label for="firstName" class="label">
		<span>First Name</span>
		<input id="firstName" type="text" name="firstName" class="input" bind:value={firstName} />
	</label>
	<label for="firstName" class="label">
		<span>Last Name</span>
		<input id="firstName" type="text" name="lastName" class="input" bind:value={lastName} />
	</label>

	<div class="grid grid-cols-2 gap-2 mt-2">
		<button type="button" on:click={handleCancel} class="btn variant-ghost-error">Cancel</button>
		<button type="submit" class="btn variant-ghost"> Submit </button>
	</div>
</form>
