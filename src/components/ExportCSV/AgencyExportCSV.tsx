import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
import { Checkbox } from "../ui/checkbox";
import { useState } from "react";
import { Button } from "../ui/button";

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

export const AgencyExportCSV = ({
  isOpen,
  onClose,
  agencies,
  sheetName,
}: AgencyExportCSVProps) => {
  const { t } = useTranslation();

  const [columns, setColumns] = useState<ExportColumn[]>([
    { label: "Agence nom", value: "name", checked: true },
    { label: "Adresse", value: "address", checked: true },
    { label: "Ville", value: "city", checked: true },
    { label: "Code postal", value: "postal_code", checked: true },
    { label: "Téléphone", value: "phone_number", checked: true },
    { label: "Limite de commande", value: "order_limit", checked: true },
    { label: "Limite de budget", value: "budget_limit", checked: true },
  ]);

  const handleExport = () => {
    const selectedColumns = columns.filter((col) => col.checked);

    const exportData = agencies.map((agency) => {
      const row: { [key: string]: any } = {};
      selectedColumns.forEach((col) => {
        row[col.label] = agency[col.value as keyof Agency] || "";
      });
      return row;
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${sheetName}.xlsx`);
    onClose();
  };

  const handleColumnToggle = (index: number) => {
    const newColumns = [...columns];
    newColumns[index].checked = !newColumns[index].checked;
    setColumns(newColumns);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("exportModal.title")}</DialogTitle>
        </DialogHeader>
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
          <Button onClick={handleExport}>{t("exportModal.export")}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
