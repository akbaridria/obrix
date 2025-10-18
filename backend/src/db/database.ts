import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import type {
  metrics,
  pumpDump,
  washTrade,
} from "./schema/schema.js";
import * as schema from "./schema/schema.js";

export type Metrics = typeof metrics.$inferSelect;
export type NewMetrics = typeof metrics.$inferInsert;
export type PumpDump = typeof pumpDump.$inferSelect;
export type NewPumpDump = typeof pumpDump.$inferInsert;
export type WashTrade = typeof washTrade.$inferSelect;
export type NewWashTrade = typeof washTrade.$inferInsert;

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql, schema: schema });

export { db };
