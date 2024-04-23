<script lang="ts">
	import { setContext } from "svelte"
	import { derived, writable, type Writable } from "svelte/store"
	import type { CalendshareWithRelations, User } from "$lib/drizzle/schema"
	import type {
		CalendshareContext,
		CalendshareState,
		CalendshareUser,
		CalendshareUserRecord,
		CurrentMode
	} from "./CalendshareState.types"
	import { getModalStore, type ModalSettings } from "@skeletonlabs/skeleton"
	import { invalidateAll } from "$app/navigation"
	import { getRandomColorFromPalette, palette, type Palette } from "$lib/calendshare/color"

	export let calendshare: CalendshareWithRelations
	export let activeUser: User | undefined
	export let colors: Palette

	const state: CalendshareState = writable(calendshare)
	const currentMode: CurrentMode = writable("available")

	const user: CalendshareUser = writable(activeUser)
	const userRecord: CalendshareUserRecord = derived([state, user], ([$state, $user]) => {
		return $state.records.find((record) => record.userId === $user?.id)
	})
	$: $user = activeUser

	let invisibleRecords: Writable<Array<number>> = writable([])
	let justMounted = true

	// TODO: Add response to guestLogin modal
	// $: if (activeUser && !getActiveUserRecord()) {
	// 	addRecord()
	// }

	const modalStore = getModalStore()
	function handleJoinCalendshare() {
		if (!$user) {
			const modal: ModalSettings = {
				type: "component",
				component: "guestLogin",
				response: async () => {
					await invalidateAll()
				}
			}

			modalStore.trigger(modal)
		} else {
			addRecord()
		}
	}

	let nextNewRecordId = 0
	function getNextNewRecordId() {
		return nextNewRecordId--
	}

	let nextNewRecordEntryId = 0
	function getNextNewRecordEntryId() {
		return nextNewRecordEntryId--
	}

	function addRecord() {
		state.update((state) => {
			const colorsNotInUse = palette.filter(
				(color) => !$state.records.find((r) => r.color === color.hex)
			)

			state.records = [
				...state.records,
				{
					id: getNextNewRecordId(),
					calendshareId: state.id,
					color: getRandomColorFromPalette(colorsNotInUse).hex,
					userId: $user!.id,
					user: $user!,
					entries: []
				}
			]

			return state
		})
	}

	function updateRecordColor(color: string) {
		state.update((state) => {
			const recordToUpdate = state.records.find((record) => record.user.id === activeUser!.id)!

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
		state.update((state) => {
			const recordToUpdate = state.records.find((record) => record.user.id == activeUser!.id)!

			function addEntry() {
				const baseDays = [
					{ id: 1, name: "Monday" },
					{ id: 2, name: "Tuesday" },
					{ id: 3, name: "Wednesday" },
					{ id: 4, name: "Thursday" },
					{ id: 5, name: "Friday" },
					{ id: 6, name: "Saturday" },
					{ id: 7, name: "Sunday" },
					...state.days.map(({ day }) => day)
				]

				const dayObj = baseDays.find((d) => d.name === day)!

				recordToUpdate.entries = [
					...recordToUpdate.entries,
					{
						id: getNextNewRecordEntryId(),
						recordId: recordToUpdate.id,
						dayId: dayObj.id,
						day: {
							id: dayObj.id,
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

					if (possibleExistingEntryIndex === -1 && options.mode === "toggle") {
						addEntry()
					} else if (possibleExistingEntryIndex !== -1) {
						removeEntry(possibleExistingEntryIndex)
					}
					break
			}

			return state
		})
	}

	function getActiveUserRecord() {
		return $user ? $state.records.find((record) => record.userId === activeUser!.id) : undefined
	}

	// Asynchronously updates the backend on every change
	let debounceTimeout: ReturnType<typeof setTimeout>

	state.subscribe((calendshare) => {
		if (justMounted) {
			justMounted = false
			return
		}

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
				const { updates, newIds, newRelations } = (await updateRes.json()) as {
					updates: Array<string>
					newIds: Record<string, Array<[number, number]>>
					newRelations: Record<
						string,
						Array<[[number | string, number], [number | string, number]]>
					>
				}

				if (updates.length) {
					console.log("Updates:", updates)
				}

				if (newIds["records"]) {
					for (const [oldId, newId] of newIds["records"]) {
						const record = $state.records.find((r) => r.id === oldId)!
						record.id = newId
					}
				}

				if (newIds["entries"]) {
					for (const [oldId, newId] of newIds["entries"]) {
						const entry = $state.records.flatMap((r) => r.entries).find((e) => e.id === oldId)!
						entry.id = newId
					}
				}

				if (newIds["days"]) {
					for (const [oldId, newId] of newIds["days"]) {
						const { day } = $state.days.find((d) => d.day.id === oldId)!
						day.id = newId
					}
				}

				if (newRelations["calendsharesDays"]) {
					for (const [[_, oldDayId], [__, newDayId]] of newRelations["calendsharesDays"]) {
						const dayRelation = $state.days.find((d) => d.dayId === oldDayId)!
						dayRelation.dayId = newDayId
					}
				}
			}
		}, 300) // 300ms debounce time
	})

	// All communication with the server will be defined within this file.

	setContext<CalendshareContext>("CalendshareContext", {
		state,
		user,
		userRecord,
		currentMode,
		invisibleRecords,
		activeUser,
		colors,
		getActiveUserRecord,
		updateRecordEntry,
		handleGuestLogin: handleJoinCalendshare,
		updateRecordColor
	})
</script>

<slot />
