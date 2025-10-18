import { Hono } from "hono";

const routes = new Hono();

routes.get("/", async (c) => {
  return c.text("API is running");
});

export default routes;
