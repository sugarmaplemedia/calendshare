<script lang="ts">
	import { page } from "$app/stores"
	import { ThemeSupa } from "@supabase/auth-ui-shared"
	import { Auth } from "@supabase/auth-ui-svelte"

	export let data

	let { session, supabase } = data
	$: ({ session, supabase } = data)

	const url = $page.url.origin
</script>

<div class="w-full flex justify-center gap-4 items-center h-full">
	<div class="card h-fit p-4 w-full xl:w-96 flex flex-col gap-4">
		<h2 class="h2">Log in</h2>
		<Auth
			supabaseClient={supabase}
			view="sign_in"
			redirectTo="/api/auth/callback"
			appearance={{
				extend: false,
				className: {
					input: "input",
					label: "label",
					button: "btn variant-ghost-surface w-full",
					container: "flex flex-col gap-4",
					anchor: "anchor text-sm"
				}
			}}
		/>
	</div>
	<div class="card h-fit p-4 w-full xl:w-96 flex flex-col gap-4">
		<h2 class="h2">Sign Up</h2>
		<Auth
			supabaseClient={supabase}
			view="sign_up"
			redirectTo={`${url}/api/auth/callback`}
			showLinks={false}
			appearance={{
				extend: false,
				className: {
					input: "input",
					label: "label",
					button: "btn variant-ghost-surface",
					container: "flex flex-col gap-4"
				}
			}}
		/>
	</div>
</div>

<style>
</style>
