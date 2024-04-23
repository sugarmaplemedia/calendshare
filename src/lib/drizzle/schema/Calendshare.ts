import { integer, pgEnum, pgTable, primaryKey, serial, text, uuid } from "drizzle-orm/pg-core"
import { users, type User } from "./User"
import { relations } from "drizzle-orm"

export const Visibility = pgEnum("calendshare_visibility", ["personal", "private", "public"])
export const DaysTemplate = pgEnum("calendshare_days_template", [
	"business_days",
	"all_week",
	"weekend_only",
	"custom"
])
export const HoursTemplate = pgEnum("calendshare_hours_template", [
	"business_hours",
	"all_hours",
	"custom"
])

export const calendshares = pgTable("calendshares", {
	id: uuid("id").defaultRandom().primaryKey(),
	ownerId: uuid("owner_user_id")
		.references(() => users.id)
		.notNull(),
	name: text("name").default("A New Calendshare").notNull(),
	description: text("description").default("").notNull(),
	visibility: Visibility("visibility").default("public").notNull(),
	daysTemplate: DaysTemplate("days_template").default("all_week").notNull(),
	hoursTemplate: HoursTemplate("hours_template").default("business_hours").notNull(),
	startHour: integer("start_hour"),
	endHour: integer("end_hour"),
	timeIncrement: integer("time_increment").default(60).notNull()
})

export const calendsharesCustomDays = pgTable(
	"calendshare_custom_days",
	{
		calendshareId: uuid("calendshare_id")
			.references(() => calendshares.id)
			.notNull(),
		dayId: integer("day_id")
			.references(() => days.id)
			.notNull()
	},
	(table) => ({ pk: primaryKey({ columns: [table.calendshareId, table.dayId] }) })
)

export const calendsharesCustomDaysRelations = relations(calendsharesCustomDays, ({ one }) => ({
	calendshare: one(calendshares, {
		fields: [calendsharesCustomDays.calendshareId],
		references: [calendshares.id]
	}),
	day: one(days, { fields: [calendsharesCustomDays.dayId], references: [days.id] })
}))
export type CalendshareCustomDaysWithRelations = typeof calendsharesCustomDays.$inferSelect & {
	day: Day
}

export const calendsharesRelations = relations(calendshares, ({ one, many }) => ({
	owner: one(users, { fields: [calendshares.ownerId], references: [users.id] }),
	days: many(calendsharesCustomDays),
	records: many(records)
}))

export type Calendshare = typeof calendshares.$inferSelect
export type CalendshareInsertValues = typeof calendshares.$inferInsert
export type CalendshareWithRelations = Calendshare & {
	days: Array<CalendshareCustomDaysWithRelations>
	records: Array<RecordsWithRelations>
}
// TODO: Define this dynamically rather than here, it'll be easier that way

export const days = pgTable("days", {
	id: serial("id").primaryKey(),
	name: text("name").unique().notNull()
})

export const daysRelations = relations(days, ({ many }) => ({
	calendshares: many(calendsharesCustomDays)
}))
export type Day = typeof days.$inferSelect

export const records = pgTable("calendshare_records", {
	id: serial("id").primaryKey(),
	calendshareId: uuid("calendshare_id")
		.references(() => calendshares.id)
		.notNull(),
	userId: uuid("user_id").notNull(),
	color: text("color").notNull()
})

export const recordsRelations = relations(records, ({ one, many }) => ({
	calendshare: one(calendshares, {
		fields: [records.calendshareId],
		references: [calendshares.id]
	}),
	user: one(users, {
		fields: [records.userId],
		references: [users.id]
	}),
	entries: many(recordEntries)
}))

export type Record = typeof records.$inferSelect
export type RecordInsertValues = typeof records.$inferInsert
export type RecordUpdateValues = {
	color?: string
}
export type RecordsWithRelations = Record & {
	user: User
	entries: Array<RecordEntryWithRelations>
}

export const RecordEntryStatus = pgEnum("calendshare_record_entry_status", [
	"unavailable",
	"available",
	"preferred"
])
export type RecordEntryStatusType = typeof recordEntries.$inferSelect.status

export const recordEntries = pgTable("calendshare_record_entries", {
	id: serial("id").primaryKey(),
	recordId: integer("record_id")
		.references(() => records.id, { onDelete: "cascade" })
		.notNull(),
	dayId: integer("day_id")
		.references(() => days.id)
		.notNull(),
	hour: integer("hour").notNull(), // Number between 0 and 23
	minute: integer("minute").default(0).notNull(), // Number between 1 and 60
	status: RecordEntryStatus("status").notNull()
})

export const recordEntryRelations = relations(recordEntries, ({ one }) => ({
	record: one(records, {
		fields: [recordEntries.recordId],
		references: [records.id]
	}),
	day: one(days, {
		fields: [recordEntries.dayId],
		references: [days.id]
	})
}))

export type RecordEntry = typeof recordEntries.$inferSelect
export type RecordEntryWithRelations = RecordEntry & {
	day: Day
}
