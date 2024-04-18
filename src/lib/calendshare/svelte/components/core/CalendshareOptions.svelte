<script lang="ts">
	import { getContext } from "svelte"
	import type { CalendshareContext } from "./CalendshareState.types"

	const { state } = getContext<CalendshareContext>("CalendshareContext")
</script>

<form class="flex flex-col gap-4">
	<label for="calendar-name" class="label">
		<span class="float-left text-sm uppercase font-bold">Calendar Name</span>
		<input
			type="text"
			id="calendar-name"
			name="calendar-name"
			class="input"
			bind:value={$state.calendshare.name}
		/>
	</label>
	<label for="calendar-description" class="label">
		<span class="float-left text-sm uppercase font-bold">Description</span>
		<input
			type="text"
			id="calendar-description"
			name="calendar-description"
			class="input"
			bind:value={$state.calendshare.description}
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
				checked={$state.calendshare.daysTemplate === "all_week"}
				on:input={() => ($state.calendshare.daysTemplate = "all_week")}
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
				checked={$state.calendshare.daysTemplate === "business_days"}
				on:input={() => ($state.calendshare.daysTemplate = "business_days")}
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
				checked={$state.calendshare.daysTemplate === "weekend_only"}
				on:input={() => ($state.calendshare.daysTemplate = "weekend_only")}
			/>
			<p>Weekend Only</p>
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
				checked={$state.calendshare.hoursTemplate == "business_hours"}
				on:input={() => ($state.calendshare.hoursTemplate = "business_hours")}
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
				checked={$state.calendshare.hoursTemplate == "all_hours"}
				on:input={() => ($state.calendshare.hoursTemplate = "all_hours")}
			/>
			<p>All Hours</p>
		</label>
	</fieldset>
</form>
