ALTER TABLE "calendshares" RENAME COLUMN "owner_user_id" TO "ownerId";--> statement-breakpoint
ALTER TABLE "calendshares" RENAME COLUMN "days_template" TO "daysTemplate";--> statement-breakpoint
ALTER TABLE "calendshares" RENAME COLUMN "hours_template" TO "hoursTemplate";--> statement-breakpoint
ALTER TABLE "calendshares" RENAME COLUMN "start_hour" TO "startHour";--> statement-breakpoint
ALTER TABLE "calendshares" RENAME COLUMN "end_hour" TO "endHour";--> statement-breakpoint
ALTER TABLE "calendshares" RENAME COLUMN "time_increment" TO "timeIncrement";--> statement-breakpoint
ALTER TABLE "calendshare_custom_days" RENAME COLUMN "day_id" TO "dayId";--> statement-breakpoint
ALTER TABLE "calendshare_record_entries" RENAME COLUMN "record_id" TO "recordId";--> statement-breakpoint
ALTER TABLE "calendshare_record_entries" RENAME COLUMN "day_id" TO "dayId";--> statement-breakpoint
ALTER TABLE "calendshare_records" RENAME COLUMN "calendshare_id" TO "calendshareId";--> statement-breakpoint
ALTER TABLE "calendshare_records" RENAME COLUMN "user_id" TO "userId";--> statement-breakpoint
ALTER TABLE "calendshares" DROP CONSTRAINT "calendshares_owner_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "calendshare_custom_days" DROP CONSTRAINT "calendshare_custom_days_day_id_days_id_fk";
--> statement-breakpoint
ALTER TABLE "calendshare_record_entries" DROP CONSTRAINT "calendshare_record_entries_record_id_calendshare_records_id_fk";
--> statement-breakpoint
ALTER TABLE "calendshare_record_entries" DROP CONSTRAINT "calendshare_record_entries_day_id_days_id_fk";
--> statement-breakpoint
ALTER TABLE "calendshare_records" DROP CONSTRAINT "calendshare_records_calendshare_id_calendshares_id_fk";
--> statement-breakpoint
ALTER TABLE "calendshare_records" DROP CONSTRAINT "calendshare_records_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "calendshare_custom_days" DROP CONSTRAINT "calendshare_custom_days_calendshare_id_day_id_pk";--> statement-breakpoint
ALTER TABLE "calendshare_custom_days" ADD CONSTRAINT "calendshare_custom_days_calendshare_id_dayId_pk" PRIMARY KEY("calendshare_id","dayId");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "calendshares" ADD CONSTRAINT "calendshares_ownerId_users_id_fk" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "calendshare_custom_days" ADD CONSTRAINT "calendshare_custom_days_dayId_days_id_fk" FOREIGN KEY ("dayId") REFERENCES "days"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "calendshare_record_entries" ADD CONSTRAINT "calendshare_record_entries_recordId_calendshare_records_id_fk" FOREIGN KEY ("recordId") REFERENCES "calendshare_records"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "calendshare_record_entries" ADD CONSTRAINT "calendshare_record_entries_dayId_days_id_fk" FOREIGN KEY ("dayId") REFERENCES "days"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "calendshare_records" ADD CONSTRAINT "calendshare_records_calendshareId_calendshares_id_fk" FOREIGN KEY ("calendshareId") REFERENCES "calendshares"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "calendshare_records" ADD CONSTRAINT "calendshare_records_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
