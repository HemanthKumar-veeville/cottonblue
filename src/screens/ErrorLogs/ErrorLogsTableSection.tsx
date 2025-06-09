import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/Skeleton";
import EmptyState from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";
import { AlertTriangle } from "lucide-react";

interface ErrorLog {
  id: string;
  timestamp: string;
  level: "error" | "warning" | "info";
  message: string;
  source: string;
  stackTrace: string;
}

interface ErrorLogsTableSectionProps {
  searchQuery: string;
}

export const ErrorLogsTableSection = ({
  searchQuery,
}: ErrorLogsTableSectionProps): JSX.Element => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 25;

  // TODO: Replace with actual API call
  const mockLogs: ErrorLog[] = [
    {
      id: "1",
      timestamp: "2024-03-20 10:30:45",
      level: "error",
      message: "Failed to process payment",
      source: "PaymentService",
      stackTrace:
        "Error: Payment processing failed\n at PaymentService.process",
    },
    {
      id: "2",
      timestamp: "2024-03-20 10:29:30",
      level: "warning",
      message: "High memory usage detected",
      source: "SystemMonitor",
      stackTrace: "Warning: Memory usage above 80%",
    },
  ];

  // Filter logs based on search query
  const filteredLogs = useMemo(() => {
    if (!searchQuery) return mockLogs;

    const query = searchQuery.toLowerCase();
    return mockLogs.filter((log) => {
      return (
        log.message.toLowerCase().includes(query) ||
        log.source.toLowerCase().includes(query) ||
        log.level.toLowerCase().includes(query)
      );
    });
  }, [mockLogs, searchQuery]);

  // Get current page logs
  const currentLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredLogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredLogs, currentPage]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);

  // Generate pagination items
  const paginationItems = useMemo(() => {
    const items = [];
    for (let i = 1; i <= totalPages; i++) {
      items.push(i);
    }
    return items;
  }, [totalPages]);

  const getLevelBadgeVariant = (level: ErrorLog["level"]) => {
    switch (level) {
      case "error":
        return "destructive";
      case "warning":
        return "warning";
      default:
        return "secondary";
    }
  };

  return (
    <section className="flex flex-col h-full">
      <div className="flex-grow overflow-auto pb-24">
        <div className="w-full">
          {false ? ( // Replace with actual loading state
            <Skeleton variant="table" />
          ) : false ? ( // Replace with actual error state
            <ErrorState
              message="Failed to fetch error logs"
              variant="inline"
              onRetry={() => window.location.reload()}
            />
          ) : currentLogs.length === 0 ? (
            <EmptyState
              icon={AlertTriangle}
              title="No Error Logs"
              description="No error logs found matching your criteria"
              actionLabel="Clear Search"
              onAction={() => window.location.reload()}
            />
          ) : (
            <Table>
              <TableHeader className="bg-1-tokens-color-modes-common-primary-brand-lower rounded-md">
                <TableRow>
                  <TableHead className="w-[200px] text-left text-[#1e2324] font-text-small">
                    Timestamp
                  </TableHead>
                  <TableHead className="w-[100px] text-left text-[#1e2324] font-text-small">
                    Level
                  </TableHead>
                  <TableHead className="w-[300px] text-left text-[#1e2324] font-text-small">
                    Message
                  </TableHead>
                  <TableHead className="w-[150px] text-left text-[#1e2324] font-text-small">
                    Source
                  </TableHead>
                  <TableHead className="flex-1 text-left text-[#1e2324] font-text-small">
                    Stack Trace
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentLogs.map((log) => (
                  <TableRow
                    key={log.id}
                    className="border-b border-primary-neutal-300 py-[var(--2-tokens-screen-modes-common-spacing-XS)]"
                  >
                    <TableCell className="w-[200px] text-left font-text-smaller text-coolgray-100">
                      {log.timestamp}
                    </TableCell>
                    <TableCell className="w-[100px]">
                      <Badge variant={getLevelBadgeVariant(log.level)}>
                        {log.level.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="w-[300px] text-left font-text-bold-smaller text-[color:var(--1-tokens-color-modes-input-primary-default-text)]">
                      {log.message}
                    </TableCell>
                    <TableCell className="w-[150px] text-left font-text-smaller text-black">
                      {log.source}
                    </TableCell>
                    <TableCell className="flex-1 text-left font-text-smaller text-black font-mono">
                      {log.stackTrace}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {currentLogs.length > 0 && (
        <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-primary-neutal-300 py-4">
          <div className="px-6 max-w-[calc(100%-2rem)]">
            <Pagination className="flex items-center justify-between w-full mx-auto">
              <PaginationPrevious
                href="#"
                className="h-[42px] bg-white rounded-lg shadow-1dp-ambient flex items-center gap-1 pl-2 pr-3 py-2.5 font-medium text-black text-[15px]"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <img
                  className="w-6 h-6"
                  alt="Arrow left"
                  src="/img/arrow-left-sm.svg"
                />
                Previous
              </PaginationPrevious>

              <PaginationContent className="flex items-center gap-3">
                {paginationItems.map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      className={`flex items-center justify-center w-9 h-9 rounded ${
                        page === currentPage
                          ? "bg-cyan-100 font-bold text-[#1e2324]"
                          : "border border-solid border-primary-neutal-300 font-medium text-[#023337]"
                      }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                {totalPages > 5 && (
                  <>
                    <PaginationEllipsis className="w-9 h-9 flex items-center justify-center rounded border border-solid border-primary-neutal-300 font-bold text-[#023337]" />
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        className="flex items-center justify-center w-9 h-9 rounded border border-solid border-primary-neutal-300 font-medium text-[#023337]"
                        onClick={() => setCurrentPage(totalPages)}
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}
              </PaginationContent>

              <PaginationNext
                href="#"
                className="h-[42px] bg-white rounded-lg shadow-1dp-ambient flex items-center gap-1 pl-3 pr-2 py-2.5 font-medium text-black text-[15px]"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
                <img
                  className="w-6 h-6 rotate-180"
                  alt="Arrow right"
                  src="/img/arrow-left-sm-1.svg"
                />
              </PaginationNext>
            </Pagination>
          </div>
        </div>
      )}
    </section>
  );
};
