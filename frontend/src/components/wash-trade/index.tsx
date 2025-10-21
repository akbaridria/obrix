import * as React from "react";
import { TabsContent } from "../ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "../ui/pagination";
import { useQuery } from "@tanstack/react-query";
import { getWashTrade, washTradeQueryKey } from "@/api/washTrade";
import type { WashTrade } from "@/types";

const WashTrading = () => {
  const [page, setPage] = React.useState(1);
  const limit = 100;
  const { data, isLoading, error } = useQuery({
    queryKey: washTradeQueryKey(page, limit),
    queryFn: () => getWashTrade(page, limit),
  });

  const rows: WashTrade[] = data?.data?.items ?? [];
  const hasNextPage = data?.data?.hasNextPage ?? false;
  const hasPrevPage = data?.data?.hasPrevPage ?? false;

  return (
    <TabsContent value="wash-trade">
      <div className="mt-6 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Wash Trade Alerts</CardTitle>
            <CardDescription>
              List of detected wash trade events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table className="min-w-full">
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead className="p-4 text-left font-semibold">
                    Pool
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
                  </TableHead>{" "}
                  {/* Added */}
                  <TableHead className="p-4 text-left font-semibold">
                    Probability
                  </TableHead>
                  <TableHead className="p-4 text-left font-semibold">
                    Confidence
                  </TableHead>
                  <TableHead
                    className="p-4 text-left font-semibold"
                    style={{
                      position: "sticky",
                      right: 0,
                      background: "inherit",
                      zIndex: 2,
                    }}
                  >
                    Details
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-left py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                )}
                {error && (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-destructive"
                    >
                      Error loading wash trade data
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading && !error && rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-left py-8">
                      No data
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading &&
                  !error &&
                  rows.length > 0 &&
                  rows.map((row, idx) => (
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
                      <TableCell className="p-4">{row.network}</TableCell>
                      <TableCell className="p-4">{row.version}</TableCell>
                      <TableCell className="p-4">
                        {row.token0_symbol}/{row.token1_symbol}
                      </TableCell>
                      <TableCell className="p-4">
                        <Badge>
                          {(row.wash_trading_probability * 100).toFixed(2)}%
                        </Badge>
                      </TableCell>
                      <TableCell className="p-4">{row.confidence}</TableCell>
                      <TableCell className="p-4 sticky right-0 bg-input z-1">
                        <AlertDetailsDialog row={row} />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <div className="flex items-end justify-end mt-4">
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={(e) => {
                        e.preventDefault();
                        if (!isLoading && hasPrevPage) setPage(page - 1);
                      }}
                      aria-disabled={isLoading || !hasPrevPage}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      onClick={(e) => {
                        e.preventDefault();
                        if (!isLoading && hasNextPage) setPage(page + 1);
                      }}
                      aria-disabled={isLoading || !hasNextPage}
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

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../ui/dialog";
import { Badge } from "../ui/badge";

const AlertDetailsDialog: React.FC<{ row: WashTrade }> = ({ row }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="px-2 py-1 rounded bg-muted hover:bg-accent text-xs">
          Details
        </button>
      </DialogTrigger>
      <DialogContent className="!w-[800px] !max-w-[90vw] max-h-[80vh] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Wash Trade Alert Details</DialogTitle>
          <DialogDescription>
            <div className="space-y-2 mt-2 max-w-2xl max-h-full overflow-y-scroll">
              <div>
                <strong>Pool:</strong>
                <div
                  className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[400px]"
                  title={row.pool_id}
                >
                  {row.pool_id}
                </div>
              </div>
              <div>
                <strong>Protocol:</strong>
                <div>{row.protocol}</div>
              </div>
              <div>
                <strong>Pool name:</strong>
                <div>
                  {row.token0_symbol}/{row.token1_symbol}
                </div>
              </div>
              <div>
                <strong>Chain:</strong>
                <div>{row.network}</div>
              </div>
              <div>
                <strong>Version:</strong>
                <div>{row.version}</div>
              </div>
              <div>
                <strong>Probability:</strong>{" "}
                <Badge>
                  {(row.wash_trading_probability * 100).toFixed(2)}%
                </Badge>
              </div>
              <div>
                <strong>Confidence:</strong>
                <div>{row.confidence}</div>
              </div>
              <div>
                <strong>Created At:</strong>
                <div>{row.created_at}</div>
              </div>
              <div>
                <strong>Suspicious Addresses:</strong>{" "}
                <ul className="list-disc pl-4">
                  {row.suspicious_addresses.map((addr, i) => (
                    <li key={i} title={addr}>
                      {addr}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <strong>Transaction Hashes:</strong>{" "}
                <ul className="list-disc pl-4">
                  {row.transaction_hashes.map((tx, i) => (
                    <li key={i}>{tx}</li>
                  ))}
                </ul>
              </div>
              <div>
                <strong>Key Drivers:</strong>{" "}
                <ul className="list-disc pl-4">
                  {row.key_drivers.map((driver, i) => (
                    <li key={i}>{driver}</li>
                  ))}
                </ul>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogClose asChild>
          <button className="mt-4 px-4 py-2 rounded bg-primary text-white">
            Close
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default WashTrading;
