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
  name: "Product Name",
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

export const ExportCSV = ({
  isOpen,
  onClose,
  products,
  sheetName = "Products",
  templateColumns,
}: ExportCSVProps) => {
  const { t } = useTranslation();
  const [selectedFields, setSelectedFields] = useState<Record<string, boolean>>(
    () => {
      const initialFields: Record<string, boolean> = {};
      if (templateColumns) {
        templateColumns.forEach((col) => {
          initialFields[col] = true;
        });
      } else {
        // Default fields if no template columns provided
        initialFields["Product Name"] = true;
        initialFields["SKU Reference"] = true;
        initialFields["Pack of"] = true;
        initialFields["Pack Price"] = true;
        initialFields["Total Packs"] = true;
        initialFields["Suitable For"] = true;
        initialFields["Size"] = true;
        initialFields["Product Description"] = true;
      }
      return initialFields;
    }
  );

  const handleExport = () => {
    try {
      // Filter products data based on selected fields
      const exportData = products.map((product) => {
        const filteredProduct: Record<string, any> = {};
        Object.entries(selectedFields).forEach(([field, isSelected]) => {
          if (isSelected) {
            // Map the display names to actual product fields
            switch (field) {
              case "Product Name":
                filteredProduct[field] = product.name;
                break;
              case "SKU Reference":
                filteredProduct[field] = product.id;
                break;
              case "Pack of":
                filteredProduct[field] = product.total_stock;
                break;
              case "Pack Price":
                filteredProduct[field] = product.price;
                break;
              case "Total Packs":
                filteredProduct[field] = product.total_stock;
                break;
              case "Suitable For":
                filteredProduct[field] = product.available_region;
                break;
              case "Size":
                filteredProduct[field] = "";
                break;
              case "Product Description":
                filteredProduct[field] = product.description;
                break;
              default:
                filteredProduct[field] = "";
            }
          }
        });
        return filteredProduct;
      });

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Format headers with selected field names
      const headers = Object.keys(selectedFields).filter(
        (field) => selectedFields[field]
      );

      XLSX.utils.sheet_add_aoa(ws, [headers], { origin: "A1" });

      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, sheetName);

      // Save file with timestamp
      const timestamp = getFormattedTimestamp();
      XLSX.writeFile(wb, `${sheetName.toLowerCase()}_${timestamp}.xlsx`);
      onClose();
    } catch (error) {
      console.error("Error exporting data:", error);
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
          <Button onClick={handleExport}>
            {t("exportCSV.export", "Export")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
