import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { StatusIcon } from "../../components/ui/status-icon";
import { FileText, ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
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
import { jsPDF } from "jspdf";
import { StatusText } from "../../components/ui/status-text";

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
    | "approval_pending"
    | "on_hold"
    | "processing"
    | "confirmed"
    | "refused"
    | "shipped"
    | "in_transit"
    | "delivered";
  order_items: OrderItem[];
}

type StatusIconType = "warning" | "success" | "danger" | "default";

const paginationItems = [
  { page: 1, active: true },
  { page: 2, active: false },
  { page: 3, active: false },
  { page: 4, active: false },
  { page: 5, active: false },
  { page: 24, active: false },
];

const OrderRow = ({
  order,
  index,
  isSelected,
  onSelect,
}: {
  order: Order;
  index: number;
  isSelected: boolean;
  onSelect: (orderId: number) => void;
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleDownloadInvoice = (order: Order) => {
    // Validate order data
    if (!order?.order_items?.length) {
      console.error("No order items found");
      return;
    }

    const doc = new jsPDF();

    // Helper function to draw borders
    const drawBorder = () => {
      doc.setDrawColor(7, 81, 95); // #07515f
      doc.setLineWidth(0.5);
      doc.rect(10, 10, 190, 277);
      doc.setLineWidth(0.2);
      doc.rect(15, 15, 180, 267);
    };

    // Helper function to draw horizontal line
    const drawHorizontalLine = (y: number, opacity = 1) => {
      doc.setDrawColor(7, 81, 95);
      doc.setLineWidth(0.2);
      doc.line(15, y, 195, y);
    };

    // Helper function to format price
    const formatPrice = (price: number | undefined): string => {
      return typeof price === "number" ? price.toFixed(2) : "0.00";
    };

    // Add borders
    drawBorder();

    // Add header bar
    doc.setFillColor(7, 81, 95);
    doc.rect(10, 10, 190, 25, "F");

    // Add company logo/header
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("Cotton Blue", 20, 27);

    // Add "INVOICE" text
    doc.setFontSize(16);
    doc.text("INVOICE", 160, 27);

    // Add invoice details section
    doc.setTextColor(7, 81, 95);
    doc.setFontSize(12);
    doc.text("BILL TO:", 20, 50);

    // Add subtle divider
    drawHorizontalLine(53);

    // Store information
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Customer", 20, 60);

    // Add invoice info box
    doc.setDrawColor(7, 81, 95);
    doc.setFillColor(247, 250, 252);
    doc.rect(120, 45, 70, 35, "FD");

    doc.setFont("helvetica", "bold");
    doc.text("Invoice Number:", 125, 53);
    doc.text("Date:", 125, 61);
    doc.text("Status:", 125, 69);

    doc.setFont("helvetica", "normal");
    doc.text(`#${order.order_id}`, 165, 53);
    doc.text(new Date(order.created_at).toLocaleDateString(), 165, 61);

    // Status with color coding
    const statusColors = {
      approval_pending: [255, 170, 0],
      on_hold: [255, 170, 0],
      processing: [255, 170, 0],
      confirmed: [0, 150, 0],
      refused: [200, 0, 0],
      shipped: [0, 150, 0],
      in_transit: [0, 150, 0],
      delivered: [0, 150, 0],
    };
    const [r, g, b] = statusColors[
      order.order_status as keyof typeof statusColors
    ] || [0, 0, 0];
    doc.setTextColor(r, g, b);
    doc.text(order.order_status.replace(/_/g, " ").toUpperCase(), 165, 69);
    doc.setTextColor(0, 0, 0);

    // Add order items table
    drawHorizontalLine(85);

    // Table headers
    doc.setFillColor(247, 250, 252);
    doc.rect(18, 90, 170, 10, "F");
    doc.setFont("helvetica", "bold");
    doc.text("Item", 20, 97);
    doc.text("Quantity", 120, 97);
    doc.text("Price", 150, 97);
    doc.text("Total", 175, 97);

    // Table content
    let yPos = 107;
    doc.setFont("helvetica", "normal");

    order.order_items.forEach((item, index) => {
      if (!item) return; // Skip if item is undefined

      // Alternate row background
      if (index % 2 === 0) {
        doc.setFillColor(252, 252, 252);
        doc.rect(18, yPos - 5, 170, 8, "F");
      }

      const itemTotal = (item.product_price || 0) * (item.quantity || 0);

      // Truncate long product names
      const maxLength = 45;
      const displayName =
        (item.product_name || "Unknown Product").length > maxLength
          ? (item.product_name || "Unknown Product").substring(0, maxLength) +
            "..."
          : item.product_name || "Unknown Product";

      doc.text(displayName, 20, yPos);
      doc.text(item.quantity?.toString() || "0", 120, yPos);
      doc.text(`$${formatPrice(item.product_price)}`, 150, yPos);
      doc.text(`$${formatPrice(itemTotal)}`, 175, yPos);
      yPos += 8;
    });

    // Calculate total with safe checks
    const subtotal = order.order_items.reduce(
      (sum, item) => sum + (item?.product_price || 0) * (item?.quantity || 0),
      0
    );
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    // Add total section
    yPos += 5;
    doc.setFillColor(247, 250, 252);
    doc.rect(115, yPos - 5, 75, 35, "F");

    doc.setFont("helvetica", "normal");
    doc.text("Subtotal:", 125, yPos + 5);
    doc.text(`$${formatPrice(subtotal)}`, 175, yPos + 5);

    doc.text("Tax (10%):", 125, yPos + 15);
    doc.text(`$${formatPrice(tax)}`, 175, yPos + 15);

    doc.setFont("helvetica", "bold");
    doc.text("Total:", 125, yPos + 25);
    doc.text(`$${formatPrice(total)}`, 175, yPos + 25);

    // Add payment terms
    yPos += 45;
    doc.setFont("helvetica", "bold");
    doc.text("Payment Terms", 20, yPos);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Payment is due within 30 days of invoice date.", 20, yPos + 7);
    doc.text("Please include invoice number with your payment.", 20, yPos + 14);

    // Add footer
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(128, 128, 128);

    // Add divider before footer
    drawHorizontalLine(260);

    // Footer text
    doc.text(
      "Thank you for your business with Cotton Blue!",
      doc.internal.pageSize.width / 2,
      265,
      { align: "center" }
    );
    doc.setFontSize(8);
    doc.text(
      "For any questions about this invoice, please contact support@cottonblue.com",
      doc.internal.pageSize.width / 2,
      270,
      { align: "center" }
    );
    doc.text(
      "Cotton Blue Inc. | 123 Fashion Street, Style City, SC 12345 | +1 (555) 123-4567",
      doc.internal.pageSize.width / 2,
      275,
      { align: "center" }
    );

    try {
      // Save the PDF with a clean name
      const timestamp = new Date().toISOString().split("T")[0];
      doc.save(`CottonBlue_Invoice_${order.order_id}_${timestamp}.pdf`);
    } catch (error) {
      console.error("Error saving PDF:", error);
    }
  };

  // Format date
  const formattedDate = order?.created_at
    ? new Date(order.created_at).toLocaleDateString()
    : "";

  const statusIcon: Record<Order["order_status"] | "default", StatusIconType> =
    {
      approval_pending: "warning",
      on_hold: "warning",
      processing: "warning",
      confirmed: "success",
      refused: "danger",
      shipped: "success",
      in_transit: "success",
      delivered: "success",
      default: "default",
    };

  return (
    <TableRow key={index} className="border-b border-primary-neutal-300">
      <TableCell className="w-11 py-3 px-2 align-middle">
        <Checkbox
          className="w-5 h-5 rounded border-[1.5px] border-solid border-1-tokens-color-modes-common-neutral-medium"
          checked={isSelected}
          onCheckedChange={() => onSelect(order.order_id)}
        />
      </TableCell>
      <TableCell className="w-[129px] p-2.5 text-left align-middle">
        <span
          className={`font-normal ${
            index === 0 ? "text-coolgray-100" : "text-[#121619]"
          } text-[15px] tracking-[0] leading-normal whitespace-nowrap`}
        >
          {order?.order_id}
        </span>
      </TableCell>
      <TableCell className="w-[145px] p-2.5 text-left align-middle">
        <span className="font-normal text-black text-[15px] tracking-[0] leading-normal whitespace-nowrap">
          {formattedDate}
        </span>
      </TableCell>
      <TableCell className="w-[145px] p-2.5 text-left align-middle">
        <span className="font-normal text-black text-[15px] tracking-[0] leading-normal whitespace-nowrap">
          {order?.total_amount}€
        </span>
      </TableCell>
      <TableCell className="w-[145px] p-2.5 align-middle">
        <div className="flex items-center gap-2">
          <StatusIcon status={order?.order_status} />
          <StatusText status={order?.order_status} />
        </div>
      </TableCell>
      <TableCell className="w-[69px] p-2.5 text-left align-middle">
        <FileText
          className="inline-block w-4 h-4 text-[#07515f] cursor-pointer hover:text-[#023337] transition-colors"
          onClick={() => handleDownloadInvoice(order)}
        />
      </TableCell>
      <TableCell className="w-[145px] p-2.5 text-right align-middle">
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

export const OrderDetailsSection = (): JSX.Element => {
  const { t } = useTranslation();
  const orders = useSelector((state: any) => state.cart.orders);
  const loading = useSelector((state: any) => state.cart.loading);
  const error = useSelector((state: any) => state.cart.error);
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10; // Number of orders to show per page

  const orderList = orders || [];
  const totalPages = Math.ceil(orderList.length / ordersPerPage);

  // Get current orders
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orderList.slice(indexOfFirstOrder, indexOfLastOrder);

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

  if (error) {
    return <div>Error: {error}</div>;
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
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-auto pb-24">
        <Table className="bg-white rounded-[var(--2-tokens-screen-modes-common-spacing-XS)]">
          <TableHeader className="bg-[#eaf8e7] rounded-md">
            <TableRow>
              <TableHead className="w-11 p-2.5 align-middle">
                <Checkbox
                  className="w-5 h-5 rounded border-[1.5px] border-solid border-1-tokens-color-modes-common-neutral-medium"
                  checked={
                    selectedOrders.length === currentOrders.length &&
                    currentOrders.length > 0
                  }
                  onCheckedChange={(checked: boolean | "indeterminate") =>
                    handleSelectAll(checked === true)
                  }
                />
              </TableHead>
              {[
                t("history.table.order"),
                t("history.table.date"),
                t("history.table.totalPrice"),
                t("history.table.status"),
                t("history.table.invoice"),
                t("history.table.details"),
              ].map((header, index) => (
                <TableHead
                  key={index}
                  className={`w-[${index === 4 ? 69 : 145}px] p-2.5 ${
                    index === 5 ? "text-right" : "text-left"
                  } align-middle`}
                >
                  <span className="font-text-small text-[#1e2324] text-[length:var(--text-small-font-size)] tracking-[var(--text-small-letter-spacing)] leading-[var(--text-small-line-height)]">
                    {header}
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
