CREATE TABLE "metrics" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"protocol" varchar(32),
	"chain" varchar(32),
	"version" varchar(16),
	"tvl" varchar(32),
	"twap" varchar(32),
	"volatility" varchar(32),
	"mean_reversion" varchar(32),
	"is_empty" boolean,
	"created_at" timestamp with time zone DEFAULT now()
);
