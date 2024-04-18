ALTER TABLE "calendshare_days" DROP CONSTRAINT "calendshare_days_calendshare_id_calendshares_id_fk";
--> statement-breakpoint
ALTER TABLE "calendshare_hours" DROP CONSTRAINT "calendshare_hours_calendshare_id_calendshares_id_fk";
--> statement-breakpoint
ALTER TABLE "calendshare_days" DROP COLUMN IF EXISTS "calendshare_id";--> statement-breakpoint
ALTER TABLE "calendshare_hours" DROP COLUMN IF EXISTS "calendshare_id";