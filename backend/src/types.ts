interface MetricsResult<T> {
  isEmpty: boolean;
  twap: number;
  volatility: number;
  meanReversion: number;
  poolId: string;
  token0Symbol: string;
  token1Symbol: string;
  data: T;
}

export type { MetricsResult };
