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
import { getStats, getMetrics, queryKeys } from "@/api/metrics";
import type { Metrics } from "@/types";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

const Overview = () => {
  const [page, setPage] = React.useState(1);
  const limit = 10;
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: queryKeys.stats,
    queryFn: getStats,
  });
  const {
    data: metrics,
    isLoading: metricsLoading,
    error: metricsError,
  } = useQuery({
    queryKey: [...queryKeys.metrics, page, limit],
    queryFn: () => getMetrics(page, limit),
  });

  const rows: Metrics[] = metrics?.data?.items ?? [];
  const pageCount: number = metrics?.data?.totalPages ?? 1;

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
                  <TableHead className="px-4 py-2 text-left font-semibold">
                    Pool ID
                  </TableHead>
                  <TableHead className="px-4 py-2 text-left font-semibold">
                    Protocol
                  </TableHead>
                  <TableHead className="px-4 py-2 text-left font-semibold">
                    Chain
                  </TableHead>
                  <TableHead className="px-4 py-2 text-left font-semibold">
                    Version
                  </TableHead>
                  <TableHead className="px-4 py-2 text-left font-semibold">
                    Pool Name
                  </TableHead>
                  <TableHead className="px-4 py-2 text-left font-semibold">
                    TWAP
                  </TableHead>
                  <TableHead className="px-4 py-2 text-left font-semibold">
                    Volatility
                  </TableHead>
                  <TableHead className="px-4 py-2 text-left font-semibold">
                    Mean Reversion
                  </TableHead>
                  <TableHead className="px-4 py-2 text-left font-semibold">
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
                        <TableCell className="p-4 max-w-[140px] truncate" title={row.pool_id}>
                          <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
                            {row.pool_id}
                          </span>
                        </TableCell>
                        <TableCell className="p-4">
                          {row.protocol}
                        </TableCell>
                        <TableCell className="p-4">{row.chain}</TableCell>
                        <TableCell className="p-4">
                          {row.version}
                        </TableCell>
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
                        <TableCell className="p-4">
                          {row.created_at}
                        </TableCell>
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
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (!metricsLoading && page > 1) setPage(page - 1);
                      }}
                      aria-disabled={metricsLoading || page === 1}
                    />
                  </PaginationItem>
                  {Array.from({ length: pageCount }).map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        href="#"
                        isActive={page === i + 1}
                        onClick={(e) => {
                          e.preventDefault();
                          if (!metricsLoading) setPage(i + 1);
                        }}
                        aria-disabled={metricsLoading}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  {pageCount > 5 && page < pageCount - 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (!metricsLoading && page < pageCount)
                          setPage(page + 1);
                      }}
                      aria-disabled={metricsLoading || page === pageCount}
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
