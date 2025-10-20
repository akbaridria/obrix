import type { NewPumpDump } from "../db/database.js";
import type { PumpDumpRepository } from "../repository/pump-dump.js";

export class PumpDumpService {
  private repo: PumpDumpRepository;

  constructor(pumpDumpRepository: PumpDumpRepository) {
    this.repo = pumpDumpRepository;

    this.create = this.create.bind(this);
    this.getAll = this.getAll.bind(this);
  }

  public async create(values: NewPumpDump) {
    await this.repo.create(values);
  }

  public async getAll(
    params: { limit?: number; page?: number; protocol?: string } = {}
  ) {
    return this.repo.getAll(params);
  }

  public async getTotalAlertsEqualToOne() {
    return this.repo.getTotalAlertsEqualToOne();
  }
}