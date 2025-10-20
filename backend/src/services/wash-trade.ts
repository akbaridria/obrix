import type { NewWashTrade } from "../db/database.js";
import type { WashTradeRepository } from "../repository/wash-trade.js";

export class WashTradeService {
  private repo: WashTradeRepository;

  constructor(washTradeRepository: WashTradeRepository) {
    this.repo = washTradeRepository;

    this.create = this.create.bind(this);
    this.getAll = this.getAll.bind(this);
  }

  public async create(values: NewWashTrade) {
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
