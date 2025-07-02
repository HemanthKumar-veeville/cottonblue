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

  const handleExport = () => {
    try {
      // Filter products data based on selected fields
      const exportData = products.map((product) => {
        console.log({ product });
        const filteredProduct: Record<string, any> = {};
        Object.entries(selectedFields).forEach(([field, isSelected]) => {
          if (isSelected) {
            // Map the display names to actual product fields
            switch (field) {
              case "Nom du produit":
                filteredProduct[field] = product.name;
                break;
              case "Référence EAN":
                filteredProduct[field] = product.id;
                break;
              case "Quantité par lot":
                filteredProduct[field] = product.pack_quantity;
                break;
              case "Prix du lot":
                filteredProduct[field] = product.price_of_pack;
                break;
              case "Total des lots":
                filteredProduct[field] = product.total_packs;
                break;
              case "Convient pour":
                filteredProduct[field] = product.suitable_for;
                break;
              case "Taille":
                filteredProduct[field] = product.size;
                break;
              case "Description":
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
