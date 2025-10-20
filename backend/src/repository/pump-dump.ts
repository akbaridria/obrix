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
    const [totalResult, data] = await Promise.all([
      db
        .select({ count: count() })
        .from(pumpDump)
        .where(protocol ? eq(pumpDump.protocol, protocol) : undefined),
      db.query.pumpDump.findMany({
        where: protocol ? eq(pumpDump.protocol, protocol) : undefined,
        limit,
        offset,
        orderBy: (pumpDump, { desc }) => [desc(pumpDump.created_at)],
      }),
    ]);

    const total = totalResult[0]?.count ?? 0;
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      totalPages,
      page,
      limit,
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
