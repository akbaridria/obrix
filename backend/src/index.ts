import { serve } from "@hono/node-server";
import { Hono } from "hono";
import routes from "./routes/index.js";
import { cors } from "hono/cors";
import { logger as httpLogger } from "hono/logger";
import { compress } from "hono/compress";
import { trimTrailingSlash } from "hono/trailing-slash";
import { UniswapV4Worker } from "./workers/uniswap-v4.worker.js";
import { defaultQueue } from "./libs/queue.js";
import { LIST_UNISWAP_V4_POOLS } from "./libs/constant.js";

const app = new Hono();

app.use(cors());
app.use(compress());
app.use(httpLogger());
app.use(trimTrailingSlash());

const uniswapV4Worker = new UniswapV4Worker();
const worker = uniswapV4Worker.setup();
if (worker) {
  console.log("Uniswap V4 Worker is set up and running.");
}

LIST_UNISWAP_V4_POOLS?.forEach((poolId) => {
  defaultQueue.upsertJobScheduler(
    "uniswap-v4-metrics-" + poolId,
    {
      every: 2 * 60 * 60 * 1000,
    },
    {
      data: {
        poolId,
      },
      opts: {
        attempts: 3,
        backoff: { type: "exponential", delay: 60000 },
      },
    }
  );
});

app.route("/", routes);

serve(
  {
    fetch: app.fetch,
    port: 3012,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
