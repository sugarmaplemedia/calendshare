ALTER TABLE "calendshares" RENAME COLUMN "passphrase_hash" TO "passphraseHash";--> statement-breakpoint
ALTER TABLE "calendshare_custom_days" RENAME COLUMN "calendshare_id" TO "calendshareId";--> statement-breakpoint
ALTER TABLE "calendshare_custom_days" DROP CONSTRAINT "calendshare_custom_days_calendshare_id_calendshares_id_fk";
--> statement-breakpoint
ALTER TABLE "calendshare_custom_days" DROP CONSTRAINT "calendshare_custom_days_calendshare_id_dayId_pk";--> statement-breakpoint
ALTER TABLE "calendshare_custom_days" ADD CONSTRAINT "calendshare_custom_days_calendshareId_dayId_pk" PRIMARY KEY("calendshareId","dayId");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "calendshare_custom_days" ADD CONSTRAINT "calendshare_custom_days_calendshareId_calendshares_id_fk" FOREIGN KEY ("calendshareId") REFERENCES "calendshares"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
