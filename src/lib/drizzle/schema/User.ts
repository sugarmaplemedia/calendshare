import { relations } from "drizzle-orm"
import { boolean, pgTable, text, uuid } from "drizzle-orm/pg-core"
import { calendshares } from "./Calendshare"

export const users = pgTable("users", {
	id: uuid("id").defaultRandom().primaryKey(),
	firstName: text("firstName").default(""),
	lastName: text("lastName").default(""),
	guest: boolean("guest").notNull().default(false)
})
export type User = typeof users.$inferSelect
export type UserInsertValues = typeof users.$inferInsert

export const userRelations = relations(users, ({ many }) => ({
	calendshares: many(calendshares)
}))
