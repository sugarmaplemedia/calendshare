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

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<a href="/" class="flex gap-2 items-center">
					<img src="/icon-white.svg" alt="" class="h-6" />
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
