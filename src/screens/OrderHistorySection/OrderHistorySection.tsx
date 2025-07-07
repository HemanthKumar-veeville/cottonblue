import { DownloadIcon, ChevronDown } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { useCompanyColors } from "../../hooks/useCompanyColors";
import ExcelJS from "exceljs";
import { useState, useRef } from "react";
import { Buffer } from "buffer";
import dayjs from "dayjs";

const Heading = ({ text }: { text: string }) => (
  <h3 className="text-[length:var(--heading-h3-font-size)] font-heading-h3 font-[number:var(--heading-h3-font-weight)] text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] tracking-[var(--heading-h3-letter-spacing)] leading-[var(--heading-h3-line-height)] [font-style:var(--heading-h3-font-style)]">
    {text}
  </h3>
);

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
        variant="outline"
        className="transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 flex items-center"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        style={{
          backgroundColor: "var(--primary-color)",
          color: "var(--primary-text-color)",
          borderColor: "var(--primary-color)",
        }}
      >
        <DownloadIcon className="mr-2 h-4 w-4" />
        <span>{selectedLabel}</span>
        <ChevronDown className="ml-2 h-4 w-4" />
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

export const OrderHistorySection = (): JSX.Element => {
  const { t, i18n } = useTranslation();
  const orders = useSelector((state: any) => state.cart.orders);
  const loading = useSelector((state: any) => state.cart.loading);
  const { buttonStyles } = useCompanyColors();
  const orderList = orders || [];

  if (typeof window !== "undefined" && !(window as any).Buffer) {
    (window as any).Buffer = Buffer;
  }

  const handleDownloadOrdersCSV = () => {
    if (!orderList?.length) return;
    try {
      const rows: Record<string, any>[] = [];
      let currentOrderId: string | null = null;
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
            // Include order fields for all rows except total_amount
            if (currentOrderId !== order.order_id || index === 0) {
              Object.entries(orderFields).forEach(([key, value]) => {
                if (key !== "total_amount") {
                  row[key] = value;
                }
              });
              currentOrderId = order.order_id;
            }
            // Add total_amount only to the last product row
            if (index === order_items.length - 1) {
              row.total_amount = orderFields.total_amount;
            }
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
        total_amount: t("csv.total_amount"),
        amount: t("csv.order_items.amount"),
        price_of_pack: t("csv.order_items.price_of_pack"),
        product_id: t("csv.order_items.product_id"),
        product_name: t("csv.order_items.product_name"),
        product_size: t("csv.order_items.product_size"),
        product_suitable_for: t("csv.order_items.product_suitable_for"),
        quantity: t("csv.order_items.quantity"),
      };
      const keySet = new Set<string>();
      rows.forEach((row) => {
        Object.keys(row).forEach((key) => keySet.add(key));
      });
      const allKeysRaw = Array.from(keySet).filter(
        (key) => key !== "product_images"
      );
      // Move total_amount to the end if present
      let allKeys = allKeysRaw;
      const totalIdx = allKeys.indexOf("total_amount");
      if (totalIdx !== -1) {
        allKeys = allKeys.filter((k) => k !== "total_amount");
        allKeys.push("total_amount");
      }
      const headers = allKeys.map((key) => headerMap[key] || key);
      const data = rows.map((row) =>
        allKeys.map((key) => (row[key] !== undefined ? row[key] : ""))
      );
      const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
      const csvContent = XLSX.utils.sheet_to_csv(worksheet);
      // Use UTF-8 with BOM for best compatibility with French characters
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
      let currentOrderId: string | null = null;
      let isAlternateOrder = false;

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
            // Include order fields for all rows except total_amount
            if (currentOrderId !== order.order_id || index === 0) {
              Object.entries(orderFields).forEach(([key, value]) => {
                if (key !== "total_amount") {
                  row[key] = value;
                }
              });
              currentOrderId = order.order_id;
              if (index === 0) {
                isAlternateOrder = !isAlternateOrder;
              }
            }
            // Add total_amount only to the last product row
            if (index === order_items.length - 1) {
              row.total_amount = orderFields.total_amount;
            }
            Object.entries(item).forEach(([itemKey, itemValue]) => {
              if (itemKey !== "product_images") {
                row[itemKey] = itemValue;
              }
            });
            rows.push(row);
          });
        } else {
          rows.push({ ...orderFields });
          isAlternateOrder = !isAlternateOrder;
        }
      });

      const headerMap: Record<string, string> = {
        created_at: t("csv.created_at"),
        order_id: t("csv.order_id"),
        order_status: t("csv.order_status"),
        total_amount: t("csv.total_amount"),
        amount: t("csv.order_items.amount"),
        price_of_pack: t("csv.order_items.price_of_pack"),
        product_id: t("csv.order_items.product_id"),
        product_name: t("csv.order_items.product_name"),
        product_size: t("csv.order_items.product_size"),
        product_suitable_for: t("csv.order_items.product_suitable_for"),
        quantity: t("csv.order_items.quantity"),
      };
      const keySet = new Set<string>();
      rows.forEach((row) => {
        Object.keys(row).forEach((key) => keySet.add(key));
      });
      const allKeysRaw = Array.from(keySet).filter(
        (key) => key !== "product_images"
      );
      // Move total_amount to the end if present
      let allKeys = allKeysRaw;
      const totalIdx = allKeys.indexOf("total_amount");
      if (totalIdx !== -1) {
        allKeys = allKeys.filter((k) => k !== "total_amount");
        allKeys.push("total_amount");
      }
      const headers = allKeys.map((key) => headerMap[key] || key);
      worksheet.addRow(headers);
      // Add data rows
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const rowData = allKeys.map((key) => {
          if (key === "created_at" && row[key]) {
            const date = dayjs(row[key]);
            return date.isValid() ? date.format("YYYY-MM-DD") : row[key];
          }
          if (key === "order_status" && row[key]) {
            return t(row[key]) || row[key];
          }
          return row[key] !== undefined ? row[key] : "";
        });

        const excelRow = worksheet.addRow(rowData);

        // Apply alternating colors
        if (row.isAlternate) {
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
      }

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

      // Set column widths based on max content length
      Array.from(worksheet.columns ?? []).forEach((col, idx) => {
        let maxLength = headers[idx].length;
        col.eachCell?.({ includeEmpty: true }, (cell: any) => {
          const cellValue = cell.value ? cell.value.toString() : "";
          if (cellValue.length > maxLength) maxLength = cellValue.length;
        });
        col.width = Math.max(12, Math.min(40, maxLength + 6));
      });
      // Freeze header row
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

  return (
    <header
      className="flex items-center justify-between w-full"
      style={buttonStyles}
    >
      <Heading text={t("history.title")} />
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
    </header>
  );
};
