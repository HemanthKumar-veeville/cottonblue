import React, { useState, createContext, useContext, useEffect } from "react";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../store/store";
import {
  getAllCompanies,
  setSelectedCompany,
} from "../../store/features/clientSlice";
import { useAppSelector } from "../../store/store";
import { fetchAllStores } from "../../store/features/agencySlice";
import { useNavigate, useLocation } from "react-router-dom";
import { resetDashboard } from "../../store/features/dashboardSlice";
import { setAdminMode } from "../../store/features/authSlice";
import { isDevHostname, isWarehouseHostname } from "../../utils/hostUtils";

interface NavTabItem {
  id: number;
  name: string;
  icon: string;
  active: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}

export const AdminModeContext = createContext<{
  isAdminMode: boolean;
  setIsAdminMode: (value: boolean) => void;
}>({
  isAdminMode: true,
  setIsAdminMode: () => {},
});

export const useAdminMode = () => useContext(AdminModeContext);

export const AdminModeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAdminMode, setIsAdminMode] = useState(true);

  return (
    <AdminModeContext.Provider value={{ isAdminMode, setIsAdminMode }}>
      {children}
    </AdminModeContext.Provider>
  );
};

const navTabs: NavTabItem[] = [
  {
    id: 1,
    name: "header.adminManagement",
    icon: "/img/crown.svg",
    active: true,
    isFirst: true,
  },
  {
    id: 2,
    name: "header.clientManagement",
    icon: "/img/crown.svg",
    active: false,
    isLast: true,
  },
];

const NavTab = ({ tab, onClick }: { tab: NavTabItem; onClick: () => void }) => {
  const { t } = useTranslation();

  const getRoundedClasses = () => {
    if (tab.isFirst) return "rounded-l-lg";
    if (tab.isLast) return "rounded-r-lg";
    return "";
  };

  return (
    <button
      onClick={onClick}
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
  const [tabs, setTabs] = useState<NavTabItem[]>(navTabs);
  const { setIsAdminMode } = useAdminMode();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { companies, selectedCompany } = useAppSelector(
    (state) => state.client
  );
  const { stores } = useAppSelector((state) => state.agency);
  const [selectedStore, setSelectedStore] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const storeList = stores?.stores?.map(
    (store: { id: string; name: string }) => ({
      id: store.id,
      name: store.name,
    })
  );
  const pathname = useLocation().pathname;

  const companyList =
    companies?.companies?.map((company) => ({
      id: company.id,
      name: company.name,
      dns: company.dns_prefix,
    })) || [];

  useEffect(() => {
    dispatch(getAllCompanies());
    dispatch(setAdminMode(true));
  }, [dispatch]);

  const handleTabClick = (tabId: number) => {
    dispatch(resetDashboard());

    const newTabs = tabs.map((tab) => ({
      ...tab,
      active: tab.id === tabId,
    }));
    setTabs(newTabs);
    setIsAdminMode(tabId === 1);
    if (
      (!isWarehouseHostname() || isDevHostname()) &&
      pathname !== "/warehouse" &&
      pathname !== "/test-board" &&
      pathname !== "/error-logs"
    ) {
      tabId === 1 ? navigate("/dashboard") : navigate("/client-dashboard");
    }

    tabId === 1 ? dispatch(setAdminMode(true)) : dispatch(setAdminMode(false));
  };

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
  };

  const handleCompanySelect = (company: { id: string; name: string }) => {
    dispatch(resetDashboard());
    dispatch(setSelectedCompany(company));
    dispatch(fetchAllStores(company.dns));
  };

  const handleStoreSelect = (store: { id: string; name: string }) => {
    setSelectedStore(store);
    // Add any additional store selection logic here
  };

  return (
    <header className="flex flex-col items-start relative flex-1 self-stretch grow bg-white">
      <div className="flex items-center justify-between px-8 py-4 relative self-stretch w-full flex-[0_0_auto] border-b border-solid border-gray-300">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            <div className="flex items-start bg-[#F8F9FA] p-1 rounded-lg">
              {tabs.map((tab) => (
                <NavTab
                  key={tab.id}
                  tab={tab}
                  onClick={() => handleTabClick(tab.id)}
                />
              ))}
            </div>
          </div>
          {tabs.find((tab) => tab.id === 2)?.active && (
            <div className="flex items-center gap-3">
              <div className="relative">
                <div
                  className="flex w-[200px] items-center justify-center gap-3 py-3 px-3 self-stretch bg-gray-100 rounded-lg border border-solid border-gray-300 cursor-pointer"
                  onClick={() => {
                    const dropdown =
                      document.getElementById("company-dropdown");
                    if (dropdown) {
                      dropdown.classList.toggle("hidden");
                    }
                  }}
                >
                  <div className="flex w-6 h-6 items-center justify-center shrink-0">
                    <img className="w-5 h-5" alt="Icon" src="/img/icon-9.svg" />
                  </div>
                  <div className="flex-1 font-medium text-gray-700 text-base leading-4 tracking-normal truncate">
                    {selectedCompany?.name || "Select Company"}
                  </div>
                  <div className="flex w-6 h-6 items-center justify-center shrink-0">
                    <img
                      className="w-4 h-4"
                      alt="Chevron down"
                      src="/img/icon-13.svg"
                    />
                  </div>
                </div>
                <div
                  id="company-dropdown"
                  className="hidden absolute top-full left-0 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50"
                >
                  {companyList.map((company) => (
                    <div
                      key={company.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        handleCompanySelect(company);
                        const dropdown =
                          document.getElementById("company-dropdown");
                        if (dropdown) {
                          dropdown.classList.add("hidden");
                        }
                      }}
                    >
                      {company.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
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
