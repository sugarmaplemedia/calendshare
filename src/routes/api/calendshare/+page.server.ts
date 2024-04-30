export function load({ locals: { session } }) {
	if (!session) {
		return {
			status: 401,
			body: {
				error: "You must be logged in to access this API."
			}
		}
	}
}
