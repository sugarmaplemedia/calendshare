<script lang="ts">
	import { getContext } from "svelte"
	import type { DayWeekCalendarContext } from "./DayWeekCalendarStateTypes"
	import type { DayOptions, HourOptions } from "../db/collections/DayWeekCalendars"
	const { store: state } = getContext<DayWeekCalendarContext>("dayWeekCalendarState")

	function saveState() {
		$state.calendar?.save()
	}

	function handleSelectDayType(dayType: string) {
		state.update((previousState) => {
			previousState.calendar?.setDays(dayType as DayOptions)
			previousState.calendar?.save()
			return previousState
		})
	}

	function handleSelectHourType(hourType: string) {
		state.update((previousState) => {
			previousState.calendar?.setHours(hourType as HourOptions)
			previousState.calendar?.save()
			return previousState
		})
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
			bind:value={$state.calendar.name}
			on:change={saveState}
		/>
	</label>
	<label for="calendar-description" class="label">
		<span class="float-left text-sm uppercase font-bold">Description</span>
		<input
			type="text"
			id="calendar-description"
			name="calendar-description"
			class="input"
			bind:value={$state.calendar.description}
			on:change={saveState}
		/>
	</label>
	<fieldset class="w-full text-left flex gap-1 flex-col">
		<legend class="text-sm uppercase font-bold mb-1">Days of the Week</legend>
		<label for="calendar-days-of-week-all" class="pl-4 flex items-center gap-2">
			<input
				type="radio"
				id="calendar-days-of-week-all"
				name="calendar-days-of-week"
				class="radio"
				value="all"
				checked={$state.calendar?.template.days == "all"}
				on:click={({ currentTarget }) => handleSelectDayType(currentTarget.value)}
			/>
			<p>All</p>
		</label>
		<label for="calendar-days-of-week-weekdays" class="pl-4 flex items-center gap-2">
			<input
				type="radio"
				id="calendar-days-of-week-weekdays"
				name="calendar-days-of-week"
				class="radio"
				value="week"
				checked={$state.calendar?.template.days == "week"}
				on:click={({ currentTarget }) => handleSelectDayType(currentTarget.value)}
			/>
			<p>Weekdays</p>
		</label>
		<label for="calendar-days-of-week-weekends" class="pl-4 flex items-center gap-2">
			<input
				type="radio"
				id="calendar-days-of-week-weekends"
				name="calendar-days-of-week"
				class="radio"
				value="weekend"
				checked={$state.calendar?.template.days == "weekend"}
				on:click={({ currentTarget }) => handleSelectDayType(currentTarget.value)}
			/>
			<p>Weekends</p>
		</label>
	</fieldset>

	<fieldset class="w-full text-left flex gap-1 flex-col">
		<legend class="text-sm uppercase font-bold mb-1">Hours</legend>
		<label for="calendar-hours-all" class="pl-4 flex items-center gap-2">
			<input
				type="radio"
				id="calendar-hours-all"
				name="calendar-hours"
				class="radio"
				value="all"
				checked={$state.calendar?.template.hours == "all"}
				on:click={({ currentTarget }) => handleSelectHourType(currentTarget.value)}
			/>
			<p>All</p>
		</label>
		<label for="calendar-hours-business" class="pl-4 flex items-center gap-2">
			<input
				type="radio"
				id="calendar-hours-business"
				name="calendar-hours"
				class="radio"
				value="business"
				checked={$state.calendar?.template.hours == "business"}
				on:click={({ currentTarget }) => handleSelectHourType(currentTarget.value)}
			/>
			<p>Business</p>
		</label>
	</fieldset>
</form>
