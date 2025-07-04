import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Checkbox } from "../ui/checkbox";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
import { useState } from "react";
import { getFormattedTimestamp } from "../../utils/dateUtils";
import { DownloadIcon, ChevronDown } from "lucide-react";
import { useRef } from "react";
import ExcelJS from "exceljs";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  total_stock: number;
  available_region: string;
  created_at: string;
  updated_at: string;
  company_id: number;
  product_image: string | null;
  is_active: boolean;
  // Added fields for export
  pack_quantity?: number;
  price_of_pack?: number;
  total_packs?: number;
  suitable_for?: string;
  size?: string;
}

interface ExportCSVProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  sheetName?: string;
  templateColumns?: string[];
}

const headerDisplayNames = {
  id: "Product ID",
  name: "Nom du produit",
  description: "Product Description",
  price: "Product Price",
  total_stock: "Total Stock",
};

const FieldCheckbox = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id={label} checked={checked} onCheckedChange={onChange} />
      <label
        htmlFor={label}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
    </div>
  );
};

// Dropdown component (duplicated from OrderHistorySection)
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

export const ExportCSV = ({
  isOpen,
  onClose,
  products,
  sheetName = "Products",
  templateColumns,
}: ExportCSVProps) => {
  const { t, i18n } = useTranslation();
  const [selectedFields, setSelectedFields] = useState<Record<string, boolean>>(
    () => {
      const initialFields: Record<string, boolean> = {};
      if (templateColumns) {
        templateColumns.forEach((col) => {
          initialFields[col] = true;
        });
      } else {
        // Default fields if no template columns provided
        initialFields["Nom du produit"] = true;
        initialFields["Référence EAN"] = true;
        initialFields["Quantité par lot"] = true;
        initialFields["Total des lots"] = true;
        initialFields["Prix du lot"] = true;
        initialFields["Convient pour"] = true;
        initialFields["Taille"] = true;
        initialFields["Description"] = true;
      }
      return initialFields;
    }
  );

  // Helper to get translated header
  const getHeader = (field: string) => {
    switch (field) {
      case "Nom du produit":
        return t("csv.product_name", "Nom du produit");
      case "Référence EAN":
        return t("csv.ean_reference", "Référence EAN");
      case "Quantité par lot":
        return t("csv.pack_quantity", "Quantité par lot");
      case "Prix du lot":
        return t("csv.price_of_pack", "Prix du lot");
      case "Total des lots":
        return t("csv.total_packs", "Total des lots");
      case "Convient pour":
        return t("csv.suitable_for", "Convient pour");
      case "Taille":
        return t("csv.size", "Taille");
      case "Description":
        return t("csv.description", "Description");
      default:
        return field;
    }
  };

  const handleExportCSV = () => {
    try {
      const exportData = products.map((product) => {
        const filteredProduct: Record<string, any> = {};
        Object.entries(selectedFields).forEach(([field, isSelected]) => {
          if (isSelected) {
            switch (field) {
              case "Nom du produit":
                filteredProduct[getHeader(field)] = product.name;
                break;
              case "Référence EAN":
                filteredProduct[getHeader(field)] = product.id;
                break;
              case "Quantité par lot":
                filteredProduct[getHeader(field)] = product.pack_quantity;
                break;
              case "Prix du lot":
                filteredProduct[getHeader(field)] = product.price_of_pack;
                break;
              case "Total des lots":
                filteredProduct[getHeader(field)] = product.total_packs;
                break;
              case "Convient pour":
                filteredProduct[getHeader(field)] = product.suitable_for;
                break;
              case "Taille":
                filteredProduct[getHeader(field)] = product.size;
                break;
              case "Description":
                filteredProduct[getHeader(field)] = product.description;
                break;
              default:
                filteredProduct[getHeader(field)] = "";
            }
          }
        });
        return filteredProduct;
      });
      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(exportData);
      // Format headers with selected field names
      const headers = Object.keys(selectedFields)
        .filter((field) => selectedFields[field])
        .map(getHeader);
      XLSX.utils.sheet_add_aoa(ws, [headers], { origin: "A1" });
      // Convert to CSV
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
        ? `produits_${dateStr}.csv`
        : `products_${dateStr}.csv`;
      const link = document.createElement("a");
      link.href = URL.createObjectURL(csvBlob);
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(link.href);
      onClose();
    } catch (error) {
      console.error("Error exporting CSV:", error);
    }
  };

  const handleExportExcel = async () => {
    try {
      // Prepare headers and data
      const headers = Object.keys(selectedFields)
        .filter((field) => selectedFields[field])
        .map(getHeader);
      const exportData = products.map((product) => {
        const filteredProduct: Record<string, any> = {};
        Object.entries(selectedFields).forEach(([field, isSelected]) => {
          if (isSelected) {
            switch (field) {
              case "Nom du produit":
                filteredProduct[getHeader(field)] = product.name;
                break;
              case "Référence EAN":
                filteredProduct[getHeader(field)] = product.id;
                break;
              case "Quantité par lot":
                filteredProduct[getHeader(field)] = product.pack_quantity;
                break;
              case "Prix du lot":
                filteredProduct[getHeader(field)] = product.price_of_pack;
                break;
              case "Total des lots":
                filteredProduct[getHeader(field)] = product.total_packs;
                break;
              case "Convient pour":
                filteredProduct[getHeader(field)] = product.suitable_for;
                break;
              case "Taille":
                filteredProduct[getHeader(field)] = product.size;
                break;
              case "Description":
                filteredProduct[getHeader(field)] = product.description;
                break;
              default:
                filteredProduct[getHeader(field)] = "";
            }
          }
        });
        return filteredProduct;
      });
      // Use exceljs for advanced formatting
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(sheetName);
      worksheet.addRow(headers);
      // Add data rows
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
        ? `produits_${dateStr}.xlsx`
        : `products_${dateStr}.xlsx`;
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(link.href);
      onClose();
    } catch (error) {
      console.error("Error exporting Excel:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("exportCSV.title", "Export Products")}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-3">
            {Object.entries(selectedFields).map(([field, isSelected]) => (
              <FieldCheckbox
                key={field}
                label={field}
                checked={isSelected}
                onChange={(checked) =>
                  setSelectedFields((prev) => ({ ...prev, [field]: checked }))
                }
              />
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("common.cancel", "Cancel")}
          </Button>
          <ExportDropdown
            defaultLabel={t("exportCSV.export", "Export")}
            disabled={products?.length === 0}
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
