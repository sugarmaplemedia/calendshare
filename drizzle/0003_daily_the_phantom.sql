CREATE TABLE IF NOT EXISTS "calendshare_custom_days" (
	"calendshare_id" uuid NOT NULL,
	"day_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "calendshare_custom_hours" (
	"calendshare_id" uuid NOT NULL,
	"hour_id" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "calendshare_custom_days" ADD CONSTRAINT "calendshare_custom_days_calendshare_id_calendshares_id_fk" FOREIGN KEY ("calendshare_id") REFERENCES "calendshares"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "calendshare_custom_days" ADD CONSTRAINT "calendshare_custom_days_day_id_calendshare_days_id_fk" FOREIGN KEY ("day_id") REFERENCES "calendshare_days"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "calendshare_custom_hours" ADD CONSTRAINT "calendshare_custom_hours_calendshare_id_calendshares_id_fk" FOREIGN KEY ("calendshare_id") REFERENCES "calendshares"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "calendshare_custom_hours" ADD CONSTRAINT "calendshare_custom_hours_hour_id_calendshare_hours_id_fk" FOREIGN KEY ("hour_id") REFERENCES "calendshare_hours"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
