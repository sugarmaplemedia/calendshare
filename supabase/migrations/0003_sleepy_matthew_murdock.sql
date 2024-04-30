ALTER TABLE "calendshare_record_entries" DROP CONSTRAINT "calendshare_record_entries_record_id_calendshare_records_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "calendshare_record_entries" ADD CONSTRAINT "calendshare_record_entries_record_id_calendshare_records_id_fk" FOREIGN KEY ("record_id") REFERENCES "calendshare_records"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
