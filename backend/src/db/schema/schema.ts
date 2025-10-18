import { sql } from "drizzle-orm";
import {
  pgTable,
  varchar,
  boolean,
  timestamp,
  serial,
  real,
  jsonb,
  uuid,
} from "drizzle-orm/pg-core";

export const metrics = pgTable("metrics", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  protocol: varchar("protocol", { length: 32 }),
  chain: varchar("chain", { length: 32 }),
  version: varchar("version", { length: 16 }),
  twap: varchar("twap", { length: 32 }),
  volatility: varchar("volatility", { length: 32 }),
  meanReversion: varchar("mean_reversion", { length: 32 }),
  is_empty: boolean("is_empty"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  pool_id: varchar("pool_id", { length: 128 }),
  token0_symbol: varchar("token0_symbol", { length: 32 }),
  token1_symbol: varchar("token1_symbol", { length: 32 }),
});

export const washTrade = pgTable("wash_trade", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  wash_trading_probability: real("wash_trading_probability"),
  suspicious_addresses: jsonb("suspicious_addresses"),
  transaction_hashes: jsonb("transaction_hashes"),
  key_drivers: jsonb("key_drivers"),
  confidence: varchar("confidence", { length: 8 }),
  pool_id: varchar("pool_id", { length: 128 }),
  token0_symbol: varchar("token0_symbol", { length: 32 }),
  token1_symbol: varchar("token1_symbol", { length: 32 }),
  protocol: varchar("protocol", { length: 32 }),
  version: varchar("version", { length: 16 }),
  network: varchar("network", { length: 32 }),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const pumpDump = pgTable("pump_dump", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  pump_dump_probability: real("pump_dump_probability"),
  suspicious_addresses: jsonb("suspicious_addresses"),
  transaction_hashes: jsonb("transaction_hashes"),
  key_drivers: jsonb("key_drivers"),
  confidence: varchar("confidence", { length: 8 }),
  pool_id: varchar("pool_id", { length: 128 }),
  token0_symbol: varchar("token0_symbol", { length: 32 }),
  token1_symbol: varchar("token1_symbol", { length: 32 }),
  protocol: varchar("protocol", { length: 32 }),
  version: varchar("version", { length: 16 }),
  network: varchar("network", { length: 32 }),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
