<script lang="ts">
	import { getContext } from "svelte"
	import type { CalendshareContext } from "./CalendshareState.types"
	import { DaysTemplate, type Day } from "$lib/drizzle/schema"
	import { getModalStore, type ModalSettings } from "@skeletonlabs/skeleton"

	const { state } = getContext<CalendshareContext>("CalendshareContext")

	const modalStore = getModalStore()

	function openCustomDaysModal() {
		const modal: ModalSettings = {
			type: "component",
			component: "customDays",
			meta: {
				selectedDays: $state.days.map(({ day }) => day)
			},
			response: (combinedDays: Array<Day>) => {
				if (combinedDays) {
					$state.days = combinedDays.map((day) => ({
						calendshareId: $state.id,
						dayId: day.id,
						day: day
					}))
				}
			}
		}

		modalStore.trigger(modal)
	}

	function openCustomHoursModal() {
		const modal: ModalSettings = {
			type: "component",
			component: "customHours",
			meta: {
				startHour: $state.startHour,
				endHour: $state.endHour
			},
			response: ({ startHour, endHour }) => {
				$state.startHour = startHour
				$state.endHour = endHour
			}
		}

		modalStore.trigger(modal)
	}
</script>

<form class="flex flex-col gap-4">
	<label for="calendar-name" class="label">
		<span class="float-left text-sm uppercase font-bold">Calendar Name</span>
		<input
			type="text"
			id="calendar-name"
			name="calendar-name"
			class="input"
			bind:value={$state.name}
		/>
	</label>
	<label for="calendar-description" class="label">
		<span class="float-left text-sm uppercase font-bold">Description</span>
		<input
			type="text"
			id="calendar-description"
			name="calendar-description"
			class="input"
			bind:value={$state.description}
		/>
	</label>
	<fieldset class="w-full text-left flex gap-1 flex-col">
		<legend class="text-sm uppercase font-bold mb-1">Days To Choose From</legend>
		<label for="calendar-days-of-week-all" class="pl-4 flex items-center gap-2">
			<input
				type="radio"
				id="calendar-days-of-week-all"
				name="calendar-days-of-week"
				class="radio"
				value="all_week"
				checked={$state.daysTemplate === "all_week"}
				on:input={() => ($state.daysTemplate = "all_week")}
			/>
			<p>All Week</p>
		</label>
		<label for="calendar-days-of-week-weekdays" class="pl-4 flex items-center gap-2">
			<input
				type="radio"
				id="calendar-days-of-week-weekdays"
				name="calendar-days-of-week"
				class="radio"
				value="business_days"
				checked={$state.daysTemplate === "business_days"}
				on:input={() => ($state.daysTemplate = "business_days")}
			/>
			<p>Business Days</p>
		</label>
		<label for="calendar-days-of-week-weekends" class="pl-4 flex items-center gap-2">
			<input
				type="radio"
				id="calendar-days-of-week-weekends"
				name="calendar-days-of-week"
				class="radio"
				value="weekend_only"
				checked={$state.daysTemplate === "weekend_only"}
				on:input={() => ($state.daysTemplate = "weekend_only")}
			/>
			<p>Weekend Only</p>
		</label>
		<label for="calendar-days-of-week-weekends" class="pl-4 flex items-center gap-2">
			<div class="flex gap-2">
				<input
					type="radio"
					id="calendar-days-of-week-weekends"
					name="calendar-days-of-week"
					class="radio"
					value="weekend_only"
					checked={$state.daysTemplate === "custom"}
					on:input={() => ($state.daysTemplate = "custom")}
				/>
				<span>Custom</span>
			</div>
			{#if $state.daysTemplate == "custom"}
				<button
					type="button"
					on:click={openCustomDaysModal}
					class="btn variant-ghost-primary !py-1 px-2 w-full">Set Days</button
				>
			{/if}
		</label>
	</fieldset>

	<fieldset class="w-full text-left flex gap-1 flex-col">
		<legend class="text-sm uppercase font-bold mb-1">Hours To Choose From</legend>
		<label for="calendar-hours-all" class="pl-4 flex items-center gap-2">
			<input
				type="radio"
				id="calendar-hours-all"
				name="calendar-hours"
				class="radio"
				value="business_hours"
				checked={$state.hoursTemplate == "business_hours"}
				on:input={() => ($state.hoursTemplate = "business_hours")}
			/>
			<p>Business Hours</p>
		</label>
		<label for="calendar-hours-business" class="pl-4 flex items-center gap-2">
			<input
				type="radio"
				id="calendar-hours-business"
				name="calendar-hours"
				class="radio"
				value="all_hours"
				checked={$state.hoursTemplate == "all_hours"}
				on:input={() => ($state.hoursTemplate = "all_hours")}
			/>
			<p>All Hours</p>
		</label>
		<label for="calendar-days-of-week-weekends" class="pl-4 flex items-center gap-2">
			<div class="flex gap-2">
				<input
					type="radio"
					id="calendar-days-of-week-weekends"
					name="calendar-hours"
					class="radio"
					value="custom"
					checked={$state.hoursTemplate === "custom"}
					on:input={() => ($state.hoursTemplate = "custom")}
				/>
				<span>Custom</span>
			</div>
			{#if $state.hoursTemplate == "custom"}
				<button
					type="button"
					on:click={openCustomHoursModal}
					class="btn variant-ghost-primary !py-1 px-2 w-full">Set Hours</button
				>
			{/if}
		</label>
	</fieldset>
</form>
