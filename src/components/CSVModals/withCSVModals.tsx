import { ComponentType, useState } from "react";
import ImportCSVModal from "../ImportCSVModal/ImportCSVModal";
import { ExportCSV } from "../ExportCSV/ExportCSV";
import { agencyService } from "../../services/agencyService";
import { useAppSelector } from "../../store/store";
import { fetchAllStores } from "../../store/features/agencySlice";
import { useAppDispatch } from "../../store/store";

import * as XLSX from "xlsx";

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

export interface CSVModalProps {
  isImportModalOpen: boolean;
  isExportModalOpen: boolean;
  setIsImportModalOpen: (isOpen: boolean) => void;
  setIsExportModalOpen: (isOpen: boolean) => void;
  handleImport: (file: File) => Promise<void>;
  agencies?: Agency[];
}

export interface CSVConfig {
  templateColumns: string[];
  sheetName: string;
  importEndpoint: string;
  exportEndpoint: string;
}

export const withCSVModals = <P extends object>(
  WrappedComponent: ComponentType<P & CSVModalProps>,
  config: CSVConfig
) => {
  return (props: P) => {
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const { selectedCompany } = useAppSelector((state) => state.client);
    const dispatch = useAppDispatch();
    const handleImport = async (file: File) => {
      try {
        let csvFile = file;

        // Convert Excel files to CSV if needed
        if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
          // Read the Excel file
          const reader = new FileReader();
          const buffer = await new Promise<ArrayBuffer>((resolve) => {
            reader.onload = (e) => resolve(e.target?.result as ArrayBuffer);
            reader.readAsArrayBuffer(file);
          });

          // Convert to CSV
          const workbook = XLSX.read(buffer, { type: "array" });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const csvContent = XLSX.utils.sheet_to_csv(firstSheet);

          // Create a new File object with CSV content
          const csvBlob = new Blob([csvContent], { type: "text/csv" });
          csvFile = new File(
            [csvBlob],
            file.name.replace(/\.(xlsx|xls)$/, ".csv"),
            {
              type: "text/csv",
            }
          );
        }

        const formData = new FormData();
        formData.append("csv_file", csvFile);
        formData.append("company_id", selectedCompany?.id?.toString() || "");

        const response = await agencyService.registerStore(
          selectedCompany?.dns || "",
          formData
        );

        await dispatch(fetchAllStores(selectedCompany?.dns || ""));
        setIsImportModalOpen(false);
        return response;
      } catch (error) {
        console.error("Error importing CSV:", error);
        throw error;
      }
    };

    return (
      <>
        <WrappedComponent
          {...props}
          isImportModalOpen={isImportModalOpen}
          isExportModalOpen={isExportModalOpen}
          setIsImportModalOpen={setIsImportModalOpen}
          setIsExportModalOpen={setIsExportModalOpen}
          handleImport={handleImport}
        />
        <ImportCSVModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          onImport={handleImport}
          templateColumns={config.templateColumns}
          sheetName={config.sheetName}
        />
        <ExportCSV
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          agencies={props.agencies || []}
          sheetName={config.sheetName}
        />
      </>
    );
  };
};
