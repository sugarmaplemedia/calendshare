<script lang="ts">
	import CalendshareState from "$lib/calendshare/svelte/components/core/CalendshareState.svelte"
	import CalendshareTitle from "$lib/calendshare/svelte/components/core/CalendshareTitle.svelte"
	import CalendshareUsers from "$lib/calendshare/svelte/components/core/CalendshareUsers.svelte"
	import CalendshareOptions from "$lib/calendshare/svelte/components/core/CalendshareOptions.svelte"
	import {
		Accordion,
		AccordionItem,
		getModalStore,
		type ModalSettings
	} from "@skeletonlabs/skeleton"
	import CalendshareShare from "$lib/calendshare/svelte/components/core/CalendshareShare.svelte"
	import CalendshareSelector from "$lib/calendshare/svelte/components/core/CalendshareSelector.svelte"
	import CalendshareGuestLoginButton from "$lib/calendshare/svelte/components/core/CalendshareGuestLoginButton.svelte"

	export let data

	let { calendshare, user, palette } = data
	$: ({ calendshare, user } = data)
</script>

<div class="container h-full mx-auto flex justify-center items-center mt-16">
	<CalendshareState {calendshare} activeUser={user} colors={palette}>
		<div class="flex flex-col">
			<div class="xl:rotate-y-12 xl:-rotate-x-12">
				<CalendshareTitle />
			</div>
			<div class="text-center flex flex-col xl:flex-row gap-8 xl:gap-4">
				<div
					class="card h-fit p-4 xl:rotate-y-12 xl:-rotate-x-12 w-full xl:w-96 flex flex-col gap-4"
				>
					<Accordion>
						<AccordionItem open>
							<svelte:fragment slot="summary">Calendar Users</svelte:fragment>
							<CalendshareUsers slot="content" />
						</AccordionItem>
						{#if calendshare.ownerId == user?.id}
							<AccordionItem open>
								<svelte:fragment slot="summary">Calendar Options</svelte:fragment>
								<CalendshareOptions slot="content" />
							</AccordionItem>
						{/if}
					</Accordion>
					<div class="flex gap-2">
						{#if user}
							<CalendshareShare />
						{:else}
							<CalendshareGuestLoginButton />
						{/if}
					</div>
				</div>

				<div class="xl:-rotate-y-12 xl:translate-y-2.5 xl:-rotate-x-12 flex flex-col items-start">
					<CalendshareSelector />
				</div>
			</div>
		</div>
	</CalendshareState>
</div>
