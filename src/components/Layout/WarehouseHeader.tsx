import React from "react";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useTranslation } from "react-i18next";

export const WarehouseHeader = (): JSX.Element => {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
  };

  return (
    <header className="flex flex-col items-start relative flex-1 self-stretch grow bg-white">
      <div className="flex items-center justify-between px-8 py-4 relative self-stretch w-full flex-[0_0_auto] border-b border-solid border-gray-300">
        <div className="flex items-center gap-4">
          {/* Left side content can be added here if needed */}
        </div>
        <div className="flex items-center gap-4">
          <Select
            defaultValue={i18n.language}
            onValueChange={handleLanguageChange}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">{t("language.en")}</SelectItem>
              <SelectItem value="fr">{t("language.fr")}</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center justify-center">
            <div className="flex h-12 items-center justify-center p-3 relative">
              <img className="w-6 h-6" alt="Bell" src="/img/bell.svg" />
              <Badge className="absolute top-2 left-6 bg-red-500 rounded-xl">
                <span className="text-white text-xs">9</span>
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
