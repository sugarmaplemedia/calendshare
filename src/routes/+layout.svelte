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
		Toast,
		Drawer,
		getDrawerStore
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

	const drawerStore = getDrawerStore()

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

		drawerStore.close()
		menuOpen = false
	})

	let menuOpen = false
	function handleToggleDrawer() {
		if (menuOpen) {
			drawerStore.close()
		} else {
			drawerStore.open()
		}

		menuOpen = !menuOpen
	}
</script>

<Toast />
<Modal components={modalRegistry} />
<Drawer position="right">
	<div class="flex flex-col gap-4 p-8 h-full justify-between">
		<div class="w-full flex justify-between">
			<div class="flex gap-2 h-fit items-center">
				<img src="/icon-white.svg" alt="" class="h-6" />
				<p class="text-2xl uppercase scale-y-90 font-black">Calendshare</p>
			</div>
			<button on:click={handleToggleDrawer} class="md:hidden p-1 h-fit btn variant-ghost-surface">
				<svg xmlns="http://www.w3.org/2000/svg" class="ionicon w-6" viewBox="0 0 512 512"
					><path
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-miterlimit="10"
						stroke-width="32"
						d="M80 160h352M80 256h352M80 352h352"
					/></svg
				>
			</button>
		</div>
		<div class="flex flex-col grow gap-16 text-center justify-center">
			<p><a href="/" class="h2-flat white underline">Home</a></p>
			{#if !session}
				<p><a href="/login" class="h2-flat white underline">Log In</a></p>
				<p><a href="/sign-up" class="h2-flat white underline">Sign Up</a></p>
			{:else}
				<p><a href="/dashboard" class="h2-flat white underline">Dashboard</a></p>
			{/if}
		</div>
		<div class="h-fit">
			{#if guestId}
				<a
					href="/new?guestId={guestId}"
					data-sveltekit-reload
					class="btn btn-sm variant-ghost-surface p-6 w-full"
				>
					New Calendshare
				</a>
			{:else}
				<a href="/new" data-sveltekit-reload class="btn p-6 w-full variant-ghost-surface">
					New Calendshare
				</a>
			{/if}
		</div>
	</div>
</Drawer>

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
		<ProgressBar class="text-surface-100" />
		<AppBar>
			<svelte:fragment slot="lead">
				<a href="/" class="flex gap-2 items-center">
					<img src="/icon-white.svg" alt="" class="h-6" />
					<p class="text-2xl uppercase scale-y-90 font-black">Calendshare</p>
				</a>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<div class="gap-4 hidden md:flex">
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
				</div>

				<button on:click={handleToggleDrawer} class="md:hidden p-1 btn variant-ghost-surface">
					<svg xmlns="http://www.w3.org/2000/svg" class="ionicon w-6" viewBox="0 0 512 512"
						><path
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-miterlimit="10"
							stroke-width="32"
							d="M80 160h352M80 256h352M80 352h352"
						/></svg
					>
				</button>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>

	<slot />
</AppShell>
