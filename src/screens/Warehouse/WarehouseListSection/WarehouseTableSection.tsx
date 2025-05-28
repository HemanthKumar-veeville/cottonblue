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
import { PopupOrder } from "../../../components/WareHousePopup/WareHousePopup";
import {
  Package,
  MoreVertical,
  Eye,
  ClipboardEdit,
  CheckCircle2,
  XIcon,
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
  company_dns_prefix?: string;
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
  onStoreClick: (storeId: string, storeName: string) => void;
  onStatusClick: (status: string | null) => void;
  activeStoreFilter: { id: string; name: string } | null;
  activeStatusFilter: string | null;
  onSelectedOrdersChange: (orderIds: string[]) => void;
  onSearchChange: (term: string) => void;
}

export const WarehouseTableSection = ({
  orders,
  loading,
  error,
  searchTerm,
  onStoreClick,
  onStatusClick,
  activeStoreFilter,
  activeStatusFilter,
  onSelectedOrdersChange,
  onSearchChange,
}: WarehouseTableSectionProps): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const { selectedCompany } = useAppSelector((state) => state.client);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeStatusFilter]);

  // Filter orders based on search term and status
  const filteredOrders = orders?.filter((order) => {
    const matchesSearch =
      order.order_id
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order?.store_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      !activeStatusFilter || order.order_status === activeStatusFilter;

    return matchesSearch && matchesStatus;
  });

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
  const handleSelectOrder = (orderId: number) => {
    const orderIdStr = orderId.toString();
    const newSelectedOrders = selectedOrders.includes(orderIdStr)
      ? selectedOrders.filter((id) => id !== orderIdStr)
      : [...selectedOrders, orderIdStr];

    setSelectedOrders(newSelectedOrders);
    onSelectedOrdersChange(newSelectedOrders);
  };

  // Handle select all orders on current page
  const handleSelectAllOrders = () => {
    const currentOrderIds = currentOrders.map((order) =>
      order.order_id.toString()
    );

    // If all current page orders are selected, unselect them
    const allCurrentSelected = currentOrderIds.every((id) =>
      selectedOrders.includes(id)
    );

    let newSelectedOrders: string[];
    if (allCurrentSelected) {
      // Remove current page orders from selection
      newSelectedOrders = selectedOrders.filter(
        (id) => !currentOrderIds.includes(id)
      );
    } else {
      // Add all current page orders that aren't already selected
      const existingSelections = selectedOrders.filter(
        (id) => !currentOrderIds.includes(id)
      );
      newSelectedOrders = [...existingSelections, ...currentOrderIds];
    }

    setSelectedOrders(newSelectedOrders);
    onSelectedOrdersChange(newSelectedOrders);
  };

  // Handle status click
  const handleStatusClick = (status: string) => {
    onStatusClick(status);
    setSelectedOrders([]); // Clear selections when filter changes
    onSelectedOrdersChange([]);
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

  // Update the view details handler to show popup
  const handleViewDetails = (orderId: number) => {
    setSelectedOrderId(orderId);
    setIsPopupOpen(true);
  };

  // Update the clear filters button click handler
  const clearFilters = () => {
    onStatusClick(null);
    onSearchChange("");
  };

  // Handle closing the popup
  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedOrderId(null);
  };

  return (
    <>
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
                    searchTerm || activeStatusFilter
                      ? t("warehouse.noSearchResults")
                      : t("warehouse.emptyMessage")
                  }
                />
                {(searchTerm || activeStatusFilter) && (
                  <Button onClick={clearFilters} className="mt-4">
                    {t("warehouse.clearSearch")}
                  </Button>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-1-tokens-color-modes-common-primary-brand-lower rounded-md">
                  <TableRow>
                    <TableHead className="w-[48px] px-4 py-3 text-left text-[#1e2324] font-text-small">
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
                    <TableHead className="w-[120px] px-4 py-3 text-left text-[#1e2324] font-text-small">
                      {t("warehouse.columns.orderId")}
                    </TableHead>
                    <TableHead className="w-[140px] px-4 py-3 text-left text-[#1e2324] font-text-small">
                      {t("warehouse.columns.date")}
                    </TableHead>
                    <TableHead className="w-[280px] px-4 py-3 text-left text-[#1e2324] font-text-small">
                      {t("warehouse.columns.store")}
                    </TableHead>
                    <TableHead className="w-[120px] px-4 py-3 text-center text-[#1e2324] font-text-small">
                      {t("warehouse.columns.status")}
                    </TableHead>
                    <TableHead className="w-[160px] px-4 py-3 text-center text-[#1e2324] font-text-small">
                      {t("warehouse.columns.actions")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentOrders.map((order) => (
                    <TableRow
                      key={order.order_id}
                      className="border-b border-primary-neutal-300 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <TableCell className="w-[48px] px-4 py-3 text-left">
                        <Checkbox
                          checked={selectedOrders.includes(
                            order.order_id.toString()
                          )}
                          onCheckedChange={() =>
                            handleSelectOrder(order.order_id)
                          }
                          aria-label={`Select order ${order.order_id}`}
                        />
                      </TableCell>
                      <TableCell className="w-[120px] px-4 py-3 text-left">
                        <button
                          onClick={() => handleViewDetails(order.order_id)}
                          className="text-primary-600 hover:underline focus:outline-none font-medium"
                        >
                          #{order.order_id}
                        </button>
                      </TableCell>
                      <TableCell className="w-[140px] px-4 py-3 text-left text-gray-600">
                        {new Date(order.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="w-[280px] px-4 py-3 text-left">
                        {activeStoreFilter ? (
                          <span className="text-gray-900 font-medium">
                            {activeStoreFilter.name}
                          </span>
                        ) : (
                          <button
                            onClick={() =>
                              onStoreClick(
                                order.store_id.toString(),
                                order.store_name,
                                order.company_dns_prefix
                              )
                            }
                            className="text-primary-600 hover:underline focus:outline-none font-medium"
                          >
                            {order.store_name}
                          </button>
                        )}
                      </TableCell>
                      <TableCell className="w-[120px] px-4 py-3">
                        <div className="flex justify-center">
                          <button
                            onClick={() =>
                              handleStatusClick(order.order_status)
                            }
                            className={`inline-flex px-2.5 py-1 rounded-full text-sm font-medium transition-colors duration-150 ${
                              order.order_status === "shipped"
                                ? activeStatusFilter === "shipped"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                                : order.order_status === "confirmed"
                                ? activeStatusFilter === "confirmed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-green-50 text-green-700 hover:bg-green-100"
                                : activeStatusFilter === order.order_status
                                ? "bg-orange-100 text-orange-800"
                                : "bg-orange-50 text-orange-700 hover:bg-orange-100"
                            } cursor-pointer`}
                          >
                            {order.order_status}
                          </button>
                        </div>
                      </TableCell>
                      <TableCell className="w-[160px] px-4 py-3">
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleViewDetails(order.order_id)}
                            className="inline-flex items-center gap-2 px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="text-sm font-medium hover:underline whitespace-nowrap">
                              {t("warehouse.actions.viewDetails")}
                            </span>
                          </button>
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
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
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

      {selectedOrderId && (
        <PopupOrder
          orderId={selectedOrderId}
          onClose={handleClosePopup}
          open={isPopupOpen}
        />
      )}
    </>
  );
};
