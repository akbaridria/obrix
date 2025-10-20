import { eq, count } from "drizzle-orm";
import { washTrade } from "../db/schema/schema.js";
import { db, type NewWashTrade } from "../db/database.js";

export class WashTradeRepository {
  public async create(_washTrade: NewWashTrade) {
    return db.insert(washTrade).values(_washTrade);
  }

  public async findById(id: string) {
    return db.query.washTrade.findMany({
      where: eq(washTrade.id, id),
    });
  }

  public async getAll({
    limit = 100,
    page = 1,
    protocol,
  }: { limit?: number; page?: number; protocol?: string } = {}) {
    const offset = (page - 1) * limit;
    const whereClause = protocol ? eq(washTrade.protocol, protocol) : undefined;

    const [items, totalCountResult] = await Promise.all([
      db.query.washTrade.findMany({
        where: whereClause,
        limit,
        offset,
        orderBy: (washTrade, { desc }) => [desc(washTrade.created_at)],
      }),
      db.select({ count: count() }).from(washTrade).where(whereClause),
    ]);

    const totalCount = totalCountResult[0]?.count ?? 0;
    const totalPages = Math.ceil(totalCount / limit);

    return {
      items,
      totalPages,
      totalCount,
      page,
      limit,
    };
  }

  async getTotalAlertsEqualToOne(): Promise<number> {
    const result = await db
      .select({ count: count() })
      .from(washTrade)
      .where(eq(washTrade.wash_trading_probability, 1));
    return result[0]?.count ?? 0;
  }
}
