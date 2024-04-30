<script lang="ts">
	import { Accordion, AccordionItem } from "@skeletonlabs/skeleton"
	import CalendshareState from "$lib/calendshare/svelte/components/core/CalendshareState.svelte"
	import CalendshareTitle from "$lib/calendshare/svelte/components/core/CalendshareTitle.svelte"
	import CalendshareUsers from "$lib/calendshare/svelte/components/core/CalendshareUsers.svelte"
	import CalendshareOptions from "$lib/calendshare/svelte/components/core/CalendshareOptions.svelte"
	import CalendshareSelector from "$lib/calendshare/svelte/components/core/CalendshareSelector.svelte"
	import JoinOrShareButton from "$lib/calendshare/svelte/components/core/JoinOrShareButton.svelte"
	import { invalidateAll } from "$app/navigation"

	export let data

	invalidateAll()

	let { calendshare, user, supabase } = data
	$: ({ calendshare, user } = data)
</script>

<div class="container h-full mx-auto flex justify-center items-center mt-16">
	<CalendshareState {calendshare} {supabase} activeUser={user}>
		<div class="flex flex-col">
			<div class="xl:rotate-y-12 xl:-rotate-x-12">
				<CalendshareTitle />
			</div>
			<div class="text-center flex flex-col xl:flex-row gap-8 xl:gap-4">
				<div class="flex flex-col gap-4">
					<div
						class="card h-fit p-4 xl:rotate-y-12 xl:-rotate-x-12 w-full xl:w-96 flex flex-col gap-4"
					>
						{#if calendshare.visibility === "personal"}
							<CalendshareUsers />
						{/if}
						<Accordion>
							{#if calendshare.visibility !== "personal"}
								<AccordionItem open>
									<svelte:fragment slot="summary">
										<span>Calendar Users</span>
										<span class="code ml-2">{calendshare.records.length}/12</span>
									</svelte:fragment>
									<CalendshareUsers slot="content" />
								</AccordionItem>
							{/if}
							{#if calendshare.ownerId == user?.id}
								<AccordionItem open>
									<svelte:fragment slot="summary">Calendar Options</svelte:fragment>
									<CalendshareOptions slot="content" />
								</AccordionItem>
							{/if}
						</Accordion>
						{#if calendshare.visibility !== "personal"}
							<div class="flex gap-2">
								<JoinOrShareButton />
							</div>
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
