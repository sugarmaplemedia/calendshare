DROP TABLE "calendshare_hours";--> statement-breakpoint
ALTER TABLE "calendshare_custom_hours" DROP CONSTRAINT "calendshare_custom_hours_hour_id_calendshare_hours_id_fk";
--> statement-breakpoint
ALTER TABLE "calendshare_record_entries" DROP CONSTRAINT "calendshare_record_entries_hour_id_calendshare_hours_id_fk";
--> statement-breakpoint
ALTER TABLE "calendshare_custom_hours" ADD COLUMN "id" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "calendshare_custom_hours" ADD COLUMN "hour" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "calendshare_custom_hours" ADD COLUMN "minute" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "calendshare_record_entries" ADD COLUMN "hour" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "calendshare_record_entries" ADD COLUMN "minute" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "calendshare_custom_hours" DROP COLUMN IF EXISTS "hour_id";--> statement-breakpoint
ALTER TABLE "calendshare_record_entries" DROP COLUMN IF EXISTS "hour_id";