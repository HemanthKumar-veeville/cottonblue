import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Dialog, DialogContent, DialogTitle } from "../../components/ui/dialog";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ExportCSVProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const FieldCheckbox = ({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) => (
  <div className="flex items-center space-x-2">
    <Checkbox
      id={id}
      checked={checked}
      onCheckedChange={onChange}
      className="w-5 h-5 rounded border-[1.5px] border-solid border-1-tokens-color-modes-common-neutral-medium"
    />
    <label
      htmlFor={id}
      className="text-black font-label-smaller text-xs leading-4"
    >
      {label}
    </label>
  </div>
);

export default function ExportCSV({
  isOpen = false,
  onClose,
}: ExportCSVProps): JSX.Element {
  const [selectedFields, setSelectedFields] = useState<Record<string, boolean>>(
    {
      name: true,
      ref: true,
      price: true,
    }
  );

  const fields = [
    { id: "name", label: "Name" },
    { id: "ref", label: "Ref" },
    { id: "price", label: "Price" },
  ];

  const handleExport = async () => {
    try {
      // Get the selected fields
      const selectedFieldIds = Object.entries(selectedFields)
        .filter(([_, checked]) => checked)
        .map(([id]) => id);

      // Make API call to export the CSV
      const response = await fetch("/api/products/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fields: selectedFieldIds }),
      });

      if (!response.ok) {
        throw new Error("Export failed");
      }

      // Get the blob from the response
      const blob = await response.blob();

      // Create a download link and trigger the download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "products.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("CSV file exported successfully");
      onClose?.();
    } catch (error) {
      console.error("Error exporting CSV:", error);
      toast.error("Failed to export CSV file");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-6 bg-white max-w-md">
        <div className="flex justify-between items-center">
          <DialogTitle className="text-base font-bold font-[Montserrat] text-[#1e2324]">
            Export a CSV file
          </DialogTitle>
        </div>

        <div className="text-sm text-[#1e2324] font-text-small">
          Select the fields to include:
        </div>

        <div className="flex flex-col gap-4 mt-2">
          {fields.map((field) => (
            <FieldCheckbox
              key={field.id}
              id={field.id}
              label={field.label}
              checked={selectedFields[field.id]}
              onChange={(checked) =>
                setSelectedFields((prev) => ({ ...prev, [field.id]: checked }))
              }
            />
          ))}
        </div>

        <Button
          className="w-full mt-4 bg-[#07515f] text-white rounded-lg border border-solid border-[color:var(--1-tokens-color-modes-border-primary)]"
          onClick={handleExport}
        >
          Export
        </Button>
      </DialogContent>
    </Dialog>
  );
}
