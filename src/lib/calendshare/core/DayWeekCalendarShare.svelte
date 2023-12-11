<script lang="ts">
	import { getContext } from "svelte"
	import { popup, type PopupSettings } from "@skeletonlabs/skeleton"
	import type { DayWeekCalendarContext } from "./DayWeekCalendarStateTypes"

	const { store: state } = getContext<DayWeekCalendarContext>("dayWeekCalendarState")

	async function handleShare() {
		await navigator
			.share({
				title: $state.calendar?.name ?? "CalendShare Calendar",
				text: "Check out this calendar!",
				url: window.location.href
			})
			.catch((err) => {})
	}

	async function handleCopyLink() {
		await navigator.clipboard.writeText(window.location.href).catch((err) => {})
	}

	const copyLinkPopup: PopupSettings = {
		event: "click",
		target: "popupClick",
		placement: "bottom"
	}
</script>

{#if typeof navigator.share === "function"}
	<button on:click={handleShare} class="btn variant-ghost-surface">
		<span class="w-4 h-4 block">
			<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 512 512">
				<path
					d="M336 192h40a40 40 0 0140 40v192a40 40 0 01-40 40H136a40 40 0 01-40-40V232a40 40 0 0140-40h40M336 128l-80-80-80 80M256 321V48"
					fill="none"
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="32"
				/>
			</svg>
		</span>
		<span>Share</span>
	</button>
{/if}
<button use:popup={copyLinkPopup} on:click={handleCopyLink} class="btn variant-ghost-surface">
	<span class="w-4 h-4 block">
		<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512">
			<rect
				x="128"
				y="128"
				width="336"
				height="336"
				rx="57"
				ry="57"
				fill="none"
				stroke="currentColor"
				stroke-linejoin="round"
				stroke-width="32"
			/>
			<path
				d="M383.5 128l.5-24a56.16 56.16 0 00-56-56H112a64.19 64.19 0 00-64 64v216a56.16 56.16 0 0056 56h24"
				fill="none"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="32"
			/>
		</svg>
	</span>
	<span>Copy Link</span>
</button>
<div class="card p-4 variant-filled-primary rounded-lg" data-popup="popupClick">
	<p>Copied!</p>
	<div class="arrow variant-filled-primary" />
</div>
