import React, {
  useState,
  createContext,
  useContext,
  useEffect,
  useRef,
} from "react";
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
import { Card } from "../ui/card";
import { MessageSquareIcon } from "lucide-react";
import { fetchTickets } from "../../store/features/ticketSlice";

interface NavTabItem {
  id: number;
  name: string;
  icon: string;
  active: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}

enum TicketStatus {
  OPEN = "open",
  IN_PROGRESS = "in_progress",
  CLOSED = "closed",
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
  const { tickets } = useAppSelector((state) => state.ticket);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const [selectedStore, setSelectedStore] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const openTickets = tickets?.filter(
    (ticket: any) =>
      ticket.ticket_status === TicketStatus.OPEN ||
      ticket.ticket_status === TicketStatus.IN_PROGRESS
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchTicketsData = async () => {
      try {
        await dispatch(
          fetchTickets({
            dnsPrefix: isWarehouseHostname() ? "sedis" : "admin",
            ticketStatus: undefined,
          })
        ).unwrap();
      } catch (error) {
        console.error("Failed to fetch tickets:", error);
      }
    };

    fetchTicketsData();
  }, [dispatch]);

  const handleNotificationClick = () => {
    navigate("/support/tickets");
    setShowNotifications(false);
  };

  const storeList = stores?.stores?.map(
    (store: { id: string; name: string }) => ({
      id: store.id,
      name: store.name,
    })
  );

  const companyList =
    companies?.companies?.map((company) => ({
      id: company.id,
      name: company.name,
      dns: company.dns_prefix,
    })) || [];

  useEffect(() => {
    dispatch(getAllCompanies({ page: 1, limit: 1000, search: "" }));
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

  const pathname = useLocation().pathname;

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
                  {companyList &&
                    companyList?.length > 0 &&
                    companyList.map((company) => (
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
                  {companyList && companyList?.length === 0 && (
                    <div className="px-4 py-2 text-gray-500">
                      {t("common.noCompanies")}
                    </div>
                  )}
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
          <div
            className="flex items-center justify-center relative"
            ref={notificationRef}
          >
            <div
              className="flex h-12 items-center justify-center p-3 relative cursor-pointer hover:bg-gray-100 rounded-full transition-colors duration-200"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <img className="w-6 h-6" alt="Bell" src="/img/bell.svg" />
              {openTickets?.length > 0 && (
                <Badge className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center bg-defaultalert rounded-full">
                  <span className="text-white text-xs font-medium">
                    {openTickets.length}
                  </span>
                </Badge>
              )}
            </div>

            {showNotifications && (
              <Card className="absolute right-0 top-[calc(100%+0.5rem)] w-[320px] shadow-lg border bg-gray-50 border-gray-200 rounded-lg overflow-hidden z-[60]">
                <div className="p-3 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {t("notifications.title")}
                  </h3>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {openTickets?.length > 0 ? (
                    <div
                      className="p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all duration-200"
                      onClick={handleNotificationClick}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-full flex-shrink-0">
                          <MessageSquareIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {t("notifications.ticketsToHandle", {
                              count: openTickets.length,
                            })}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {t("notifications.clickToView")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-gray-500">
                      {t("notifications.noNotifications")}
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
