<script lang="ts">
	import { enhance } from "$app/forms"
	import { invalidateAll } from "$app/navigation"
	import { Visibility, type VisibilityType } from "$lib/drizzle/schema.js"
	import { getToastStore, type ModalSettings, getModalStore } from "@skeletonlabs/skeleton"
	import type { SubmitFunction } from "@sveltejs/kit"

	export let data
	export let form

	let { session, user, calendshareRecords } = data
	$: ({ session, user, calendshareRecords } = data)

	let loading = false

	let email = session.user.email
	let firstName = user!.firstName
	let lastName = user!.lastName
	let password = ""
	let originalPassword = ""

	const modalStore = getModalStore()
	const toastStore = getToastStore()

	const handleSubmit: SubmitFunction = ({ formData, cancel, submitter }) => {
		formData.set("originalPassword", originalPassword)

		if (password.length && !originalPassword.length) {
			cancel()

			modalStore.trigger({
				type: "component",
				component: "confirmPasswordChange",
				response: (res: { password: string } | undefined) => {
					if (res?.password) {
						modalStore.close()

						originalPassword = res.password
						submitter?.click()
					}
				}
			})
		} else {
			loading = true

			return async ({ result }) => {
				loading = false
				password = ""
				originalPassword = ""

				if (result.status === 200) {
					toastStore.trigger({
						message: "Successfully updated account details.",
						timeout: 2000,
						hideDismiss: true
					})
				}

				await invalidateAll()
			}
		}
	}

	async function handleLeave(calendshareId: string) {
		const leaveRes = await fetch(`/api/calendshare/${calendshareId}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json"
			}
		})

		if (leaveRes.ok) {
			toastStore.trigger({
				message: "Successfully left calendar.",
				timeout: 2000,
				hideDismiss: true
			})
			invalidateAll()
		}
	}

	async function handleSetVisibility(calendshareId: string, visibilityMode: VisibilityType) {
		if (visibilityMode === "personal") {
			const modal: ModalSettings = {
				type: "component",
				component: "confirmPersonalVisibility",
				response: ({ confirmed }) => {
					if (confirmed) {
						setVisibility(calendshareId, visibilityMode)
					} else {
						invalidateAll()
					}
				}
			}

			modalStore.trigger(modal)
		} else {
			setVisibility(calendshareId, visibilityMode)
		}
	}

	async function setVisibility(calendshareId: string, visibilityMode: VisibilityType) {
		const res = await fetch(`/api/calendshare/${calendshareId}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ visibility: visibilityMode })
		})

		if (res.ok) {
			toastStore.trigger({
				message: "Successfully updated calendar visibility.",
				timeout: 2000,
				hideDismiss: true
			})

			invalidateAll()
		}
	}
</script>

<div class="w-full flex items-center justify-center h-full">
	<div class="md:grid p-4 w-full md:grid-cols-3 gap-4 max-w-5xl">
		<form
			class="card w-full p-4 mb-4 lg:mb-0 grid gap-4"
			method="post"
			action="?/update"
			use:enhance={handleSubmit}
		>
			<h2 class="h2-flat">Account Details</h2>
			<div>
				<label for="email">Email</label>
				<input id="email" type="text" class="input" value={email} disabled />
			</div>
			{#if !session.user.email_confirmed_at}
				<div class="card p-2 variant-ghost-warning text-sm">
					Your email is not confirmed. Please check your inbox for a confirmation email. <a
						href="/api/auth/send-confirmation">Resend email</a
					>
				</div>
			{/if}
			<div>
				<label for="firstName">First Name</label>
				<input
					id="firstName"
					name="firstName"
					class="input"
					type="text"
					value={form?.firstName ?? firstName}
					disabled={loading}
				/>
			</div>
			<div>
				<label for="lastName">Last Name</label>
				<input
					id="lastName"
					name="lastName"
					class="input"
					type="text"
					value={form?.lastName ?? lastName}
					disabled={loading}
				/>
			</div>
			<div>
				<label for="password">Password</label>
				<input
					id="password"
					name="password"
					class="input"
					type="password"
					bind:value={password}
					disabled={loading}
				/>
			</div>
			<div class="flex gap-4">
				<input
					type="submit"
					class="btn variant-ghost-primary cursor-pointer"
					value="Update"
					disabled={loading}
				/>
				<a href="/api/auth/sign-out" class="btn variant-ghost-error block">Sign Out</a>
			</div>
		</form>

		<div class="flex flex-col gap-8 card variant-ghost-surface p-4 md:col-span-2 h-fit">
			<div class="flex justify-between md:flex-row flex-col gap-1">
				<h2 class="h2-flat">All Calendshares</h2>
				<a href="/new" class="btn variant-ghost-primary">New Calendshare</a>
			</div>
			{#if calendshareRecords.length}
				<div class="table-container">
					<table class="table">
						<thead>
							<tr>
								<td class="p-4">Name</td>
								<td>Owner</td>
								<td>Visibility</td>
								<td>Options</td>
							</tr>
						</thead>

						<tbody class="max-h-96 overflow-auto">
							{#each calendshareRecords as record}
								<tr>
									<td class="align-middle">
										<a href={`/${record.calendshareId}`} class="anchor">
											{record.calendshare.name}
										</a>
									</td>
									<td class="align-middle overflow-ellipsis overflow-hidden">
										<p>
											{record.calendshare.owner.firstName}
											{record.calendshare.owner.lastName}
										</p>
									</td>
									{#if record.calendshare.ownerId !== session.user.id}
										<td>{record.calendshare.visibility}</td>
									{:else}
										<td>
											<select class="select">
												{#each Visibility.enumValues as visibilityMode}
													<option
														on:click={() =>
															handleSetVisibility(record.calendshareId, visibilityMode)}
														selected={record.calendshare.visibility === visibilityMode}
													>
														{visibilityMode}
													</option>
												{/each}
											</select>
										</td>
									{/if}
									<td>
										<button
											on:click={() => handleLeave(record.calendshareId)}
											class="btn variant-ghost-error"
										>
											Leave
										</button>
									</td>
								</tr>
							{/each}
						</tbody>

						<tfoot class="table-footer-group">
							<tr>
								<td class="font-bold">Total</td>
								<td></td>
								<td></td>
								<td class="text-end">
									<span class="code">{calendshareRecords.length}</span>
								</td>
							</tr>
						</tfoot>
					</table>
				</div>
			{:else}
				<p class="text-center italic">No calendshares found. <a href="/new">Create one!</a></p>
			{/if}
		</div>
	</div>
</div>
