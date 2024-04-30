<script lang="ts">
	import { getContext } from "svelte"
	import { getModalStore, type ModalSettings } from "@skeletonlabs/skeleton"
	import type { Record, User } from "$lib/drizzle/schema"
	import { invalidateAll } from "$app/navigation"
	import { derived } from "svelte/store"
	import type { Context } from "./CalendshareState.svelte"

	const {
		calendshareStore: state,
		recordsStore,
		user,
		userRecord,
		loggedInUsers,
		colors,
		invisibleRecords,
		copyPersonalCalendshare
	} = getContext<Context>("calendshare:context")

	const recordsWithoutActiveUser = derived([recordsStore, user], ([$recordsStore, $user]) => {
		return $recordsStore.filter((record) => record.userId !== $user?.id)
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
			sessionStorage.setItem("guest", JSON.stringify(guestData))

			invalidateAll()
		}
	}

	function handleToggleVisibilityForUser(recordId: number) {
		const possibleIndex = $invisibleRecords.findIndex((id) => id === recordId)

		if (possibleIndex === -1) {
			invisibleRecords.set([...$invisibleRecords, recordId])
		} else {
			invisibleRecords.update(($invisibleRecords) =>
				$invisibleRecords.filter((id) => id !== recordId)
			)
		}
	}

	const modalStore = getModalStore()

	const modal: ModalSettings = {
		type: "component",
		component: "colorPalette",
		response: ({ hexColor }) => {
			recordsStore.update({ ...$userRecord!, color: hexColor })
		}
	}

	function handleChangeName() {
		modalStore.trigger({
			type: "component",
			component: "guestChangeName",
			meta: {
				id: $user!.id,
				firstName: $user!.firstName,
				lastName: $user!.lastName
			}
		})
	}

	function handleSelectColor() {
		modal.meta = {
			colors,
			color: $userRecord!.color,
			unavailableColors: $recordsStore.map((r) => r.color).filter((c) => c !== $userRecord!.color)
		}

		modalStore.trigger(modal)
	}

	function handleRemoveRecord(record: Record) {
		modalStore.trigger({
			type: "component",
			component: "removeUser",
			meta: {
				record
			},
			response({ confirmed }) {
				if (!confirmed) {
					return
				}

				recordsStore.remove(record)
			}
		})
	}
</script>

<ul class="text-left flex flex-col gap-1">
	{#if $user && $userRecord}
		<li
			style="border-left: 8px solid {$userRecord.color};"
			class="card p-2 pl-2 font-medium flex justify-between items-center drop-shadow variant-filled"
		>
			<div class="flex gap-1 items-center pl-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="ionicon w-4 translate-y-[1px] fill-success-500"
					viewBox="0 0 512 512"
					><path
						d="M258.9 48C141.92 46.42 46.42 141.92 48 258.9c1.56 112.19 92.91 203.54 205.1 205.1 117 1.6 212.48-93.9 210.88-210.88C462.44 140.91 371.09 49.56 258.9 48zm126.42 327.25a4 4 0 01-6.14-.32 124.27 124.27 0 00-32.35-29.59C321.37 329 289.11 320 256 320s-65.37 9-90.83 25.34a124.24 124.24 0 00-32.35 29.58 4 4 0 01-6.14.32A175.32 175.32 0 0180 259c-1.63-97.31 78.22-178.76 175.57-179S432 158.81 432 256a175.32 175.32 0 01-46.68 119.25z"
					/><path
						d="M256 144c-19.72 0-37.55 7.39-50.22 20.82s-19 32-17.57 51.93C191.11 256 221.52 288 256 288s64.83-32 67.79-71.24c1.48-19.74-4.8-38.14-17.68-51.82C293.39 151.44 275.59 144 256 144z"
					/></svg
				>
				<span class="p-2 pl-0">{$user.firstName} {$user.lastName}</span>
			</div>

			<div class="flex gap-1">
				<!-- Change Guest Name -->
				{#if $user.guest}
					<button
						on:click={handleChangeName}
						aria-label="toggle user schedule visiblity"
						class="btn variant-filled-surface w-fit px-2 py-2"
						title="Change color"
					>
						<span class="w-6 h-6 fill-primary-50">
							<svg xmlns="http://www.w3.org/2000/svg" class="ionicon w-6" viewBox="0 0 512 512"
								><path
									d="M344 144c-3.92 52.87-44 96-88 96s-84.15-43.12-88-96c-4-55 35-96 88-96s92 42 88 96z"
									fill="none"
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="32"
								/><path
									d="M256 304c-87 0-175.3 48-191.64 138.6C62.39 453.52 68.57 464 80 464h352c11.44 0 17.62-10.48 15.65-21.4C431.3 352 343 304 256 304z"
									fill="none"
									stroke="currentColor"
									stroke-miterlimit="10"
									stroke-width="32"
								/></svg
							>
						</span>
					</button>
				{/if}

				<!-- Change Color -->
				<button
					on:click={handleSelectColor}
					aria-label="toggle user schedule visiblity"
					class="btn variant-filled-surface w-fit px-2 py-2"
					title="Change color"
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
				{#if !$user.guest && $state.visibility !== "personal"}
					<button
						on:click={copyPersonalCalendshare}
						aria-label="toggle user schedule visiblity"
						class="btn variant-filled-surface w-fit px-2 py-2"
						title="Copy personal calendar"
					>
						<span class="w-6 h-6 fill-primary-50">
							<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"
								><path
									d="M336 64h32a48 48 0 0148 48v320a48 48 0 01-48 48H144a48 48 0 01-48-48V112a48 48 0 0148-48h32"
									fill="none"
									stroke="currentColor"
									stroke-linejoin="round"
									stroke-width="32"
								/><rect
									x="176"
									y="32"
									width="160"
									height="64"
									rx="26.13"
									ry="26.13"
									fill="none"
									stroke="currentColor"
									stroke-linejoin="round"
									stroke-width="32"
								/></svg
							>
						</span>
					</button>
				{/if}
				<button
					on:click={() => $userRecord && handleToggleVisibilityForUser($userRecord.id)}
					aria-label="toggle user schedule visiblity"
					class="btn variant-filled-surface w-fit px-2 py-2"
					title="Toggle visibility"
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
		{#if $state.visibility !== "personal"}
			<hr class="!border-t-2 mx-4 my-2" />
		{/if}
	{/if}

	{#each $recordsWithoutActiveUser as record}
		<li
			style="border-left: 8px solid {record.color};"
			class="card p-2 pl-2 font-medium flex justify-between items-center drop-shadow variant-filled"
		>
			<div class="flex gap-1 items-center pl-2">
				{#if $loggedInUsers.includes(record.userId)}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="ionicon w-4 translate-y-[1px] fill-success-500"
						viewBox="0 0 512 512"
						><path
							d="M258.9 48C141.92 46.42 46.42 141.92 48 258.9c1.56 112.19 92.91 203.54 205.1 205.1 117 1.6 212.48-93.9 210.88-210.88C462.44 140.91 371.09 49.56 258.9 48zm126.42 327.25a4 4 0 01-6.14-.32 124.27 124.27 0 00-32.35-29.59C321.37 329 289.11 320 256 320s-65.37 9-90.83 25.34a124.24 124.24 0 00-32.35 29.58 4 4 0 01-6.14.32A175.32 175.32 0 0180 259c-1.63-97.31 78.22-178.76 175.57-179S432 158.81 432 256a175.32 175.32 0 01-46.68 119.25z"
						/><path
							d="M256 144c-19.72 0-37.55 7.39-50.22 20.82s-19 32-17.57 51.93C191.11 256 221.52 288 256 288s64.83-32 67.79-71.24c1.48-19.74-4.8-38.14-17.68-51.82C293.39 151.44 275.59 144 256 144z"
						/></svg
					>
				{/if}
				<span class="p-2 pl-0">{record.user.firstName} {record.user.lastName}</span>
			</div>

			<div class="flex gap-1">
				{#if $state.ownerId === $user?.id && !$loggedInUsers.includes(record.userId)}
					<!-- Only the logged in owner can see this button -->
					<button
						on:click={() => handleRemoveRecord(record)}
						class="btn variant-filled-surface w-fit px-2 py-2"
						title="Remove user"
					>
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
				{#if !$user && record.user.guest && !$loggedInUsers.includes(record.userId)}
					<button
						on:click={() => handleExistingGuestLogin(record.user.id)}
						class="btn variant-filled-surface">Login</button
					>
				{/if}
			</div>
		</li>
	{/each}
</ul>
