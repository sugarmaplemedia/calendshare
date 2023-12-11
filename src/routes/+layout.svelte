<script lang="ts">
	import "../app.postcss"
	import { AppShell, AppBar, Modal, type ModalComponent } from "@skeletonlabs/skeleton"
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from "@floating-ui/dom"
	import { storePopup } from "@skeletonlabs/skeleton"
	import { initializeStores } from "@skeletonlabs/skeleton"
	import { user } from "$lib/stores/auth"
	import DayWeekCalendarGuestLogin from "$lib/calendshare/core/DayWeekCalendarGuestLogin.svelte"
	import LoginModal from "$lib/calendshare/auth/components/LoginModal.svelte"
	import type { LayoutData } from "./$types"
	import { initializeFirebase } from "$lib/client/firebase"
	import { browser } from "$app/environment"

	export let data: LayoutData

	if (browser) {
		try {
			initializeFirebase()
		} catch (ex) {
			console.error(ex)
		}
	}

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow })

	initializeStores()
	const modalRegistry: Record<string, ModalComponent> = {
		dayWeekCalendarGuestLogin: { ref: DayWeekCalendarGuestLogin },
		loginModal: { ref: LoginModal }
	}
</script>

<Modal components={modalRegistry} />

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<strong class="text-xl uppercase">Calendshare {$user ? $user.email : "NULL"}</strong>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				{#if !$user}
					<a class="btn btn-sm variant-ghost-surface" href="/login" rel="noreferrer">Log In</a>
				{:else}
					<a class="btn btn-sm variant-ghost-surface" href="/new" rel="noreferrer">
						New Calendar
					</a>
					<a class="btn btn-sm variant-ghost-surface" href="/dashboard" rel="noreferrer">
						Dashboard
					</a>
					<form action="/login?/logout" method="POST">
						<button class="btn btn-sm variant-ghost-surface">Log Out</button>
					</form>
				{/if}
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />
</AppShell>
