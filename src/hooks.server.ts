export async function handle({ event, resolve }) {
	event.locals.user = {
		id: 1,
		name: "Harrison",
		email: "harrison@example.com"
	}

	return resolve(event)
}
