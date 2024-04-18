import { relations } from "drizzle-orm"
import { boolean, pgTable, text, uuid } from "drizzle-orm/pg-core"
import { calendshares } from "./Calendshare"

export const users = pgTable("users", {
	id: uuid("id").defaultRandom().primaryKey(),
	firstName: text("first_name").default(""),
	lastName: text("last_name").default(""),
	guest: boolean("guest").notNull().default(false),
	guestPassword: text("guest_password")
})
export type User = typeof users.$inferSelect
export type UserInsertValues = typeof users.$inferInsert

export const userRelations = relations(users, ({ many }) => ({
	calendshares: many(calendshares)
}))
