import { SearchIcon, XIcon } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../../store/store";
import { getOrderStatusText } from "../../../utils/statusUtil";

interface StoreFilter {
  id: string;
  name: string;
  dns_prefix: string;
}

interface WarehouseListSectionProps {
  onSearch: (searchTerm: string) => void;
  activeStoreFilter: StoreFilter | null;
  activeStatusFilter: string | null;
  onClearFilter: () => void;
  onClearStatusFilter: () => void;
  selectedOrders: number[];
  onSelectedOrdersChange: (orders: number[]) => void;
  setSelectedOrders: (orders: number[]) => void;
}

export const WarehouseListSection = ({
  onSearch,
  activeStoreFilter,
  activeStatusFilter,
  onClearFilter,
  onClearStatusFilter,
  selectedOrders,
  onSelectedOrdersChange,
  setSelectedOrders,
}: WarehouseListSectionProps): JSX.Element => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const { selectedCompany } = useAppSelector((state) => state.client);
  const dns_prefix = selectedCompany?.dns || "admin";

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  // Handle search input change with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <section className="flex flex-col gap-[var(--2-tokens-screen-modes-common-spacing-m)] w-full">
      <header>
        <h3 className="font-heading-h3 text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] text-[length:var(--heading-h3-font-size)] tracking-[var(--heading-h3-letter-spacing)] leading-[var(--heading-h3-line-height)] font-[number:var(--heading-h3-font-weight)] [font-style:var(--heading-h3-font-style)]">
          {t("warehouse.title")}
        </h3>
      </header>

      <div className="flex flex-col gap-4 w-full">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <div className="relative w-[400px]">
              <Input
                className="pl-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-h)] pr-12 py-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-v)] bg-[color:var(--1-tokens-color-modes-input-primary-default-background)] border-[color:var(--1-tokens-color-modes-input-primary-default-border)] rounded-[var(--2-tokens-screen-modes-input-border-radius)]"
                placeholder={t("warehouse.search.placeholder")}
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-line-height)] h-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-line-height)]">
                <SearchIcon className="w-5 h-5 text-[color:var(--1-tokens-color-modes-input-primary-default-icon)]" />
              </div>
            </div>
          </div>
        </div>

        {(activeStoreFilter || activeStatusFilter) && (
          <div className="flex gap-2">
            {activeStoreFilter && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                <span>{activeStoreFilter.name}</span>
                <button
                  onClick={onClearFilter}
                  className="p-0.5 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            )}
            {activeStatusFilter && (
              <div
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                  activeStatusFilter === "confirmed"
                    ? "bg-green-50 text-green-700"
                    : "bg-orange-50 text-orange-700"
                }`}
              >
                <span>{getOrderStatusText(activeStatusFilter, t)}</span>
                <button
                  onClick={onClearStatusFilter}
                  className="p-0.5 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
