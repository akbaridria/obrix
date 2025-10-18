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
    const { isEmpty, data, meanReversion, twap, volatility } =
      await fetchPoolSwaps(job.data.poolId, timestamp);
    const metricsService = new MetricsService(new MetricsRepository());
  }
}

export { UniswapV4Worker, type UniswapV4JobData };
