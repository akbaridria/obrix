import { eq, count } from "drizzle-orm";
import { pumpDump } from "../db/schema/schema.js";
import { db, type NewPumpDump } from "../db/database.js";

export class PumpDumpRepository {
  public async create(_pumpDump: NewPumpDump) {
    return db.insert(pumpDump).values(_pumpDump);
  }

  public async findById(id: string) {
    return db.query.pumpDump.findMany({
      where: eq(pumpDump.id, id),
    });
  }

  public async getAll({
    limit = 100,
    page = 1,
    protocol,
  }: { limit?: number; page?: number; protocol?: string } = {}) {
    const offset = (page - 1) * limit;
    const items = await db.query.pumpDump.findMany({
      where: protocol ? eq(pumpDump.protocol, protocol) : undefined,
      limit: limit + 1,
      offset,
      orderBy: (pumpDump, { desc }) => [desc(pumpDump.created_at)],
    });

    const hasNextPage = items.length > limit;
    const paginatedItems = items.slice(0, limit);

    return {
      items: paginatedItems,
      page,
      limit,
      hasNextPage,
      hasPrevPage: page > 1,
    };
  }

  async getTotalAlertsEqualToOne(): Promise<number> {
    const result = await db
      .select({ count: count() })
      .from(pumpDump)
      .where(eq(pumpDump.pump_dump_probability, 1));
    return result[0]?.count ?? 0;
  }
}
