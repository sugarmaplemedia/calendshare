// Drizzle DB Seeder
// Currently used for adding in weekdays (Mon - Sun)

import { eq } from "drizzle-orm"
import { createDrizzleClient } from "."
import { days } from "./schema"

async function seedWeekdays() {
	const drizzle = await createDrizzleClient()

	const monday = await drizzle.query.days.findFirst({ where: eq(days.name, "Monday") })

	if (!monday) {
		await drizzle
			.insert(days)
			.values([
				{ name: "Monday" },
				{ name: "Tuesday" },
				{ name: "Wednesday" },
				{ name: "Thursday" },
				{ name: "Friday" },
				{ name: "Saturday" },
				{ name: "Sunday" }
			])

		console.log("🌱 Database successfully seeded with weekdays!")
	} else {
		console.log("🪴 Database already seeded!")
	}
}

seedWeekdays()
