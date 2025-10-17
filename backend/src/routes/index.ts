import { Hono } from "hono";
import { fetchPoolSwaps } from "../scripts/uniswap-v4.js";

const routes = new Hono();

routes.get("/", async (c) => {
  const poolId =
    "0xb98437c7ba28c6590dd4e1cc46aa89eed181f97108e5b6221730d41347bc817f";
  const LAST_HOUR_TIMESTAMP = Math.floor(Date.now() / 1000) - (3600 * 2);
  const res = await fetchPoolSwaps(poolId, LAST_HOUR_TIMESTAMP);
  return c.json({
    res,
    timestamp: LAST_HOUR_TIMESTAMP,
    date_string: new Date(LAST_HOUR_TIMESTAMP * 1000).toISOString(),
  });
});

export default routes;
