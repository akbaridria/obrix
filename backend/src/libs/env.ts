import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
  SUBGRAPH_API_KEY: z.string(),
});

export default envSchema.parse(process.env);
