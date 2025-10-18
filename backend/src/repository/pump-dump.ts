import { eq } from "drizzle-orm";
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
    return db.query.pumpDump.findMany({
      where: protocol ? eq(pumpDump.protocol, protocol) : undefined,
      limit,
      offset,
      orderBy: (pumpDump, { desc }) => [desc(pumpDump.created_at)],
    });
  }
}