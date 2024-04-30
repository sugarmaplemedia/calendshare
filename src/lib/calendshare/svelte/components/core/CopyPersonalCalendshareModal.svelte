<script lang="ts">
	import { getModalStore } from "@skeletonlabs/skeleton"
	import type { CalendshareWithRelations } from "$lib/drizzle/schema"

	let calendshares: CalendshareWithRelations[] = []
	let selectedCalendshare: CalendshareWithRelations | undefined

	const modalStore = getModalStore()
	let isOpen = false

	$: if ($modalStore[0] && !isOpen) {
		isOpen = true
		calendshares = $modalStore[0].meta.calendshares
	}

	function handleCancel() {
		isOpen = false
		modalStore.close()
	}

	function handleSubmit() {
		isOpen = false

		$modalStore[0]!.response!({ calendshare: selectedCalendshare })
		modalStore.close()
	}
</script>

<form class="card max-w-lg p-12 gap-4 flex flex-col" on:submit|preventDefault={handleSubmit}>
	<h2 class="h2-flat">Insert Personal Calendshare</h2>

	{#if $modalStore[0]?.meta?.currentTemplate === "custom"}
		<div class="card p-4 variant-ghost-error">
			<p>You can only insert personal hours onto non-custom calendshares.</p>
		</div>
	{/if}

	{#if calendshares.length}
		<div
			class="card p-4 grid gap-2 {$modalStore[0]?.meta?.currentTemplate === 'custom'
				? 'brightness-75 pointer-events-none'
				: ''}"
		>
			{#each calendshares as calendshare (calendshare.id)}
				<div class="flex gap-2 justify-between">
					<label for="option-{calendshare.id}" class="flex items-center gap-2">
						<input
							type="radio"
							id="option-{calendshare.id}"
							name="calendshare"
							value={calendshare.id}
							on:input={() => (selectedCalendshare = calendshare)}
							class="radio"
						/>
						<span>{calendshare.name}</span>
					</label>
					<a
						href="/{calendshare.id}"
						target="_blank"
						data-sveltekit-preload="false"
						class="py-0 btn variant-ghost-surface">View</a
					>
				</div>
			{/each}
		</div>
	{:else}
		<div class="card p-4 variant-ghost-primary">
			<p>
				Sorry, you don't have any personal calendshares set up.
				<a href="/new" class="anchor">Create one! </a>
			</p>
		</div>
	{/if}

	<div class="grid grid-cols-2 gap-2 mt-2">
		<button type="button" on:click={handleCancel} class="btn variant-ghost-primary">Cancel</button>
		<button
			type="submit"
			class="btn variant-ghost-success"
			disabled={$modalStore[0]?.meta.currentTemplate === "custom"}
		>
			Confirm
		</button>
	</div>
</form>
