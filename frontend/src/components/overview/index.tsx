import * as React from "react";
import {
  ChartLineIcon,
  DropletsIcon,
  Repeat2Icon,
  InfoIcon,
  TrendingUpIcon,
} from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  cn,
  getMeanReversionDescription,
  getVolatilityDescription,
} from "../../lib/utils";
import { TabsContent } from "@radix-ui/react-tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useQuery } from "@tanstack/react-query";
import { getStats, getMetrics, metricsQueryKey } from "@/api/metrics";
import type { Metrics } from "@/types";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

const Overview = () => {
  const [page, setPage] = React.useState(1);
  const limit = 100;
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: getStats,
  });
  const {
    data: metrics,
    isLoading: metricsLoading,
    error: metricsError,
  } = useQuery({
    queryKey: metricsQueryKey(page, limit),
    queryFn: () => getMetrics(page, limit),
  });

  const rows: Metrics[] = metrics?.data?.items ?? [];
  const hasNextPage = metrics?.data?.hasNextPage ?? false;
  const hasPrevPage = metrics?.data?.hasPrevPage ?? false;

  return (
    <TabsContent value="overview">
      <div className="mt-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Pool Monitored</CardTitle>
              <CardAction>
                <DropletsIcon className="h-6 w-6 text-primary" />
              </CardAction>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {statsLoading ? "..." : stats?.totalUniquePools ?? "-"}
              </p>
              <p className="text-xs text-muted-foreground">Pool Monitored</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Wash Trade Alerts</CardTitle>
              <CardAction>
                <Repeat2Icon className="h-6 w-6 text-primary" />
              </CardAction>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {statsLoading ? "..." : stats?.totalWashTradeAlerts ?? "-"}
              </p>
              <p className="text-xs text-muted-foreground">Wash Trade Alerts</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Pump & Dump Alerts</CardTitle>
              <CardAction>
                <ChartLineIcon className="h-6 w-6 text-primary" />
              </CardAction>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {statsLoading ? "..." : stats?.totalPumpDumpAlerts ?? "-"}
              </p>
              <p className="text-xs text-muted-foreground">
                Pump & Dump Alerts
              </p>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <TrendingUpIcon />
                Metrics Overview
              </div>
            </CardTitle>
            <CardDescription>
              Overview of monitored pools and their key metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table className="min-w-full">
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead className="p-4 text-left font-semibold">
                    Pool ID
                  </TableHead>
                  <TableHead className="p-4 text-left font-semibold">
                    Protocol
                  </TableHead>
                  <TableHead className="p-4 text-left font-semibold">
                    Chain
                  </TableHead>
                  <TableHead className="p-4 text-left font-semibold">
                    Version
                  </TableHead>
                  <TableHead className="p-4 text-left font-semibold">
                    Pool Name
                  </TableHead>
                  <TableHead className="p-4 text-left font-semibold">
                    TWAP
                  </TableHead>
                  <TableHead className="p-4 text-left font-semibold">
                    Volatility
                  </TableHead>
                  <TableHead className="p-4 text-left font-semibold">
                    Mean Reversion
                  </TableHead>
                  <TableHead className="p-4 text-left font-semibold">
                    Created At
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metricsLoading && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-left py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                )}
                {metricsError && (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center py-8 text-destructive"
                    >
                      Error loading metrics
                    </TableCell>
                  </TableRow>
                )}
                {!metricsLoading && !metricsError && rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-left py-8">
                      No data
                    </TableCell>
                  </TableRow>
                )}
                {!metricsLoading &&
                  !metricsError &&
                  rows.length > 0 &&
                  rows.map((row, idx) => {
                    return (
                      <TableRow
                        key={idx}
                        className="hover:bg-accent transition-colors"
                      >
                        <TableCell
                          className="p-4 max-w-[140px] truncate"
                          title={row.pool_id}
                        >
                          <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
                            {row.pool_id}
                          </span>
                        </TableCell>
                        <TableCell className="p-4">{row.protocol}</TableCell>
                        <TableCell className="p-4">{row.chain}</TableCell>
                        <TableCell className="p-4">{row.version}</TableCell>
                        <TableCell className="p-4">
                          {row.token0_symbol}/{row.token1_symbol}
                        </TableCell>
                        <TableCell className="p-4">
                          {new Intl.NumberFormat(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(Number(row.twap))}
                        </TableCell>
                        <TableCell className="p-4">
                          <div className="flex items-center gap-2">
                            {`${(Number(row.volatility) * 100).toFixed(2)}%`}
                            <Popover>
                              <PopoverTrigger>
                                <button
                                  type="button"
                                  className="p-0 m-0 bg-transparent border-none cursor-pointer"
                                >
                                  <InfoIcon className="h-4 w-4 text-muted-foreground" />
                                </button>
                              </PopoverTrigger>
                              <PopoverContent className="max-w-xs p-2 text-xs">
                                <ul className="list-disc pl-4">
                                  {getVolatilityDescription(
                                    Number(row.volatility)
                                  ).map((desc, i) => (
                                    <li key={i}>{desc}</li>
                                  ))}
                                </ul>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </TableCell>
                        <TableCell className="p-4">
                          <div className="flex items-center gap-2">
                            {(Number(row.meanReversion) * 100).toFixed(2)}%
                            <Popover>
                              <PopoverTrigger>
                                <button
                                  type="button"
                                  className="p-0 m-0 bg-transparent border-none cursor-pointer"
                                >
                                  <InfoIcon className="h-4 w-4 text-muted-foreground" />
                                </button>
                              </PopoverTrigger>
                              <PopoverContent className="max-w-xs p-2 text-xs">
                                <ul className="list-disc pl-4">
                                  {getMeanReversionDescription(
                                    Number(row.meanReversion)
                                  ).map((desc, i) => (
                                    <li key={i}>{desc}</li>
                                  ))}
                                </ul>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </TableCell>
                        <TableCell className="p-4">{row.created_at}</TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
            <div className="flex items-end justify-end mt-4">
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      className={cn({
                        "cursor-not-allowed opacity-50": metricsLoading || !hasPrevPage,
                      })}
                      onClick={(e) => {
                        e.preventDefault();
                        if (!metricsLoading && hasPrevPage) setPage(page - 1);
                      }}
                      aria-disabled={metricsLoading || !hasPrevPage}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      className={cn({
                        "cursor-not-allowed opacity-50": metricsLoading || !hasNextPage,
                      })}
                      onClick={(e) => {
                        e.preventDefault();
                        if (!metricsLoading && hasNextPage) setPage(page + 1);
                      }}
                      aria-disabled={metricsLoading || !hasNextPage}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
};

export default Overview;
