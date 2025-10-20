export interface Metrics {
  id: string;
  protocol: string;
  chain: string;
  version: string;
  twap: string;
  volatility: string;
  meanReversion: string;
  is_empty?: boolean;
  created_at: string;
  pool_id: string;
  token0_symbol: string;
  token1_symbol: string;
}

export interface MetricsListResponse {
  data: {
    items: Metrics[];
    totalPages: number;
    totalCount: number;
    page: number;
    limit: number;
  };
  status: string;
}

export interface StatsResponse {
  totalUniquePools: number;
  totalPumpDumpAlerts: number;
  totalWashTradeAlerts: number;
}

export interface WashTrade {
  id: string;
  wash_trading_probability: number;
  suspicious_addresses: string[];
  transaction_hashes: string[];
  key_drivers: string[];
  confidence: string;
  pool_id: string;
  token0_symbol: string;
  token1_symbol: string;
  protocol: string;
  version: string;
  network: string;
  created_at: string;
}

export interface WashTradeListResponse {
  data: {
    items: WashTrade[];
    totalPages: number;
    totalCount: number;
    page: number;
    limit: number;
  };
  status: string;
}

export interface PumpDump {
  id: string;
  pump_dump_probability: number;
  suspicious_addresses: string[];
  transaction_hashes: string[];
  key_drivers: string[];
  confidence: string;
  pool_id: string;
  token0_symbol: string;
  token1_symbol: string;
  protocol: string;
  version: string;
  network: string;
  created_at: string;
}

export interface PumpDumpListResponse {
  data: {
    items: PumpDump[];
    totalPages: number;
    totalCount: number;
    page: number;
    limit: number;
  };
  status: string;
}
