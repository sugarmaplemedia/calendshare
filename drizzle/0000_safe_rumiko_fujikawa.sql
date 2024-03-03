DO $$ BEGIN
 CREATE TYPE "calendar_type" AS ENUM('week', 'date');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "calendar_visibility" AS ENUM('private', 'public');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "status" AS ENUM('available', 'unavailable');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "days" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "days_options" AS ENUM('all', 'week', 'weekend', 'custom');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "hours_options" AS ENUM('all', 'business', 'custom');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "month_options" AS ENUM('all', 'custom');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "calendar" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"description" text,
	"type" "calendar_type" NOT NULL,
	"visibility" "calendar_visibility" NOT NULL,
	"owner_uid" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "calendar_user_data" (
	"calendar_user_id" integer,
	"date" date,
	"day" "days",
	"hour" integer NOT NULL,
	"status" "status" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "calendar_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"calendar_id" integer,
	"profile_uid" uuid,
	"hex_color" char(6) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "profiles" (
	"uid" uuid PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"full_name" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "week_calendar_data" (
	"calendar_id" integer PRIMARY KEY NOT NULL,
	"days" "days_options" NOT NULL,
	"hours" "hours_options" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "custom_days" (
	"calendar_id" integer PRIMARY KEY NOT NULL,
	"monday" boolean,
	"tuesday" boolean,
	"wednesday" boolean,
	"thursday" boolean,
	"friday" boolean,
	"saturday" boolean,
	"sunday" boolean
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "custom_hours" (
	"calendar_id" integer PRIMARY KEY NOT NULL,
	"start" integer NOT NULL,
	"end" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "custom_month" (
	"calendar_id" integer PRIMARY KEY NOT NULL,
	"start" integer NOT NULL,
	"end" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "calendar" ADD CONSTRAINT "calendar_owner_uid_profiles_uid_fk" FOREIGN KEY ("owner_uid") REFERENCES "profiles"("uid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "calendar_user_data" ADD CONSTRAINT "calendar_user_data_calendar_user_id_calendar_users_id_fk" FOREIGN KEY ("calendar_user_id") REFERENCES "calendar_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "calendar_users" ADD CONSTRAINT "calendar_users_calendar_id_calendar_id_fk" FOREIGN KEY ("calendar_id") REFERENCES "calendar"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "calendar_users" ADD CONSTRAINT "calendar_users_profile_uid_profiles_uid_fk" FOREIGN KEY ("profile_uid") REFERENCES "profiles"("uid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "week_calendar_data" ADD CONSTRAINT "week_calendar_data_calendar_id_calendar_id_fk" FOREIGN KEY ("calendar_id") REFERENCES "calendar"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "custom_days" ADD CONSTRAINT "custom_days_calendar_id_calendar_id_fk" FOREIGN KEY ("calendar_id") REFERENCES "calendar"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "custom_hours" ADD CONSTRAINT "custom_hours_calendar_id_calendar_id_fk" FOREIGN KEY ("calendar_id") REFERENCES "calendar"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "custom_month" ADD CONSTRAINT "custom_month_calendar_id_calendar_id_fk" FOREIGN KEY ("calendar_id") REFERENCES "calendar"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
