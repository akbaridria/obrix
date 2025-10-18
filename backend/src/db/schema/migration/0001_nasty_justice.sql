CREATE TABLE "pump_dump" (
	"id" serial PRIMARY KEY NOT NULL,
	"pump_dump_probability" real,
	"suspicious_addresses" jsonb,
	"transaction_hashes" jsonb,
	"key_drivers" jsonb,
	"confidence" varchar(8),
	"pool_id" varchar(64),
	"token0_symbol" varchar(32),
	"token1_symbol" varchar(32),
	"protocol" varchar(32),
	"version" varchar(16),
	"network" varchar(32),
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "wash_trade" (
	"id" serial PRIMARY KEY NOT NULL,
	"wash_trading_probability" real,
	"suspicious_addresses" jsonb,
	"transaction_hashes" jsonb,
	"key_drivers" jsonb,
	"confidence" varchar(8),
	"pool_id" varchar(64),
	"token0_symbol" varchar(32),
	"token1_symbol" varchar(32),
	"protocol" varchar(32),
	"version" varchar(16),
	"network" varchar(32),
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "metrics" ADD COLUMN "pool_id" varchar(64);--> statement-breakpoint
ALTER TABLE "metrics" ADD COLUMN "token0_symbol" varchar(32);--> statement-breakpoint
ALTER TABLE "metrics" ADD COLUMN "token1_symbol" varchar(32);