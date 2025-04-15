import { ComponentType, useState } from "react";
import ImportCSVModal from "../ImportCSVModal/ImportCSVModal";
import { ExportCSV } from "../ExportCSV/ExportCSV";
import { agencyService } from "../../services/agencyService";
import { useAppSelector } from "../../store/store";
import { RootState } from "../../store/store";

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
    const company = useAppSelector(
      (state: RootState) => state.client.selectedCompany
    );

    const handleImport = async (file: File) => {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await agencyService.registerStore(
          company?.name,
          formData
        );

        if (!response.ok) {
          throw new Error("Import failed");
        }

        // Handle successful import
        setIsImportModalOpen(false);
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
