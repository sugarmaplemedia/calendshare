<script lang="ts">
	import type { User } from "$lib/drizzle/schema"
	import { getModalStore } from "@skeletonlabs/skeleton"

	const modalStore = getModalStore()

	let firstName = ""
	let lastName = ""

	async function handleGuestCreation() {
		const guestRes = await fetch("/api/users/guest", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ firstName, lastName })
		})

		if (guestRes.ok) {
			const guestData = (await guestRes.json()) as User
			localStorage.setItem("guest", JSON.stringify(guestData))

			if ($modalStore[0]) {
				$modalStore[0].response!({ id: guestData.id })
			}

			console.log("Created guest account successfully")
			modalStore.close()
		}
	}

	function handleCancel() {
		modalStore.close()
	}
</script>

<form class="card max-w-lg p-12 gap-4 flex flex-col" on:submit|preventDefault={handleGuestCreation}>
	<h2 class="font-bold text-3xl">Guest Login</h2>

	<aside class="alert variant-ghost-warning">
		<p class="alert-message">
			<span class="font-bold">Warning: guest accounts are not secure.</span> Anybody with access to this
			calendar can log in and change your availability.
		</p>
	</aside>

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
		<button type="submit" class="btn variant-ghost"> Log in as guest </button>
	</div>
</form>
