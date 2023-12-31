<script lang="ts">
	import { enhance } from "$app/forms"
	import { generateGuestUser, loginAsGuest } from "$lib/stores/auth"
	import { RadioGroup, RadioItem, getModalStore } from "@skeletonlabs/skeleton"
	import { DayWeekCalendar } from "../db/collections/DayWeekCalendars"
	import type { UserData } from "../db/collections/CalendshareUsers"

	const modalStore = getModalStore()
	const calendarId = $modalStore[0].meta.calendarId ?? ""

	let guestLoginType = "new"

	let firstName: string = ""
	let lastName: string = ""

	let existingGuests: UserData[] = []
	$: DayWeekCalendar.getFromId(calendarId)
		.then((calendar) => calendar.mapUsersToData())
		.then((users) => (existingGuests = users.filter((user) => user.email == "guest")))

	function handleCancel() {
		modalStore.close()
	}

	let selectedGuest: UserData
	async function handleGuestLogin() {
		if (guestLoginType == "existing") {
			await loginAsGuest(selectedGuest.uid)
		} else {
			await generateGuestUser({ firstName, lastName })
		}
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

	<RadioGroup>
		<RadioItem bind:group={guestLoginType} name="guest-login-type" value={"new"}>
			New Guest
		</RadioItem>
		<RadioItem bind:group={guestLoginType} name="guest-login-type" value={"existing"}>
			Existing Guest
		</RadioItem>
	</RadioGroup>

	{#if guestLoginType == "new"}
		<label for="guest-fname" class="label">
			<span>First Name</span>
			<input id="guest-fname" type="text" name="guest-fname" class="input" bind:value={firstName} />
		</label>
		<label for="guest-lname" class="label">
			<span>Last Name</span>
			<input id="guest-lname" type="text" name="guest-lname" class="input" bind:value={lastName} />
		</label>
	{:else if guestLoginType == "existing"}
		<label for="guest-existing">Select Existing Guest</label>
		<select id="guest-existing" class="select" bind:value={selectedGuest}>
			{#each existingGuests as guest}
				<option value={guest}>{guest.firstName} {guest.lastName}</option>
			{/each}
		</select>
	{/if}

	<div class="grid grid-cols-2 gap-2 mt-2">
		<button type="button" on:click={handleCancel} class="btn variant-ghost-error">Cancel</button>
		<button type="button" on:click={handleGuestLogin} class="btn variant-ghost">
			Log in as guest
		</button>
	</div>
</form>
