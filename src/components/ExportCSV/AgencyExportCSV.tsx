import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
import { Checkbox } from "../ui/checkbox";
import { useState, useRef } from "react";
import { Button } from "../ui/button";
import ExcelJS from "exceljs";
import { DownloadIcon, ChevronDown } from "lucide-react";

interface Agency {
  id: number;
  name: string;
  phone_number: string;
  city: string;
  address: string;
  longitude: string;
  latitude: string;
  created_at: string;
  updated_at: string;
  company_id: number;
  postal_code: string;
  is_active: boolean;
}

interface AgencyExportCSVProps {
  isOpen: boolean;
  onClose: () => void;
  agencies: Agency[];
  sheetName: string;
}

interface ExportColumn {
  label: string;
  value: string;
  checked: boolean;
}

// Dropdown component (copied from ExportCSV)
const ExportDropdown = ({
  onExportCSV,
  onExportExcel,
  disabled,
  defaultLabel,
  options,
}: {
  onExportCSV: () => void;
  onExportExcel: () => void;
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
        // Use the same color palette and style as the create button
        className="flex items-center gap-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-gap)] py-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-h)] px-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-v)] min-w-[92px] bg-[#07515f] rounded-[var(--2-tokens-screen-modes-nav-tab-border-radius)] font-label-smaller text-[length:var(--label-smaller-font-size)] leading-[var(--label-smaller-line-height)] tracking-[var(--label-smaller-letter-spacing)] font-[number:var(--label-smaller-font-weight)] text-[color:var(--1-tokens-color-modes-button-primary-default-text)] [font-style:var(--label-smaller-font-style)]"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
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

export const AgencyExportCSV = ({
  isOpen,
  onClose,
  agencies,
  sheetName,
}: AgencyExportCSVProps) => {
  const { t, i18n } = useTranslation();

  const [columns, setColumns] = useState<ExportColumn[]>([
    { label: "Agence nom", value: "name", checked: true },
    { label: "Adresse", value: "address", checked: true },
    { label: "Ville", value: "city", checked: true },
    { label: "Code postal", value: "postal_code", checked: true },
    { label: "Téléphone", value: "phone_number", checked: true },
    {
      label: "Limite de commande par mois",
      value: "order_limit",
      checked: true,
    },
    {
      label: "Limite de budget par mois",
      value: "budget_limit",
      checked: true,
    },
  ]);

  const handleExportCSV = () => {
    const selectedColumns = columns.filter((col) => col.checked);
    const exportData = agencies.map((agency) => {
      const row: { [key: string]: any } = {};
      selectedColumns.forEach((col) => {
        row[col.label] = agency[col.value as keyof Agency] || "";
      });
      return row;
    });
    const ws = XLSX.utils.json_to_sheet(exportData);
    const headers = selectedColumns.map((col) => col.label);
    XLSX.utils.sheet_add_aoa(ws, [headers], { origin: "A1" });
    const csvContent = XLSX.utils.sheet_to_csv(ws);
    const utf8Bom = "\uFEFF";
    const csvBlob = new Blob([utf8Bom + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const now = new Date();
    const dateStr = now
      .toISOString()
      .replace(/T/, "_")
      .replace(/:/g, "-")
      .replace(/\..+/, "");
    const isFrench = typeof i18n !== "undefined" && i18n.language === "fr";
    const fileName = isFrench
      ? `agences_${dateStr}.csv`
      : `agencies_${dateStr}.csv`;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(csvBlob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
    onClose();
  };

  const handleExportExcel = async () => {
    const selectedColumns = columns.filter((col) => col.checked);
    const headers = selectedColumns.map((col) => col.label);
    const exportData = agencies.map((agency) => {
      const row: { [key: string]: any } = {};
      selectedColumns.forEach((col) => {
        row[col.label] = agency[col.value as keyof Agency] || "";
      });
      return row;
    });
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);
    worksheet.addRow(headers);
    exportData.forEach((row) => {
      worksheet.addRow(
        headers.map((h) => (row[h] !== undefined ? row[h] : ""))
      );
    });
    // Style header row
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: "center", vertical: "middle" };
    headerRow.height = 30;
    // Style all data rows
    worksheet.eachRow((row, rowNumber) => {
      row.alignment = { horizontal: "left", vertical: "middle" };
      row.height = 20;
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        cell.alignment = {
          horizontal: rowNumber === 1 ? "center" : "left",
          vertical: "middle",
          wrapText: true,
          indent: 1,
        };
      });
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
    // Download file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const now = new Date();
    const dateStr = now
      .toISOString()
      .replace(/T/, "_")
      .replace(/:/g, "-")
      .replace(/\..+/, "");
    const isFrench = typeof i18n !== "undefined" && i18n.language === "fr";
    const fileName = isFrench
      ? `agences_${dateStr}.xlsx`
      : `agencies_${dateStr}.xlsx`;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
    onClose();
  };

  const handleColumnToggle = (index: number) => {
    const newColumns = [...columns];
    newColumns[index].checked = !newColumns[index].checked;
    setColumns(newColumns);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("exportModal.title")}</DialogTitle>
        </DialogHeader>
        <div className="sm:max-w-[425px]">
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-4">
              {columns.map((column, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`column-${index}`}
                    checked={column.checked}
                    onCheckedChange={() => handleColumnToggle(index)}
                  />
                  <label
                    htmlFor={`column-${index}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {column.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end">
            <ExportDropdown
              defaultLabel={t("exportCSV.export", "Export")}
              disabled={agencies?.length === 0}
              onExportCSV={handleExportCSV}
              onExportExcel={handleExportExcel}
              options={[
                {
                  label: t("exportCSV.exportAsCSV", "Export as CSV"),
                  onClick: handleExportCSV,
                },
                {
                  label: t("exportCSV.exportAsExcel", "Export as Excel"),
                  onClick: handleExportExcel,
                },
              ]}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
