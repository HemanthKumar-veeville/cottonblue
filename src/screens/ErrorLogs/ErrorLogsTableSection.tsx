import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { getErrorLogs } from "../../store/features/authSlice";
import { RootState } from "../../store/store";
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
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";

interface ErrorLog {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  method: string;
  endpoint: string;
  data: string;
  error_code: number;
  error_message: string;
  created_at: string;
}

interface ErrorLogsTableSectionProps {
  searchQuery: string;
}

export const ErrorLogsTableSection = ({
  searchQuery,
}: ErrorLogsTableSectionProps): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const ITEMS_PER_PAGE = 25;

  const {
    errorLogs,
    errorLogsLoading: isLoading,
    error,
  } = useSelector((state: RootState) => ({
    errorLogs: state.auth.errorLogs?.logs || [],
    errorLogsLoading: state.auth.errorLogsLoading,
    error: state.auth.error,
  }));

  useEffect(() => {
    dispatch(getErrorLogs());
  }, [dispatch]);

  // Reset pagination when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const toggleRowExpansion = (id: number) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  // Filter logs based on search query
  const filteredLogs = useMemo(() => {
    if (!searchQuery) return errorLogs;

    const query = searchQuery.toLowerCase();
    return errorLogs.filter((log) => {
      return (
        log.error_message.toLowerCase().includes(query) ||
        log.endpoint.toLowerCase().includes(query) ||
        log.method.toLowerCase().includes(query) ||
        log.user_email.toLowerCase().includes(query) ||
        log.user_name.toLowerCase().includes(query)
      );
    });
  }, [errorLogs, searchQuery]);

  // Get current page logs
  const currentLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredLogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredLogs, currentPage]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);

  // Generate visible pagination items with smart ellipsis
  const getVisiblePages = useMemo(() => {
    const delta = 2; // Number of pages to show before and after current page
    const range: (number | string)[] = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || // Always show first page
        i === totalPages || // Always show last page
        (i >= currentPage - delta && i <= currentPage + delta) // Show pages around current page
      ) {
        range.push(i);
      } else if (range[range.length - 1] !== "...") {
        range.push("...");
      }
    }

    return range;
  }, [currentPage, totalPages]);

  const formatErrorMessage = (message: string) => {
    try {
      const parsed = JSON.parse(message);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return message;
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy HH:mm:ss");
    } catch {
      return dateString;
    }
  };

  const getLevelBadgeVariant = (errorCode: number) => {
    if (errorCode >= 500) return "inactive";
    return "active";
  };

  return (
    <section className="flex flex-col h-full">
      <div className="flex-grow overflow-auto pb-24">
        <div className="w-full">
          {isLoading ? (
            <Skeleton variant="table" />
          ) : error ? (
            <ErrorState
              message="Failed to fetch error logs"
              variant="inline"
              onRetry={() => dispatch(getErrorLogs())}
            />
          ) : currentLogs.length === 0 ? (
            <EmptyState
              icon={AlertTriangle}
              title="No Error Logs"
              description="No error logs found matching your criteria"
            />
          ) : (
            <Table>
              <TableHeader className="bg-1-tokens-color-modes-common-primary-brand-lower rounded-md">
                <TableRow>
                  <TableHead className="w-[40px]"></TableHead>
                  <TableHead className="w-[160px] text-left text-[#1e2324] font-text-small">
                    Timestamp
                  </TableHead>
                  <TableHead className="w-[100px] text-left text-[#1e2324] font-text-small">
                    Method
                  </TableHead>
                  <TableHead className="w-[200px] text-left text-[#1e2324] font-text-small">
                    User
                  </TableHead>
                  <TableHead className="w-[300px] text-left text-[#1e2324] font-text-small">
                    Error Message
                  </TableHead>
                  <TableHead className="flex-1 text-left text-[#1e2324] font-text-small">
                    Endpoint
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentLogs.map((log) => (
                  <>
                    <TableRow
                      key={log.id}
                      className="border-b border-primary-neutal-300 py-[var(--2-tokens-screen-modes-common-spacing-XS)] cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleRowExpansion(log.id)}
                    >
                      <TableCell className="w-[40px] text-center">
                        {expandedRows.includes(log.id) ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </TableCell>
                      <TableCell className="w-[160px] text-left font-text-smaller text-coolgray-100">
                        <div className="flex flex-col">
                          <span>{formatDateTime(log.created_at)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="w-[100px]">
                        <Badge variant={getLevelBadgeVariant(log.error_code)}>
                          {log.method}
                        </Badge>
                      </TableCell>
                      <TableCell className="w-[200px] text-left font-text-smaller">
                        <div className="flex flex-col">
                          <span className="font-medium">{log.user_name}</span>
                          <span className="text-gray-500 text-xs">
                            {log.user_email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="w-[300px] text-left font-text-bold-smaller text-[color:var(--1-tokens-color-modes-input-primary-default-text)]">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              log.error_code >= 500 ? "inactive" : "active"
                            }
                          >
                            {log.error_code}
                          </Badge>
                          <span
                            className="truncate"
                            title={formatErrorMessage(log.error_message)}
                          >
                            {formatErrorMessage(log.error_message)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="flex-1 text-left font-text-smaller text-black font-mono">
                        {log.endpoint}
                      </TableCell>
                    </TableRow>
                    {expandedRows.includes(log.id) && (
                      <TableRow>
                        <TableCell colSpan={6} className="bg-gray-50 px-6 py-4">
                          <div className="flex flex-col gap-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 mb-1">
                                Error Details
                              </h4>
                              <pre className="text-sm bg-gray-100 p-3 rounded-md overflow-x-auto max-w-[80vw] whitespace-pre-wrap">
                                {formatErrorMessage(log.error_message)}
                              </pre>
                            </div>
                            {log.data && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-1">
                                  Request Data
                                </h4>
                                <pre className="text-sm bg-gray-100 p-3 rounded-md overflow-x-auto max-w-[80vw] whitespace-pre-wrap">
                                  {formatErrorMessage(log.data)}
                                </pre>
                              </div>
                            )}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="font-medium text-gray-900">
                                  User Information
                                </p>
                                <p className="text-gray-600">
                                  ID: {log.user_id}
                                </p>
                                <p className="text-gray-600">
                                  Name: {log.user_name}
                                </p>
                                <p className="text-gray-600">
                                  Email: {log.user_email}
                                </p>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  Request Information
                                </p>
                                <p className="text-gray-600">
                                  Method: {log.method}
                                </p>
                                <p className="text-gray-600">
                                  Endpoint: {log.endpoint}
                                </p>
                                <p className="text-gray-600">
                                  Error Code: {log.error_code}
                                </p>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {currentLogs.length > 0 && (
        <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-primary-neutal-300 py-4">
          <div className="px-6 max-w-[calc(100%-2rem)]">
            <Pagination
              className="flex items-center justify-between w-full mx-auto"
              aria-label="Pagination navigation"
            >
              <PaginationPrevious
                href="#"
                className="h-[42px] bg-white rounded-lg shadow-1dp-ambient flex items-center gap-1 pl-2 pr-3 py-2.5 font-medium text-black text-[15px]"
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault();
                  setCurrentPage((prev) => Math.max(1, prev - 1));
                }}
                disabled={currentPage === 1}
                aria-label="Go to previous page"
              >
                <img
                  className="w-6 h-6"
                  alt="Arrow left"
                  src="/img/arrow-left-sm.svg"
                />
                Previous
              </PaginationPrevious>

              <PaginationContent className="flex items-center gap-3">
                {getVisiblePages.map((page, index) =>
                  page === "..." ? (
                    <PaginationEllipsis
                      key={`ellipsis-${index}`}
                      className="w-9 h-9 flex items-center justify-center rounded border border-solid border-primary-neutal-300 font-bold text-[#023337]"
                      aria-hidden="true"
                    />
                  ) : (
                    <PaginationItem key={`page-${page}`}>
                      <PaginationLink
                        href="#"
                        className={`flex items-center justify-center w-9 h-9 rounded ${
                          page === currentPage
                            ? "bg-cyan-100 font-bold text-[#1e2324]"
                            : "border border-solid border-primary-neutal-300 font-medium text-[#023337]"
                        }`}
                        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                          e.preventDefault();
                          setCurrentPage(page as number);
                        }}
                        aria-label={`Go to page ${page}`}
                        aria-current={page === currentPage ? "page" : undefined}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
              </PaginationContent>

              <PaginationNext
                href="#"
                className="h-[42px] bg-white rounded-lg shadow-1dp-ambient flex items-center gap-1 pl-3 pr-2 py-2.5 font-medium text-black text-[15px]"
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault();
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1));
                }}
                disabled={currentPage === totalPages}
                aria-label="Go to next page"
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
