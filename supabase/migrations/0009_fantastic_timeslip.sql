ALTER TABLE "calendshares" ALTER COLUMN "startHour" SET DEFAULT 6;--> statement-breakpoint
ALTER TABLE "calendshares" ALTER COLUMN "endHour" SET DEFAULT 12;--> statement-breakpoint
ALTER TABLE "calendshare_custom_days" ADD COLUMN "id" serial NOT NULL;