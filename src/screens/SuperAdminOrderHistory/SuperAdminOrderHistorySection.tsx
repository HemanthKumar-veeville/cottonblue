import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Checkbox } from "../../components/ui/checkbox";
import { StatusIcon } from "../../components/ui/status-icon";
import { DownloadIcon, FileText, SearchIcon, ShoppingBag } from "lucide-react";
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
import ErrorState from "../../components/ErrorState";
import EmptyState from "../../components/EmptyState";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";

interface OrderItem {
  product_id: number;
  product_name: string;
  product_image: string;
  product_price: number;
  quantity: number;
}

interface Order {
  order_id: number;
  store_id: number;
  store_name: string;
  store_address: string;
  created_at: string;
  order_status:
    | "approval_pending"
    | "confirmed"
    | "refused"
    | "shipped"
    | "in_transit"
    | "delivered";
  order_items: OrderItem[];
}

type StatusIconType = "warning" | "success" | "danger" | "default";

const Heading = ({ text }: { text: string }) => (
  <h3 className="text-[length:var(--heading-h3-font-size)] font-heading-h3 font-[number:var(--heading-h3-font-weight)] text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] tracking-[var(--heading-h3-letter-spacing)] leading-[var(--heading-h3-line-height)] [font-style:var(--heading-h3-font-style)]">
    {text}
  </h3>
);

const DownloadButton = ({
  label,
  disabled,
}: {
  label: string;
  disabled: boolean;
}) => (
  <Button
    variant="ghost"
    className="flex items-center gap-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-gap)]"
    disabled={disabled}
  >
    <span className="text-[length:var(--label-small-font-size)] leading-[var(--label-small-line-height)] font-label-small font-[number:var(--label-small-font-weight)] text-[color:var(--1-tokens-color-modes-button-ghost-default-text)] tracking-[var(--label-small-letter-spacing)] [font-style:var(--label-small-font-style)]">
      {label}
    </span>
    <DownloadIcon className="w-4 h-4" />
  </Button>
);

const StatusText = ({ status, type }: { status: string; type: string }) => {
  const textColorClassMap: { [key: string]: string } = {
    approval_pending: "text-1-tokens-color-modes-common-warning-medium",
    confirmed: "text-1-tokens-color-modes-common-success-medium",
    refused: "text-1-tokens-color-modes-common-danger-medium",
    shipped: "text-1-tokens-color-modes-common-success-medium",
    in_transit: "text-1-tokens-color-modes-common-success-medium",
    delivered: "text-1-tokens-color-modes-common-success-medium",
    default:
      "text-[color:var(--1-tokens-color-modes-input-primary-default-text)]",
  };
  const textColorClass = textColorClassMap[type] || textColorClassMap.default;

  return (
    <div
      className={`font-normal text-[15px] leading-normal whitespace-nowrap ${textColorClass}`}
    >
      {status
        ?.split("_")
        ?.join(" ")
        ?.replace(/_/g, " ")
        ?.replace(/\b\w/g, (char) => char.toUpperCase())}
    </div>
  );
};

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

    // Add borders
    drawBorder();

    // Add header bar
    doc.setFillColor(7, 81, 95);
    doc.rect(10, 10, 190, 25, 'F');
    
    // Add company logo/header
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
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
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(order.store_name, 20, 60);
    doc.text(order.store_address, 20, 66);

    // Add invoice info box
    doc.setDrawColor(7, 81, 95);
    doc.setFillColor(247, 250, 252);
    doc.rect(120, 45, 70, 35, 'FD');
    
    doc.setFont('helvetica', 'bold');
    doc.text("Invoice Number:", 125, 53);
    doc.text("Date:", 125, 61);
    doc.text("Status:", 125, 69);
    
    doc.setFont('helvetica', 'normal');
    doc.text(`#${order.order_id}`, 165, 53);
    doc.text(new Date(order.created_at).toLocaleDateString(), 165, 61);
    
    // Status with color coding
    const statusColors = {
      approval_pending: [255, 170, 0],
      confirmed: [0, 150, 0],
      refused: [200, 0, 0],
      shipped: [0, 150, 0],
      in_transit: [0, 150, 0],
      delivered: [0, 150, 0]
    };
    const [r, g, b] = statusColors[order.order_status as keyof typeof statusColors] || [0, 0, 0];
    doc.setTextColor(r, g, b);
    doc.text(order.order_status.replace(/_/g, ' ').toUpperCase(), 165, 69);
    doc.setTextColor(0, 0, 0);

    // Add order items table
    drawHorizontalLine(85);
    
    // Table headers
    doc.setFillColor(247, 250, 252);
    doc.rect(15, 90, 180, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text("Item", 20, 97);
    doc.text("Quantity", 120, 97);
    doc.text("Price", 150, 97);
    doc.text("Total", 175, 97);

    // Table content
    let yPos = 107;
    doc.setFont('helvetica', 'normal');
    
    order.order_items.forEach((item, index) => {
      // Alternate row background
      if (index % 2 === 0) {
        doc.setFillColor(252, 252, 252);
        doc.rect(15, yPos - 5, 180, 8, 'F');
      }

      const itemTotal = item.product_price * item.quantity;
      
      // Truncate long product names
      const maxLength = 45;
      const displayName = item.product_name.length > maxLength 
        ? item.product_name.substring(0, maxLength) + '...'
        : item.product_name;

      doc.text(displayName, 20, yPos);
      doc.text(item.quantity.toString(), 120, yPos);
      doc.text(`$${item.product_price.toFixed(2)}`, 150, yPos);
      doc.text(`$${itemTotal.toFixed(2)}`, 175, yPos);
      yPos += 8;
    });

    // Calculate total
    const subtotal = order.order_items.reduce(
      (sum, item) => sum + (item.product_price * item.quantity),
      0
    );
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    // Add total section
    yPos += 5;
    doc.setFillColor(247, 250, 252);
    doc.rect(120, yPos - 5, 75, 35, 'F');
    
    doc.setFont('helvetica', 'normal');
    doc.text("Subtotal:", 125, yPos + 5);
    doc.text(`$${subtotal.toFixed(2)}`, 175, yPos + 5);
    
    doc.text("Tax (10%):", 125, yPos + 15);
    doc.text(`$${tax.toFixed(2)}`, 175, yPos + 15);
    
    doc.setFont('helvetica', 'bold');
    doc.text("Total:", 125, yPos + 25);
    doc.text(`$${total.toFixed(2)}`, 175, yPos + 25);

    // Add payment terms
    yPos += 45;
    doc.setFont('helvetica', 'bold');
    doc.text("Payment Terms", 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text("Payment is due within 30 days of invoice date.", 20, yPos + 7);
    doc.text("Please include invoice number with your payment.", 20, yPos + 14);

    // Add footer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(128, 128, 128);
    
    // Add divider before footer
    drawHorizontalLine(260);
    
    // Footer text
    doc.text("Thank you for your business with Cotton Blue!", doc.internal.pageSize.width / 2, 265, { align: 'center' });
    doc.setFontSize(8);
    doc.text("For any questions about this invoice, please contact support@cottonblue.com", doc.internal.pageSize.width / 2, 270, { align: 'center' });
    doc.text("Cotton Blue Inc. | 123 Fashion Street, Style City, SC 12345 | +1 (555) 123-4567", doc.internal.pageSize.width / 2, 275, { align: 'center' });
    
    // Save the PDF with a clean name
    const timestamp = new Date().toISOString().split('T')[0];
    doc.save(`CottonBlue_Invoice_${order.order_id}_${timestamp}.pdf`);
  };

  // Calculate total price for the order
  const totalPrice = order?.order_items?.reduce(
    (sum: number, item: OrderItem) => {
      return sum + (item?.product_price ?? 0) * (item?.quantity ?? 0);
    },
    0
  );

  // Format date
  const formattedDate = order?.created_at
    ? new Date(order.created_at).toLocaleDateString()
    : t("common.notAvailable");

  const statusIcon: Record<Order["order_status"] | "default", StatusIconType> = {
      approval_pending: "warning",
      confirmed: "success",
      refused: "danger",
      shipped: "success",
      in_transit: "success",
      delivered: "success",
      default: "default",
    };

  return (
    <TableRow
      key={index}
      className="border-b border-primary-neutal-300 py-[var(--2-tokens-screen-modes-common-spacing-XS)]"
    >
      <TableCell className="w-11">
        <div className="flex justify-center">
          <Checkbox
            className="w-5 h-5 rounded border-[1.5px] border-solid border-1-tokens-color-modes-common-neutral-medium data-[state=checked]:bg-[#07515f] data-[state=checked]:border-[#07515f]"
            checked={isSelected}
            onCheckedChange={() => onSelect(order.order_id)}
          />
        </div>
      </TableCell>
      <TableCell className="w-[129px] text-left">
        <span className="font-text-smaller text-coolgray-100">
          {order?.order_id ?? t("common.notAvailable")}
        </span>
      </TableCell>
      <TableCell className="w-[145px] text-left">
        <span className="font-text-smaller text-black">{formattedDate}</span>
      </TableCell>
      <TableCell className="w-[145px] text-left">
        <span className="font-text-smaller text-black">
          {order?.store_name}
        </span>
      </TableCell>
      <TableCell className="w-[145px] text-left">
        <span className="font-text-smaller text-black">
          {totalPrice ?? t("common.notAvailable")}
        </span>
      </TableCell>
      <TableCell className="w-[145px] text-left">
        <div className="flex items-center gap-2">
          <StatusIcon type={statusIcon[order?.order_status ?? "default"]} />
          <StatusText
            status={order?.order_status ?? ""}
            type={order?.order_status ?? "default"}
          />
        </div>
      </TableCell>
      <TableCell className="w-[69px] text-left">
        <FileText 
          className="inline-block w-4 h-4 text-[#07515f] cursor-pointer hover:text-[#023337] transition-colors" 
          onClick={() => handleDownloadInvoice(order)}
        />
      </TableCell>
      <TableCell className="w-[145px] text-left">
        <Button
          variant="link"
          onClick={() =>
            navigate(`/order-details/${order?.store_id}/${order?.order_id}`)
          }
          disabled={!order?.order_id}
          className="text-[color:var(--1-tokens-color-modes-button-ghost-default-text)] font-text-small underline"
        >
          {t("history.superAdmin.orderHistory.table.details")}
        </Button>
      </TableCell>
    </TableRow>
  );
};

export const SuperAdminOrderHistorySection = (): JSX.Element => {
  const { t } = useTranslation();
  const orders = useSelector((state: any) => state.cart.orders);
  const loading = useSelector((state: any) => state.cart.loading);
  const error = useSelector((state: any) => state.cart.error);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // You can adjust this value as needed

  const orderList = orders ?? [];

  // Filter orders based on search query
  const filteredOrders = useMemo(() => {
    return orderList.filter((order: Order) => {
      const searchStr = searchQuery.toLowerCase();
      return (
        order.order_id.toString().includes(searchStr) ||
        order.store_name.toLowerCase().includes(searchStr) ||
        order.store_address.toLowerCase().includes(searchStr)
      );
    });
  }, [orderList, searchQuery]);

  // Calculate pagination
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

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

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(orderList.map((order: Order) => order.order_id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId: number) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleDownloadInvoices = () => {
    // Filter selected orders
    const selectedOrdersData = orderList.filter((order: Order) =>
      selectedOrders.includes(order.order_id)
    );

    // Prepare data for export
    const exportData = selectedOrdersData.map((order: Order) => {
      // Calculate total price for the order
      const totalPrice = order.order_items.reduce(
        (sum, item) => sum + item.product_price * item.quantity,
        0
      );

      // Format date
      const formattedDate = order.created_at
        ? new Date(order.created_at).toLocaleDateString()
        : "";

      // Create row data
      return {
        "Order ID": order.order_id,
        Date: formattedDate,
        "Store Name": order.store_name,
        "Store Address": order.store_address,
        "Total Price": totalPrice,
        Status: order.order_status
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        Items: order.order_items
          .map((item) => `${item.product_name} (${item.quantity}x)`)
          .join(", "),
      };
    });

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Set column widths
    const colWidths = [
      { wch: 10 }, // Order ID
      { wch: 12 }, // Date
      { wch: 20 }, // Store Name
      { wch: 30 }, // Store Address
      { wch: 12 }, // Total Price
      { wch: 15 }, // Status
      { wch: 50 }, // Items
    ];
    ws["!cols"] = colWidths;

    // Create workbook and append worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");

    // Generate timestamp for filename
    const timestamp = new Date().toISOString().split("T")[0];

    // Save file
    XLSX.writeFile(wb, `orders_${timestamp}.xlsx`);
  };

  if (loading) {
    return (
      <section className="flex flex-col gap-[var(--2-tokens-screen-modes-common-spacing-m)] w-full">
        <header>
          <h3 className="font-heading-h3 text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] text-[length:var(--heading-h3-font-size)] tracking-[var(--heading-h3-letter-spacing)] leading-[var(--heading-h3-line-height)] font-[number:var(--heading-h3-font-weight)] [font-style:var(--heading-h3-font-style)]">
            {t("history.superAdmin.orderHistory.title")}
          </h3>
        </header>

        <div className="flex items-center justify-between w-full">
          <div className="relative w-[400px]">
            <Input
              className="pl-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-h)] pr-12 py-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-v)] bg-[color:var(--1-tokens-color-modes-input-primary-default-background)] border-[color:var(--1-tokens-color-modes-input-primary-default-border)] rounded-[var(--2-tokens-screen-modes-input-border-radius)]"
              placeholder={t("history.superAdmin.orderHistory.search.placeholder")}
              disabled={true}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-line-height)] h-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-line-height)]">
              <SearchIcon className="w-5 h-5 text-[color:var(--1-tokens-color-modes-input-primary-default-icon)]" />
            </div>
          </div>

          <Button
            className="flex items-center gap-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-gap)] py-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-h)] px-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-v)] min-w-[92px] bg-[#07515f] rounded-[var(--2-tokens-screen-modes-nav-tab-border-radius)]"
            disabled={true}
          >
            <span className="font-label-smaller text-[length:var(--label-smaller-font-size)] leading-[var(--label-smaller-line-height)] tracking-[var(--label-smaller-letter-spacing)] font-[number:var(--label-smaller-font-weight)] text-[color:var(--1-tokens-color-modes-button-primary-default-text)] [font-style:var(--label-smaller-font-style)]">
              {t("history.superAdmin.orderHistory.downloadSelectedInvoices")}
            </span>
            <DownloadIcon className="w-6 h-6" />
          </Button>
        </div>

        <div className="flex flex-col h-full">
          <div className="flex-grow overflow-auto pb-24">
            <Skeleton variant="table" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        variant="inline"
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (orderList.length === 0) {
    return (
      <section className="flex flex-col gap-[var(--2-tokens-screen-modes-common-spacing-m)] w-full">
        <header>
          <h3 className="font-heading-h3 text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] text-[length:var(--heading-h3-font-size)] tracking-[var(--heading-h3-letter-spacing)] leading-[var(--heading-h3-line-height)] font-[number:var(--heading-h3-font-weight)] [font-style:var(--heading-h3-font-style)]">
            {t("history.superAdmin.orderHistory.title")}
          </h3>
        </header>
        <div className="flex items-center justify-between w-full">
          <div className="relative w-[400px]">
            <Input
              className="pl-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-h)] pr-12 py-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-v)] bg-[color:var(--1-tokens-color-modes-input-primary-default-background)] border-[color:var(--1-tokens-color-modes-input-primary-default-border)] rounded-[var(--2-tokens-screen-modes-input-border-radius)]"
              placeholder={t(
                "history.superAdmin.orderHistory.search.placeholder"
              )}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-line-height)] h-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-line-height)]">
              <SearchIcon className="w-5 h-5 text-[color:var(--1-tokens-color-modes-input-primary-default-icon)]" />
            </div>
          </div>
          <Button
            className="flex items-center gap-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-gap)] py-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-h)] px-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-v)] min-w-[92px] bg-[#07515f] rounded-[var(--2-tokens-screen-modes-nav-tab-border-radius)]"
            disabled={true}
          >
            <span className="font-label-smaller text-[length:var(--label-smaller-font-size)] leading-[var(--label-smaller-line-height)] tracking-[var(--label-smaller-letter-spacing)] font-[number:var(--label-smaller-font-weight)] text-[color:var(--1-tokens-color-modes-button-primary-default-text)] [font-style:var(--label-smaller-font-style)]">
              {t("history.superAdmin.orderHistory.downloadSelectedInvoices")}
            </span>
            <DownloadIcon className="w-6 h-6" />
          </Button>
        </div>
        <div className="flex-grow flex items-center justify-center min-h-[400px] bg-white rounded-lg">
          <EmptyState
            icon={ShoppingBag}
            title={
              t("history.superAdmin.orderHistory.empty.title") ||
              "No Orders Found"
            }
            description={
              searchQuery
                ? t(
                    "history.superAdmin.orderHistory.empty.searchDescription"
                  ) ||
                  "No orders match your search criteria. Try adjusting your search terms."
                : t("history.superAdmin.orderHistory.empty.description") ||
                  "There are no orders in the system yet."
            }
            className="max-w-md"
          />
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-[var(--2-tokens-screen-modes-common-spacing-m)] w-full">
      <header>
        <h3 className="font-heading-h3 text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] text-[length:var(--heading-h3-font-size)] tracking-[var(--heading-h3-letter-spacing)] leading-[var(--heading-h3-line-height)] font-[number:var(--heading-h3-font-weight)] [font-style:var(--heading-h3-font-style)]">
          {t("history.superAdmin.orderHistory.title")}
        </h3>
      </header>

      <div className="flex items-center justify-between w-full">
        <div className="relative w-[400px]">
          <Input
            className="pl-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-h)] pr-12 py-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-v)] bg-[color:var(--1-tokens-color-modes-input-primary-default-background)] border-[color:var(--1-tokens-color-modes-input-primary-default-border)] rounded-[var(--2-tokens-screen-modes-input-border-radius)]"
            placeholder={t(
              "history.superAdmin.orderHistory.search.placeholder"
            )}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-line-height)] h-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-line-height)]">
            <SearchIcon className="w-5 h-5 text-[color:var(--1-tokens-color-modes-input-primary-default-icon)]" />
          </div>
        </div>

        <Button
          className="flex items-center gap-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-gap)] py-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-h)] px-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-v)] min-w-[92px] bg-[#07515f] rounded-[var(--2-tokens-screen-modes-nav-tab-border-radius)]"
          disabled={loading || selectedOrders.length === 0}
          onClick={handleDownloadInvoices}
        >
          <span className="font-label-smaller text-[length:var(--label-smaller-font-size)] leading-[var(--label-smaller-line-height)] tracking-[var(--label-smaller-letter-spacing)] font-[number:var(--label-smaller-font-weight)] text-[color:var(--1-tokens-color-modes-button-primary-default-text)] [font-style:var(--label-smaller-font-style)]">
            {t("history.superAdmin.orderHistory.downloadSelectedInvoices")}
          </span>
          <DownloadIcon className="w-6 h-6" />
        </Button>
      </div>

      <div className="flex flex-col h-full">
        <div className="flex-grow overflow-auto pb-24">
          <Table className="w-full">
            <TableHeader className="bg-1-tokens-color-modes-common-primary-brand-lower rounded-md">
              <TableRow>
                <TableHead className="w-11">
                  <div className="flex justify-center">
                    <Checkbox
                      className="w-5 h-5 rounded border-[1.5px] border-solid border-1-tokens-color-modes-common-neutral-medium data-[state=checked]:bg-[#07515f] data-[state=checked]:border-[#07515f]"
                      checked={
                        orderList.length > 0 &&
                        selectedOrders.length === orderList.length
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </div>
                </TableHead>
                {[
                  "table.order",
                  "table.date",
                  "table.store",
                  "table.totalPrice",
                  "table.status",
                  "table.invoice",
                  "table.details",
                ].map((key, index) => (
                  <TableHead
                    key={index}
                    className={`${
                      index === 5 ? "w-[69px]" : "w-[145px]"
                    } text-left text-[#1e2324] font-text-small`}
                  >
                    {t(`history.superAdmin.orderHistory.${key}`)}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentOrders.map((order: Order, index: number) => (
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
                {t("history.superAdmin.orderHistory.table.previous")}
              </PaginationPrevious>

              <PaginationContent className="flex items-center gap-3">
                {getPaginationItems().map((item, index) => (
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
                {t("history.superAdmin.orderHistory.table.next")}
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
    </section>
  );
};
