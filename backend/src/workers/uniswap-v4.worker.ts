import { type Job, Worker } from "bullmq";
import { connection, QUEUE } from "../libs/queue.js";
import { fetchPoolSwaps } from "../scripts/uniswap-v4.js";
import { MetricsService } from "../services/metrics.js";
import { MetricsRepository } from "../repository/metrics.js";

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
    // calcualte metrics
    const {
      isEmpty,
      data,
      meanReversion,
      twap,
      volatility,
      poolId,
      token0Symbol,
      token1Symbol,
    } = await fetchPoolSwaps(job.data.poolId, timestamp);
    const metricsService = new MetricsService(new MetricsRepository());

    // insert metrics to the database
    // await metricsService.create({
    //   chain: "ethereum",
    //   protocol: "uniswap",
    //   version: "v4",
    //   pool_id: poolId,
    //   is_empty: isEmpty,
    //   meanReversion: String(meanReversion),
    //   twap: String(twap),
    //   volatility: String(volatility),
    //   token0_symbol: token0Symbol,
    //   token1_symbol: token1Symbol,
    // });

    // run agent
    // const res = await runner.ask(
    //   "Analyze the following swap data for wash trading and pump & dump risks: " +
    //     JSON.stringify(data)
    // );
    // console.log(res);
  }
}

export { UniswapV4Worker, type UniswapV4JobData };
