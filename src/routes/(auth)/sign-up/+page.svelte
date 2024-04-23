<script lang="ts">
	import { enhance } from "$app/forms"

	export let data
	export let form
</script>

<div class="w-full flex justify-center items-center h-full">
	<form use:enhance method="post" class="card h-fit p-4 w-full xl:w-96 flex flex-col gap-4">
		<h2 class="h2">Sign Up</h2>

		<div class="grid grid-cols-2 gap-4">
			<label for="firstName">
				<span>First Name</span>
				<input id="firstName" name="firstName" class="input" />
			</label>

			<label for="lastName">
				<span>Last Name</span>
				<input id="lastName" name="lastName" class="input" />
			</label>
		</div>

		<label for="email">
			<span>Email</span>
			<input id="email" name="email" class="input" />
		</label>

		<label for="password">
			<span>Password</span>
			<input id="password" name="password" type="password" class="input" />
		</label>

		<button type="submit" class="btn variant-ghost-primary">Sign Up</button>
	</form>
</div>
