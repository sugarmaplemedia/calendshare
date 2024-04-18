DO $$ BEGIN
 CREATE TYPE "calendshare_days_template" AS ENUM('business_days', 'all_week', 'weekend_only', 'custom');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "calendshare_hours_template" AS ENUM('business_hours', 'all_hours', 'custom');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "calendshare_record_entry_status" AS ENUM('unavailable', 'available', 'preferred');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "calendshare_visibility" AS ENUM('personal', 'private', 'public');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "calendshares" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text DEFAULT 'A New Calendshare' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"visibility" "calendshare_visibility" DEFAULT 'public' NOT NULL,
	"days_template" "calendshare_days_template" DEFAULT 'all_week' NOT NULL,
	"hours_template" "calendshare_hours_template" DEFAULT 'business_hours' NOT NULL,
	"owner_user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "calendshare_days" (
	"id" serial PRIMARY KEY NOT NULL,
	"calendshare_id" uuid NOT NULL,
	"day" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "calendshare_hours" (
	"id" serial PRIMARY KEY NOT NULL,
	"calendshare_id" uuid NOT NULL,
	"hour" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "calendshare_record_entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"record_id" integer NOT NULL,
	"day_id" integer NOT NULL,
	"hour_id" integer NOT NULL,
	"status" "calendshare_record_entry_status" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "calendshare_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"calendshare_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"color" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" text DEFAULT '',
	"last_name" text DEFAULT '',
	"guest" boolean DEFAULT false NOT NULL,
	"guest_password" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "calendshares" ADD CONSTRAINT "calendshares_owner_user_id_users_id_fk" FOREIGN KEY ("owner_user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "calendshare_days" ADD CONSTRAINT "calendshare_days_calendshare_id_calendshares_id_fk" FOREIGN KEY ("calendshare_id") REFERENCES "calendshares"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "calendshare_hours" ADD CONSTRAINT "calendshare_hours_calendshare_id_calendshares_id_fk" FOREIGN KEY ("calendshare_id") REFERENCES "calendshares"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "calendshare_record_entries" ADD CONSTRAINT "calendshare_record_entries_record_id_calendshare_records_id_fk" FOREIGN KEY ("record_id") REFERENCES "calendshare_records"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "calendshare_record_entries" ADD CONSTRAINT "calendshare_record_entries_day_id_calendshare_days_id_fk" FOREIGN KEY ("day_id") REFERENCES "calendshare_days"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "calendshare_record_entries" ADD CONSTRAINT "calendshare_record_entries_hour_id_calendshare_hours_id_fk" FOREIGN KEY ("hour_id") REFERENCES "calendshare_hours"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "calendshare_records" ADD CONSTRAINT "calendshare_records_calendshare_id_calendshares_id_fk" FOREIGN KEY ("calendshare_id") REFERENCES "calendshares"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
