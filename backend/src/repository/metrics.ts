import { eq, countDistinct } from "drizzle-orm";
import { metrics } from "../db/schema/schema.js";
import { db, type NewMetrics } from "../db/database.js";

export class MetricsRepository {
  public async create(_metrics: NewMetrics) {
    return db.insert(metrics).values(_metrics);
  }

  public async findById(id: string) {
    return db.query.metrics.findMany({
      where: eq(metrics.id, id),
    });
  }

  async getAll({
    limit = 100,
    page = 1,
    protocol,
  }: { limit?: number; page?: number; protocol?: string } = {}) {
    const offset = (page - 1) * limit;

    const [total, items] = await Promise.all([
      db
        .select({ count: countDistinct(metrics.id) })
        .from(metrics)
        .where(protocol ? eq(metrics.protocol, protocol) : undefined),
      db.query.metrics.findMany({
        where: protocol ? eq(metrics.protocol, protocol) : undefined,
        limit,
        offset,
        orderBy: (metrics, { desc }) => [desc(metrics.created_at)],
      }),
    ]);

    const totalCount = total[0]?.count ?? 0;
    const totalPages = Math.ceil(totalCount / limit);

    return {
      items,
      totalPages,
      totalCount,
      page,
      limit,
    };
  }

  public async getTotalUniquePools(): Promise<number> {
    const result = await db
      .select({ count: countDistinct(metrics.pool_id) })
      .from(metrics);
    return result[0]?.count ?? 0;
  }
}
