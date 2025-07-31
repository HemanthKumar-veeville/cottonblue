import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { StatusIcon } from "../../components/ui/status-icon";
import { FileText, ShoppingBag } from "lucide-react";
import { handleDownloadInvoice } from "../../utils/pdfUtil";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Skeleton } from "../../components/Skeleton";
import EmptyState from "../../components/EmptyState";
import { StatusText } from "../../components/ui/status-text";
import { useCompanyColors } from "../../hooks/useCompanyColors";
import { useAppSelector } from "../../store/store";
import { formatDateToParis } from "../../utils/dateUtils";

interface OrderItem {
  product_id: number;
  product_name: string;
  product_image: string;
  product_price: number;
  quantity: number;
}

interface Order {
  order_id: number;
  created_at: string;
  total_amount: number;
  order_status:
    | "all"
    | "approval_pending"
    | "pending"
    | "approved"
    | "rejected"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "sedis_rejected"
    | "default";
  order_items: OrderItem[];
}

const OrderRow = ({
  order,
  index,
  isSelected,
  onSelect,
  activeTab,
  currentPage,
  itemsPerPage,
}: {
  order: Order;
  index: number;
  isSelected: boolean;
  onSelect: (orderId: number) => void;
  activeTab: "all" | "selected";
  currentPage: number;
  itemsPerPage: number;
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Format date
  const formattedDate = order?.created_at
    ? formatDateToParis(order?.created_at)
    : "";

  const {
    store_name,
    store_address,
    company_name,
    company_phone,
    company_email,
    vat_number,
  } = useAppSelector((state) => state.cart);
  console.log({ activeTab });
  return (
    <TableRow key={index} className="border-b border-primary-neutal-300">
      <TableCell className="py-3 px-2 w-[5%] align-middle">
        <span className="font-text-small text-[#1e2324] text-[length:var(--text-small-font-size)] tracking-[var(--text-small-letter-spacing)] leading-[var(--text-small-line-height)] px-2">
          {(currentPage - 1) * itemsPerPage + index + 1}
        </span>
      </TableCell>
      <TableCell className="p-2.5 w-[15%] text-left align-middle">
        <span
          className={`font-normal ${
            index === 0 ? "text-coolgray-100" : "text-[#121619]"
          } text-[15px] tracking-[0] leading-normal whitespace-nowrap`}
        >
          {order?.order_id}
        </span>
      </TableCell>
      <TableCell className="p-2.5 w-[15%] text-left align-middle">
        <span
          className={`font-normal ${
            index === 0 ? "text-coolgray-100" : "text-[#121619]"
          } text-[15px] tracking-[0] leading-normal whitespace-nowrap`}
        >
          {order?.reference}
        </span>
      </TableCell>
      {activeTab === "all" && (
        <TableCell className="p-2.5 w-[15%] text-left align-middle">
          <span className="font-normal text-black text-[15px] tracking-[0] leading-normal whitespace-nowrap">
            {order?.store_name}
          </span>
        </TableCell>
      )}
      <TableCell className="p-2.5 w-[15%] text-left align-middle">
        <span className="font-normal text-black text-[15px] tracking-[0] leading-normal whitespace-nowrap">
          {formattedDate}
        </span>
      </TableCell>
      <TableCell className="p-2.5 w-[15%] text-left align-middle">
        <span className="font-normal text-black text-[15px] tracking-[0] leading-normal whitespace-nowrap">
          {order?.total_amount}€
        </span>
      </TableCell>
      <TableCell className="p-2.5 w-[20%] align-middle">
        <div className="flex items-center gap-2">
          <StatusIcon status={order?.order_status} />
          <StatusText status={order?.order_status} />
        </div>
      </TableCell>
      <TableCell className="p-2.5 w-[5%] text-left align-middle">
        <FileText
          className="inline-block w-4 h-4 text-[#07515f] cursor-pointer hover:text-[#023337] transition-colors"
          onClick={() =>
            handleDownloadInvoice(
              {
                store_name: store_name,
                store_address: store_address,
                ordered_user: {
                  email: company_email,
                  phone: company_phone,
                  name: company_name,
                },
                order_id: order?.order_id,
                created_at: order?.created_at,
                order_items: order?.order_items,
              },
              "#07505e",
              "#ffffff",
              "Cotton Blue",
              "121 Rue du 8 Mai 1945, Villeneuve-d'Ascq - 59650",
              vat_number,
              "contact@cotton-blue.com",
              "03 20 41 09 09"
            )
          }
        />
      </TableCell>
      <TableCell className="p-2.5 w-[10%] text-right align-middle">
        <Button
          variant="ghost"
          className="p-0 underline font-medium text-[color:var(--1-tokens-color-modes-button-ghost-default-text)]"
          onClick={() => navigate(`/order-details/${order?.order_id}`)}
        >
          {t("history.table.details")}
        </Button>
      </TableCell>
    </TableRow>
  );
};

export const OrderDetailsSection = ({
  currentPage,
  itemsPerPage,
  setCurrentPage,
  activeTab,
}: {
  currentPage: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
  activeTab: "all" | "selected";
}): JSX.Element => {
  const { t } = useTranslation();

  const orders = useSelector((state: any) => state.cart.orders);
  const totalOrders = useSelector((state: any) => state.cart.totalOrders);
  const loading = useSelector((state: any) => state.cart.loading);
  const error = useSelector((state: any) => state.cart.error);
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const { buttonStyles } = useCompanyColors();
  const orderList = orders || [];
  const totalPages = Math.ceil(totalOrders / itemsPerPage);

  // Remove client-side pagination since we're getting paginated data from API
  const currentOrders = orderList;
  console.log({ currentPage, totalPages });

  // Generate pagination items
  const generatePaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    let startPage = 1;
    let endPage = totalPages;

    if (totalPages > maxVisiblePages) {
      const leftOffset = Math.floor(maxVisiblePages / 2);
      const rightOffset = maxVisiblePages - leftOffset - 1;

      if (currentPage <= leftOffset) {
        endPage = maxVisiblePages;
      } else if (currentPage > totalPages - rightOffset) {
        startPage = totalPages - maxVisiblePages + 1;
      } else {
        startPage = currentPage - leftOffset;
        endPage = currentPage + rightOffset;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push({ page: i, active: i === currentPage });
    }

    return items;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Reset selected orders when changing pages
      setSelectedOrders([]);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(currentOrders.map((order: Order) => order.order_id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId: number) => {
    setSelectedOrders((prev) => {
      if (prev.includes(orderId)) {
        return prev.filter((id) => id !== orderId);
      } else {
        return [...prev, orderId];
      }
    });
  };

  if (loading) {
    return <Skeleton variant="table" />;
  }

  if (!orderList.length) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        <EmptyState
          icon={ShoppingBag}
          title={t("history.empty.title") || "No Orders Yet"}
          description={
            t("history.empty.description") ||
            "You haven't placed any orders yet. Start shopping to see your order history here."
          }
          className="max-w-md"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" style={buttonStyles}>
      <div className="flex-grow overflow-auto pb-24">
        <Table className="bg-white rounded-[var(--2-tokens-screen-modes-common-spacing-XS)]">
          <TableHeader
            className="bg-[var(--primary-light-color)] rounded-md"
            style={buttonStyles}
          >
            <TableRow>
              <TableHead className="p-2.5 w-[5%] align-middle">
                <span className="font-text-small text-[#1e2324] text-[length:var(--text-small-font-size)] tracking-[var(--text-small-letter-spacing)] leading-[var(--text-small-line-height)] px-1">
                  #
                </span>
              </TableHead>
              {[
                { key: "order", width: "15%" },
                { key: "reference", width: "15%" },

                ...(activeTab === "all"
                  ? [{ key: "store", width: "15%" }]
                  : []),
                { key: "date", width: "15%" },
                { key: "totalPrice", width: "15%" },
                { key: "status", width: "20%" },
                { key: "invoice", width: "5%" },
                { key: "details", width: "10%" },
              ].map((header, index) => (
                <TableHead
                  key={index}
                  className={`p-2.5 w-[${header.width}] ${
                    header.key === "details" ? "text-right" : "text-left"
                  } align-middle`}
                >
                  <span className="font-text-small text-[#1e2324] text-[length:var(--text-small-font-size)] tracking-[var(--text-small-letter-spacing)] leading-[var(--text-small-line-height)]">
                    {t(`history.table.${header.key}`)}
                  </span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentOrders?.map((order: Order, index: number) => (
              <OrderRow
                key={order?.order_id}
                order={order}
                index={index}
                isSelected={selectedOrders.includes(order.order_id)}
                onSelect={handleSelectOrder}
                activeTab={activeTab}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-primary-neutal-300 py-4">
        <div className="px-6 max-w-[calc(100%-2rem)]">
          <Pagination className="flex items-center justify-between w-full mx-auto">
            <PaginationPrevious
              onClick={() => handlePageChange(currentPage - 1)}
              className={`h-[42px] bg-white rounded-lg shadow-1dp-ambient flex items-center gap-1 pl-2 pr-3 py-2.5 font-medium text-black text-[15px] ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              disabled={currentPage === 1}
            >
              <img
                className="w-6 h-6"
                alt="Arrow left"
                src="/img/arrow-left-sm.svg"
              />
              {t("history.table.previous")}
            </PaginationPrevious>

            <PaginationContent className="flex items-center gap-3">
              {generatePaginationItems().map((item, index) => (
                <React.Fragment key={index}>
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => handlePageChange(item.page)}
                      className={`flex items-center justify-center w-9 h-9 rounded cursor-pointer ${
                        item.active
                          ? "bg-cyan-100 font-bold text-[#1e2324]"
                          : "border border-solid border-primary-neutal-300 font-medium text-[#023337]"
                      }`}
                    >
                      {item.page}
                    </PaginationLink>
                  </PaginationItem>
                  {totalPages > 5 &&
                    index === generatePaginationItems().length - 1 &&
                    item.page < totalPages && (
                      <>
                        <PaginationItem>
                          <PaginationEllipsis className="w-9 h-9 flex items-center justify-center rounded border border-solid border-primary-neutal-300 font-bold text-[#023337]" />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink
                            onClick={() => handlePageChange(totalPages)}
                            className="flex items-center justify-center w-9 h-9 rounded border border-solid border-primary-neutal-300 font-medium text-[#023337] cursor-pointer"
                          >
                            {totalPages}
                          </PaginationLink>
                        </PaginationItem>
                      </>
                    )}
                </React.Fragment>
              ))}
            </PaginationContent>

            <PaginationNext
              onClick={() => handlePageChange(currentPage + 1)}
              className={`h-[42px] bg-white rounded-lg shadow-1dp-ambient flex items-center gap-1 pl-2 pr-3 py-2.5 font-medium text-black text-[15px] ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              disabled={currentPage === totalPages}
            >
              {t("history.table.next")}
              <img
                className="w-6 h-6 rotate-180"
                alt="Arrow right"
                src="/img/arrow-left-sm-1.svg"
              />
            </PaginationNext>
          </Pagination>
        </div>
      </div>
    </div>
  );
};
