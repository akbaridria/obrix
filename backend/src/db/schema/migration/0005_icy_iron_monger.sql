ALTER TABLE "metrics" ALTER COLUMN "pool_id" SET DATA TYPE varchar(128);--> statement-breakpoint
ALTER TABLE "pump_dump" ALTER COLUMN "pool_id" SET DATA TYPE varchar(128);--> statement-breakpoint
ALTER TABLE "wash_trade" ALTER COLUMN "pool_id" SET DATA TYPE varchar(128);