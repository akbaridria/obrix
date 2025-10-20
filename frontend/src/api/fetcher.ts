import { BASE_URL } from "@/config/constant";

export async function fetcher<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, options);
  if (!res.ok) throw new Error("Failed to fetch " + endpoint);
  return res.json();
}
