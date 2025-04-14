import { DownloadIcon, PlusIcon, SearchIcon, UploadIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useAppDispatch } from "../../store/store";

interface AgencyListSectionProps {
  onSearch: (searchTerm: string) => void;
}

export const AgencyListSection = ({
  onSearch,
}: AgencyListSectionProps): JSX.Element => {
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

  // Handle import CSV button click
  const handleImportCSV = () => {
    // Create a file input element
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".csv";

    // Handle file selection
    fileInput.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
          const csvData = event.target?.result as string;
          console.log("CSV Data:", csvData);
          // Here you would parse the CSV and dispatch actions to add agencies
        };

        reader.readAsText(file);
      }
    };

    // Trigger file selection dialog
    fileInput.click();
  };

  // Handle export CSV button click
  const handleExportCSV = () => {
    // This would typically get the current agency data and convert it to CSV
    console.log("Export CSV clicked");
    // For demonstration, we'll create a sample CSV
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "ID,Name,Phone,City,Address,Longitude,Latitude,Created At,Updated At,Company ID,Postal Code,Status\n" +
      "1,Store 1,1234567890,City A,123 Main St,56.78,12.34,2025-04-14,2025-04-14,12,12345,Active\n" +
      "2,Store 2,9876543210,City B,456 Oak Ave,78.90,34.56,2025-04-15,2025-04-15,12,54321,Active\n";

    // Create a download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "agencies.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="flex flex-col gap-[var(--2-tokens-screen-modes-common-spacing-m)] w-full">
      <header>
        <h3 className="font-heading-h3 text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] text-[length:var(--heading-h3-font-size)] tracking-[var(--heading-h3-letter-spacing)] leading-[var(--heading-h3-line-height)] font-[number:var(--heading-h3-font-weight)] [font-style:var(--heading-h3-font-style)]">
          Agency List
        </h3>
      </header>

      <div className="flex items-center justify-between w-full">
        <div className="relative w-[400px]">
          <Input
            className="pl-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-h)] pr-12 py-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-v)] bg-[color:var(--1-tokens-color-modes-input-primary-default-background)] border-[color:var(--1-tokens-color-modes-input-primary-default-border)] rounded-[var(--2-tokens-screen-modes-input-border-radius)]"
            placeholder="Search agencies..."
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
              Add Agency
            </span>
          </Button>

          <Button
            variant="outline"
            className="flex items-center gap-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-gap)] py-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-h)] px-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-v)] min-w-[92px] bg-[color:var(--1-tokens-color-modes-button-secondary-default-background)] border-[color:var(--1-tokens-color-modes-button-secondary-default-border)] rounded-[var(--2-tokens-screen-modes-button-border-radius)]"
            onClick={handleImportCSV}
          >
            <DownloadIcon className="w-6 h-6 text-[color:var(--1-tokens-color-modes-button-secondary-default-icon)]" />
            <span className="font-label-smaller text-[length:var(--label-smaller-font-size)] leading-[var(--label-smaller-line-height)] tracking-[var(--label-smaller-letter-spacing)] font-[number:var(--label-smaller-font-weight)] text-[color:var(--1-tokens-color-modes-button-secondary-default-text)] [font-style:var(--label-smaller-font-style)]">
              Import CSV
            </span>
          </Button>

          <Button
            variant="outline"
            className="flex items-center gap-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-gap)] py-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-h)] px-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-v)] min-w-[92px] bg-[color:var(--1-tokens-color-modes-button-secondary-default-background)] border-[color:var(--1-tokens-color-modes-button-secondary-default-border)] rounded-[var(--2-tokens-screen-modes-button-border-radius)]"
            onClick={handleExportCSV}
          >
            <UploadIcon className="w-6 h-6 text-[color:var(--1-tokens-color-modes-button-secondary-default-icon)]" />
            <span className="font-label-smaller text-[length:var(--label-smaller-font-size)] leading-[var(--label-smaller-line-height)] tracking-[var(--label-smaller-letter-spacing)] font-[number:var(--label-smaller-font-weight)] text-[color:var(--1-tokens-color-modes-button-secondary-default-text)] [font-style:var(--label-smaller-font-style)]">
              Export CSV
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
};
