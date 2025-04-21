import { DownloadIcon, PlusIcon, SearchIcon, UploadIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useAppDispatch } from "../../store/store";
import {
  withCSVModals,
  CSVModalProps,
} from "../../components/CSVModals/withCSVModals";

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

interface AgencyListSectionProps {
  onSearch: (searchTerm: string) => void;
  agencies: Agency[];
}

const AgencyListSectionBase = ({
  onSearch,
  agencies,
  setIsImportModalOpen,
  setIsExportModalOpen,
}: AgencyListSectionProps & CSVModalProps): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  // Handle add agency button click
  const handleAddAgency = () => {
    // This would typically open a modal or navigate to a form
    console.log("Add agency clicked");
  };

  return (
    <section className="flex flex-col gap-[var(--2-tokens-screen-modes-common-spacing-m)] w-full">
      <header>
        <h3 className="font-heading-h3 text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] text-[length:var(--heading-h3-font-size)] tracking-[var(--heading-h3-letter-spacing)] leading-[var(--heading-h3-line-height)] font-[number:var(--heading-h3-font-weight)] [font-style:var(--heading-h3-font-style)]">
          {t("agencyList.title", "Agency List")}
        </h3>
      </header>

      <div className="flex items-center justify-between w-full">
        <div className="relative w-[400px]">
          <Input
            className="pl-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-h)] pr-12 py-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-v)] bg-[color:var(--1-tokens-color-modes-input-primary-default-background)] border-[color:var(--1-tokens-color-modes-input-primary-default-border)] rounded-[var(--2-tokens-screen-modes-input-border-radius)]"
            placeholder={t(
              "agencyList.search.placeholder",
              "Search agencies..."
            )}
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-line-height)] h-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-line-height)]">
            <SearchIcon className="w-5 h-5 text-[color:var(--1-tokens-color-modes-input-primary-default-icon)]" />
          </div>
        </div>

        <div className="flex items-center gap-[var(--2-tokens-screen-modes-common-spacing-m)]">
          <Button
            className="flex items-center gap-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-gap)] py-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-h)] px-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-v)] min-w-[92px] bg-[#07515f] rounded-[var(--2-tokens-screen-modes-nav-tab-border-radius)]"
            onClick={handleAddAgency}
          >
            <PlusIcon className="w-6 h-6" />
            <span className="font-label-smaller text-[length:var(--label-smaller-font-size)] leading-[var(--label-smaller-line-height)] tracking-[var(--label-smaller-letter-spacing)] font-[number:var(--label-smaller-font-weight)] text-[color:var(--1-tokens-color-modes-button-primary-default-text)] [font-style:var(--label-smaller-font-style)]">
              {t("agencyList.actions.create", "Add Agency")}
            </span>
          </Button>

          <Button
            variant="outline"
            className="flex items-center gap-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-gap)] py-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-h)] px-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-v)] min-w-[92px] bg-[color:var(--1-tokens-color-modes-button-secondary-default-background)] border-[color:var(--1-tokens-color-modes-button-secondary-default-border)] rounded-[var(--2-tokens-screen-modes-button-border-radius)]"
            onClick={() => setIsImportModalOpen(true)}
          >
            <DownloadIcon className="w-6 h-6 text-[color:var(--1-tokens-color-modes-button-secondary-default-icon)]" />
            <span className="font-label-smaller text-[length:var(--label-smaller-font-size)] leading-[var(--label-smaller-line-height)] tracking-[var(--label-smaller-letter-spacing)] font-[number:var(--label-smaller-font-weight)] text-[color:var(--1-tokens-color-modes-button-secondary-default-text)] [font-style:var(--label-smaller-font-style)]">
              {t("agencyList.actions.importCsv", "Import CSV")}
            </span>
          </Button>

          <Button
            variant="outline"
            className="flex items-center gap-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-gap)] py-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-h)] px-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-v)] min-w-[92px] bg-[color:var(--1-tokens-color-modes-button-secondary-default-background)] border-[color:var(--1-tokens-color-modes-button-secondary-default-border)] rounded-[var(--2-tokens-screen-modes-button-border-radius)]"
            onClick={() => setIsExportModalOpen(true)}
          >
            <UploadIcon className="w-6 h-6 text-[color:var(--1-tokens-color-modes-button-secondary-default-icon)]" />
            <span className="font-label-smaller text-[length:var(--label-smaller-font-size)] leading-[var(--label-smaller-line-height)] tracking-[var(--label-smaller-letter-spacing)] font-[number:var(--label-smaller-font-weight)] text-[color:var(--1-tokens-color-modes-button-secondary-default-text)] [font-style:var(--label-smaller-font-style)]">
              {t("agencyList.actions.exportCsv", "Export CSV")}
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
};

// Configure the CSV functionality for agencies
const csvConfig = {
  templateColumns: [
    "store_name",
    "store_address",
    "city",
    "postal_code",
    "phone_number",
    "latitude",
    "longitude",
    "store_region",
  ],
  sheetName: "Agencies",
  importEndpoint: "/api/agencies/import",
  exportEndpoint: "/api/agencies/export",
};

// Create the enhanced component with CSV functionality
export const AgencyListSection = withCSVModals(
  AgencyListSectionBase,
  csvConfig
);
