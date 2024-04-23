<script lang="ts">
	import type { Palette } from "$lib/calendshare/color"
	import { getModalStore } from "@skeletonlabs/skeleton"

	const modalStore = getModalStore()

	let hexColor = "#D50000"
	let palette: Palette = []
	let isOpen = false

	$: if ($modalStore[0]) {
		if (!isOpen) {
			hexColor = $modalStore[0].meta.color
			palette = $modalStore[0].meta.colors
			setTimeout(() => palette.find((c) => c.hex === hexColor)?.input?.focus(), 0)

			isOpen = true
		}
	}

	async function handleSubmit() {
		if ($modalStore[0]) {
			$modalStore[0].response!({ hexColor })
		}

		isOpen = false
		modalStore.close()
	}

	function handleCancel() {
		isOpen = false
		modalStore.close()
	}
</script>

<form class="card max-w-lg p-12 gap-4 flex flex-col" on:submit|preventDefault={handleSubmit}>
	<h2 class="font-bold text-3xl">Color Selector</h2>

	<div class="grid grid-cols-4 gap-4 w-full bg-surface-200 p-6 rounded-md">
		{#each palette as paletteColor (paletteColor.name)}
			{@const disabled =
				$modalStore[0] && $modalStore[0].meta.unavailableColors.includes(paletteColor.hex)}
			<label
				for="user-color-palette-{paletteColor.name}"
				class="
                    w-12 h-12 {paletteColor.classes} focus-within:outline-4 rounded-sm outline-none transition-all
                    {hexColor === paletteColor.hex ? 'brightness-110 scale-110 shadow-lg' : ''}
                    {disabled ? '!bg-primary-900 scale-75 cursor-not-allowed' : 'cursor-pointer'}
                "
				title={paletteColor.name}
			>
				<input
					aria-label={paletteColor.name}
					type="radio"
					id="user-color-palette-{paletteColor.name}"
					class="opacity-0 {disabled ? 'cursor-not-allowed' : 'cursor-pointer'}"
					value={paletteColor.hex}
					checked={hexColor === paletteColor.hex}
					on:input={() => (hexColor = paletteColor.hex)}
					{disabled}
					bind:this={paletteColor.input}
				/>
			</label>
		{/each}
	</div>

	<div class="grid grid-cols-2 gap-2 mt-2">
		<button type="button" on:click={handleCancel} class="btn variant-ghost-primary">Cancel</button>
		<button type="submit" class="btn variant-ghost-success"> Confirm </button>
	</div>
</form>
