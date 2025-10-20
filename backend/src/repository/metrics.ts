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
    const whereClause = protocol ? eq(metrics.protocol, protocol) : undefined;

    const items = await db.query.metrics.findMany({
      where: whereClause,
      limit: limit + 1,
      offset,
      orderBy: (metrics, { desc }) => [desc(metrics.created_at)],
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

  public async getTotalUniquePools(): Promise<number> {
    const result = await db
      .select({ count: countDistinct(metrics.pool_id) })
      .from(metrics);
    return result[0]?.count ?? 0;
  }
}
