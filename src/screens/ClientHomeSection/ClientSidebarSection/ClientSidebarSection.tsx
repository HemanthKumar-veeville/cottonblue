import {
  ClipboardListIcon,
  HelpCircleIcon,
  HomeIcon,
  LifeBuoyIcon,
  LogOutIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { RootState, useAppDispatch } from "../../../store/store";
import { logout } from "../../../store/features/authSlice";
import { useAppSelector } from "../../../store/store";
import { useCompanyColors } from "../../../hooks/useCompanyColors";
import { fetchDashboard } from "../../../store/features/dashboardSlice";
import { getHost } from "../../../utils/hostUtils";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Badge } from "../../../components/ui/badge";
import { getOrdersForApproval } from "../../../store/features/cartSlice";
import { getStoreBudget } from "../../../store/features/agencySlice";

let navItems = [
  {
    icon: <HomeIcon className="w-4 h-4" />,
    label: "sidebar.home",
    path: "/",
  },
  {
    icon: <ClipboardListIcon className="w-4 h-4" />,
    label: "sidebar.orderHistory",
    path: "/history",
  },
  {
    icon: <ClipboardListIcon className="w-4 h-4" />,
    label: "sidebar.adminDashboard",
    path: "/admin-dashboard",
  },
  {
    icon: <UsersIcon className="w-4 h-4" />,
    label: "sidebar.users.list",
    path: "/users",
  },
];

const bottomNavItems = [
  {
    icon: <LifeBuoyIcon className="w-4 h-4" />,
    label: "sidebar.support.title",
    path: "/support",
  },
  {
    icon: <SettingsIcon className="w-4 h-4" />,
    label: "sidebar.settings",
    path: "/settings",
  },
  {
    icon: <LogOutIcon className="w-4 h-4" />,
    label: "sidebar.logout",
    path: "/logout",
  },
];

const LogoSection = ({ companyLogo }: { companyLogo: string }) => (
  <div className="flex flex-col items-end justify-center w-full">
    <img
      className="w-full h-auto object-contain"
      alt="Logo vert"
      src={companyLogo}
    />
    <div className="w-fit font-text-small text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)]">
      by Cotton Blue
    </div>
  </div>
);

const NavigationMenu = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { isClientAdmin } = useAppSelector((state) => state.auth);
  navItems = navItems?.slice(0, isClientAdmin ? 4 : 2);
  const { buttonStyles } = useCompanyColors();
  const dispatch = useAppDispatch();
  const dns_prefix = getHost();
  const { ordersForApproval } = useAppSelector(
    (state: RootState) => state.cart
  );

  useEffect(() => {
    if (isClientAdmin) {
      dispatch(
        fetchDashboard({
          dns_prefix,
          filter_by: "monthly",
          filter_value: new Date().getMonth() + 1,
        })
      );
    }

    if (isClientAdmin) {
      dispatch(getOrdersForApproval({ dns_prefix }));
    }
  }, [dispatch, dns_prefix, isClientAdmin]);

  return (
    <nav className="w-full space-y-2" style={buttonStyles}>
      {navItems.map((item, index) => (
        <Button
          key={index}
          variant="ghost"
          onClick={() => navigate(item.path)}
          className={`h-fit flex justify-start items-center w-full gap-2 py-2 px-4 rounded-lg ${
            location.pathname === item.path
              ? "bg-[var(--primary-light-color)] text-[#1e2324]"
              : "bg-[color:var(--1-tokens-color-modes-nav-tab-primary-default-background)] text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)]"
          }`}
        >
          {item.icon}
          <span className="mt-[-1.00px] font-label-small text-wrap text-left">
            {t(item.label)}
          </span>
          {item.path === "/admin-dashboard" &&
            ordersForApproval?.length > 0 && (
              <Badge className="ml-auto bg-red-500 text-white">
                {ordersForApproval.length}
              </Badge>
            )}
        </Button>
      ))}
    </nav>
  );
};

const StoreBudgetSection = () => {
  const { t } = useTranslation();
  const { storeBudget } = useAppSelector((state) => state.agency);
  const storeBudgetData = storeBudget?.budget;

  const currentMonthOrders = storeBudgetData?.order_count || "-";
  const currentMonthAmount = storeBudgetData?.current_month_expenses || "-";
  const monthlyOrderLimit = storeBudgetData?.order_limit || "-";
  const monthlyExpenseLimit = storeBudgetData?.budget || "-";

  const budgetCards = [
    {
      title: "sidebar.budget.expenses",
      value: (
        <>
          <span className="text-emerald-500 text-2xl font-bold">
            {currentMonthAmount}€/
          </span>
          <span className="text-lg leading-[19.8px]">
            {monthlyExpenseLimit}€
          </span>
        </>
      ),
    },
    {
      title: "sidebar.budget.orders",
      value: (
        <>
          <span className="text-red-500 text-2xl font-bold">
            {currentMonthOrders}/
          </span>
          <span className="text-lg leading-[19.8px]">{monthlyOrderLimit}</span>
        </>
      ),
    },
  ];
  return (
    <section className="flex flex-col items-start gap-6 w-full">
      <div className="flex items-center justify-between w-full">
        <h2 className="w-fit font-bold text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] text-lg leading-7">
          {t("sidebar.budget.title")}
        </h2>
        <div className="group relative flex items-center">
          <HelpCircleIcon className="w-6 h-6 text-gray-500 cursor-pointer" />
          <div className="absolute bottom-full right-0 mb-2 w-56 rounded bg-white px-4 py-2 text-sm text-gray-700 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto before:content-[''] before:absolute before:top-full before:right-2 before:border-8 before:border-transparent before:border-t-white">
            Cette information est à titre indicatif et vous permet de respecter
            le cadre d'engagement budgétaire défini sous votre responsabilité
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start gap-3 w-full">
        {budgetCards.map((card, index) => (
          <Card
            key={index}
            className="w-full border-1-tokens-color-modes-border-secondary"
          >
            <CardContent className="flex flex-col items-center gap-4 p-4">
              <div className="flex items-center gap-4 w-full">
                <div className="flex flex-col items-start gap-2 flex-1">
                  <div className="w-fit mt-[-1.00px] font-text-medium text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)]">
                    {t(card.title)}
                  </div>
                  <div className="flex items-center gap-2 w-full">
                    <div className="flex-1 mt-[-1.00px]">{card.value}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
const BottomNavigation = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { buttonStyles } = useCompanyColors();
  const handleClick = async (path: string) => {
    if (path === "/logout") {
      try {
        await dispatch(logout(window.location.hostname.split(".")[0]));
        window.location.href = "/";
      } catch (error) {
        console.error("Logout failed:", error);
        window.location.href = "/";
      }
    } else {
      navigate(path);
    }
  };

  return (
    <div
      className="flex flex-col items-start gap-3 w-full"
      style={buttonStyles}
    >
      {bottomNavItems.map((item, index) => (
        <Button
          key={index}
          variant="ghost"
          onClick={() => handleClick(item.path)}
          className={`flex justify-start items-center w-full gap-2 py-2 px-4 rounded-lg ${
            location.pathname === item.path
              ? "bg-[var(--primary-light-color)] text-[#1e2324]"
              : "bg-[color:var(--1-tokens-color-modes-nav-tab-primary-default-background)]"
          }`}
        >
          {item.icon}
          <span className="mt-[-1.00px] font-label-small text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)]">
            {t(item.label)}
          </span>
        </Button>
      ))}
    </div>
  );
};

export const ClientSidebarSection = (): JSX.Element => {
  const { user } = useAppSelector((state) => state.auth);
  const companyLogo = user?.company_logo;

  const dispatch = useAppDispatch();
  const dns_prefix = getHost();
  const { selectedStore } = useAppSelector((state) => state.agency);

  useEffect(() => {
    if (selectedStore) {
      dispatch(
        getStoreBudget({ dnsPrefix: dns_prefix, storeId: selectedStore })
      );
    }
  }, [selectedStore, dispatch, dns_prefix]);

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-defaultwhite border-r border-solid border-1-tokens-color-modes-common-neutral-lower overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full relative">
      <div className="p-8 sticky top-0 bg-defaultwhite z-10">
        <LogoSection companyLogo={companyLogo} />
      </div>
      <div className="flex flex-col min-h-[calc(100vh-96px)]">
        <div className="flex-1 space-y-10 px-4">
          <NavigationMenu />
          <StoreBudgetSection />
        </div>
        <div className="sticky bottom-0 bg-defaultwhite px-4 pb-8 border-t border-1-tokens-color-modes-common-neutral-lower pt-8">
          <BottomNavigation />
        </div>
      </div>
    </aside>
  );
};
