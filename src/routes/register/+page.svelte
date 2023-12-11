<script lang="ts">
	import { CalendshareUser } from "$lib/calendshare/db/collections/CalendshareUsers"
	import { firestore } from "$lib/firebase/client"
	import { validateAndCreateUser } from "$lib/stores/auth"
	import { fail, redirect } from "@sveltejs/kit"
	import { doc, getDoc } from "firebase/firestore/lite"

	let email = ""
	let password = ""
	let firstName = ""
	let lastName = ""

	async function handleRegister() {
		const user = await validateAndCreateUser(email, password)

		// Save user details to DB
		const newUser = new CalendshareUser(user!.uid, firstName, lastName)
		await newUser.save()

		// Validate user saved to DB
		const userFromDBSnapshot = await getDoc(doc(firestore, "users", newUser.uid))
		if (!userFromDBSnapshot.exists()) fail(500, { error: "User not saved to DB" })

		console.log("User saved to DB and persisted to session!")
	}
</script>

<main class="w-full p-4 flex items-center flex-col gap-8">
	<h1 class="h1">Register</h1>
	<form method="POST" class="card p-4 gap-4 flex flex-col max-w-md">
		<div class="grid grid-cols-2 gap-2 mt-2">
			<label for="register-fname" class="label">
				<span>First Name</span>
				<input
					id="register-fname"
					type="text"
					name="fname"
					class="input"
					bind:value={firstName}
					required
				/>
			</label>
			<label for="register-lname" class="label">
				<span>Last Name</span>
				<input
					id="register-lname"
					type="text"
					name="lname"
					class="input"
					required
					bind:value={lastName}
				/>
			</label>
		</div>
		<label for="register-email" class="label">
			<span>Email</span>
			<input
				id="register-email"
				type="email"
				name="email"
				class="input"
				required
				bind:value={email}
			/>
		</label>
		<label for="register-password" class="label">
			<span>Password</span>
			<input
				id="register-password"
				type="password"
				name="password"
				class="input"
				required
				bind:value={password}
			/>
		</label>
		<div class="grid gap-2 mt-2">
			<button type="button" on:click={handleRegister} class="btn variant-ghost">Register</button>
			<p class="italic text-xs text-primary-50">
				<a href="/login">Return to login</a>
			</p>
		</div>
	</form>
</main>
