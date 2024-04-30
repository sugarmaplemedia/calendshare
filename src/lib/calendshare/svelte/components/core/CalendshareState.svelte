<script context="module" lang="ts">
	type CalendshareUser = Writable<User | undefined>
	type CalendshareUserRecord = Readable<Record | undefined>

	export type Context = {
		calendshareStore: CalendshareStore
		recordsStore: RecordsStore
		recordEntriesStore: RecordEntriesStore
		daysStore: DaysStore
		user: CalendshareUser
		userRecord: CalendshareUserRecord
		loggedInUsers: Writable<Array<string>>
		colors: Palette
		invisibleRecords: Writable<Array<number>>
		currentMode: Writable<RecordEntryStatusType>
		copyPersonalCalendshare: () => void
		handleJoinCalendshare: () => void
	}
</script>

<script lang="ts">
	import { setContext } from "svelte"
	import { derived, writable, type Readable, type Writable } from "svelte/store"
	import type {
		CalendshareWithRelations,
		User,
		Record,
		RecordEntryStatusType
	} from "$lib/drizzle/schema"
	import { getModalStore } from "@skeletonlabs/skeleton"
	import { getRandomColorFromPalette, palette, type Palette } from "$lib/calendshare/color"
	import type { SupabaseClient } from "@supabase/supabase-js"
	import { getCalendshareStores } from "$lib/client/stores"
	import type { CalendshareStore } from "$lib/client/stores/CalendshareStore"
	import type { RecordsStore } from "$lib/client/stores/recordsStore"
	import type { RecordEntriesStore } from "$lib/client/stores/recordEntriesStore"
	import type { DaysStore } from "$lib/client/stores/daysStore"
	import { invalidateAll } from "$app/navigation"

	export let calendshare: CalendshareWithRelations
	export let activeUser: User | undefined
	export let supabase: SupabaseClient

	const { calendshareStore, recordsStore, recordEntriesStore, daysStore } = getCalendshareStores(
		calendshare,
		supabase
	)

	type CalendshareUser = Writable<User | undefined>
	const user: CalendshareUser = writable(activeUser)
	$: $user = activeUser

	const userRecord = derived([recordsStore, user], ([$recordsStore, $user]) =>
		$recordsStore.find((record) => record.userId === $user?.id)
	)

	const loggedInUsers: Writable<Array<string>> = writable([])
	const room = supabase
		.channel(`calendshare-${calendshare.id}-room`, {
			config: {
				presence: {
					key: $user?.id
				}
			}
		})
		.on("presence", { event: "sync" }, () => {
			const newState = room.presenceState()
			console.log("sync", newState)

			//@ts-ignore
			$loggedInUsers = Object.values(newState).map((presenceArr) => presenceArr[0].userId)
		})
		.subscribe(async (status) => {
			if (status !== "SUBSCRIBED") {
				return
			}

			await room.track({ userId: $user?.id, guest: $user?.guest })
		})

	// Array of record IDs that should not be displayed
	const invisibleRecords: Writable<Array<number>> = writable([])

	type CurrentMode = Writable<RecordEntryStatusType>
	const currentMode: CurrentMode = writable("available")

	const modalStore = getModalStore()

	function handleJoinCalendshare() {
		if (!$user) {
			modalStore.trigger({
				type: "component",
				component: "guestLogin",
				response: async ({ guest }: { guest: User }) => {
					if (guest) {
						user.set(guest)
						addUserToCalendshare(guest)
						invalidateAll()
					}
				}
			})
		} else {
			addUserToCalendshare($user)
		}

		function addUserToCalendshare(newUser: User) {
			const colorsNotInUse = palette.filter(
				(color) => !$recordsStore.find((r) => r.color === color.hex)
			)

			recordsStore.insert(
				{
					id: -1,
					calendshareId: $calendshareStore.id,
					color: getRandomColorFromPalette(colorsNotInUse).hex,
					userId: newUser.id
				},
				newUser
			)
		}
	}

	async function copyPersonalCalendshare() {
		const ownCalendsharesRes = await fetch(`/api/user/${$user!.id}/personal`)

		if (!ownCalendsharesRes.ok) {
			console.error("Failed to fetch personal calendshares")
			return
		}

		const ownCalendshares = (await ownCalendsharesRes.json()) as Array<CalendshareWithRelations>

		modalStore.trigger({
			type: "component",
			component: "copyPersonalCalendshare",
			meta: {
				calendshares: ownCalendshares.map((calendshare) => calendshare.visibility === "personal"),
				currentTemplate: $calendshareStore.daysTemplate
			},
			response: ({ calendshare }: { calendshare: CalendshareWithRelations }) => {
				calendshare.records[0]?.entries.forEach(recordEntriesStore.insert)
			}
		})
	}

	const context: Context = {
		calendshareStore,
		recordsStore,
		recordEntriesStore,
		daysStore,
		user,
		userRecord,
		loggedInUsers,
		colors: palette,
		invisibleRecords,
		currentMode,
		copyPersonalCalendshare,
		handleJoinCalendshare
	}

	setContext<Context>("calendshare:context", context)
</script>

<slot />
