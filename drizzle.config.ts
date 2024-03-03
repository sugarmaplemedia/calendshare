import type { Config } from "drizzle-kit"

export default {
	schema: "./src/lib/db/schema.ts",
	out: "./drizzle",
	driver: "pg",
	dbCredentials: {
		connectionString: process.env.DB_URL!
	},
	verbose: true,
	strict: true
} satisfies Config
