import { char, date, integer, pgEnum, pgTable, serial, text, uuid } from "drizzle-orm/pg-core"
import { daysEnum, daysOptions, hoursOptions } from "./schema/timeOptions"

export const profile = pgTable("profiles", {
	uid: uuid("uid").primaryKey(),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	fullName: text("full_name")
})

// Calendar Type
// Week: Calendar is for a week
// Date: Calendar is for a specific date
export const calendarTypeEnum = pgEnum("calendar_type", ["week", "date"])

// Calendar visibility
// Private: belongs to a user to be used on other calendars
// Public: belongs to a group and can be used by any member of the group
export const calendarVisibilityEnum = pgEnum("calendar_visibility", ["private", "public"])

// Parent calendar object
// Contains the name, description, type, and visibility of the calendar
// Can be used to create a week or date calendar
export const calendar = pgTable("calendar", {
	id: serial("id").primaryKey(),
	name: text("name"),
	description: text("description"),
	type: calendarTypeEnum("type").notNull(),
	visibility: calendarVisibilityEnum("visibility").notNull(),
	owner_uid: uuid("owner_uid").references(() => profile.uid)
})

// Week Calendar
// Contains the days and hours for a week calendar
// Tied to a calendar data object
export const weekCalendarData = pgTable("week_calendar_data", {
	calendarId: integer("calendar_id")
		.references(() => calendar.id, {
			onDelete: "cascade"
		})
		.primaryKey(),
	days: daysOptions("days").notNull(),
	hours: hoursOptions("hours").notNull()
})

// Users of a calendar
// Contains the color and data for a user of a calendar
export const calendarUsers = pgTable("calendar_users", {
	id: serial("id").primaryKey(),
	calendarId: integer("calendar_id").references(() => calendar.id, {
		onDelete: "cascade"
	}),
	profileUid: uuid("profile_uid").references(() => profile.uid),
	hexColor: char("hex_color", { length: 6 }).notNull()
})

export const statusEnum = pgEnum("status", ["available", "unavailable"])

export const calendarUserData = pgTable("calendar_user_data", {
	calendarUserId: integer("calendar_user_id").references(() => calendarUsers.id, {
		onDelete: "cascade"
	}),
	date: date("date"),
	day: daysEnum("day"),
	hour: integer("hour").notNull(),
	status: statusEnum("status").notNull()
})

export * from "./schema/timeOptions"
