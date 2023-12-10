<script lang="ts">
	import "../app.postcss"
	import { AppShell, AppBar } from "@skeletonlabs/skeleton"
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from "@floating-ui/dom"
	import { storePopup } from "@skeletonlabs/skeleton"
	import { user } from "$lib/stores/auth"

	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow })
</script>

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
