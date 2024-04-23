export const ssr = false

export function load({ data }) {
	let { user } = data

	// If no logged in user, attempt to retrieve guest user data.
	if (!user) {
		user = localStorage.getItem("guest") ? JSON.parse(localStorage.getItem("guest")!) : undefined
	}
	// TODO: Look into Skeleton's localStorage pub/sub API

	return {
		...data,
		user
	}
}
