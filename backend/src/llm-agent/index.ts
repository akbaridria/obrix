import { AgentBuilder, LlmAgent, ParallelAgent } from "@iqai/adk";

const washTradingAgent = new LlmAgent({
  name: "wash-trade-detector",
  description:
    "Detects signs of wash trading activity in the provided swap data.",
  model: "gemini-2.5-flash",
  instruction: `
    You are a DeFi compliance analyst.
    Analyze the given pool swap data to identify potential WASH TRADING patterns.

    Focus on:
    - Repetitive buy/sell patterns between same addresses
    - Minimal net position change but high volume
    - Rapid in/out swaps of the same token pair
    - Suspicious volume spikes not accompanied by price movement

    Output as JSON:
    {
      "wash_trading_probability": (0-1),
      "suspicious_addresses": [address...],
      "evidence_summary": "...",
      "confidence": "low | medium | high"
    }
  `,
  outputKey: "wash_trading_analysis",
});

const pumpDumpAgent = new LlmAgent({
  name: "pump-dump-detector",
  model: "gemini-2.5-flash",
  description:
    "Analyzes price and volume patterns to detect pump-and-dump behavior.",
  instruction: `
    You are a DeFi market integrity analyst.
    Analyze the provided swap metrics and price data to detect PUMP AND DUMP patterns.

    Look for:
    - Rapid price increases followed by steep declines
    - Sudden spikes in trade volume
    - Concentrated trading by a few addresses
    - Short-term volatility anomalies

    Output as JSON:
    {
      "pump_dump_probability": (0-1),
      "time_window": "e.g. 1h / 4h",
      "key_drivers": [description...],
      "confidence": "low | medium | high"
    }
  `,
  outputKey: "pump_dump_analysis",
});

export const defiRiskPipeline = new ParallelAgent({
  name: "defi-risk-pipeline",
  description:
    "Parallel LLM agents detecting wash trading and pump & dump risks in swap data.",
  subAgents: [washTradingAgent, pumpDumpAgent],
});

const { runner } = await AgentBuilder.create("defi-risk-pipeline")
  .withDescription(
    "Parallel LLM agents detecting wash trading and pump & dump risks in swap data."
  )
  .withSubAgents([defiRiskPipeline])
  .build();

export { runner };
