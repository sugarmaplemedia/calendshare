ALTER TABLE "calendshare_days" RENAME TO "days";--> statement-breakpoint
ALTER TABLE "calendshare_custom_days" DROP CONSTRAINT "calendshare_custom_days_day_id_calendshare_days_id_fk";
--> statement-breakpoint
ALTER TABLE "calendshare_record_entries" DROP CONSTRAINT "calendshare_record_entries_day_id_calendshare_days_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "calendshare_custom_days" ADD CONSTRAINT "calendshare_custom_days_day_id_days_id_fk" FOREIGN KEY ("day_id") REFERENCES "days"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "calendshare_record_entries" ADD CONSTRAINT "calendshare_record_entries_day_id_days_id_fk" FOREIGN KEY ("day_id") REFERENCES "days"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
