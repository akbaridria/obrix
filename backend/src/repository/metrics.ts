import { eq } from "drizzle-orm";
import { metrics } from "../db/schema/schema.js";
import { db, type NewMetrics } from "../db/database.js";

export class MetricsRepository {
  public async create(_metrics: NewMetrics) {
    return db.insert(metrics).values(_metrics).returning();
  }

  public async findById(id: string) {
    return db.query.metrics.findMany({
      where: eq(metrics.id, id),
    });
  }

  public async getAll({
    limit = 10,
    page = 1,
    protocol,
  }: { limit?: number; page?: number; protocol?: string } = {}) {
    const offset = (page - 1) * limit;
    return db.query.metrics.findMany({
      where: protocol ? eq(metrics.protocol, protocol) : undefined,
      limit,
      offset,
      orderBy: (metrics, { desc }) => [desc(metrics.created_at)],
    });
  }
}
