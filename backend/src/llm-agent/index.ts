import {
  AgentBuilder,
  InMemorySessionService,
  LlmAgent,
  ParallelAgent,
} from "@iqai/adk";
import dedent from "dedent";
import type { MetricsResult } from "../types.js";
import type { PoolSwapQueryResult } from "../scripts/uniswap-v4.js";
import z from "zod";
import env from "../libs/env.js";

const createRunner = async (res: MetricsResult<PoolSwapQueryResult[]>) => {
  const washTradingAgent = new LlmAgent({
    name: "wash_trade_detector",
    description:
      "Detects signs of wash trading activity in the provided swap data.",
    model: "gemini-2.5-flash",
    instruction: `
    You are a DeFi compliance analyst.
    Your job is to assess risks in DeFi pools using the current pool swap state.
    Base your analysis strictly on the provided data—do not make assumptions, extrapolate beyond what's given, or introduce external knowledge.
    If the data is insufficient to draw a conclusion on a specific risk, explicitly state that and explain why.

    Wash Trading: This involves artificial inflation of trading volume through repeated, often self-dealing trades (e.g., the same addresses swapping back and forth with minimal net effect on holdings or price).
    Indicators from data: Patterns in swap data like frequent small-volume trades between limited addresses, high swap frequency with low net price impact relative to TWAP, or volume spikes without corresponding volatility changes.

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
    outputSchema: z.object({
      wash_trading_probability: z.number(),
      suspicious_addresses: z.array(z.string()),
      transaction_hashes: z.array(z.string()),
      key_drivers: z.array(z.string()),
      confidence: z.enum(["low", "medium", "high"]),
    }),
    outputKey: "wash_trading_analysis",
  });

  const pumpDumpAgent = new LlmAgent({
    name: "pump_dump_detector",
    model: "gemini-2.5-flash",
    description:
      "Analyzes price and volume patterns to detect pump-and-dump behavior.",
    instruction: `
    You are a DeFi market integrity analyst.
    Your job is to assess risks in DeFi pools using the current pool swap state.
    Base your analysis strictly on the provided data—do not make assumptions, extrapolate beyond what's given, or introduce external knowledge.
    If the data is insufficient to draw a conclusion on a specific risk, explicitly state that and explain why.

    Pump & Dump: This is a scheme where price is artificially inflated (pumped) through coordinated buying, followed by a rapid sell-off (dump) for profit.
    Indicators from data: Sudden spikes in volatility or deviations from TWAP suggesting rapid price increases, followed by reversals; low mean reversion during spikes indicating unsustainable changes; unusual swap patterns like concentrated buys then sells.

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
    outputSchema: z.object({
      pump_dump_probability: z.number(),
      suspicious_addresses: z.array(z.string()),
      transaction_hashes: z.array(z.string()),
      key_drivers: z.array(z.string()),
      confidence: z.enum(["low", "medium", "high"]),
    }),
    outputKey: "pump_dump_analysis",
  });
  const sessionService = new InMemorySessionService();
  const { runner } = await AgentBuilder.create("defi_risk_pipeline")
    .withDescription(
      "Parallel LLM agents detecting wash trading and pump & dump risks in swap data."
    )
    .withInstruction(
      dedent`
        You are a DeFi risk analyzer. Your job is to assess risks in DeFi pools using the current pool swap state. 
        Base your analysis strictly on the provided data—do not make assumptions, extrapolate beyond what's given, 
        or introduce external knowledge. If the data is insufficient to draw a conclusion on a specific risk, 
        explicitly state that and explain why.

        Current pool state:
          Pool ID: {poolId}
          Token0 Symbol: {token0Symbol}
          Token1 Symbol: {token1Symbol}
          Is Empty: {isEmpty}
          TWAP: {twap}
          Volatility: {volatility}
          Mean Reversion: {meanReversion}
          Swap Data: {data}

        Use this state to analyze for wash trading and pump & dump risks. Define each risk clearly before analyzing:

        Wash Trading: This involves artificial inflation of trading volume through repeated, often self-dealing trades 
        (e.g., the same addresses swapping back and forth with minimal net effect on holdings or price). Indicators from data: 
        Patterns in swap data like frequent small-volume trades between limited addresses, high swap frequency with low net price 
        impact relative to TWAP, or volume spikes without corresponding volatility changes.

        Pump & Dump: This is a scheme where price is artificially inflated (pumped) through coordinated buying, followed by a rapid 
        sell-off (dump) for profit. Indicators from data: Sudden spikes in volatility or deviations from TWAP suggesting rapid price 
        increases, followed by reversals; low mean reversion during spikes indicating unsustainable changes; unusual swap patterns 
        like concentrated buys then sells.
      `
    )
    .withSubAgents([washTradingAgent, pumpDumpAgent])
    .withSessionService(sessionService, {
      state: {
        ...res,
        data: JSON.stringify(
          res.data?.map((swap) => ({
            ...swap,
            transaction: {
              ...swap.transaction,
              transaction_hash: swap.transaction.id,
            },
          }))
        ),
      },
    })
    .withModel(env.LLM_AGENT || "gemini-2.0-flash-exp")
    .withOutputSchema(
      z.object({
        wash_trading_analysis: z.object({
          wash_trading_probability: z.number(),
          suspicious_addresses: z.array(z.string()),
          transaction_hashes: z.array(z.string()),
          key_drivers: z.array(z.string()),
          confidence: z.enum(["low", "medium", "high"]),
        }),
        pump_dump_analysis: z.object({
          pump_dump_probability: z.number(),
          suspicious_addresses: z.array(z.string()),
          transaction_hashes: z.array(z.string()),
          key_drivers: z.array(z.string()),
          confidence: z.enum(["low", "medium", "high"]),
        }),
      })
    )
    .build();

  return runner;
};

export { createRunner };
