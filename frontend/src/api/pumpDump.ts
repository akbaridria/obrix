import { fetcher } from "./fetcher";
import type { PumpDumpListResponse } from "@/types";

export const getPumpDump = (page = 1, limit = 100) =>
  fetcher<PumpDumpListResponse>(`/pump-dump?page=${page}&limit=${limit}`);

export const pumpDumpQueryKey = (page: number, limit: number) => ["pump-dump", page, limit];
