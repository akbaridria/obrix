import { serve } from "@hono/node-server";
import { Hono } from "hono";
import routes from "./routes/index.js";
import { cors } from "hono/cors";
import { logger as httpLogger } from "hono/logger";
import { compress } from "hono/compress";
import { trimTrailingSlash } from "hono/trailing-slash";

const app = new Hono();

app.use(cors());
app.use(compress());
app.use(httpLogger());
app.use(trimTrailingSlash());

app.route("/", routes);


serve(
  {
    fetch: app.fetch,
    port: 3011,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);