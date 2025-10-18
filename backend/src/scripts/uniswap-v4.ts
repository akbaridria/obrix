import { SUBGRAPH_URL } from "../libs/constant.js";
import type { MetricsResult } from "../types.js";

export interface PoolSwapQueryResult {
  id: string;
  timestamp: string;
  sqrtPriceX96: string;
  tick: string;
  amount0: string;
  amount1: string;
  amountUSD: string;
  transaction: {
    id: string;
    blockNumber: string;
    timestamp: string;
    transfers: {
      id: string;
      from: string;
      to: string;
      amount: string;
      token: {
        id: string;
        symbol: string;
        decimals: string;
      };
    }[];
  };
}

interface PoolInfo {
  id: string;
  tick: string;
  totalValueLockedUSD: string;
  token0: {
    id: string;
    symbol: string;
    decimals: string;
  };
  token1: {
    id: string;
    symbol: string;
    decimals: string;
  };
}

interface GraphQLResponse {
  swaps: PoolSwapQueryResult[];
  pool: PoolInfo;
}

function calculateTWAP(
  swaps: PoolSwapQueryResult[],
  pool: PoolInfo
): { isSuccess: boolean; twap: number } {
  try {
    if (!swaps || swaps.length < 2) {
      return { isSuccess: false, twap: 0 };
    }

    const decimals0 = parseInt(pool?.token0?.decimals ?? "18");
    const decimals1 = parseInt(pool?.token1?.decimals ?? "6");

    let priceTimeSum = 0;
    let totalTime = 0;

    for (let i = 1; i < swaps.length; i++) {
      const prevSwap = swaps[i - 1];
      const currSwap = swaps[i];

      const timeDelta = Number(currSwap.timestamp) - Number(prevSwap.timestamp);
      const price = sqrtPriceX96ToPrice(
        BigInt(prevSwap.sqrtPriceX96),
        decimals0,
        decimals1
      );

      priceTimeSum += price * timeDelta;
      totalTime += timeDelta;
    }

    const twap = totalTime > 0 ? priceTimeSum / totalTime : 0;

    return { isSuccess: true, twap };
  } catch (error) {
    return { isSuccess: false, twap: 0 };
  }
}

function calculateVolatility(
  swaps: PoolSwapQueryResult[],
  pool: PoolInfo
): { isSuccess: boolean; volatility: number } {
  try {
    if (!swaps || swaps.length < 2) {
      return { isSuccess: false, volatility: 0 };
    }

    const decimals0 = parseInt(pool?.token0?.decimals ?? "18");
    const decimals1 = parseInt(pool?.token1?.decimals ?? "6");

    const prices = swaps.map((swap) =>
      sqrtPriceX96ToPrice(BigInt(swap.sqrtPriceX96), decimals0, decimals1)
    );
    const returns = [];

    for (let i = 1; i < prices.length; i++) {
      const logReturn = Math.log(prices[i] / prices[i - 1]);
      returns.push(logReturn);
    }

    const meanReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;

    const variance =
      returns.reduce((sum, r) => {
        return sum + Math.pow(r - meanReturn, 2);
      }, 0) / returns.length;

    const volatility = Math.sqrt(variance);

    const avgTimeInterval =
      (Number(swaps[swaps.length - 1].timestamp) - Number(swaps[0].timestamp)) /
      (swaps.length - 1);
    const periodsPerYear = (365.25 * 24 * 3600) / avgTimeInterval;
    const annualizedVolatility = volatility * Math.sqrt(periodsPerYear);

    return { isSuccess: true, volatility: annualizedVolatility };
  } catch (error) {
    return { isSuccess: false, volatility: 0 };
  }
}

function calculateMeanReversionIndex(
  swaps: PoolSwapQueryResult[],
  pool: PoolInfo
): { isSuccess: boolean; meanReversionIndex: number } {
  try {
    if (!swaps || swaps.length < 10) {
      return { isSuccess: false, meanReversionIndex: 0 };
    }

    const decimals0 = parseInt(pool?.token0?.decimals ?? "18");
    const decimals1 = parseInt(pool?.token1?.decimals ?? "6");

    const prices = swaps.map((swap) =>
      sqrtPriceX96ToPrice(BigInt(swap.sqrtPriceX96), decimals0, decimals1)
    );

    const windowSize = Math.min(20, Math.floor(prices.length / 2));
    const movingAverage = calculateMovingAverage(prices, windowSize);

    let crossings = 0;
    for (let i = windowSize; i < prices.length; i++) {
      if (
        Math.sign(prices[i] - movingAverage[i - windowSize + 1]) !==
        Math.sign(prices[i - 1] - movingAverage[i - windowSize])
      ) {
        crossings++;
      }
    }

    const n = prices.length - windowSize + 1;

    const hurstExponent = calculateSimplifiedHurst(prices);

    const expectedCrossings = n / 2;
    const crossingScore = Math.min(crossings / expectedCrossings, 2) / 2;
    const hurstScore = Math.max(0, 1 - 2 * hurstExponent);
    const meanReversionIndex = crossingScore * 0.6 + hurstScore * 0.4;

    return { isSuccess: true, meanReversionIndex };
  } catch (error) {
    return { isSuccess: false, meanReversionIndex: 0 };
  }
}

function calculateSimplifiedHurst(prices: number[]): number {
  if (prices.length < 20) return 0.5;

  const logPrices = prices.map((p) => Math.log(p));
  const mean = logPrices.reduce((a, b) => a + b, 0) / logPrices.length;

  let cumDev = 0;
  const cumDevs = [];
  for (let i = 0; i < logPrices.length; i++) {
    cumDev += logPrices[i] - mean;
    cumDevs.push(cumDev);
  }

  const range = Math.max(...cumDevs) - Math.min(...cumDevs);

  const variance =
    logPrices.reduce((sum, price) => {
      return sum + Math.pow(price - mean, 2);
    }, 0) / logPrices.length;
  const stdDev = Math.sqrt(variance);

  const rs = stdDev !== 0 ? range / stdDev : 1;
  const hurst = Math.log(rs) / Math.log(logPrices.length);

  return Math.max(0, Math.min(1, hurst));
}

function calculateMovingAverage(
  prices: number[],
  windowSize: number
): number[] {
  const ma: number[] = [];
  for (let i = 0; i <= prices.length - windowSize; i++) {
    const window = prices.slice(i, i + windowSize);
    const avg = window.reduce((a, b) => a + b, 0) / windowSize;
    ma.push(avg);
  }
  return ma;
}

function sqrtPriceX96ToPrice(
  sqrtPriceX96: bigint,
  decimals0 = 18,
  decimals1 = 6
): number {
  const Q96 = 2n ** 96n;
  const sqrtPrice = Number(sqrtPriceX96) / Number(Q96);
  const price = sqrtPrice ** 2;

  const decimalAdjustment = Math.pow(10, decimals0 - decimals1);
  return price * decimalAdjustment;
}

async function fetchPoolSwaps(
  poolId: string,
  timestampGte: number
): Promise<MetricsResult<PoolSwapQueryResult[]>> {
  const SWAPS_QUERY = `
  query GetSwaps($poolId: ID!, $timestampGte: Int!) {
    swaps(
      where: { pool: $poolId, timestamp_gte: $timestampGte }
      orderBy: timestamp
      orderDirection: asc
      first: 1000
    ) {
      id
      timestamp
      sqrtPriceX96
      tick
      amount0
      amount1
      amountUSD
    	origin
      transaction {
        id
        blockNumber
        timestamp
        transfers(first: 10) {
          id
          from
          to
          tokenId
          timestamp
        }
      }
      token0 {
        id
        symbol
        decimals
      }
      token1 {
        id
        symbol
        decimals
      }
    }
    pool(id: $poolId) {
      id
      tick
      token0 {
        id
        symbol
        decimals
      }
      token1 {
        id
        symbol
        decimals
      }
    }
  }
`;

  const response = await fetch(SUBGRAPH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: SWAPS_QUERY,
      variables: { poolId, timestampGte },
    }),
  });

  if (!response.ok) {
    throw new Error(`GraphQL error: ${response.statusText}`);
  }

  const { data }: { data: GraphQLResponse } = await response.json();

  if (data.swaps?.length < 2) {
    return {
      isEmpty: true,
      twap: 0,
      volatility: 0,
      meanReversion: 0,
      data: data.swaps,
      token0Symbol: data.pool.token0.symbol,
      token1Symbol: data.pool.token1.symbol,
      poolId: poolId,
    };
  }

  return {
    isEmpty: false,
    twap: calculateTWAP(data.swaps, data.pool).twap,
    volatility: calculateVolatility(data.swaps, data.pool).volatility,
    meanReversion: calculateMeanReversionIndex(data.swaps, data.pool)
      .meanReversionIndex,
    data: data.swaps,
    token0Symbol: data.pool.token0.symbol,
    token1Symbol: data.pool.token1.symbol,
    poolId: poolId,
  };
}

export { fetchPoolSwaps };
