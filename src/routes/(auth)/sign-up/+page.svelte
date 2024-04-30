<script lang="ts">
	import { browser } from "$app/environment"
	import { enhance } from "$app/forms"
	import type { User } from "$lib/drizzle/schema.js"
	import { SlideToggle } from "@skeletonlabs/skeleton"

	let guestData: User | undefined
	if (browser) {
		guestData = sessionStorage.getItem("guest")
			? JSON.parse(sessionStorage.getItem("guest")!)
			: undefined
	}

	let guestImport = !!guestData

	export let form
</script>

<div class="w-full flex justify-center items-center flex-col gap-8 h-full">
	{#if form?.success && form?.sentTo}
		<aside class="alert variant-ghost-warning">
			<p class="alert-message">
				A confirmation email has been sent to <span class="font-bold">{form.sentTo}</span>. Please
				check your inbox to log in to your account.
			</p>
		</aside>
	{/if}

	<form use:enhance method="post" class="card h-fit p-4 w-full max-w-sm flex flex-col gap-4">
		<h2 class="h2">Sign Up</h2>

		{#if guestData}
			<div class="card p-4 variant-ghost-primary">
				<SlideToggle name="guestImport" bind:checked={guestImport}>
					Import records from guest account?
				</SlideToggle>
				<input type="hidden" name="guestId" value={guestData.id} />
				{#if form?.guestId}
					<div class="card p-1 variant-ghost-error text-sm">
						<p class="error">{form.guestId.message}</p>
					</div>
				{/if}
			</div>
		{/if}

		{#if !guestImport}
			<div class="grid grid-cols-2 gap-4">
				<label for="firstName">
					<span>First Name <span class="text-yellow-500">*</span></span>
					<input
						id="firstName"
						name="firstName"
						class="input mb-2"
						required
						value={form?.firstName?.value ?? ""}
					/>
					{#if form?.firstName}
						<div class="card p-1 variant-ghost-error text-sm">
							<p class="error">{form.firstName.message}</p>
						</div>
					{/if}
				</label>

				<label for="lastName">
					<span>Last Name</span>
					<input
						id="lastName"
						name="lastName"
						class="input mb-2"
						value={form?.lastName?.value ?? ""}
					/>
					{#if form?.lastName}
						<div class="card p-1 variant-ghost-error text-sm">
							<p class="error">{form.lastName.message}</p>
						</div>
					{/if}
				</label>
			</div>
		{:else}
			<input type="hidden" name="firstNameGuest" value={guestData?.firstName} />
			<input type="hidden" name="lastNameGuest" value={guestData?.lastName} />
		{/if}

		<label for="email">
			<span>Email <span class="text-yellow-500">*</span></span>
			<input id="email" name="email" class="input mb-2" required value={form?.email?.value ?? ""} />
			{#if form?.email}
				<div class="card p-1 variant-ghost-error text-sm">
					<p class="error">{form.email.message}</p>
				</div>
			{/if}
		</label>

		<label for="password" class="">
			<span>Password <span class="text-yellow-500">*</span></span>
			<input id="password" name="password" type="password" class="input mb-2" required />
			{#if form?.password}
				<div class="card p-1 variant-ghost-error text-sm">
					<p class="error">{form.password.message}</p>
				</div>
			{/if}
		</label>

		<label for="passwordConfirm" class="pb-8">
			<span>Confirm Password <span class="text-yellow-500">*</span></span>
			<input
				id="password-confirm"
				name="passwordConfirm"
				type="password"
				class="input mb-2"
				required
			/>
			{#if form?.passwordConfirm}
				<div class="card p-1 variant-ghost-error text-sm">
					<p class="error">{form.passwordConfirm.message}</p>
				</div>
			{/if}
		</label>

		<button type="submit" class="btn variant-ghost-primary">Sign Up</button>
	</form>
</div>
