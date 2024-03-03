import { boolean, integer, pgEnum, pgTable } from "drizzle-orm/pg-core"
import { calendar } from "../schema"

export const daysEnum = pgEnum("days", [
	"monday",
	"tuesday",
	"wednesday",
	"thursday",
	"friday",
	"saturday",
	"sunday"
])

export const daysOptions = pgEnum("days_options", ["all", "week", "weekend", "custom"])

export const customDays = pgTable("custom_days", {
	calendarId: integer("calendar_id")
		.references(() => calendar.id)
		.primaryKey(),
	monday: boolean("monday"),
	tuesday: boolean("tuesday"),
	wednesday: boolean("wednesday"),
	thursday: boolean("thursday"),
	friday: boolean("friday"),
	saturday: boolean("saturday"),
	sunday: boolean("sunday")
})

export const hoursOptions = pgEnum("hours_options", ["all", "business", "custom"])

export const customHours = pgTable("custom_hours", {
	calendarId: integer("calendar_id")
		.references(() => calendar.id)
		.primaryKey(),
	start: integer("start").notNull(),
	end: integer("end").notNull()
})

export const monthOptions = pgEnum("month_options", ["all", "custom"])

export const customMonths = pgTable("custom_month", {
	calendarId: integer("calendar_id")
		.references(() => calendar.id)
		.primaryKey(),
	start: integer("start").notNull(),
	end: integer("end").notNull()
})
