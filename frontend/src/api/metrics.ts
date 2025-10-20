import { fetcher } from "./fetcher";
import { queryKeys } from "./queryKeys";
import type { StatsResponse, MetricsListResponse } from "@/types";

export const getStats = () => fetcher<StatsResponse>("/stats");
export const getMetrics = (page = 1, limit = 100) => fetcher<MetricsListResponse>(`/metrics?page=${page}&limit=${limit}`);

export { queryKeys };
