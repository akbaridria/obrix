import { type Job, Worker } from "bullmq";
import { connection, QUEUE } from "../libs/queue.js";

interface JobData {
  poolId: string;
}

class WorkerService {
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

  private async processor(job: Job<JobData>) {
    console.info(`Processing job ${job.id}, task name: ${job.name}`);
    // Implement the actual job processing logic here
  }
}

export { WorkerService, type JobData };
