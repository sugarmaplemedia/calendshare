<main class="w-full p-4 flex items-center flex-col gap-8">
	<h1 class="h1">Register</h1>
	<form method="POST" class="card p-4 gap-4 flex flex-col max-w-md">
		<div class="grid grid-cols-2 gap-2 mt-2">
			<label for="register-fname" class="label">
				<span>First Name</span>
				<input id="register-fname" type="text" name="fname" class="input" required />
			</label>
			<label for="register-lname" class="label">
				<span>Last Name</span>
				<input id="register-lname" type="text" name="lname" class="input" required />
			</label>
		</div>
		<label for="register-email" class="label">
			<span>Email</span>
			<input id="register-email" type="email" name="email" class="input" required />
		</label>
		<label for="register-password" class="label">
			<span>Password</span>
			<input id="register-password" type="password" name="password" class="input" required />
		</label>
		<div class="grid gap-2 mt-2">
			<button class="btn variant-ghost">Register</button>
			<p class="italic text-xs text-primary-50">
				<a href="/login">Return to login</a>
			</p>
		</div>
	</form>
</main>
