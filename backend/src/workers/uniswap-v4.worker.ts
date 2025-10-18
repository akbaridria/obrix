import { type Job, Worker } from "bullmq";
import { connection, QUEUE } from "../libs/queue.js";
import { fetchPoolSwaps } from "../scripts/uniswap-v4.js";
import { MetricsService } from "../services/metrics.js";
import { MetricsRepository } from "../repository/metrics.js";
import { createRunner } from "../llm-agent/index.js";
import { WashTradeService } from "../services/wash-trade.js";
import { WashTradeRepository } from "../repository/wash-trade.js";
import { PumpDumpService } from "../services/pump-dump.js";
import { PumpDumpRepository } from "../repository/pump-dump.js";

interface UniswapV4JobData {
  poolId: string;
}

class UniswapV4Worker {
  constructor() {}

  public setup() {
    const worker = new Worker(QUEUE.default, this.processor, { connection });

    worker.on("completed", (job: Job) => {
      console.info(`Job ${job.id} completed, task name: ${job.name}`);
    });

    worker.on("failed", (job: Job | undefined, error: Error) => {
      if (job) {
        console.error(
          `Job ${job.id} failed, task name: ${job.name}, error: ${error.message}`
        );
      } else {
        console.error(`Job failed, error: ${error.message}`);
      }
    });

    worker.on("error", (err) => {
      console.error(err);
    });

    return worker;
  }

  private async processor(job: Job<UniswapV4JobData>) {
    console.info(`Processing job ${job.id}, task name: ${job.name}`);
    const timestamp = Math.floor(Date.now() / 1000) - 7200; // 2 hour ago
    const result = await fetchPoolSwaps(job.data.poolId, timestamp);
    const {
      isEmpty,
      meanReversion,
      twap,
      volatility,
      poolId,
      token0Symbol,
      token1Symbol,
    } = result;
    const metricsService = new MetricsService(new MetricsRepository());
    await metricsService.create({
      chain: "ethereum",
      protocol: "uniswap",
      version: "v4",
      pool_id: poolId,
      is_empty: isEmpty,
      meanReversion: String(meanReversion),
      twap: String(twap),
      volatility: String(volatility),
      token0_symbol: token0Symbol,
      token1_symbol: token1Symbol,
    });

    const runner = await createRunner(result);
    const analysis = await runner.ask(
      "Analyze the following swap data for wash trading and pump & dump risks. the swap data is in your session state."
    );
    const washtradeService = new WashTradeService(new WashTradeRepository());
    await washtradeService.create({
      wash_trading_probability:
        analysis.wash_trading_analysis.wash_trading_probability,
      suspicious_addresses: analysis.wash_trading_analysis.suspicious_addresses,
      transaction_hashes: analysis.wash_trading_analysis.transaction_hashes,
      key_drivers: analysis.wash_trading_analysis.key_drivers,
      confidence: analysis.wash_trading_analysis.confidence,
      pool_id: poolId,
      token0_symbol: token0Symbol,
      token1_symbol: token1Symbol,
      protocol: "uniswap-v4",
      version: "v4",
      network: "ethereum",
    });

    const pumpDumpService = new PumpDumpService(new PumpDumpRepository());
    await pumpDumpService.create({
      pump_dump_probability: analysis.pump_dump_analysis.pump_dump_probability,
      suspicious_addresses: analysis.pump_dump_analysis.suspicious_addresses,
      transaction_hashes: analysis.pump_dump_analysis.transaction_hashes,
      key_drivers: analysis.pump_dump_analysis.key_drivers,
      confidence: analysis.pump_dump_analysis.confidence,
      pool_id: poolId,
      token0_symbol: token0Symbol,
      token1_symbol: token1Symbol,
      protocol: "uniswap",
      version: "v4",
      network: "ethereum",
    });
  }
}

export { UniswapV4Worker, type UniswapV4JobData };
