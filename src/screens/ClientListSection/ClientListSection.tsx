import { PlusIcon, SearchIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import { InfoIcon } from "lucide-react";

interface ClientListSectionProps {
  onSearch: (searchTerm: string) => void;
  searchTerm: string;
}

export const ClientListSection = ({
  onSearch,
  searchTerm,
}: ClientListSectionProps): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onSearch(value);
  };

  // Handle add client button click
  const handleAddClient = () => {
    navigate("/customers/add");
  };

  return (
    <section className="flex flex-col gap-[var(--2-tokens-screen-modes-common-spacing-m)] w-full">
      <header>
        <h3 className="font-heading-h3 text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] text-[length:var(--heading-h3-font-size)] tracking-[var(--heading-h3-letter-spacing)] leading-[var(--heading-h3-line-height)] font-[number:var(--heading-h3-font-weight)] [font-style:var(--heading-h3-font-style)]">
          {t("sidebar.customers.list")}
        </h3>
      </header>

      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <div className="relative w-[400px]">
            <Input
              className="pl-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-h)] pr-12 py-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-v)] bg-[color:var(--1-tokens-color-modes-input-primary-default-background)] border-[color:var(--1-tokens-color-modes-input-primary-default-border)] rounded-[var(--2-tokens-screen-modes-input-border-radius)]"
              placeholder={t("sidebar.customers.search.placeholder")}
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-line-height)] h-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-line-height)]">
              <SearchIcon className="w-5 h-5 text-[color:var(--1-tokens-color-modes-input-primary-default-icon)]" />
            </div>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                  <InfoIcon className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="bg-gray-800 text-white border-none mb-10"
              >
                <div className="flex flex-col gap-1">
                  <p className="font-medium">
                    {t("sidebar.customers.search.tooltip.title")}
                  </p>
                  <ul className="list-disc list-inside text-sm">
                    <li>{t("sidebar.customers.search.tooltip.items.name")}</li>
                    <li>{t("sidebar.customers.search.tooltip.items.phone")}</li>
                    <li>{t("sidebar.customers.search.tooltip.items.city")}</li>
                    <li>
                      {t("sidebar.customers.search.tooltip.items.address")}
                    </li>
                  </ul>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex items-center gap-[var(--2-tokens-screen-modes-common-spacing-m)]">
          <Button
            className="flex items-center gap-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-gap)] py-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-h)] px-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-v)] min-w-[92px] bg-[#07515f] rounded-[var(--2-tokens-screen-modes-nav-tab-border-radius)]"
            onClick={handleAddClient}
          >
            <PlusIcon className="w-6 h-6" />
            <span className="font-label-smaller text-[length:var(--label-smaller-font-size)] leading-[var(--label-smaller-line-height)] tracking-[var(--label-smaller-letter-spacing)] font-[number:var(--label-smaller-font-weight)] text-[color:var(--1-tokens-color-modes-button-primary-default-text)] [font-style:var(--label-smaller-font-style)]">
              {t("sidebar.customers.add")}
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
};
