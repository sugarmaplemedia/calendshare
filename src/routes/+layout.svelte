<script lang="ts">
	import "../app.postcss"
	import { AppShell, AppBar, Modal, type ModalComponent } from "@skeletonlabs/skeleton"
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from "@floating-ui/dom"
	import { storePopup } from "@skeletonlabs/skeleton"
	import { initializeStores } from "@skeletonlabs/skeleton"
	import DayWeekCalendarGuestLogin from "$lib/calendshare/core/DayWeekCalendarGuestLogin.svelte"
	import { initializeFirebase } from "$lib/client/firebase"
	import { browser } from "$app/environment"

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
		dayWeekCalendarGuestLogin: { ref: DayWeekCalendarGuestLogin }
	}
</script>

<Modal components={modalRegistry} />

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<a href="/">
					<strong class="text-xl uppercase">Calendshare</strong>
				</a>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<a class="btn btn-sm variant-ghost-surface" href="/new" rel="noreferrer"> New Calendar </a>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />
</AppShell>
