<script lang="ts">
	import { getContext } from "svelte"
	import {
		getModalStore,
		popup,
		type ModalSettings,
		type PopupSettings
	} from "@skeletonlabs/skeleton"
	import type { CalendshareContext } from "./CalendshareState.types"
	import type { RecordsWithRelations, User } from "$lib/drizzle/schema"
	import { invalidateAll } from "$app/navigation"
	import { derived } from "svelte/store"

	const { state, invisibleRecords, user, colors, updateRecordColor, userRecord } =
		getContext<CalendshareContext>("CalendshareContext")

	let recordsWithoutActiveUser = derived([state, user], ([$state, $user]) => {
		return $state.records.filter((record) => record.user.id !== $user?.id)
	})

	async function handleExistingGuestLogin(guestId: string) {
		const guestRes = await fetch("/api/users/guest", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ id: guestId })
		})

		if (guestRes.ok) {
			const guestData = (await guestRes.json()) as User
			localStorage.setItem("guest", JSON.stringify(guestData))

			invalidateAll()
		}
	}

	async function handleRemoveUser(uid: string) {
		// $state.calendar?.removeUser(uid)
	}

	function handleToggleVisibilityForUser(recordId: number) {
		// TODO: Fix
		const possibleIndex = $invisibleRecords.findIndex((id) => id === recordId)

		if (possibleIndex === -1) {
			$invisibleRecords = [...$invisibleRecords, recordId]
		} else {
			$invisibleRecords = $invisibleRecords.filter((id) => id !== recordId)
		}
	}

	const modalStore = getModalStore()
	const modal: ModalSettings = {
		type: "component",
		component: "colorPalette",
		response: ({ hexColor }) => {
			updateRecordColor(hexColor)
		}
	}

	function handleSelectColor() {
		modal.meta = {
			colors,
			color: $userRecord!.color,
			unavailableColors: $state.records.map((r) => r.color).filter((c) => c !== $userRecord!.color)
		}

		modalStore.trigger(modal)
	}

	const popupClick: PopupSettings = {
		event: "click",
		target: "popupClick",
		placement: "bottom"
	}
</script>

<ul class="text-left flex flex-col gap-1">
	{#if $user && $userRecord}
		<li
			style="border-left: 8px solid {$userRecord.color};"
			class="card p-2 pl-2 font-medium flex justify-between items-center drop-shadow variant-filled"
		>
			<span class="p-2">{$user.firstName} {$user.lastName}</span>
			<div class="flex gap-1">
				<button
					on:click={handleSelectColor}
					aria-label="toggle user schedule visiblity"
					class="btn variant-filled-surface w-fit px-2 py-2"
				>
					<span class="w-6 h-6 fill-primary-50">
						<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"
							><path
								d="M430.11 347.9c-6.6-6.1-16.3-7.6-24.6-9-11.5-1.9-15.9-4-22.6-10-14.3-12.7-14.3-31.1 0-43.8l30.3-26.9c46.4-41 46.4-108.2 0-149.2-34.2-30.1-80.1-45-127.8-45-55.7 0-113.9 20.3-158.8 60.1-83.5 73.8-83.5 194.7 0 268.5 41.5 36.7 97.5 55 152.9 55.4h1.7c55.4 0 110-17.9 148.8-52.4 14.4-12.7 11.99-36.6.1-47.7z"
								fill="none"
								stroke="currentColor"
								stroke-miterlimit="10"
								stroke-width="32"
							/><circle cx="144" cy="208" r="32" /><circle cx="152" cy="311" r="32" /><circle
								cx="224"
								cy="144"
								r="32"
							/><circle cx="256" cy="367" r="48" /><circle cx="328" cy="144" r="32" /></svg
						>
					</span>
				</button>
				<button
					on:click={() => $userRecord && handleToggleVisibilityForUser($userRecord.id)}
					aria-label="toggle user schedule visiblity"
					class="btn variant-filled-surface w-fit px-2 py-2"
				>
					<span class="w-6 h-6 fill-primary-50">
						{#if !$invisibleRecords.includes($userRecord.id)}
							<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"
								><path
									d="M255.66 112c-77.94 0-157.89 45.11-220.83 135.33a16 16 0 00-.27 17.77C82.92 340.8 161.8 400 255.66 400c92.84 0 173.34-59.38 221.79-135.25a16.14 16.14 0 000-17.47C428.89 172.28 347.8 112 255.66 112z"
									fill="none"
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="32"
								/><circle
									cx="256"
									cy="256"
									r="80"
									fill="none"
									stroke="currentColor"
									stroke-miterlimit="10"
									stroke-width="32"
								/></svg
							>
						{:else}
							<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"
								><path
									d="M432 448a15.92 15.92 0 01-11.31-4.69l-352-352a16 16 0 0122.62-22.62l352 352A16 16 0 01432 448zM255.66 384c-41.49 0-81.5-12.28-118.92-36.5-34.07-22-64.74-53.51-88.7-91v-.08c19.94-28.57 41.78-52.73 65.24-72.21a2 2 0 00.14-2.94L93.5 161.38a2 2 0 00-2.71-.12c-24.92 21-48.05 46.76-69.08 76.92a31.92 31.92 0 00-.64 35.54c26.41 41.33 60.4 76.14 98.28 100.65C162 402 207.9 416 255.66 416a239.13 239.13 0 0075.8-12.58 2 2 0 00.77-3.31l-21.58-21.58a4 4 0 00-3.83-1 204.8 204.8 0 01-51.16 6.47zM490.84 238.6c-26.46-40.92-60.79-75.68-99.27-100.53C349 110.55 302 96 255.66 96a227.34 227.34 0 00-74.89 12.83 2 2 0 00-.75 3.31l21.55 21.55a4 4 0 003.88 1 192.82 192.82 0 0150.21-6.69c40.69 0 80.58 12.43 118.55 37 34.71 22.4 65.74 53.88 89.76 91a.13.13 0 010 .16 310.72 310.72 0 01-64.12 72.73 2 2 0 00-.15 2.95l19.9 19.89a2 2 0 002.7.13 343.49 343.49 0 0068.64-78.48 32.2 32.2 0 00-.1-34.78z"
								/><path
									d="M256 160a95.88 95.88 0 00-21.37 2.4 2 2 0 00-1 3.38l112.59 112.56a2 2 0 003.38-1A96 96 0 00256 160zM165.78 233.66a2 2 0 00-3.38 1 96 96 0 00115 115 2 2 0 001-3.38z"
								/></svg
							>
						{/if}
					</span>
				</button>
			</div>
		</li>
		<hr class="!border-t-2 mx-4 my-2" />
	{/if}

	{#each $recordsWithoutActiveUser as record}
		<li
			style="border-left: 8px solid {record.color};"
			class="card p-2 pl-2 font-medium flex justify-between items-center drop-shadow variant-filled"
		>
			<span class="p-2">{record.user.firstName} {record.user.lastName}</span>
			<div class="flex gap-1">
				{#if $state.ownerId == $user?.id}
					<!-- Only the logged in owner can see this button -->
					<button use:popup={popupClick} class="btn variant-filled-surface w-fit px-2 py-2">
						<span class="w-6 h-6 block pointer-events-none">
							<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512">
								<path
									fill="none"
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="32"
									d="M368 368L144 144M368 144L144 368"
								/>
							</svg>
						</span>
					</button>
					<div class="card p-4 variant-filled-primary z-100 w-40" data-popup="popupClick">
						<h3 class="font-bold uppercase mb-1">Remove</h3>
						<p class="mb-2">Are you sure?</p>
						<button
							on:click={() => handleRemoveUser(record.user.id)}
							class="btn w-full variant-filled-error"
						>
							Remove
						</button>
						<div class="arrow bg-primary-500" />
					</div>
				{/if}

				<button
					on:click={() => handleToggleVisibilityForUser(record.id)}
					aria-label="toggle user schedule visiblity"
					class="btn variant-filled-surface w-fit px-2 py-2"
				>
					<span class="w-6 h-6 fill-primary-50">
						{#if !$invisibleRecords.includes(record.id)}
							<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"
								><path
									d="M255.66 112c-77.94 0-157.89 45.11-220.83 135.33a16 16 0 00-.27 17.77C82.92 340.8 161.8 400 255.66 400c92.84 0 173.34-59.38 221.79-135.25a16.14 16.14 0 000-17.47C428.89 172.28 347.8 112 255.66 112z"
									fill="none"
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="32"
								/><circle
									cx="256"
									cy="256"
									r="80"
									fill="none"
									stroke="currentColor"
									stroke-miterlimit="10"
									stroke-width="32"
								/></svg
							>
						{:else}
							<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"
								><path
									d="M432 448a15.92 15.92 0 01-11.31-4.69l-352-352a16 16 0 0122.62-22.62l352 352A16 16 0 01432 448zM255.66 384c-41.49 0-81.5-12.28-118.92-36.5-34.07-22-64.74-53.51-88.7-91v-.08c19.94-28.57 41.78-52.73 65.24-72.21a2 2 0 00.14-2.94L93.5 161.38a2 2 0 00-2.71-.12c-24.92 21-48.05 46.76-69.08 76.92a31.92 31.92 0 00-.64 35.54c26.41 41.33 60.4 76.14 98.28 100.65C162 402 207.9 416 255.66 416a239.13 239.13 0 0075.8-12.58 2 2 0 00.77-3.31l-21.58-21.58a4 4 0 00-3.83-1 204.8 204.8 0 01-51.16 6.47zM490.84 238.6c-26.46-40.92-60.79-75.68-99.27-100.53C349 110.55 302 96 255.66 96a227.34 227.34 0 00-74.89 12.83 2 2 0 00-.75 3.31l21.55 21.55a4 4 0 003.88 1 192.82 192.82 0 0150.21-6.69c40.69 0 80.58 12.43 118.55 37 34.71 22.4 65.74 53.88 89.76 91a.13.13 0 010 .16 310.72 310.72 0 01-64.12 72.73 2 2 0 00-.15 2.95l19.9 19.89a2 2 0 002.7.13 343.49 343.49 0 0068.64-78.48 32.2 32.2 0 00-.1-34.78z"
								/><path
									d="M256 160a95.88 95.88 0 00-21.37 2.4 2 2 0 00-1 3.38l112.59 112.56a2 2 0 003.38-1A96 96 0 00256 160zM165.78 233.66a2 2 0 00-3.38 1 96 96 0 00115 115 2 2 0 001-3.38z"
								/></svg
							>
						{/if}
					</span>
				</button>
				{#if !$user && record.user.guest}
					<button
						on:click={() => handleExistingGuestLogin(record.user.id)}
						class="btn variant-filled-surface">Login</button
					>
				{/if}
			</div>
		</li>
	{/each}
</ul>
