DROP TABLE "calendshare_custom_hours";--> statement-breakpoint
ALTER TABLE "calendshares" ADD COLUMN "min_hour" integer;--> statement-breakpoint
ALTER TABLE "calendshares" ADD COLUMN "max_hour" integer;--> statement-breakpoint
ALTER TABLE "calendshares" ADD COLUMN "time_increment" integer DEFAULT 60 NOT NULL;