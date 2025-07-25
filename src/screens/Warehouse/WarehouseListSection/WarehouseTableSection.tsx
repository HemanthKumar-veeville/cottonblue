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
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "../../../components/Skeleton";
import EmptyState from "../../../components/EmptyState";
import ErrorState from "../../../components/ErrorState";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders } from "../../../store/features/cartSlice";
import { PopupOrder } from "../../../components/WareHousePopup/WareHousePopup";
import {
  Package,
  MoreVertical,
  Eye,
  ClipboardEdit,
  CheckCircle2,
  XIcon,
  ShoppingBag,
} from "lucide-react";

import { Checkbox } from "../../../components/ui/checkbox";
import { useAppSelector } from "../../../store/store";
import { TFunction } from "i18next";
import {
  getOrderStatusColor,
  getOrderStatusText,
} from "../../../utils/statusUtil";
import { StatusText } from "../../../components/ui/status-text";
import { StatusIcon } from "../../../components/ui/status-icon";
import { RootState } from "../../../store/store";
import { formatDateToParis } from "../../../utils/dateUtils";

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
  onStoreClick: (
    storeId: string,
    storeName: string,
    dnsPrefix: string,
    status: string
  ) => void;
  onStatusClick: (status: string | null) => void;
  activeStoreFilter: { id: string; name: string } | null;
  activeStatusFilter: string | null;
  onSelectedOrdersChange: (orderIds: number[]) => void;
  onSearchChange: (term: string) => void;
  selectedOrders: number[];
  setSelectedOrders: (orders: number[]) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
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
  selectedOrders,
  setSelectedOrders,
  currentPage,
  setCurrentPage,
  itemsPerPage,
}: WarehouseTableSectionProps): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const { store_address } = useAppSelector((state) => state.cart);
  const total = useSelector((state: RootState) => state.cart.totalOrders);
  const totalPages = Math.ceil(total / itemsPerPage);

  // Generate pagination items
  const getPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push({ page: i, active: i === currentPage });
    }

    return items;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Handle checkbox selection
  const handleSelectOrder = (orderId: number) => {
    const newSelectedOrders = selectedOrders.includes(orderId)
      ? selectedOrders.filter((id) => id !== orderId)
      : [...selectedOrders, orderId];

    setSelectedOrders(newSelectedOrders);
    onSelectedOrdersChange(newSelectedOrders);
  };

  // Handle select all orders on current page
  const handleSelectAllOrders = () => {
    const currentOrderIds = orders.map((order) => order.order_id);

    // If all current page orders are selected, unselect them
    const allCurrentSelected = currentOrderIds.every((id) =>
      selectedOrders.includes(id)
    );

    let newSelectedOrders: number[];
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

  // Update the view details handler to show popup
  const handleViewDetails = (orderId: number) => {
    setSelectedOrderId(orderId);
    setIsPopupOpen(true);
  };

  // Handle closing the popup
  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedOrderId(null);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-auto pb-24">
        {loading ? (
          <Skeleton variant="table" />
        ) : error ? (
          <ErrorState
            title={t("common.error")}
            description={t("common.errorDescription")}
          />
        ) : orders.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title={t("warehouse.empty.title")}
            description={
              searchTerm
                ? t("warehouse.empty.searchDescription")
                : t("warehouse.empty.description")
            }
          />
        ) : (
          <Table>
            <TableHeader className="bg-1-tokens-color-modes-common-primary-brand-lower rounded-md">
              <TableRow>
                <TableHead className="w-[48px] px-4 py-3 text-left text-[#1e2324] font-text-small">
                  <span className="text-primary-600 font-medium text-center">
                    #
                  </span>
                </TableHead>
                <TableHead className="w-[120px] px-4 py-3 text-left text-[#1e2324] font-text-small">
                  {t("warehouse.columns.orderId")}
                </TableHead>
                <TableHead className="w-[140px] px-4 py-3 text-left text-[#1e2324] font-text-small">
                  {t("warehouse.columns.date")}
                </TableHead>
                <TableHead className="w-[140px] px-4 py-3 text-left text-[#1e2324] font-text-small">
                  {t("warehouse.columns.store")}
                </TableHead>
                <TableHead className="w-[280px] px-4 py-3 text-left text-[#1e2324] font-text-small">
                  {t("warehouse.columns.address")}
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
              {orders.map((order, index) => (
                <TableRow
                  key={order.order_id}
                  className="border-b border-primary-neutal-300 hover:bg-gray-50 transition-colors duration-150"
                >
                  <TableCell className="w-[48px] px-4 py-3 text-left">
                    <span className="text-primary-600 font-medium text-center">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </span>
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
                    {formatDateToParis(order?.created_at)}
                  </TableCell>
                  <TableCell className="w-[140px] px-4 py-3 text-left">
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
                            order.company_dns_prefix || "",
                            order.order_status
                          )
                        }
                        className="text-primary-600 hover:underline focus:outline-none font-medium"
                      >
                        {order.store_name}
                      </button>
                    )}
                  </TableCell>
                  <TableCell className="w-[280px] px-4 py-3 text-left whitespace-normal">
                    {order?.store_address || store_address}
                  </TableCell>
                  <TableCell className="w-[120px] px-4 py-3">
                    <div className="flex justify-center">
                      <button
                        onClick={() => handleStatusClick(order.order_status)}
                        className={`inline-flex px-2.5 py-1 rounded-full text-sm font-medium transition-colors duration-150 ${getOrderStatusColor(
                          order.order_status
                        )} cursor-pointer`}
                      >
                        <div className="flex items-center gap-2">
                          <StatusIcon status={order?.order_status} />
                          <StatusText status={order?.order_status} />
                        </div>
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

      {!loading && !error && orders.length > 0 && (
        <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-primary-neutal-300 py-4">
          <div className="px-6 max-w-[calc(100%-2rem)]">
            <Pagination className="flex items-center justify-between w-full mx-auto">
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(currentPage - 1);
                }}
                className={`h-[42px] bg-white rounded-lg shadow-1dp-ambient flex items-center gap-1 pl-2 pr-3 py-2.5 font-medium text-black text-[15px] ${
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <img
                  className="w-6 h-6"
                  alt="Arrow left"
                  src="/img/arrow-left-sm.svg"
                />
                {t("common.previous")}
              </PaginationPrevious>

              <PaginationContent className="flex items-center gap-3">
                {getPaginationItems().map((item) => (
                  <PaginationItem key={item.page}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(item.page);
                      }}
                      className={`flex items-center justify-center w-9 h-9 rounded ${
                        item.active
                          ? "bg-cyan-100 font-bold text-[#1e2324]"
                          : "border border-solid border-primary-neutal-300 font-medium text-[#023337]"
                      }`}
                    >
                      {item.page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                {totalPages >
                  getPaginationItems()[getPaginationItems().length - 1]
                    ?.page && (
                  <>
                    <PaginationEllipsis className="w-9 h-9 flex items-center justify-center rounded border border-solid border-primary-neutal-300 font-bold text-[#023337]" />
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(totalPages);
                        }}
                        className="flex items-center justify-center w-9 h-9 rounded border border-solid border-primary-neutal-300 font-medium text-[#023337]"
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}
              </PaginationContent>

              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(currentPage + 1);
                }}
                className={`h-[42px] bg-white rounded-lg shadow-1dp-ambient flex items-center gap-1 pl-3 pr-2 py-2.5 font-medium text-black text-[15px] ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {t("common.next")}
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
      {/* Popup Order */}
      {selectedOrderId && (
        <PopupOrder
          orderId={selectedOrderId}
          onClose={handleClosePopup}
          open={isPopupOpen}
          isLoading={loading}
        />
      )}
    </div>
  );
};
