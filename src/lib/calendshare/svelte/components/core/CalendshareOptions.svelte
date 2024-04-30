<script lang="ts">
	import { getContext } from "svelte"
	import { getModalStore, type ModalSettings } from "@skeletonlabs/skeleton"
	import { type Day, Visibility, type VisibilityType } from "$lib/drizzle/schema"
	import type { Context } from "./CalendshareState.svelte"

	const { calendshareStore, daysStore, user } = getContext<Context>("calendshare:context")

	let name = $calendshareStore.name
	let description = $calendshareStore.description
	let daysTemplate = $calendshareStore.daysTemplate
	let hoursTemplate = $calendshareStore.hoursTemplate
	$: calendshareStore.update({ name, description, daysTemplate, hoursTemplate })

	const modalStore = getModalStore()

	function openCustomDaysModal() {
		const modal: ModalSettings = {
			type: "component",
			component: "customDays",
			meta: {
				selectedDays: $daysStore
			},
			response: (res: { combinedDays: Array<Day>; confirmed: boolean }) => {
				if (!res?.confirmed) {
					return
				}

				const daysToRemove = $daysStore.filter(
					(day) => !res.combinedDays.find((d) => d.name === day.name)
				)
				daysToRemove.forEach(daysStore.remove)

				res.combinedDays.forEach(daysStore.insert)
			}
		}

		modalStore.trigger(modal)
	}

	function openCustomHoursModal() {
		const modal: ModalSettings = {
			type: "component",
			component: "customHours",
			meta: {
				startHour: $calendshareStore.startHour,
				endHour: $calendshareStore.endHour
			},
			response: (res) => {
				if (!res) {
					return
				}

				const { startHour, endHour } = res
				calendshareStore.update({ startHour, endHour })
			}
		}

		modalStore.trigger(modal)
	}

	function handleVisibilityGuestWarning() {
		modalStore.trigger({
			type: "component",
			component: "guestChangeVisibility"
		})
	}

	async function handleSetVisibility(visibilityMode: VisibilityType) {
		if (visibilityMode === "personal") {
			modalStore.trigger({
				type: "component",
				component: "confirmPersonalVisibility",
				response: ({ confirmed }) => {
					if (confirmed) {
						setVisibility(visibilityMode)
					}
				}
			})
		} else if (visibilityMode === "private") {
			modalStore.trigger({
				type: "component",
				component: "confirmPrivateVisibility",
				response: ({ confirmed, passPhrase }) => {
					if (confirmed) {
						setVisibility(visibilityMode, passPhrase)
					}
				}
			})
		} else {
			setVisibility(visibilityMode)
		}
	}

	async function setVisibility(visibilityMode: VisibilityType, passPhrase?: string) {
		calendshareStore.update({ visibility: visibilityMode }, passPhrase)
	}
</script>

<form class="flex flex-col gap-4" on:submit|preventDefault>
	<label for="calendar-name" class="label">
		<span class="float-left text-sm uppercase font-bold">Calendar Name</span>
		<input type="text" id="calendar-name" name="calendar-name" class="input" bind:value={name} />
	</label>
	<label for="calendar-description" class="label">
		<span class="float-left text-sm uppercase font-bold">Description</span>
		<input
			type="text"
			id="calendar-description"
			name="calendar-description"
			class="input"
			bind:value={description}
		/>
	</label>

	<label for="calendar-description" class="label">
		<p class="w-full text-left text-sm uppercase font-bold">Visibility</p>
		<div class="flex gap-1">
			<select class="select">
				{#each Visibility.enumValues as visibilityMode}
					<option
						on:click={() => handleSetVisibility(visibilityMode)}
						selected={$calendshareStore.visibility === visibilityMode}
					>
						{visibilityMode}
					</option>
				{/each}
			</select>
			{#if $user?.guest}
				<button on:click={handleVisibilityGuestWarning} class="btn variant-ghost-surface">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="ionicon w-6 !fill-white"
						viewBox="0 0 512 512"
						><path
							d="M160 164s1.44-33 33.54-59.46C212.6 88.83 235.49 84.28 256 84c18.73-.23 35.47 2.94 45.48 7.82C318.59 100.2 352 120.6 352 164c0 45.67-29.18 66.37-62.35 89.18S248 298.36 248 324"
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-miterlimit="10"
							stroke-width="40"
						/><circle cx="248" cy="399.99" r="32" /></svg
					>
				</button>
			{:else if $calendshareStore.visibility === "private"}
				<button
					on:click={() => handleSetVisibility("private")}
					class="btn variant-ghost-surface"
					title="Set Password"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="ionicon w-6" viewBox="0 0 512 512"
						><path
							d="M336 208v-95a80 80 0 00-160 0v95"
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="32"
						/><rect
							x="96"
							y="208"
							width="320"
							height="272"
							rx="48"
							ry="48"
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="32"
						/></svg
					>
				</button>
			{/if}
		</div>
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
				checked={$calendshareStore.daysTemplate === "all_week"}
				on:input={() => (daysTemplate = "all_week")}
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
				checked={$calendshareStore.daysTemplate === "business_days"}
				on:input={() => (daysTemplate = "business_days")}
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
				checked={$calendshareStore.daysTemplate === "weekend_only"}
				on:input={() => (daysTemplate = "weekend_only")}
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
					checked={$calendshareStore.daysTemplate === "custom"}
					on:input={() => (daysTemplate = "custom")}
				/>
				<span>Custom</span>
			</div>
			{#if $calendshareStore.daysTemplate == "custom"}
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
				checked={$calendshareStore.hoursTemplate == "business_hours"}
				on:input={() => (hoursTemplate = "business_hours")}
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
				checked={$calendshareStore.hoursTemplate == "all_hours"}
				on:input={() => (hoursTemplate = "all_hours")}
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
					checked={$calendshareStore.hoursTemplate === "custom"}
					on:input={() => (hoursTemplate = "custom")}
				/>
				<span>Custom</span>
			</div>
			{#if $calendshareStore.hoursTemplate == "custom"}
				<button
					type="button"
					on:click={openCustomHoursModal}
					class="btn variant-ghost-primary !py-1 px-2 w-full">Set Hours</button
				>
			{/if}
		</label>
	</fieldset>
</form>
