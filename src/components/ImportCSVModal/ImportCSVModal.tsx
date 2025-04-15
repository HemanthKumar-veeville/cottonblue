import { useState, useCallback } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Paperclip, Upload, Wrench, X, AlertCircle } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { getFormattedTimestamp } from "../../utils/dateUtils";

export interface ImportCSVModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (file: File) => Promise<void>;
  templateColumns: string[];
  sheetName: string;
}

const Header = ({ onClose }: { onClose: () => void }) => (
  <DialogHeader className="flex items-center p-0 mb-8">
    <DialogTitle className="text-xl font-semibold text-[#1E2324]">
      Import CSV File
    </DialogTitle>
  </DialogHeader>
);

const FileDropArea = ({
  onFileSelect,
  isImporting,
}: {
  onFileSelect: (file: File | null) => void;
  isImporting: boolean;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (
        file &&
        (file.type === "text/csv" ||
          file.name.endsWith(".xlsx") ||
          file.name.endsWith(".xls"))
      ) {
        setSelectedFile(file);
        onFileSelect(file);
      } else {
        toast.error("Please select a valid CSV or Excel file");
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
    maxFiles: 1,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    disabled: isImporting,
  });

  return (
    <div
      {...getRootProps()}
      className={`flex flex-col h-[196px] items-center justify-center gap-4 px-6 py-4 border border-dashed rounded-2 overflow-hidden transition-colors duration-200 ${
        isDragActive || isDragging
          ? "border-[#07515f] bg-[#07515f]/5"
          : "border-[color:var(--1-tokens-color-modes-border-primary)]"
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex w-8 h-8 items-center justify-center">
        <Upload className="w-8 h-8 text-[#07515f]" />
      </div>
      <div className="text-center">
        {selectedFile ? (
          <span className="font-medium text-base text-[#1E2324]">
            {selectedFile.name}
          </span>
        ) : (
          <div className="space-y-1">
            <p className="text-base font-medium text-[#1E2324]">
              Drop a file here
            </p>
            <p className="text-sm text-[color:var(--1-tokens-color-modes-input-primary-default-text)]">
              or click to select one
            </p>
          </div>
        )}
      </div>
      {selectedFile && !isImporting && (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedFile(null);
            onFileSelect(null);
          }}
          className="text-red-500 hover:text-red-600"
        >
          Remove
        </Button>
      )}
    </div>
  );
};

const Footer = ({
  templateColumns,
  sheetName,
}: {
  templateColumns: string[];
  sheetName: string;
}) => {
  const downloadTemplate = () => {
    // Create workbook
    const wb = XLSX.utils.book_new();

    // Create worksheet with header row only
    const ws = XLSX.utils.aoa_to_sheet([
      templateColumns.map((col) =>
        col
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      ),
    ]);

    // Set column widths
    const colWidths = templateColumns.map(() => ({ wch: 20 }));
    ws["!cols"] = colWidths;

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    // Generate and download the file with timestamp
    const timestamp = getFormattedTimestamp();
    XLSX.writeFile(wb, `${sheetName.toLowerCase()}_template_${timestamp}.xlsx`);
    toast.success("Template downloaded successfully");
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-4">
      <Button
        variant="link"
        className="font-medium text-sm text-[color:var(--1-tokens-color-modes-button-secondary-default-text)] hover:text-[#07515f] flex items-center gap-1.5 p-0"
        onClick={downloadTemplate}
      >
        <Paperclip className="h-4 w-4" />
        Download Template
      </Button>
      <div className="flex items-center gap-2 text-sm text-[color:var(--1-tokens-color-modes-button-secondary-default-text)] leading-5">
        <Wrench className="h-4 w-4 flex-shrink-0" />
        <span>
          Make sure the file follows the required format (columns, types, etc.)
        </span>
      </div>
    </div>
  );
};

const ImportButton = ({
  onImport,
  disabled,
}: {
  onImport: () => Promise<void>;
  disabled: boolean;
}) => (
  <Button
    className="w-full mt-4 bg-[#07515f] text-white border-[color:var(--1-tokens-color-modes-border-primary)] hover:bg-[#07515f]/90 disabled:opacity-50 disabled:cursor-not-allowed"
    onClick={onImport}
    disabled={disabled}
  >
    Import
  </Button>
);

export default function ImportCSVModal({
  isOpen,
  onClose,
  onImport,
  templateColumns,
  sheetName,
}: ImportCSVModalProps): JSX.Element {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    try {
      setIsImporting(true);
      await onImport(selectedFile);
      toast.success("File imported successfully");
      onClose();
    } catch (error) {
      toast.error("Error importing file");
      console.error("Import error:", error);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-6 max-w-md">
        <Header onClose={onClose} />
        <FileDropArea
          onFileSelect={handleFileSelect}
          isImporting={isImporting}
        />
        <Footer templateColumns={templateColumns} sheetName={sheetName} />
        <ImportButton
          onImport={handleImport}
          disabled={!selectedFile || isImporting}
        />
      </DialogContent>
    </Dialog>
  );
}
