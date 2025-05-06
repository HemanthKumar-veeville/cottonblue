import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "../ui/dialog";
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
}: ExportCSVProps) => {
  const { t } = useTranslation();
  const [selectedFields, setSelectedFields] = useState({
    id: true,
    name: true,
    description: true,
    price: true,
    total_stock: true,
  });

  const handleExport = () => {
    try {
      // Filter products data based on selected fields
      const exportData = products.map((product) => {
        const filteredProduct: Record<string, any> = {};
        if (selectedFields.id) filteredProduct.id = product.id;
        if (selectedFields.name) filteredProduct.name = product.name;
        if (selectedFields.description)
          filteredProduct.description = product.description;
        if (selectedFields.price) filteredProduct.price = product.price;
        if (selectedFields.total_stock)
          filteredProduct.total_stock = product.total_stock;
        return filteredProduct;
      });

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Format headers with proper display names
      const headers = Object.keys(selectedFields)
        .filter((field) => selectedFields[field as keyof typeof selectedFields])
        .map(
          (field) =>
            headerDisplayNames[field as keyof typeof headerDisplayNames]
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
        <DialogTitle>{t("exportCSV.title", "Export Products")}</DialogTitle>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-3">
            {Object.entries(selectedFields).map(([field, isSelected]) => (
              <FieldCheckbox
                key={field}
                label={
                  headerDisplayNames[field as keyof typeof headerDisplayNames]
                }
                checked={isSelected}
                onChange={(checked) =>
                  setSelectedFields((prev) => ({ ...prev, [field]: checked }))
                }
              />
            ))}
          </div>
        </div>
        <DialogFooter className="flex justify-end gap-3">
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
