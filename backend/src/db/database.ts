import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import type { Logger as drizzleLogger } from "drizzle-orm/logger";
import type { metrics, pumpDump, washTrade } from "./schema/schema.js";
import * as schema from "./schema/schema.js";
import env from "../libs/env.js";

class DBLogger implements drizzleLogger {
  logQuery(query: string, params: unknown[]): void {
    console.debug({ query, params });
  }
}

export type Metrics = typeof metrics.$inferSelect;
export type NewMetrics = Omit<typeof metrics.$inferInsert, "id" | "created_at">;
export type PumpDump = typeof pumpDump.$inferSelect;
export type NewPumpDump = Omit<
  typeof pumpDump.$inferInsert,
  "id" | "created_at"
>;
export type WashTrade = typeof washTrade.$inferSelect;
export type NewWashTrade = Omit<
  typeof washTrade.$inferInsert,
  "id" | "created_at"
>;

const sql = neon(env.DATABASE_URL);
const db = drizzle({ client: sql, logger: new DBLogger(), schema: schema });

export { db };
