<script lang="ts">
	import "../app.postcss"
	import {
		AppShell,
		AppBar,
		Modal,
		getModalStore,
		type ModalComponent,
		type ModalSettings,
		Toast
	} from "@skeletonlabs/skeleton"
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from "@floating-ui/dom"
	import { storePopup } from "@skeletonlabs/skeleton"
	import { initializeStores } from "@skeletonlabs/skeleton"
	import GuestLogin from "$lib/calendshare/svelte/components/auth/GuestLogin.svelte"
	import { onMount } from "svelte"
	import { invalidate } from "$app/navigation"
	import ColorPaletteModal from "$lib/calendshare/svelte/components/core/ColorPaletteModal.svelte"
	import { browser } from "$app/environment"
	import CustomDaysModal from "$lib/calendshare/svelte/components/core/CustomDaysModal.svelte"
	import CustomHoursModal from "$lib/calendshare/svelte/components/core/CustomHoursModal.svelte"

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow })
	initializeStores()

	const modalRegistry: Record<string, ModalComponent> = {
		guestLogin: { ref: GuestLogin },
		colorPalette: { ref: ColorPaletteModal },
		customDays: { ref: CustomDaysModal },
		customHours: { ref: CustomHoursModal }
	}

	export let data

	let { supabase, session } = data
	$: ({ supabase, session } = data)

	onMount(() => {
		// Reset session data for all components when the session changes/expires
		const { data } = supabase.auth.onAuthStateChange((_, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate("supabase:auth")
			}
		})

		return () => data.subscription.unsubscribe()
	})

	let guestId: string | undefined
	if (browser) {
		const serializedGuestData = localStorage.getItem("guest")
		guestId = serializedGuestData ? JSON.parse(serializedGuestData).id : undefined
	}

	const modalStore = getModalStore()

	function handleCreateGuest() {
		const modal: ModalSettings = {
			type: "component",
			component: "guestLogin",
			response: ({ id }) => {
				guestId = id
				console.log(guestId)
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
					<strong class="text-xl uppercase">Calendshare</strong>
				</a>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				{#if !session && !guestId}
					<button on:click={handleCreateGuest} class="btn btn-sm variant-ghost-surface">
						New Calendshare
					</button>
					<a class="btn btn-sm variant-ghost-surface" href="/login" rel="noreferrer"> Login </a>
				{:else if !session}
					<p class="flex gap-2 scale-y-90 text-lg">
						<a href="/login" class="font-black text-white hover:underline">Login</a>
						<span>/</span>
						<a href="/sign-up" class="font-black text-white hover:underline">Sign Up</a>
					</p>
					<a
						href="/new?guestId={guestId}"
						data-sveltekit-preload-data="false"
						class="btn btn-sm variant-ghost-surface"
					>
						New Calendshare
					</a>
					<a class="btn btn-sm variant-ghost-surface" href="/login" rel="noreferrer"> Login </a>
				{:else}
					<a href="/new" class="btn btn-sm variant-ghost-surface"> New Calendshare </a>
					<a class="btn btn-sm variant-ghost-surface" href="/account" rel="noreferrer">Dashboard</a>
				{/if}
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>

	<slot />
</AppShell>
