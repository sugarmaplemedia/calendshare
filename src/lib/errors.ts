import { browser } from "$app/environment"

export function checkEnvironmentIsServer() {
	if (browser) throw new Error("This function is only available on the server.")
}

export function checkEnvironmentIsBrowser(options: { fail?: boolean } = { fail: true }) {
	if (!browser && options.fail) throw new Error("This function is only available on the browser.")

	return
}
