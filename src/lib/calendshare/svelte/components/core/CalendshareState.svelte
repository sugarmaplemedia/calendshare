<script lang="ts">
	import { setContext } from "svelte"
	import { derived, writable } from "svelte/store"
	import type { CalendshareWithRelations, User } from "$lib/drizzle/schema"
	import type { CalendshareContext, CalendshareState } from "./CalendshareState.types"
	import { getModalStore, type ModalSettings } from "@skeletonlabs/skeleton"
	import { invalidateAll } from "$app/navigation"
	import type { Palette } from "$lib/calendshare/color"

	export let calendshare: CalendshareWithRelations
	export let activeUser: User | undefined
	export let colors: Palette

	console.log(activeUser)

	// TODO: separate this data
	const calendshareState: CalendshareState = writable({
		calendshare,
		activeUser
	})

	$: $calendshareState.activeUser = activeUser

	$: if ($calendshareState.activeUser && !$activeUserRecord) {
		addRecord()
	}

	const modalStore = getModalStore()
	function handleGuestLogin() {
		const modal: ModalSettings = {
			type: "component",
			component: "guestLogin",
			response: async () => {
				await invalidateAll()
			}
		}

		modalStore.trigger(modal)
	}

	function addRecord() {
		calendshareState.update((state) => {
			state.calendshare.records.push({
				id: -1,
				calendshareId: state.calendshare.id,
				color: "000000", // TODO: fix this
				userId: state.activeUser!.id,
				user: activeUser!,
				entries: []
			})
			return state
		})
	}

	function updateRecordColor(color: string) {
		calendshareState.update((state) => {
			const recordToUpdate = state.calendshare.records.find(
				(record) => (record.user.id = activeUser!.id)
			)!

			console.log("Found Record", recordToUpdate)

			// FIXME: broken for some reason, second client is updating first clients color
			recordToUpdate.color = color

			return state
		})
	}

	function updateRecordEntry(
		day: string,
		hour: number,
		status: "available" | "unavailable" | "preferred",
		options: { mode: "add" | "remove" | "toggle" }
	) {
		calendshareState.update((state) => {
			const recordToUpdate = state.calendshare.records.find(
				(record) => (record.user.id = activeUser!.id)
			)!

			function addEntry() {
				recordToUpdate.entries = [
					...recordToUpdate.entries,
					{
						id: -1,
						recordId: recordToUpdate.id,
						dayId: -1,
						day: {
							id: -1,
							name: day
						},
						hour,
						minute: 0,
						status
					}
				]
			}

			function removeEntry(removalIndex: number) {
				recordToUpdate.entries.splice(removalIndex, 1)
			}

			switch (options.mode) {
				case "add":
					addEntry()
					break
				case "remove":
				case "toggle":
					const possibleExistingEntryIndex = recordToUpdate.entries.findIndex(
						(entry) => entry.day.name == day && entry.hour == hour
					)

					if (possibleExistingEntryIndex === -1) {
						addEntry()
					} else {
						removeEntry(possibleExistingEntryIndex)
					}
					break
			}

			return state
		})
	}

	const activeUserRecord = derived(calendshareState, ({ calendshare, activeUser }) =>
		activeUser ? calendshare.records.find((record) => record.userId === activeUser!.id) : undefined
	)

	// Asynchronously updates the backend on every change
	let debounceTimeout: ReturnType<typeof setTimeout>

	calendshareState.subscribe(({ calendshare }) => {
		clearTimeout(debounceTimeout)

		debounceTimeout = setTimeout(async () => {
			const updateRes = await fetch("/api/calendshare", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(calendshare)
			})

			if (updateRes.ok) {
				const { updates } = await updateRes.json()
				if (updates.length) {
					console.log("Updates:", updates)
				}
			}
		}, 300) // 300ms debounce time
	})

	// All communication with the server will be defined within this file.

	setContext<CalendshareContext>("CalendshareContext", {
		state: calendshareState,
		activeUserRecord,
		colors,
		updateRecordEntry,
		handleGuestLogin,
		updateRecordColor
	})
</script>

<slot />
