<script lang="ts">
	import { getContext } from "svelte"
	import type { DayWeekCalendarContext } from "./DayWeekCalendarStateTypes"
	import type { DayOptions } from "../db/collections/DayWeekCalendars"

	const { store: state } = getContext<DayWeekCalendarContext>("dayWeekCalendarState")

	function saveState() {
		$state.calendar?.save()
	}

	let dummyVal: string = ""

	function handleSelectDayType(dayType: DayOptions) {
		state.update((previousState) => {
			previousState.calendar?.setDays(dayType)
			return previousState
		})

		console.log($state.calendar?.days, dayType)
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
				on:click={(e) => handleSelectDayType(e.target.value)}
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
				on:click={(e) => handleSelectDayType(e.target.value)}
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
				on:click={(e) => handleSelectDayType(e.target.value)}
			/>
			<p>Weekends</p>
		</label>
	</fieldset>

	<fieldset class="w-full text-left flex gap-1 flex-col">
		<legend class="text-sm uppercase font-bold mb-1">Hours</legend>
		<label for="calendar-hours-all" class="pl-4 flex items-center gap-2">
			<input type="radio" id="calendar-hours-all" name="calendar-hours" class="radio" value="all" />
			<p>All</p>
		</label>
		<label for="calendar-hours-business" class="pl-4 flex items-center gap-2">
			<input
				type="radio"
				id="calendar-hours-business"
				name="calendar-hours"
				class="radio"
				value="business"
			/>
			<p>Business</p>
		</label>
	</fieldset>
</form>
