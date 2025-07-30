import { DownloadIcon, ChevronDown, SearchIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { useCompanyColors } from "../../hooks/useCompanyColors";
import ExcelJS from "exceljs";
import { useState, useRef } from "react";
import { Buffer } from "buffer";
import dayjs from "dayjs";
import { Input } from "../../components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { TimeframeSelect, TimeframeType } from "./TimeframeSelect";
import { PeriodSelect } from "./PeriodSelect";
import { getAllCompanyOrdersReport } from "../../store/features/reportSlice";
import { getHost } from "../../utils/hostUtils";

interface DateRange {
  startDate: string;
  endDate: string;
}

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
  const { buttonStyles } = useCompanyColors();

  return (
    <div className="relative inline-block text-left">
      <Button
        ref={buttonRef}
        variant="outline"
        className="transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--primary-light-color)] flex items-center"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        style={{
          backgroundColor: "var(--primary-color)",
          color: "var(--primary-text-color)",
          border: "1px solid var(--primary-color)",
          transform: "translateY(0)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
      >
        <DownloadIcon className="mr-2 h-4 w-4" />
        <span>{selectedLabel}</span>
        <ChevronDown className="ml-2 h-4 w-4" />
      </Button>
      {open && (
        <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-[var(--primary-color)] ring-opacity-20 focus:outline-none">
          <div className="py-1">
            {options.map((opt, idx) => (
              <button
                key={idx}
                className="w-full flex items-center px-4 py-2 text-sm text-[var(--primary-color)] hover:bg-[var(--primary-light-color)]"
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

interface OrderHistorySectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  activeTab: "all" | "selected";
  setActiveTab: (tab: "all" | "selected") => void;
  selectedTimeframe: TimeframeType;
  setSelectedTimeframe: (timeframe: TimeframeType) => void;
  selectedPeriod: DateRange;
  setSelectedPeriod: (period: DateRange) => void;
}

export const OrderHistorySection = ({
  searchQuery,
  setSearchQuery,
  currentPage,
  setCurrentPage,
  itemsPerPage = 10,
  activeTab,
  setActiveTab,
  selectedTimeframe,
  setSelectedTimeframe,
  selectedPeriod,
  setSelectedPeriod,
}: OrderHistorySectionProps): JSX.Element => {
  const { t, i18n } = useTranslation();
  const orders = useSelector((state: any) => state.cart.orders);
  const loading = useSelector((state: any) => state.cart.loading);
  const error = useSelector((state: any) => state.cart.error);
  const total = useSelector((state: any) => state.cart.totalOrders);
  const { buttonStyles } = useCompanyColors();
  const orderList = orders || [];
  const { isClientAdmin } = useAppSelector((state: any) => state.auth);
  const dns_prefix = getHost();
  const dispatch = useAppDispatch();
  const report = useSelector((state: any) => state.report);
  const reportOrders = report?.orders || [];
  if (typeof window !== "undefined" && !(window as any).Buffer) {
    (window as any).Buffer = Buffer;
  }

  const handleCustomDateChange = (fromDate: Date, toDate: Date) => {
    setSelectedPeriod({
      startDate: dayjs(fromDate).format("YYYY-MM-DD"),
      endDate: dayjs(toDate).format("YYYY-MM-DD"),
    });
  };

  const handleTimeframeChange = (value: TimeframeType) => {
    setSelectedTimeframe(value);
    setCurrentPage(1);
  };

  const handleDownloadOrders = async () => {
    try {
      await dispatch(
        getAllCompanyOrdersReport({
          dns_prefix,
          ...(selectedTimeframe === "custom" && {
            startDate: selectedPeriod.startDate,
            endDate: selectedPeriod.endDate,
          }),
          search: searchQuery?.trim()?.length >= 3 ? searchQuery : "",
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownloadOrdersCSV = async () => {
    await handleDownloadOrders();
    const orderList = reportOrders;
    console.log({ orderList });
    if (!orderList?.length) return;
    try {
      const rows: Record<string, any>[] = [];
      let currentOrderId: string | null = null;
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
            if (currentOrderId !== order.order_id || index === 0) {
              Object.entries(orderFields).forEach(([key, value]) => {
                if (key !== "total_amount") {
                  row[key] = value;
                }
              });
              currentOrderId = order.order_id;
            }
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
        reference: t("csv.reference"),
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
      let currentOrderId: string | null = null;
      let isAlternateOrder = false;

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
        reference: t("csv.reference"),
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
      let allKeys = allKeysRaw;
      const totalIdx = allKeys.indexOf("total_amount");
      if (totalIdx !== -1) {
        allKeys = allKeys.filter((k) => k !== "total_amount");
        allKeys.push("total_amount");
      }

      const headers = allKeys.map((key) => headerMap[key] || key);
      worksheet.addRow(headers);

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

        if (row.isAlternate) {
          excelRow.eachCell((cell) => {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFECF5F7" },
            };
          });
        }

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

      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true };
      headerRow.alignment = { horizontal: "center", vertical: "middle" };
      headerRow.height = 30;
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: {
            argb:
              buttonStyles.backgroundColor?.replace("#", "FF") || "FF07515F",
          },
          bgColor: {
            argb:
              buttonStyles.backgroundColor?.replace("#", "FF") || "FF07515F",
          },
        };
        cell.font = {
          bold: true,
          color: { argb: "FFFFFFFF" },
        };
      });

      Array.from(worksheet.columns ?? []).forEach((col, idx) => {
        let maxLength = headers[idx].length;
        col.eachCell?.({ includeEmpty: true }, (cell: any) => {
          const cellValue = cell.value ? cell.value.toString() : "";
          if (cellValue.length > maxLength) maxLength = cellValue.length;
        });
        col.width = Math.max(12, Math.min(40, maxLength + 6));
      });

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

  const getPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    const totalPages = Math.ceil(total / itemsPerPage);
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
    const totalPages = Math.ceil(total / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <header className="flex flex-col gap-[var(--2-tokens-screen-modes-common-spacing-m)] w-full">
      <div
        className="flex items-center gap-4 justify-between"
        style={buttonStyles}
      >
        <Heading text={t("history.title")} />
        {isClientAdmin && (
          <div className="flex gap-0">
            <Button
              variant={activeTab === "all" ? "default" : "outline"}
              onClick={() => setActiveTab("all")}
              className={`flex-1 transition-all duration-200 ${
                activeTab === "all"
                  ? "hover:brightness-90 shadow-md hover:shadow-lg hover:bg-primary-hover-color hover:text-white hover:border-primary-hover-color"
                  : "hover:bg-[var(--primary-light-color)] hover:border-[var(--primary-hover-color)] hover:text-[var(--primary-hover-color)]"
              }`}
              style={{
                backgroundColor:
                  activeTab === "all" ? "var(--primary-color)" : "transparent",
                color:
                  activeTab === "all"
                    ? "var(--primary-text-color)"
                    : "var(--primary-color)",
                border: "1px solid var(--primary-color)",
                transform: "translateY(0)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                borderTopRightRadius: "0",
                borderBottomRightRadius: "0",
              }}
            >
              {t("orderHistoryExport.allStores")}
            </Button>
            <Button
              variant={activeTab === "selected" ? "default" : "outline"}
              onClick={() => setActiveTab("selected")}
              className={`flex-1 transition-all duration-200 ${
                activeTab === "selected"
                  ? "hover:brightness-90 shadow-md hover:shadow-lg hover:bg-primary-hover-color hover:text-white hover:border-primary-hover-color"
                  : "hover:bg-[var(--primary-light-color)] hover:border-[var(--primary-hover-color)] hover:text-[var(--primary-hover-color)]"
              }`}
              style={{
                backgroundColor:
                  activeTab === "selected"
                    ? "var(--primary-color)"
                    : "transparent",
                color:
                  activeTab === "selected"
                    ? "var(--primary-text-color)"
                    : "var(--primary-color)",
                border: "1px solid var(--primary-color)",
                transform: "translateY(0)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                borderTopLeftRadius: "0",
                borderBottomLeftRadius: "0",
              }}
            >
              {t("orderHistoryExport.selectedStore")}
            </Button>
          </div>
        )}
      </div>

      <div
        className="flex items-center justify-between w-full"
        style={buttonStyles}
      >
        <div className="relative w-[400px] flex items-center gap-2">
          <div className="relative flex-1">
            <Input
              className="w-full pl-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-h)] px-12 py-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-v)] bg-[color:var(--1-tokens-color-modes-input-primary-default-background)] border-[color:var(--1-tokens-color-modes-input-primary-default-border)] rounded-[var(--2-tokens-screen-modes-input-border-radius)]"
              placeholder={t("history.search.placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-line-height)] h-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-line-height)]">
              <SearchIcon className="w-5 h-5 text-[color:var(--1-tokens-color-modes-input-primary-default-icon)]" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4">
          <div className="flex items-center justify-end gap-4">
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
      </div>

      {!loading && !error && orderList.length > 0 && (
        <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-primary-neutal-300 py-4">
          <div className="px-6 max-w-[calc(100%-2rem)]">
            <Pagination className="flex items-center justify-between w-full mx-auto">
              <PaginationPrevious
                href="#"
                onClick={(e: React.MouseEvent) => {
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
                {t("history.table.previous")}
              </PaginationPrevious>

              <PaginationContent className="flex items-center gap-3">
                {getPaginationItems().map((item) => (
                  <PaginationItem key={item.page}>
                    <PaginationLink
                      href="#"
                      onClick={(e: React.MouseEvent) => {
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
                {total / itemsPerPage >
                  getPaginationItems()[getPaginationItems().length - 1]
                    ?.page && (
                  <>
                    <PaginationEllipsis className="w-9 h-9 flex items-center justify-center rounded border border-solid border-primary-neutal-300 font-bold text-[#023337]" />
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        onClick={(e: React.MouseEvent) => {
                          e.preventDefault();
                          handlePageChange(Math.ceil(total / itemsPerPage));
                        }}
                        className="flex items-center justify-center w-9 h-9 rounded border border-solid border-primary-neutal-300 font-medium text-[#023337]"
                      >
                        {Math.ceil(total / itemsPerPage)}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}
              </PaginationContent>

              <PaginationNext
                href="#"
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  handlePageChange(currentPage + 1);
                }}
                className={`h-[42px] bg-white rounded-lg shadow-1dp-ambient flex items-center gap-1 pl-3 pr-2 py-2.5 font-medium text-black text-[15px] ${
                  currentPage === Math.ceil(total / itemsPerPage)
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
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
      )}
    </header>
  );
};
