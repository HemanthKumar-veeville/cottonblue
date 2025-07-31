import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Checkbox } from "../../components/ui/checkbox";
import { StatusIcon } from "../../components/ui/status-icon";
import {
  DownloadIcon,
  FileText,
  SearchIcon,
  ShoppingBag,
  InfoIcon,
  CheckCircle,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
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
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "../../components/Skeleton";
import ErrorState from "../../components/ErrorState";
import EmptyState from "../../components/EmptyState";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import { getOrderStatusColor } from "../../utils/statusUtil";
import dayjs from "dayjs";
import ExcelJS from "exceljs";
import { Buffer } from "buffer";
import { ChevronDown, Filter } from "lucide-react";
import { useRef } from "react";
import { getAllCompanyOrders } from "../../store/features/cartSlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { formatDateToParis } from "../../utils/dateUtils";
import { getAllCompanyOrdersReport } from "../../store/features/reportSlice";
import { TimeframeSelect, TimeframeType } from "./TimeframeSelect";
import { PeriodSelect } from "./PeriodSelect";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";

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
    | "pending"
    | "approved"
    | "rejected"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "sedis_rejected"
    | "all"
    | "default";
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
  itemsPerPage,
  currentPage,
  onSelect,
}: {
  order: Order;
  index: number;
  isSelected: boolean;
  onSelect: (orderId: number) => void;
  itemsPerPage: number;
  currentPage: number;
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Format date
  const formattedDate = order?.created_at
    ? formatDateToParis(order?.created_at)
    : t("common.notAvailable");

  return (
    <TableRow
      key={index}
      className="border-b border-primary-neutal-300 py-[var(--2-tokens-screen-modes-common-spacing-XS)]"
    >
      <TableCell className="w-[60px] text-center">
        <span className="font-text-smaller text-coolgray-100">
          {(currentPage - 1) * itemsPerPage + index + 1}
        </span>
      </TableCell>
      <TableCell className="w-[120px] text-left">
        <span
          className="font-semibold text-coolgray-100 cursor-pointer hover:underline"
          onClick={() =>
            navigate(`/order-details/${order?.store_id}/${order?.order_id}`)
          }
        >
          {order?.order_id ?? t("common.notAvailable")}
        </span>
      </TableCell>
      <TableCell className="w-[120px] text-left">
        <span
          className="font-semibold text-coolgray-100 cursor-pointer hover:underline"
          onClick={() =>
            navigate(`/order-details/${order?.store_id}/${order?.order_id}`)
          }
        >
          {order?.reference ?? t("common.notAvailable")}
        </span>
      </TableCell>
      <TableCell className="w-[120px] text-left">
        <span className="font-text-smaller text-black">{formattedDate}</span>
      </TableCell>
      <TableCell className="w-[180px] text-left">
        <span className="font-text-smaller text-black">
          {order?.store_name}
        </span>
      </TableCell>
      <TableCell className="w-[120px] text-left">
        <span className="font-text-smaller text-black">
          {`€ ${order?.total_amount}` ?? t("common.notAvailable")}
        </span>
      </TableCell>
      <TableCell className="w-[150px] text-left">
        <div className="flex items-center gap-2">
          <StatusIcon status={order?.order_status} />
          <StatusText status={order?.order_status} />
        </div>
      </TableCell>
      <TableCell className="w-[80px] text-center">
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
      <TableCell className="w-[100px] text-center">
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
        style={{
          backgroundColor: "#07515f",
          color: "#fff",
          borderColor: "#07515f",
        }}
      >
        <div
          onClick={(e) => {
            options
              ?.find((option) => option.label === selectedLabel)
              ?.onClick();
            e.stopPropagation();
          }}
          className="flex"
        >
          <DownloadIcon className="w-6 h-6 text-white mr-2" />
          <span className="font-label-smaller text-[length:var(--label-smaller-font-size)] leading-[var(--label-smaller-line-height)] tracking-[var(--label-smaller-letter-spacing)] font-[number:var(--label-smaller-font-weight)] text-white [font-style:var(--label-smaller-font-style)]">
            {selectedLabel}
          </span>
        </div>
        <span onClick={() => setOpen((v) => !v)}>
          <ChevronDown className="ml-2 h-4 w-4 text-white" />
        </span>
      </Button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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

interface SuperAdminOrderHistorySectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  dns_prefix: string;
}

interface DateRange {
  startDate: string;
  endDate: string;
}

export const SuperAdminOrderHistorySection = ({
  searchQuery,
  setSearchQuery,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  dns_prefix,
}: SuperAdminOrderHistorySectionProps): JSX.Element => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const orders = useSelector((state: any) => state.cart.orders);
  const loading = useSelector((state: any) => state.cart.loading);
  const error = useSelector((state: any) => state.cart.error);
  const total = useSelector((state: any) => state.cart.totalOrders);
  const report = useSelector((state: any) => state.report);
  const reportOrders = report?.orders || [];
  const reportLoading = report?.loading;
  const reportError = report?.error;

  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] =
    useState<TimeframeType>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<DateRange>({
    startDate: dayjs().startOf("year").format("YYYY-MM-DD"),
    endDate: dayjs().format("YYYY-MM-DD"),
  });
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const orderList = orders ?? [];

  // Update period when timeframe changes

  // Handle custom date range change
  const handleCustomDateChange = (fromDate: Date, toDate: Date) => {
    setSelectedPeriod({
      startDate: dayjs(fromDate).format("YYYY-MM-DD"),
      endDate: dayjs(toDate).format("YYYY-MM-DD"),
    });
  };

  // Fetch orders with timeframe and period
  useEffect(() => {
    if (selectedTimeframe === "all") {
      (searchQuery?.trim()?.length >= 3 || searchQuery?.trim()?.length === 0) &&
        dispatch(
          getAllCompanyOrders({
            dns_prefix,
            page: currentPage,
            limit: itemsPerPage,
            search: searchQuery?.trim()?.length >= 3 ? searchQuery : "",
            status: selectedStatus !== "all" ? selectedStatus : null,
          })
        );
    } else {
      (searchQuery?.trim()?.length >= 3 || searchQuery?.trim()?.length === 0) &&
        dispatch(
          getAllCompanyOrders({
            dns_prefix,
            page: currentPage,
            limit: itemsPerPage,
            search: searchQuery?.trim()?.length >= 3 ? searchQuery : "",
            status: selectedStatus !== "all" ? selectedStatus : null,
            startDate: selectedPeriod.startDate,
            endDate: selectedPeriod.endDate,
          })
        );
    }
  }, [
    dispatch,
    dns_prefix,
    currentPage,
    itemsPerPage,
    searchQuery,
    selectedPeriod,
    selectedTimeframe,
    selectedStatus,
  ]);

  // Polyfill Buffer for ExcelJS if needed
  if (typeof window !== "undefined" && !(window as any).Buffer) {
    (window as any).Buffer = Buffer;
  }

  const handleDownloadOrders = async () => {
    try {
      setShowLoadingModal(true);
      setShowSuccess(false);
      await dispatch(
        getAllCompanyOrdersReport({
          dns_prefix,
          ...(selectedTimeframe === "custom" && {
            startDate: selectedPeriod.startDate,
            endDate: selectedPeriod.endDate,
          }),
          ...(selectedStatus !== "all" && {
            status: selectedStatus,
          }),
          search: searchQuery?.trim()?.length >= 3 ? searchQuery : "",
        })
      );
      setShowSuccess(true);
      setTimeout(() => {
        setShowLoadingModal(false);
        setShowSuccess(false);
      }, 2000);
    } catch (error) {
      console.error(error);
      setShowLoadingModal(false);
    }
  };

  // --- Download Handlers ---
  const handleDownloadOrdersCSV = async () => {
    await handleDownloadOrders();
    const orderList = reportOrders;
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
        reference: t("csv.reference"),
        store_id: t("csv.store_id"),
        store_phone: t("csv.store_phone"),
        company_id: t("csv.company_id"),
        vat_number: t("csv.vat_number"),
        company_name: t("csv.company_name"),
        company_phone: t("csv.company_phone"),
        company_email: t("csv.company_email"),
        store_name: t("csv.store_name"),
        product_size: t("csv.order_items.product_size"),
        product_suitable_for: t("csv.order_items.product_suitable_for"),
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
    await handleDownloadOrders();
    const orderList = reportOrders;
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
        reference: t("csv.reference"),
        store_id: t("csv.store_id"),
        company_id: t("csv.company_id"),
        vat_number: t("csv.vat_number"),
        company_name: t("csv.company_name"),
        company_phone: t("csv.company_phone"),
        company_email: t("csv.company_email"),
        store_name: t("csv.store_name"),
        store_phone: t("csv.store_phone"),
        product_size: t("csv.order_items.product_size"),
        product_suitable_for: t("csv.order_items.product_suitable_for"),
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

  // Handle timeframe change
  const handleTimeframeChange = (value: TimeframeType) => {
    setSelectedTimeframe(value);
    setCurrentPage(1); // Reset to first page when timeframe changes
  };

  // Handle period change
  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value);
    setCurrentPage(1); // Reset to first page when period changes
  };

  console.log({ orderList });
  // Filter orders based on search query and status
  const filteredOrders = orderList.filter((order: Order) =>
    selectedStatus === "all" ? true : order.order_status === selectedStatus
  );
  const totalItems = total;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

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

  return (
    <section className="flex flex-col gap-[var(--2-tokens-screen-modes-common-spacing-m)] w-full">
      <Dialog open={showLoadingModal} onOpenChange={setShowLoadingModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              {showSuccess ? t("common.success") : t("common.processing")}
            </DialogTitle>
            <DialogDescription className="text-center">
              {showSuccess ? (
                <div className="flex flex-col items-center gap-4 py-4">
                  <CheckCircle className="w-16 h-16 text-green-500 animate-in zoom-in duration-300" />
                  <p>{t("common.downloadComplete")}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 py-4">
                  <Loader2 className="w-16 h-16 text-primary animate-spin" />
                  <p>{t("common.preparingDownload")}</p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <header className="flex items-center justify-between w-full">
        <h3 className="font-heading-h3 text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] text-[length:var(--heading-h3-font-size)] tracking-[var(--heading-h3-letter-spacing)] leading-[var(--heading-h3-line-height)] font-[number:var(--heading-h3-font-weight)] [font-style:var(--heading-h3-font-style)]">
          {t("history.superAdmin.orderHistory.title")}
        </h3>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[250px] bg-white">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <SelectValue placeholder={t("common.filterByStatus")} />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("order_status.all")}</SelectItem>
            <SelectItem value="confirmed">
              {t("order_status.confirmed")}
            </SelectItem>
            <SelectItem value="processing">
              {t("order_status.processing")}
            </SelectItem>
            <SelectItem value="shipped">{t("order_status.shipped")}</SelectItem>
            <SelectItem value="delivered">
              {t("order_status.delivered")}
            </SelectItem>
            <SelectItem value="sedis_rejected">
              {t("order_status.sedis_rejected")}
            </SelectItem>
          </SelectContent>
        </Select>
      </header>

      <div className="flex items-center justify-between w-full">
        <div className="relative w-[400px] flex items-center gap-2">
          <div className="relative flex-1">
            <Input
              className="w-full pl-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-h)] px-12 py-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-v)] bg-[color:var(--1-tokens-color-modes-input-primary-default-background)] border-[color:var(--1-tokens-color-modes-input-primary-default-border)] rounded-[var(--2-tokens-screen-modes-input-border-radius)]"
              placeholder={t(
                "history.superAdmin.orderHistory.search.placeholder"
              )}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-line-height)] h-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-line-height)]">
              <SearchIcon className="w-5 h-5 text-[color:var(--1-tokens-color-modes-input-primary-default-icon)]" />
            </div>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                  <InfoIcon className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="bg-gray-800 text-white border-none mb-10"
              >
                <div className="flex flex-col gap-1">
                  <p className="font-medium">
                    {t("history.superAdmin.orderHistory.search.tooltip.title")}
                  </p>
                  <ul className="list-disc list-inside text-sm">
                    <li>
                      {t(
                        "history.superAdmin.orderHistory.search.tooltip.items.order"
                      )}
                    </li>
                    <li>
                      {t(
                        "history.superAdmin.orderHistory.search.tooltip.items.store"
                      )}
                    </li>
                    <li>
                      {t(
                        "history.superAdmin.orderHistory.search.tooltip.items.reference"
                      )}
                    </li>
                  </ul>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center gap-2">
          <PeriodSelect
            timeframe={selectedTimeframe}
            value={selectedPeriod}
            onChange={setSelectedPeriod}
            onCustomDateChange={handleCustomDateChange}
          />
          <TimeframeSelect
            value={selectedTimeframe}
            onChange={handleTimeframeChange}
          />
          <DownloadDropdown
            defaultLabel={t("orderHistoryExport.downloadAsExcel")}
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
      </div>

      <div className="flex flex-col h-full">
        <div className="flex-grow overflow-auto pb-24">
          {loading ? (
            <Skeleton variant="table" />
          ) : error ? (
            <ErrorState
              title={t("common.error")}
              description={t("common.errorDescription")}
            />
          ) : orderList.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title={t("history.superAdmin.orderHistory.empty.title")}
              description={
                searchQuery
                  ? t("history.superAdmin.orderHistory.empty.searchDescription")
                  : t("history.superAdmin.orderHistory.empty.description")
              }
            />
          ) : (
            <Table className="w-full">
              <TableHeader className="bg-1-tokens-color-modes-common-primary-brand-lower rounded-md sticky top-0 z-10">
                <TableRow>
                  <TableHead className="w-[60px] text-center">
                    <span className="text-[#1e2324] font-text-small">#</span>
                  </TableHead>
                  <TableHead className="w-[120px] text-left">
                    <span className="text-[#1e2324] font-text-small">
                      {t("history.superAdmin.orderHistory.table.order")}
                    </span>
                  </TableHead>
                  <TableHead className="w-[120px] text-left">
                    <span className="text-[#1e2324] font-text-small">
                      {t("history.superAdmin.orderHistory.table.reference")}
                    </span>
                  </TableHead>
                  <TableHead className="w-[120px] text-left">
                    <span className="text-[#1e2324] font-text-small">
                      {t("history.superAdmin.orderHistory.table.date")}
                    </span>
                  </TableHead>
                  <TableHead className="w-[180px] text-left">
                    <span className="text-[#1e2324] font-text-small">
                      {t("history.superAdmin.orderHistory.table.store")}
                    </span>
                  </TableHead>
                  <TableHead className="w-[120px] text-left">
                    <span className="text-[#1e2324] font-text-small">
                      {t("history.superAdmin.orderHistory.table.totalPrice")}
                    </span>
                  </TableHead>
                  <TableHead className="w-[150px] text-left">
                    <span className="text-[#1e2324] font-text-small">
                      {t("history.superAdmin.orderHistory.table.status")}
                    </span>
                  </TableHead>
                  <TableHead className="w-[80px] text-center">
                    <span className="text-[#1e2324] font-text-small">
                      {t("history.superAdmin.orderHistory.table.invoice")}
                    </span>
                  </TableHead>
                  <TableHead className="w-[100px] text-center">
                    <span className="text-[#1e2324] font-text-small">
                      {t("history.superAdmin.orderHistory.table.details")}
                    </span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order: Order, index: number) => (
                  <OrderRow
                    key={order?.order_id}
                    order={order}
                    index={index}
                    isSelected={selectedOrders.includes(order.order_id)}
                    onSelect={handleSelectOrder}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                  />
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {!loading && !error && orderList.length > 0 && (
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
        )}
      </div>
    </section>
  );
};
