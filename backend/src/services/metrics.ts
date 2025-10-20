import type { NewMetrics } from "../db/database.js";
import type { MetricsRepository } from "../repository/metrics.js";

export class MetricsService {
  private repo: MetricsRepository;

  constructor(metricsRepository: MetricsRepository) {
    this.repo = metricsRepository;

    this.create = this.create.bind(this);
    this.getAll = this.getAll.bind(this);
  }

  public async create(values: NewMetrics) {
    await this.repo.create(values);
  }

  public async getAll(
    params: { limit?: number; page?: number; protocol?: string } = {}
  ) {
    return this.repo.getAll(params);
  }

  public async getTotalUniquePools() {
    return this.repo.getTotalUniquePools();
  }
}
