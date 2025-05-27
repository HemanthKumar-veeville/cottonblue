import { Button } from "../../../components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "../../../components/Skeleton";
import EmptyState from "../../../components/EmptyState";
import ErrorState from "../../../components/ErrorState";
import { useDispatch } from "react-redux";
import { getAllOrders } from "../../../store/features/cartSlice";
import {
  Package,
  MoreVertical,
  Eye,
  ClipboardEdit,
  CheckCircle2,
} from "lucide-react";

import { Checkbox } from "../../../components/ui/checkbox";
import { useAppSelector } from "../../../store/store";
interface Order {
  order_id: number;
  store_id: number;
  store_name: string;
  store_address: string;
  created_at: string;
  order_status: string;
  order_items: Array<{
    product_id: number;
    product_name: string;
    product_image: string;
    product_price: number;
    quantity: number;
  }>;
}

interface WarehouseTableSectionProps {
  orders: Order[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
}

export const WarehouseTableSection = ({
  orders,
  loading,
  error,
  searchTerm,
}: WarehouseTableSectionProps): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const { selectedCompany } = useAppSelector((state) => state.client);
  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Filter orders based on search term
  const filteredOrders = orders?.filter(
    (order) =>
      order.order_id
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order?.store_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const itemsPerPage = 25;
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle checkbox selection
  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  // Handle select all orders on current page
  const handleSelectAllOrders = () => {
    const currentOrderIds = currentOrders.map((order) =>
      order.order_id.toString()
    );
    setSelectedOrders((prev) =>
      prev.length === currentOrderIds.length ? [] : currentOrderIds
    );
  };

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Generate pagination items
  const paginationItems = useMemo(() => {
    const items = [];
    for (let i = 1; i <= totalPages; i++) {
      items.push(i);
    }
    return items;
  }, [totalPages]);

  // Handle actions
  const handleViewDetails = (productId: number) => {
    navigate(`/warehouse/${productId}`);
    setActiveDropdown(null);
  };

  const handleEdit = (productId: number) => {
    navigate(`/warehouse/${productId}/edit`);
    setActiveDropdown(null);
  };

  const handleToggleActive = (productId: number, currentStatus: boolean) => {
    // TODO: Implement toggle active status
    console.log(
      "Toggle active status for product:",
      productId,
      "to:",
      !currentStatus
    );
    setActiveDropdown(null);
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset active dropdown when page changes
  useEffect(() => {
    setActiveDropdown(null);
  }, [currentPage]);

  // Toggle dropdown
  const handleToggleDropdown = (orderId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setActiveDropdown(activeDropdown === orderId ? null : orderId);
  };

  // Calculate dropdown position
  const getDropdownPosition = (buttonElement: HTMLButtonElement | null) => {
    if (!buttonElement) return {};
    const rect = buttonElement.getBoundingClientRect();
    return {
      top: `${rect.bottom + 8}px`,
      right: `${window.innerWidth - rect.right}px`,
    };
  };

  return (
    <section className="flex flex-col h-full">
      <div className="flex-grow overflow-auto pb-24">
        <div className="w-full">
          {loading ? (
            <Skeleton variant="table" />
          ) : error ? (
            <ErrorState
              message={error}
              variant="inline"
              onRetry={() => window.location.reload()}
            />
          ) : currentOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center">
              <EmptyState
                icon={Package}
                title={t("warehouse.noOrders")}
                description={
                  searchTerm
                    ? t("warehouse.noSearchResults")
                    : t("warehouse.emptyMessage")
                }
              />
              {searchTerm && (
                <Button
                  onClick={() => window.location.reload()}
                  className="mt-4"
                >
                  {t("warehouse.clearSearch")}
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-1-tokens-color-modes-common-primary-brand-lower rounded-md">
                <TableRow>
                  <TableHead className="w-[50px] text-left text-[#1e2324] font-text-small">
                    <Checkbox
                      checked={
                        currentOrders.length > 0 &&
                        currentOrders.every((order) =>
                          selectedOrders.includes(order.order_id.toString())
                        )
                      }
                      onCheckedChange={handleSelectAllOrders}
                      aria-label="Select all orders"
                    />
                  </TableHead>
                  <TableHead className="w-[100px] text-left text-[#1e2324] font-text-small">
                    {t("warehouse.columns.orderId")}
                  </TableHead>
                  <TableHead className="w-[120px] text-left text-[#1e2324] font-text-small">
                    {t("warehouse.columns.date")}
                  </TableHead>
                  <TableHead className="w-[200px] text-left text-[#1e2324] font-text-small">
                    {t("warehouse.columns.store")}
                  </TableHead>
                  <TableHead className="w-[100px] text-center text-[#1e2324] font-text-small">
                    {t("warehouse.columns.status")}
                  </TableHead>
                  <TableHead className="w-[100px] text-center text-[#1e2324] font-text-small">
                    {t("warehouse.columns.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentOrders.map((order) => (
                  <TableRow
                    key={order.order_id}
                    className="border-b border-primary-neutal-300 py-[var(--2-tokens-screen-modes-common-spacing-XS)]"
                  >
                    <TableCell className="w-[50px] text-left">
                      <Checkbox
                        checked={selectedOrders.includes(
                          order.order_id.toString()
                        )}
                        onCheckedChange={() =>
                          handleSelectOrder(order.order_id.toString())
                        }
                        aria-label={`Select order ${order.order_id}`}
                      />
                    </TableCell>
                    <TableCell className="w-[100px] text-left font-text-smaller text-coolgray-100">
                      {order.order_id}
                    </TableCell>
                    <TableCell className="w-[120px] text-left font-text-smaller text-[color:var(--1-tokens-color-modes-input-primary-default-text)]">
                      {new Date(order.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="w-[200px] text-left font-text-bold-smaller text-[color:var(--1-tokens-color-modes-input-primary-default-text)]">
                      <button
                        onClick={() => {
                          dispatch(
                            getAllOrders({
                              dns_prefix: selectedCompany?.dns || "admin",
                              store_id: order.store_id.toString(),
                            })
                          );
                        }}
                        className="hover:underline focus:outline-none"
                      >
                        {order.store_name}
                      </button>
                    </TableCell>
                    <TableCell className="w-[100px] text-center">
                      <span
                        className={`font-medium ${
                          order.order_status === "confirmed"
                            ? "text-green-600"
                            : "text-orange-600"
                        }`}
                      >
                        {order.order_status}
                      </span>
                    </TableCell>
                    <TableCell className="w-[100px] text-center">
                      <div
                        className="relative inline-flex items-center"
                        ref={dropdownRef}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          ref={(el) =>
                            (buttonRefs.current[order.order_id.toString()] = el)
                          }
                          className={`h-8 w-8 hover:bg-gray-100 rounded-full transition-colors duration-200 ${
                            activeDropdown === order.order_id.toString()
                              ? "bg-gray-100"
                              : ""
                          }`}
                          onClick={(e) =>
                            handleToggleDropdown(order.order_id.toString(), e)
                          }
                          aria-expanded={
                            activeDropdown === order.order_id.toString()
                          }
                          aria-haspopup="true"
                          aria-label={t("warehouse.actions.dropdown.open")}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>

                        {activeDropdown === order.order_id.toString() && (
                          <div
                            ref={menuRef}
                            className="fixed w-44 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-[9999] transform opacity-100 scale-100 transition-all duration-200 ease-out origin-top-right"
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="actions-menu"
                            style={{
                              position: "fixed",
                              zIndex: 9999,
                              ...getDropdownPosition(
                                buttonRefs.current[order.order_id.toString()]
                              ),
                            }}
                          >
                            <div className="py-1 divide-y divide-gray-100">
                              <button
                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 group"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewDetails(
                                    order.order_items[0].product_id
                                  );
                                }}
                                role="menuitem"
                              >
                                <Eye className="mr-3 h-4 w-4 text-gray-400 group-hover:text-primary-600" />
                                <span className="font-medium">
                                  {t("warehouse.actions.dropdown.view")}
                                </span>
                              </button>
                              <button
                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 group"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(order.order_items[0].product_id);
                                }}
                                role="menuitem"
                              >
                                <ClipboardEdit className="mr-3 h-4 w-4 text-gray-400 group-hover:text-primary-600" />
                                <span className="font-medium">
                                  {t("warehouse.actions.dropdown.edit")}
                                </span>
                              </button>
                              <button
                                className={`flex items-center w-full px-4 py-3 text-sm transition-colors duration-150 group ${
                                  order.order_status === "confirmed"
                                    ? "text-blue-600 hover:bg-blue-50"
                                    : "text-green-600 hover:bg-green-50"
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleActive(
                                    order.order_items[0].product_id,
                                    order.order_status === "confirmed"
                                  );
                                }}
                                role="menuitem"
                              >
                                <CheckCircle2
                                  className={`mr-3 h-4 w-4 ${
                                    order.order_status === "confirmed"
                                      ? "text-blue-400 group-hover:text-blue-600"
                                      : "text-green-400 group-hover:text-green-600"
                                  }`}
                                />
                                <span className="font-medium">
                                  {order.order_status === "confirmed"
                                    ? t("warehouse.actions.dropdown.prepare")
                                    : t("warehouse.actions.dropdown.complete")}
                                </span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {!loading && !error && filteredOrders.length > 0 && (
        <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-primary-neutal-300 py-4">
          <div className="px-6 max-w-[calc(100%-2rem)]">
            <Pagination className="flex items-center justify-between w-full mx-auto">
              <PaginationPrevious
                href="#"
                className={`h-[42px] bg-white rounded-lg shadow-1dp-ambient flex items-center gap-1 pl-2 pr-3 py-2.5 font-medium ${
                  currentPage === 1 || totalPages === 1
                    ? "text-gray-400 cursor-not-allowed hover:text-gray-400"
                    : "text-black hover:text-black"
                }`}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1 || totalPages === 1}
              >
                <img
                  className={`w-6 h-6 ${
                    currentPage === 1 || totalPages === 1 ? "opacity-50" : ""
                  }`}
                  alt="Arrow left"
                  src="/img/arrow-left-sm.svg"
                />
                {t("warehouse.pagination.previous")}
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
                className={`h-[42px] bg-white rounded-lg shadow-1dp-ambient flex items-center gap-1 pl-3 pr-2 py-2.5 font-medium ${
                  currentPage === totalPages || totalPages === 1
                    ? "text-gray-400 cursor-not-allowed hover:text-gray-400"
                    : "text-black hover:text-black"
                }`}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages || totalPages === 1}
              >
                {t("warehouse.pagination.next")}
                <img
                  className={`w-6 h-6 rotate-180 ${
                    currentPage === totalPages || totalPages === 1
                      ? "opacity-50"
                      : ""
                  }`}
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
