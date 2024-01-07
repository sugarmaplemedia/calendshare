<script lang="ts">
	import type { PageData } from "./$types"
	import DayWeekCalendarSelector from "$lib/calendshare/core/DayWeekCalendarSelector.svelte"
	import DayWeekCalendarTitle from "$lib/calendshare/core/DayWeekCalendarTitle.svelte"
	import type { UserData } from "$lib/calendshare/db/collections/CalendshareUsers"
	import DayWeekCalendarState from "$lib/calendshare/core/DayWeekCalendarState.svelte"
	import { user } from "$lib/stores/auth"
	import DayWeekCalendarOptions from "$lib/calendshare/core/DayWeekCalendarOptions.svelte"
	import { Accordion, AccordionItem, getModalStore } from "@skeletonlabs/skeleton"
	import DayWeekCalendarUsers from "$lib/calendshare/core/DayWeekCalendarUsers.svelte"
	import DayWeekCalendarShare from "$lib/calendshare/core/DayWeekCalendarShare.svelte"
	import db from "$lib/calendshare/db"

	export let data: PageData

	const modalStore = getModalStore()

	function handleLogin() {
		modalStore.trigger({
			type: "component",
			component: "loginModal"
		})
	}

	function handleGuestLogin() {
		modalStore.trigger({
			type: "component",
			component: "dayWeekCalendarGuestLogin",
			meta: { calendarId: data.calendar_id }
		})
	}

	let isOwner = false
</script>

<div class="container h-full mx-auto flex justify-center items-center mt-16">
	<DayWeekCalendarState
		calendarId={data.calendar_id}
		activeUser={$user}
		on:setOwner={() => (isOwner = true)}
	>
		<div class="flex flex-col">
			<div class="xl:rotate-y-12 xl:-rotate-x-12">
				<DayWeekCalendarTitle />
			</div>
			<div class="text-center flex flex-col xl:flex-row gap-8 xl:gap-4">
				<div
					class="card h-fit p-4 xl:rotate-y-12 xl:-rotate-x-12 w-full xl:w-96 flex flex-col gap-4"
				>
					<Accordion>
						<AccordionItem open>
							<svelte:fragment slot="summary">Calendar Users</svelte:fragment>
							<DayWeekCalendarUsers slot="content" />
						</AccordionItem>
						{#if isOwner}
							<AccordionItem open>
								<svelte:fragment slot="summary">Calendar Options</svelte:fragment>
								<DayWeekCalendarOptions slot="content" />
							</AccordionItem>
						{/if}
					</Accordion>
					<div class="flex gap-2">
						{#if $user}
							<DayWeekCalendarShare />
						{:else}
							<button on:click={handleGuestLogin} class="btn variant-ghost-surface w-full">
								Guest Login
							</button>
						{/if}
					</div>
				</div>

				<div class="xl:-rotate-y-12 xl:translate-y-2.5 xl:-rotate-x-12 flex flex-col items-start">
					<DayWeekCalendarSelector on:selectWithoutUser={handleGuestLogin} />
				</div>
			</div>
		</div>
	</DayWeekCalendarState>
</div>
