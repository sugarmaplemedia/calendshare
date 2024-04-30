<script lang="ts">
	import { getContext } from "svelte"
	import { popup, type PopupSettings } from "@skeletonlabs/skeleton"
	import type { Context } from "./CalendshareState.svelte"
	import { browser } from "$app/environment"

	const { calendshareStore, userRecord, handleJoinCalendshare } =
		getContext<Context>("calendshare:context")

	async function handleShare() {
		await navigator
			.share({
				title: $calendshareStore.name ?? "CalendShare Calendar",
				text: "Check out this calendar!",
				url: window.location.href
			})
			.catch((err) => console.log(err))
	}

	async function handleCopyLink() {
		await navigator.clipboard.writeText(window.location.href).catch((err) => console.log(err))
	}

	const copyLinkPopup: PopupSettings = {
		event: "click",
		target: "copyPopup",
		placement: "bottom"
	}
	const qrLinkPopup: PopupSettings = {
		event: "hover",
		target: "qrPopup",
		placement: "bottom"
	}
</script>

<!-- TODO: Get state of $userRecord to update properly when user logs in as guest; I think it might have to do with response of GuestLoginModal? -->
{#if $userRecord}
	{#if browser && typeof navigator.share === "function"}
		<button on:click={handleShare} class="btn variant-ghost-surface grow">
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
	<button
		use:popup={copyLinkPopup}
		on:click={handleCopyLink}
		class="btn variant-ghost-surface grow"
	>
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
	<div class="card p-4 variant-filled-primary rounded-lg" data-popup="copyPopup">
		<p>Copied!</p>
		<div class="arrow variant-filled-primary" />
	</div>
	<a
		use:popup={qrLinkPopup}
		href={`https://quickchart.io/qr?text=https%3A%2F%2Fcalendshare.app%2F/${$calendshareStore.id}&size=512`}
		target="_blank"
		class="btn variant-ghost-surface w-fit"
	>
		<span class="w-4 h-4 block fill-primary-50 pointer-events-none">
			<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"
				><rect x="336" y="336" width="80" height="80" rx="8" ry="8" /><rect
					x="272"
					y="272"
					width="64"
					height="64"
					rx="8"
					ry="8"
				/><rect x="416" y="416" width="64" height="64" rx="8" ry="8" /><rect
					x="432"
					y="272"
					width="48"
					height="48"
					rx="8"
					ry="8"
				/><rect x="272" y="432" width="48" height="48" rx="8" ry="8" /><rect
					x="336"
					y="96"
					width="80"
					height="80"
					rx="8"
					ry="8"
				/><rect
					x="288"
					y="48"
					width="176"
					height="176"
					rx="16"
					ry="16"
					fill="none"
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="32"
				/><rect x="96" y="96" width="80" height="80" rx="8" ry="8" /><rect
					x="48"
					y="48"
					width="176"
					height="176"
					rx="16"
					ry="16"
					fill="none"
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="32"
				/><rect x="96" y="336" width="80" height="80" rx="8" ry="8" /><rect
					x="48"
					y="288"
					width="176"
					height="176"
					rx="16"
					ry="16"
					fill="none"
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="32"
				/></svg
			>
		</span>
	</a>
	<div class="card p-4 variant-filled-primary rounded-lg" data-popup="qrPopup">
		<p>Get QR Code</p>
		<div class="arrow variant-filled-primary" />
	</div>
{:else}
	<button on:click={handleJoinCalendshare} class="btn variant-ghost-surface w-full">
		Join Calendar
	</button>
{/if}
