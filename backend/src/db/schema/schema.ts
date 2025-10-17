import { sql } from "drizzle-orm";
import { pgTable, varchar, boolean, timestamp } from "drizzle-orm/pg-core";

export const metrics = pgTable("metrics", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  protocol: varchar("protocol", { length: 32 }),
  chain: varchar("chain", { length: 32 }),
  version: varchar("version", { length: 16 }),
  tvl: varchar("tvl", { length: 32 }),
  twap: varchar("twap", { length: 32 }),
  volatility: varchar("volatility", { length: 32 }),
  meanReversion: varchar("mean_reversion", { length: 32 }),
  is_empty: boolean("is_empty"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
