import { Hono } from "hono";
import { MetricsService } from "../services/metrics.js";
import { MetricsRepository } from "../repository/metrics.js";
import { PumpDumpService } from "../services/pump-dump.js";
import { PumpDumpRepository } from "../repository/pump-dump.js";
import { WashTradeService } from "../services/wash-trade.js";
import { WashTradeRepository } from "../repository/wash-trade.js";

const routes = new Hono();

const metricsService = new MetricsService(new MetricsRepository());
const pumpDumpService = new PumpDumpService(new PumpDumpRepository());
const washtradeService = new WashTradeService(new WashTradeRepository());

routes.get("/", async (c) => {
  return c.text("API is running");
});

routes.get("/metrics", async (c) => {
  const page = Number(c.req.query("page") || "1");
  const limit = Number(c.req.query("limit") || "100");
  const protocol = c.req.query("protocol") || undefined;

  const data = await metricsService.getAll({ page, limit, protocol });

  return c.json(data);
});

routes.get("/pump-dump", async (c) => {
  const page = Number(c.req.query("page") || "1");
  const limit = Number(c.req.query("limit") || "100");
  const protocol = c.req.query("protocol") || undefined;

  const data = await pumpDumpService.getAll({ page, limit, protocol });

  return c.json(data);
});

routes.get("/wash-trade", async (c) => {
  const page = Number(c.req.query("page") || "1");
  const limit = Number(c.req.query("limit") || "100");
  const protocol = c.req.query("protocol") || undefined;

  const data = await washtradeService.getAll({ page, limit, protocol });

  return c.json(data);
});

export default routes;
