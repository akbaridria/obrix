import { eq } from "drizzle-orm";
import { washTrade } from "../db/schema/schema.js";
import { db, type NewWashTrade } from "../db/database.js";

export class WashTradeRepository {
  public async create(_washTrade: NewWashTrade) {
    return db.insert(washTrade).values(_washTrade).returning();
  }

  public async findById(id: number) {
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
    return db.query.washTrade.findMany({
      where: protocol ? eq(washTrade.protocol, protocol) : undefined,
      limit,
      offset,
      orderBy: (washTrade, { desc }) => [desc(washTrade.created_at)],
    });
  }
}