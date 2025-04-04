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

interface NavTabItem {
  id: number;
  name: string;
  icon: string;
  active: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}

const navTabs: NavTabItem[] = [
  {
    id: 1,
    name: "header.adminManagement",
    icon: "/img/crown.svg",
    active: false,
    isFirst: true,
  },
  {
    id: 2,
    name: "header.clientManagement",
    icon: "/img/icon-8.svg",
    active: true,
    isLast: true,
  },
];

const NavTab = ({ tab }: { tab: NavTabItem }) => {
  const { t } = useTranslation();

  const getRoundedClasses = () => {
    if (tab.isFirst) return "rounded-l-lg";
    if (tab.isLast) return "rounded-r-lg";
    return "";
  };

  return (
    <button
      className={`flex items-center gap-2 px-4 py-3 transition-colors duration-200 ${getRoundedClasses()} ${
        tab.active
          ? "bg-[#07515F] text-white"
          : "bg-[#F8F9FA] text-[#6C757D] hover:bg-gray-200"
      }`}
    >
      <img
        src={tab.icon}
        alt=""
        className={`w-5 h-5 ${tab.active ? "brightness-0 invert" : ""}`}
      />
      <span className="text-sm font-medium whitespace-nowrap">
        {t(tab.name)}
      </span>
    </button>
  );
};

export const SuperadminHeader = (): JSX.Element => {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
  };

  return (
    <header className="flex flex-col items-start relative flex-1 self-stretch grow bg-white">
      <div className="flex items-center justify-between px-8 py-4 relative self-stretch w-full flex-[0_0_auto] border-b border-solid border-gray-300">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            <div className="flex items-start bg-[#F8F9FA] p-1 rounded-lg">
              {navTabs.map((tab) => (
                <NavTab key={tab.id} tab={tab} />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex w-[200px] items-center justify-center gap-3 py-3 px-3 self-stretch bg-gray-100 rounded-lg border border-solid border-gray-300">
              <div className="flex w-6 h-6 items-center justify-center shrink-0">
                <img className="w-5 h-5" alt="Icon" src="/img/icon-9.svg" />
              </div>
              <div className="flex-1 font-medium text-gray-700 text-base leading-4 tracking-normal truncate">
                Chronodrive
              </div>
              <div className="flex w-6 h-6 items-center justify-center shrink-0">
                <img
                  className="w-4 h-4"
                  alt="Chevron down"
                  src="/img/icon-13.svg"
                />
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 py-3 px-3 self-stretch bg-gray-100 rounded-lg border border-solid border-gray-300">
              <div className="flex w-6 h-6 items-center justify-center shrink-0">
                <img className="w-5 h-5" alt="Icon" src="/img/icon-10.svg" />
              </div>
              <div className="font-medium text-gray-700 text-base leading-4 truncate">
                Marcq-en-Baroeul
              </div>
              <div className="flex w-6 h-6 items-center justify-center shrink-0">
                <img
                  className="w-4 h-4"
                  alt="Chevron down"
                  src="/img/icon-13.svg"
                />
              </div>
            </div>
          </div>
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
