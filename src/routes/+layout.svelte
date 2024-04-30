<script lang="ts">
	import { onMount } from "svelte"
	import { afterNavigate, goto, invalidate } from "$app/navigation"
	import { browser } from "$app/environment"
	import "../app.postcss"
	import {
		AppShell,
		AppBar,
		initializeStores,
		Modal,
		getModalStore,
		storePopup,
		type ModalComponent,
		type ModalSettings,
		Toast
	} from "@skeletonlabs/skeleton"
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from "@floating-ui/dom"
	import { ProgressBar } from "@prgm/sveltekit-progress-bar"
	import GuestLogin from "$lib/calendshare/svelte/components/auth/GuestLogin.svelte"
	import ColorPaletteModal from "$lib/calendshare/svelte/components/core/ColorPaletteModal.svelte"
	import CustomDaysModal from "$lib/calendshare/svelte/components/core/CustomDaysModal.svelte"
	import CustomHoursModal from "$lib/calendshare/svelte/components/core/CustomHoursModal.svelte"
	import ConfirmPersonalModal from "$lib/calendshare/svelte/components/core/ConfirmPersonalModal.svelte"
	import GuestChangeVisibilityModal from "$lib/calendshare/svelte/components/core/GuestChangeVisibilityModal.svelte"
	import ConfirmPrivateModal from "$lib/calendshare/svelte/components/core/ConfirmPrivateModal.svelte"
	import CopyPersonalCalendshareModal from "$lib/calendshare/svelte/components/core/CopyPersonalCalendshareModal.svelte"
	import ConfirmPasswordChangeModal from "$lib/calendshare/svelte/components/auth/ConfirmPasswordChangeModal.svelte"
	import GuestChangeNameModal from "$lib/calendshare/svelte/components/core/GuestChangeNameModal.svelte"
	import RemoveUserModal from "$lib/calendshare/svelte/components/core/RemoveUserModal.svelte"

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow })

	initializeStores()
	const modalRegistry: Record<string, ModalComponent> = {
		guestLogin: { ref: GuestLogin },
		colorPalette: { ref: ColorPaletteModal },
		customDays: { ref: CustomDaysModal },
		customHours: { ref: CustomHoursModal },
		confirmPersonalVisibility: { ref: ConfirmPersonalModal },
		confirmPrivateVisibility: { ref: ConfirmPrivateModal },
		guestChangeVisibility: { ref: GuestChangeVisibilityModal },
		copyPersonalCalendshare: { ref: CopyPersonalCalendshareModal },
		confirmPasswordChange: { ref: ConfirmPasswordChangeModal },
		guestChangeName: { ref: GuestChangeNameModal },
		removeUser: { ref: RemoveUserModal }
	}

	export let data

	let { supabase, session } = data
	$: ({ supabase, session } = data)

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate("supabase:auth")
			}
		})

		return () => data.subscription.unsubscribe()
	})

	let guestId: string | undefined
	afterNavigate(() => {
		if (browser && !guestId) {
			const serializedGuestData = sessionStorage.getItem("guest")
			guestId = serializedGuestData ? JSON.parse(serializedGuestData).id : undefined
		}
	})

	const modalStore = getModalStore()

	function handleCreateGuest() {
		const modal: ModalSettings = {
			type: "component",
			component: "guestLogin",
			response: ({ guest: { id } }) => {
				goto(`/new?guestId=${id}`)
			}
		}

		modalStore.trigger(modal)
	}
</script>

<Modal components={modalRegistry} />
<Toast />

<svelte:head>
	<title>Calendshare</title>
	<meta
		name="description"
		content="Your free-to-use app for finding a time in the week with others."
	/>

	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
	<link rel="manifest" href="/site.webmanifest" />
</svelte:head>

<AppShell>
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead">
				<a href="/" class="flex gap-2 items-center">
					<img src="/icon-white.svg" alt="" class="h-6" />
					<p class="text-2xl uppercase scale-y-90 font-black">Calendshare</p>
				</a>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				{#if !session}
					<p class="flex gap-2 scale-y-90 text-lg">
						<a href="/login" class="font-black text-white hover:underline">Login</a>
						<span>/</span>
						<a href="/sign-up" class="font-black text-white hover:underline">Sign Up</a>
					</p>
				{:else}
					<p class="scale-y-90 text-lg">
						<a href="/dashboard" class="font-black text-white hover:underline">Dashboard</a>
					</p>
				{/if}

				{#if guestId}
					<a
						href="/new?guestId={guestId}"
						data-sveltekit-reload
						class="btn btn-sm variant-ghost-surface"
					>
						New Calendshare
					</a>
				{:else}
					<a href="/new" data-sveltekit-reload class="btn btn-sm variant-ghost-surface">
						New Calendshare
					</a>
				{/if}
				<ProgressBar class="text-surface-100" />
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>

	<slot />
</AppShell>
