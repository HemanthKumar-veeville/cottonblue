import { useState, useCallback } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Paperclip, Upload, Wrench, X, AlertCircle } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { getFormattedTimestamp } from "../../utils/dateUtils";
import { useTranslation } from "react-i18next";

export interface ImportCSVModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (file: File) => Promise<void>;
  templateColumns: string[];
  sheetName: string;
}

const Header = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation();
  return (
    <DialogHeader className="flex items-center p-0 mb-8">
      <DialogTitle className="text-xl font-semibold text-[#1E2324]">
        {t("productList.actions.importCsv")}
      </DialogTitle>
    </DialogHeader>
  );
};

const FileDropArea = ({
  onFileSelect,
  isImporting,
}: {
  onFileSelect: (file: File | null) => void;
  isImporting: boolean;
}) => {
  const { t } = useTranslation();
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
        toast.error(t("common.error"));
      }
    },
    [onFileSelect, t]
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
              {t("productList.actions.placeholder")}
            </p>
            <p className="text-sm text-[color:var(--1-tokens-color-modes-input-primary-default-text)]">
              {t("carousel.images.orClickToSearch")}
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
          {t("common.remove")}
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
  const { t } = useTranslation();
  const downloadTemplate = () => {
    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([templateColumns]);

    // Set column widths for better readability
    const colWidths = templateColumns.map(() => ({ wch: 25 }));
    worksheet["!cols"] = colWidths;

    // Style the header row
    const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_col(C) + "1";
      if (!worksheet[address]) continue;
      worksheet[address].s = {
        font: { bold: true },
        alignment: { horizontal: "center", vertical: "center" },
      };
    }

    // Add the worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Generate filename with timestamp
    const timestamp = getFormattedTimestamp();
    const fileName = `${t(`files.${sheetName.toLowerCase()}`)}_${t(
      "files.template"
    )}_${timestamp}.xlsx`;

    // Write and download the file
    XLSX.writeFile(workbook, fileName);
    toast.success(t("common.success"));
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-4">
      <Button
        variant="link"
        className="font-medium text-sm text-[color:var(--1-tokens-color-modes-button-secondary-default-text)] hover:text-[#07515f] flex items-center gap-1.5 p-0"
        onClick={downloadTemplate}
      >
        <Paperclip className="h-4 w-4" />
        {t("exportModal.download")}
      </Button>
      <div className="flex items-center gap-2 text-sm text-[color:var(--1-tokens-color-modes-button-secondary-default-text)] leading-5">
        <Wrench className="h-4 w-4 flex-shrink-0" />
        <span>{t("productList.actions.importCsvRecommendation")}</span>
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
}) => {
  const { t } = useTranslation();
  return (
    <Button
      className="w-full mt-4 bg-[#07515f] text-white border-[color:var(--1-tokens-color-modes-border-primary)] hover:bg-[#07515f]/90 disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={onImport}
      disabled={disabled}
    >
      {t("productList.actions.importCsv")}
    </Button>
  );
};

const convertToCSV = async (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convert to CSV
        const csvContent = XLSX.utils.sheet_to_csv(worksheet);

        // Create a new File object with CSV content
        const csvBlob = new Blob([csvContent], { type: "text/csv" });
        const csvFile = new File(
          [csvBlob],
          file.name.replace(/\.(xlsx|xls)$/, ".csv"),
          {
            type: "text/csv",
          }
        );

        resolve(csvFile);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
};

export default function ImportCSVModal({
  isOpen,
  onClose,
  onImport,
  templateColumns,
  sheetName,
}: ImportCSVModalProps): JSX.Element {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    try {
      setIsImporting(true);

      // Convert Excel files to CSV if needed
      let fileToImport = selectedFile;
      if (
        selectedFile.name.endsWith(".xlsx") ||
        selectedFile.name.endsWith(".xls")
      ) {
        fileToImport = await convertToCSV(selectedFile);
      }

      await onImport(fileToImport);
      toast.success(t("common.success"));
      onClose();
    } catch (error) {
      toast.error(t("common.error"));
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
