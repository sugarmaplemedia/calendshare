<script lang="ts">
	import type { PageData } from "./$types"
	import DayWeekCalendarSelector from "$lib/calendshare/core/DayWeekCalendarSelector.svelte"
	import DayWeekCalendarTitle from "$lib/calendshare/core/DayWeekCalendarTitle.svelte"
	import type { UserData } from "$lib/calendshare/db/collections/CalendshareUsers"
	import DayWeekCalendarState from "$lib/calendshare/core/DayWeekCalendarState.svelte"
	import { user } from "$lib/stores/auth"
	import DayWeekCalendarOptions from "$lib/calendshare/core/DayWeekCalendarOptions.svelte"
	import { Accordion, AccordionItem } from "@skeletonlabs/skeleton"
	import DayWeekCalendarUsers from "$lib/calendshare/core/DayWeekCalendarUsers.svelte"

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
</script>

<div class="container h-full mx-auto flex flex-col justify-center items-center mt-16">
	<DayWeekCalendarState calendarId={data.calendar_id} activeUser={$user ?? getAnonUser()}>
		<DayWeekCalendarTitle />
		<div class="text-center flex gap-4">
			<Accordion width="w-96" class="card h-fit p-4">
				<AccordionItem open>
					<svelte:fragment slot="summary">Calendar Users</svelte:fragment>
					<DayWeekCalendarUsers slot="content" />
				</AccordionItem>
				<AccordionItem open>
					<svelte:fragment slot="summary">Calendar Options</svelte:fragment>
					<DayWeekCalendarOptions slot="content" />
				</AccordionItem>
			</Accordion>
			<DayWeekCalendarSelector />
		</div>
	</DayWeekCalendarState>
</div>
