ALTER TABLE "users" RENAME COLUMN "first_name" TO "firstName";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "last_name" TO "lastName";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "guest_password";