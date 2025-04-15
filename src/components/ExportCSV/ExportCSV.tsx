import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { Checkbox } from "../../components/ui/checkbox";
import { Label } from "../../components/ui/label";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
import { useState } from "react";
import { getFormattedTimestamp } from "../../utils/dateUtils";

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

interface ExportCSVProps {
  isOpen: boolean;
  onClose: () => void;
  agencies: Agency[];
  sheetName?: string;
}

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
  agencies,
  sheetName = "Agencies",
}: ExportCSVProps) => {
  const { t } = useTranslation();
  const [selectedFields, setSelectedFields] = useState({
    name: true,
    address: true,
    city: true,
    postal_code: true,
    phone_number: true,
    latitude: true,
    longitude: true,
  });

  const handleExport = () => {
    try {
      // Filter agencies data based on selected fields
      const exportData = agencies.map((agency) => {
        const filteredAgency: Record<string, any> = {};
        Object.entries(selectedFields).forEach(([field, isSelected]) => {
          if (isSelected) {
            filteredAgency[field] = agency[field as keyof Agency];
          }
        });
        return filteredAgency;
      });

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Format headers
      const headers = Object.keys(selectedFields).filter(
        (field) => selectedFields[field as keyof typeof selectedFields]
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
        <DialogTitle>{t("exportCSV.title", "Export Agencies")}</DialogTitle>
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
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            {t("common.cancel", "Cancel")}
          </Button>
          <Button onClick={handleExport}>
            {t("exportCSV.export", "Export")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
