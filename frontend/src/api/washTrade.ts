import { fetcher } from "./fetcher";
import type { WashTradeListResponse } from "@/types";

export const getWashTrade = (page = 1, limit = 100) =>
  fetcher<WashTradeListResponse>(`/wash-trade?page=${page}&limit=${limit}`);

export const washTradeQueryKey = (page: number, limit: number) => ["wash-trade", page, limit];
