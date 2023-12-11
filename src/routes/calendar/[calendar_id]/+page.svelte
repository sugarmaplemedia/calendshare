<script lang="ts">
	import type { PageData } from "./$types"
	import DayWeekCalendarSelector from "$lib/calendshare/core/DayWeekCalendarSelector.svelte"
	import DayWeekCalendarTitle from "$lib/calendshare/core/DayWeekCalendarTitle.svelte"
	import type { UserData } from "$lib/calendshare/db/collections/CalendshareUsers"
	import DayWeekCalendarState from "$lib/calendshare/core/DayWeekCalendarState.svelte"
	import { user } from "$lib/stores/auth"
	import DayWeekCalendarOptions from "$lib/calendshare/core/DayWeekCalendarOptions.svelte"
	import {
		Accordion,
		AccordionItem,
		getModalStore,
		type ModalSettings
	} from "@skeletonlabs/skeleton"
	import DayWeekCalendarUsers from "$lib/calendshare/core/DayWeekCalendarUsers.svelte"
	import DayWeekCalendarShare from "$lib/calendshare/core/DayWeekCalendarShare.svelte"

	export let data: PageData

	// TODO: make this a real function
	function getAnonUser(): UserData {
		return {
			uid: "",
			email: "test@test.com",
			firstName: "test",
			lastName: "test"
		}
	}

	const modalStore = getModalStore()
	function handleGuestLogin() {
		const modal: ModalSettings = {
			type: "component",
			component: "dayWeekCalendarGuestLogin"
		}

		modalStore.trigger(modal)
	}
</script>

<div class="container h-full mx-auto flex flex-col justify-center items-center mt-16">
	<DayWeekCalendarState calendarId={data.calendar_id} activeUser={$user ?? getAnonUser()}>
		<div class="rotate-y-12 -rotate-x-12">
			<DayWeekCalendarTitle />
		</div>
		<div class="text-center flex gap-4">
			<div class="card h-fit p-4 rotate-y-12 -rotate-x-12 w-96 flex flex-col gap-4">
				<Accordion>
					<AccordionItem open>
						<svelte:fragment slot="summary">Calendar Users</svelte:fragment>
						<DayWeekCalendarUsers slot="content" />
					</AccordionItem>
					<AccordionItem open>
						<svelte:fragment slot="summary">Calendar Options</svelte:fragment>
						<DayWeekCalendarOptions slot="content" />
					</AccordionItem>
				</Accordion>
				<div class="grid grid-flow-col gap-2">
					{#if !$user}
						<DayWeekCalendarShare />
					{:else}
						<a href="/login" class="btn variant-ghost-surface">Login</a>
						<button on:click={handleGuestLogin} class="btn variant-ghost-surface">
							Guest Login
						</button>
					{/if}
				</div>
			</div>

			<div class="-rotate-y-12 -rotate-x-12">
				<DayWeekCalendarSelector />
			</div>
		</div>
	</DayWeekCalendarState>
</div>
