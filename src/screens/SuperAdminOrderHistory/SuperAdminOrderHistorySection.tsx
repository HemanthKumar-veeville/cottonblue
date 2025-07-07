import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Checkbox } from "../../components/ui/checkbox";
import { StatusIcon } from "../../components/ui/status-icon";
import { DownloadIcon, FileText, SearchIcon, ShoppingBag } from "lucide-react";
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
import ErrorState from "../../components/ErrorState";
import EmptyState from "../../components/EmptyState";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import { getOrderStatusColor } from "../../utils/statusUtil";
import dayjs from "dayjs";
import ExcelJS from "exceljs";
import { Buffer } from "buffer";
import { ChevronDown } from "lucide-react";
import { useRef } from "react";

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

const StatusText = ({ status }: { status: string }) => {
  const { t } = useTranslation();

  return (
    <div
      className={`font-normal text-[15px] leading-normal whitespace-nowrap ${getOrderStatusColor(
        status
      )}`}
    >
      {t(`order_status.${status}`)}
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
  const store_name = useSelector((state: any) => state.cart.store_name);
  const store_address = useSelector((state: any) => state.cart.store_address);
  const company_email = useSelector((state: any) => state.cart.company_email);
  const company_phone = useSelector((state: any) => state.cart.company_phone);
  const company_name = useSelector((state: any) => state.cart.company_name);
  const vat_number = useSelector((state: any) => state.cart.vat_number);

  // Format date
  const formattedDate = order?.created_at
    ? new Date(order.created_at).toLocaleDateString()
    : t("common.notAvailable");

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
      <TableCell className="w-[145px] flex justify-end items-center text-right">
        <span className="font-text-smaller text-black">
          {`${order?.total_amount} €` ?? t("common.notAvailable")}
        </span>
      </TableCell>
      <TableCell className="w-[145px] text-left">
        <div className="flex items-center gap-2">
          <StatusIcon status={order?.order_status} />
          <StatusText status={order?.order_status} />
        </div>
      </TableCell>
      <TableCell className="w-[69px] text-left">
        <FileText
          className="inline-block w-4 h-4 text-[#07515f] cursor-pointer hover:text-[#023337] transition-colors"
          onClick={() =>
            handleDownloadInvoice(
              {
                store_name: order?.store_name,
                store_address: order?.store_address,
                ordered_user: {
                  email: order?.company_email,
                  phone: order?.company_phone,
                  name: order?.company_name,
                },
                order_id: order?.order_id,
                created_at: order?.created_at,
                order_items: order?.order_items,
              },
              "#07505e",
              "#ffffff",
              "Cotton Blue",
              "121 Rue du 8 Mai 1945, Villeneuve-d'Ascq - 59650",
              order?.vat_number,
              "contact@cotton-blue.com",
              "03 20 41 09 09"
            )
          }
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

// --- DownloadDropdown copied from OrderHistorySection ---
const DownloadDropdown = ({
  onDownloadCSV,
  onDownloadExcel,
  disabled,
  defaultLabel,
  options,
}: {
  onDownloadCSV: () => void;
  onDownloadExcel: () => void;
  disabled: boolean;
  defaultLabel: string;
  options: { label: string; onClick: () => void; icon?: React.ReactNode }[];
}) => {
  const [open, setOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(defaultLabel);
  const buttonRef = useRef<HTMLButtonElement>(null);
  return (
    <div className="relative inline-block text-left">
      <Button
        ref={buttonRef}
        variant="ghost"
        className="flex items-center gap-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-gap)] py-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-h)] px-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-v)] min-w-[92px] bg-[#07515f] rounded-[var(--2-tokens-screen-modes-nav-tab-border-radius)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        style={{
          backgroundColor: "#07515f",
          color: "#fff",
          borderColor: "#07515f",
        }}
      >
        <DownloadIcon className="w-6 h-6 text-white mr-2" />
        <span className="font-label-smaller text-[length:var(--label-smaller-font-size)] leading-[var(--label-smaller-line-height)] tracking-[var(--label-smaller-letter-spacing)] font-[number:var(--label-smaller-font-weight)] text-white [font-style:var(--label-smaller-font-style)]">
          {selectedLabel}
        </span>
        <ChevronDown className="ml-2 h-4 w-4 text-white" />
      </Button>
      {open && (
        <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {options.map((opt, idx) => (
              <button
                key={idx}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  opt.onClick();
                  setSelectedLabel(opt.label);
                  setOpen(false);
                }}
              >
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const SuperAdminOrderHistorySection = (): JSX.Element => {
  const { t, i18n } = useTranslation();
  const orders = useSelector((state: any) => state.cart.orders);
  const loading = useSelector((state: any) => state.cart.loading);
  const error = useSelector((state: any) => state.cart.error);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const orderList = orders ?? [];

  // Polyfill Buffer for ExcelJS if needed
  if (typeof window !== "undefined" && !(window as any).Buffer) {
    (window as any).Buffer = Buffer;
  }

  // --- Download Handlers ---
  const handleDownloadOrdersCSV = () => {
    if (!orderList?.length) return;
    try {
      const rows: Record<string, any>[] = [];
      orderList.forEach((order: any) => {
        const { order_items, ...orderFields } = order;
        // Format created_at as date and time if present
        if (orderFields.created_at) {
          const date = dayjs(orderFields.created_at);
          orderFields.created_at = date.isValid()
            ? date.format("YYYY-MM-DD")
            : orderFields.created_at;
        }
        // Translate order_status if present
        if (orderFields.order_status) {
          orderFields.order_status =
            t("order_status." + orderFields.order_status) ||
            orderFields.order_status;
        }
        if (Array.isArray(order_items) && order_items.length > 0) {
          order_items.forEach((item: any, index: number) => {
            const row: Record<string, any> = {};
            // Include order fields for the first item, except total_amount
            if (index === 0) {
              Object.entries(orderFields).forEach(([key, value]) => {
                if (key !== "total_amount") {
                  row[key] = value;
                }
              });
            }
            // Include total_amount only for the last item
            if (index === order_items.length - 1) {
              row["total_amount"] = orderFields.total_amount;
            }
            // Always include product-specific fields
            Object.entries(item).forEach(([itemKey, itemValue]) => {
              if (itemKey !== "product_images") {
                row[itemKey] = itemValue;
              }
            });
            rows.push(row);
          });
        } else {
          rows.push({ ...orderFields });
        }
      });
      const headerMap: Record<string, string> = {
        created_at: t("csv.created_at"),
        order_id: t("csv.order_id"),
        order_status: t("csv.order_status"),
        store_id: t("csv.store_id"),
        company_id: t("csv.company_id"),
        vat_number: t("csv.vat_number"),
        company_name: t("csv.company_name"),
        company_phone: t("csv.company_phone"),
        company_email: t("csv.company_email"),
        store_name: t("csv.store_name"),
        store_address: t("csv.store_address"),
        product_price: t("csv.order_items.product_price"),
        product_id: t("csv.order_items.product_id"),
        product_name: t("csv.order_items.product_name"),
        quantity: t("csv.order_items.quantity"),
        amount: t("csv.amount"),
        total_amount: t("csv.total_amount"),
      };
      const keySet = new Set<string>();
      rows.forEach((row) => {
        Object.keys(row).forEach((key) => keySet.add(key));
      });
      const allKeysRaw = Array.from(keySet).filter(
        (key) => key !== "product_images" && key !== "company_dns_prefix"
      );
      // Ensure amount and total_amount are at the end
      let allKeys = allKeysRaw.filter(
        (key) => key !== "amount" && key !== "total_amount"
      );
      if (allKeysRaw.includes("amount")) {
        allKeys.push("amount");
      }
      if (allKeysRaw.includes("total_amount")) {
        allKeys.push("total_amount");
      }
      const headers = allKeys.map((key) => headerMap[key] || key);
      const data = rows.map((row) =>
        allKeys.map((key) => (row[key] !== undefined ? row[key] : ""))
      );
      const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
      const csvContent = XLSX.utils.sheet_to_csv(worksheet);
      const utf8Bom = "\uFEFF";
      const csvBlob = new Blob([utf8Bom + csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const link = document.createElement("a");
      const now = dayjs();
      const isFrench = typeof i18n !== "undefined" && i18n.language === "fr";
      const dateStr = now.format("YYYY-MM-DD_HH-mm-ss");
      const fileName = isFrench
        ? `commandes_${dateStr}.csv`
        : `orders_${dateStr}.csv`;
      link.href = URL.createObjectURL(csvBlob);
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Error downloading orders:", error);
    }
  };

  const handleDownloadOrdersExcel = async () => {
    if (!orderList?.length) return;
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Orders");
      const rows: Record<string, any>[] = [];
      let currentOrderStartRow = 2; // Start after header row

      orderList.forEach((order: any) => {
        const { order_items, ...orderFields } = order;
        if (orderFields.created_at) {
          const date = dayjs(orderFields.created_at);
          orderFields.created_at = date.isValid()
            ? date.format("YYYY-MM-DD")
            : orderFields.created_at;
        }
        if (orderFields.order_status) {
          orderFields.order_status =
            t("order_status." + orderFields.order_status) ||
            orderFields.order_status;
        }
        if (Array.isArray(order_items) && order_items.length > 0) {
          order_items.forEach((item: any, index: number) => {
            const row: Record<string, any> = {};
            // Include order fields for the first item, except total_amount
            if (index === 0) {
              Object.entries(orderFields).forEach(([key, value]) => {
                if (key !== "total_amount") {
                  row[key] = value;
                }
              });
            }
            // Include total_amount only for the last item
            if (index === order_items.length - 1) {
              row["total_amount"] = orderFields.total_amount;
            }
            // Always include product-specific fields
            Object.entries(item).forEach(([itemKey, itemValue]) => {
              if (itemKey !== "product_images") {
                row[itemKey] = itemValue;
              }
            });
            rows.push(row);
          });
        } else {
          rows.push({ ...orderFields });
        }
      });

      const headerMap: Record<string, string> = {
        created_at: t("csv.created_at"),
        order_id: t("csv.order_id"),
        order_status: t("csv.order_status"),
        store_id: t("csv.store_id"),
        company_id: t("csv.company_id"),
        vat_number: t("csv.vat_number"),
        company_name: t("csv.company_name"),
        company_phone: t("csv.company_phone"),
        company_email: t("csv.company_email"),
        store_name: t("csv.store_name"),
        store_address: t("csv.store_address"),
        product_price: t("csv.order_items.product_price"),
        product_id: t("csv.order_items.product_id"),
        product_name: t("csv.order_items.product_name"),
        quantity: t("csv.order_items.quantity"),
        amount: t("csv.amount"),
        total_amount: t("csv.total_amount"),
      };

      const keySet = new Set<string>();
      rows.forEach((row) => {
        Object.keys(row).forEach((key) => keySet.add(key));
      });
      const allKeysRaw = Array.from(keySet).filter(
        (key) => key !== "product_images" && key !== "company_dns_prefix"
      );
      let allKeys = allKeysRaw.filter(
        (key) => key !== "amount" && key !== "total_amount"
      );
      if (allKeysRaw.includes("amount")) {
        allKeys.push("amount");
      }
      if (allKeysRaw.includes("total_amount")) {
        allKeys.push("total_amount");
      }

      const headers = allKeys.map((key) => headerMap[key] || key);
      worksheet.addRow(headers);

      let currentOrderId: number | null = null;
      let isAlternateOrder = false;

      // Add rows and apply formatting
      rows.forEach((row, index) => {
        const rowData = allKeys.map((key) => {
          if (key === "created_at" && row[key]) {
            const date = dayjs(row[key]);
            return date.isValid() ? date.format("YYYY-MM-DD") : row[key];
          }
          if (key === "order_status" && row[key]) {
            return t(row[key]) || row[key];
          }
          return row[key] !== undefined &&
            row[key] !== null &&
            key !== "company_dns_prefix"
            ? row[key]
            : "";
        });

        const excelRow = worksheet.addRow(rowData);

        // Check if this is a new order
        if (row.order_id && row.order_id !== currentOrderId) {
          currentOrderId = row.order_id;
          isAlternateOrder = !isAlternateOrder;
        }

        // Apply alternating colors for different orders
        if (isAlternateOrder) {
          excelRow.eachCell((cell) => {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFECF5F7" }, // Light cyan color
            };
          });
        }

        // Apply cell formatting
        excelRow.eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
          cell.alignment = {
            horizontal: "left",
            vertical: "middle",
            wrapText: true,
            indent: 1,
          };
        });
      });

      // Format header row
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true };
      headerRow.alignment = { horizontal: "center", vertical: "middle" };
      headerRow.height = 30;
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF07515F" }, // Dark cyan color
          bgColor: { argb: "FF07515F" },
        };
        cell.font = {
          bold: true,
          color: { argb: "FFFFFFFF" }, // White text
        };
      });

      // Set column widths
      Array.from(worksheet.columns ?? []).forEach((col, idx) => {
        let maxLength = headers[idx].length;
        col.eachCell?.({ includeEmpty: true }, (cell: any) => {
          const cellValue = cell.value ? cell.value.toString() : "";
          if (cellValue.length > maxLength) maxLength = cellValue.length;
        });
        col.width = Math.max(12, Math.min(40, maxLength + 6));
      });

      // Freeze the header row
      worksheet.views = [{ state: "frozen", ySplit: 1 }];

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      const now = dayjs();
      const isFrench = typeof i18n !== "undefined" && i18n.language === "fr";
      const dateStr = now.format("YYYY-MM-DD_HH-mm-ss");
      const fileName = isFrench
        ? `commandes_${dateStr}.xlsx`
        : `orders_${dateStr}.xlsx`;
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Error downloading orders as Excel:", error);
    }
  };

  console.log({ orderList });
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
        Status: t(`order_status.${order.order_status}`),
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
              placeholder={t(
                "history.superAdmin.orderHistory.search.placeholder"
              )}
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
      <header className="flex items-center justify-between w-full">
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

        <DownloadDropdown
          defaultLabel={t("orderHistoryExport.downloadAsCSV")}
          disabled={loading || !orderList?.length}
          onDownloadCSV={handleDownloadOrdersCSV}
          onDownloadExcel={handleDownloadOrdersExcel}
          options={[
            {
              label: t("orderHistoryExport.downloadAsCSV"),
              onClick: handleDownloadOrdersCSV,
            },
            {
              label: t("orderHistoryExport.downloadAsExcel"),
              onClick: handleDownloadOrdersExcel,
            },
          ]}
        />
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
                    className={`${index === 5 ? "w-[69px]" : "w-[145px]"} ${
                      index === 3 ? "text-center" : "text-left"
                    } text-[#1e2324] font-text-small`}
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
                onClick={(
                  e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
                ) => {
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
                      onClick={(
                        e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
                      ) => {
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
                        onClick={(
                          e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
                        ) => {
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
                onClick={(
                  e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
                ) => {
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
