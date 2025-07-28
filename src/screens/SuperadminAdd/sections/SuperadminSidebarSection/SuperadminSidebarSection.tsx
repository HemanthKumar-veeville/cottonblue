import {
  BookOpenIcon,
  BugIcon,
  FileTextIcon,
  HomeIcon,
  LayoutGridIcon,
  LogOutIcon,
  MessageSquareIcon,
  PackageIcon,
  PlusCircleIcon,
  SettingsIcon,
  TestTubeIcon,
  UserPlusIcon,
  UsersIcon,
  BuildingIcon,
  ClipboardListIcon,
  BoxesIcon,
  ShoppingCartIcon,
  BarChartIcon,
  StoreIcon,
  ListIcon,
  BoxIcon,
  GalleryHorizontalIcon,
} from "lucide-react";
import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../../store/features/authSlice";
import {
  RootState,
  AppDispatch,
  useAppSelector,
} from "../../../../store/store";
import {
  isDevHostname,
  isWarehouseHostname,
} from "../../../../utils/hostUtils";
import { Badge } from "../../../../components/ui/badge";
import { fetchTickets } from "../../../../store/features/ticketSlice";

const isDevDomain = isDevHostname();

interface NavItem {
  icon: JSX.Element;
  label: string;
  path: string;
  onClick?: () => void;
  badge?: number;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

enum TicketStatus {
  OPEN = "open",
  IN_PROGRESS = "in_progress",
  CLOSED = "closed",
}

const NavButton = ({
  icon,
  label,
  path,
  onClick,
  badge,
}: NavItem & { onClick?: () => void }) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`flex items-center gap-3 p-2.5 w-full rounded ${
          isActive
            ? "bg-[#e9fffd]"
            : "bg-[color:var(--1-tokens-color-modes-nav-tab-primary-default-background)]"
        }`}
      >
        <div className="flex w-5 h-5 items-center justify-center">{icon}</div>
        <span
          className={`flex-1 font-label-small font-[number:var(--label-small-font-weight)] text-[length:var(--label-small-font-size)] tracking-[var(--label-small-letter-spacing)] leading-[var(--label-small-line-height)] text-left ${
            isActive
              ? "text-[#07515f]"
              : "text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)]"
          }`}
        >
          {label}
        </span>
        {badge !== undefined && badge > 0 && (
          <Badge className="bg-defaultalert text-white text-xs font-semibold rounded-full min-w-[20px] h-[20px] flex items-center justify-center">
            {badge}
          </Badge>
        )}
      </button>
    );
  }

  return (
    <Link
      to={path}
      className={`flex items-center gap-3 p-2.5 w-full rounded ${
        isActive
          ? "bg-[#e9fffd]"
          : "bg-[color:var(--1-tokens-color-modes-nav-tab-primary-default-background)]"
      }`}
    >
      <div className="flex w-5 h-5 items-center justify-center">{icon}</div>
      <span
        className={`flex-1 font-label-small font-[number:var(--label-small-font-weight)] text-[length:var(--label-small-font-size)] tracking-[var(--label-small-letter-spacing)] leading-[var(--label-small-line-height)] text-left ${
          isActive
            ? "text-[#07515f]"
            : "text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)]"
        }`}
      >
        {label}
      </span>
      {badge !== undefined && badge > 0 && (
        <Badge className="bg-defaultalert text-white text-xs font-semibold rounded-full min-w-[20px] h-[20px] flex items-center justify-center">
          {badge}
        </Badge>
      )}
    </Link>
  );
};

export const SuperadminSidebarSection = ({
  isAdminMode = false,
}): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { companyColor, companyTextColor, companyLogo } = useAppSelector(
    (state) => state.auth
  );
  const company = useSelector((state: RootState) => state.auth.company);
  const isWarehouse = isWarehouseHostname();
  const { tickets } = useAppSelector((state: RootState) => state.ticket);

  const openTickets = tickets?.filter(
    (ticket: any) =>
      ticket.ticket_status === TicketStatus.OPEN ||
      ticket.ticket_status === TicketStatus.IN_PROGRESS
  );

  useEffect(() => {
    const fetchTicketsData = async () => {
      try {
        await dispatch(
          fetchTickets({
            dnsPrefix: isWarehouse ? "warehouse" : "admin",
            ticketStatus: undefined,
          })
        ).unwrap();
      } catch (error) {
        console.error("Failed to fetch tickets:", error);
      }
    };

    fetchTicketsData();
  }, [dispatch, isWarehouse]);

  const handleLogout = async () => {
    try {
      if (company) {
        await dispatch(logout(company)).unwrap();
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Logout failed:", error);
      // Still navigate to root even if logout fails
      navigate("/");
    }
  };

  const adminNavigationSections: NavSection[] = [
    {
      items: [
        {
          icon: <HomeIcon className="w-4 h-4" />,
          label: t("sidebar.dashboard"),
          path: "/dashboard",
        },
        {
          icon: <StoreIcon className="w-4 h-4" />,
          label: t("sidebar.warehouse.title"),
          path: "/warehouse",
        },
      ],
    },
    {
      title: t("sidebar.customers.title"),
      items: [
        {
          icon: <UsersIcon className="w-4 h-4" />,
          label: t("sidebar.customers.list"),
          path: "/customers",
        },
        {
          icon: <UserPlusIcon className="w-4 h-4" />,
          label: t("sidebar.customers.add"),
          path: "/customers/add",
        },
      ],
    },
    ...(isDevDomain
      ? [
          {
            title: t("sidebar.test.title"),
            items: [
              {
                icon: <TestTubeIcon className="w-4 h-4" />,
                label: t("sidebar.test.testBoard"),
                path: "/test-board",
              },
            ],
          },
          {
            title: t("sidebar.error.title"),
            items: [
              {
                icon: <BugIcon className="w-4 h-4" />,
                label: t("sidebar.error.errorLogs"),
                path: "/error-logs",
              },
            ],
          },
        ]
      : []),
    {
      title: t("sidebar.support.title"),
      items: [
        {
          icon: <MessageSquareIcon className="w-4 h-4" />,
          label: t("sidebar.support.tickets"),
          path: "/support/tickets",
          badge: openTickets?.length || 0,
        },
      ],
    },
  ];

  const clientNavigationSections: NavSection[] = [
    {
      items: [
        {
          icon: <HomeIcon className="w-4 h-4" />,
          label: t("sidebar.dashboard"),
          path: "/client-dashboard",
        },
        {
          icon: <StoreIcon className="w-4 h-4" />,
          label: t("sidebar.warehouse.title"),
          path: "/warehouse",
        },
        {
          icon: <ClipboardListIcon className="w-4 h-4" />,
          label: t("sidebar.orderHistory"),
          path: "/order-history",
        },
      ],
    },
    {
      title: t("sidebar.products.title"),
      items: [
        {
          icon: <BuildingIcon className="w-4 h-4" />,
          label: t("sidebar.products.list"),
          path: "/products",
        },
        {
          icon: <BoxIcon className="w-4 h-4" />,
          label: t("sidebar.products.manage_stock"),
          path: "/manage-stock",
        },
        {
          icon: <PlusCircleIcon className="w-4 h-4" />,
          label: t("sidebar.products.add"),
          path: "/products/add",
        },
        {
          icon: <GalleryHorizontalIcon className="w-4 h-4" />,
          label: t("sidebar.products.carousel"),
          path: "/products/carousel",
        },
      ],
    },
    {
      title: t("sidebar.agencies.title"),
      items: [
        {
          icon: <BuildingIcon className="w-4 h-4" />,
          label: t("sidebar.agencies.list"),
          path: "/agencies",
        },
        {
          icon: <PlusCircleIcon className="w-4 h-4" />,
          label: t("sidebar.agencies.add"),
          path: "/agencies/add",
        },
        {
          icon: <UsersIcon className="w-4 h-4" />,
          label: t("sidebar.users.list"),
          path: "/users",
        },
        {
          icon: <UserPlusIcon className="w-4 h-4" />,
          label: t("sidebar.users.add"),
          path: "/users/add",
        },
      ],
    },
    ...(isDevDomain
      ? [
          {
            title: t("sidebar.test.title"),
            items: [
              {
                icon: <TestTubeIcon className="w-4 h-4" />,
                label: t("sidebar.test.testBoard"),
                path: "/test-board",
              },
            ],
          },
          {
            title: t("sidebar.error.title"),
            items: [
              {
                icon: <BugIcon className="w-4 h-4" />,
                label: t("sidebar.error.errorLogs"),
                path: "/error-logs",
              },
            ],
          },
        ]
      : []),
    {
      title: t("sidebar.support.title"),
      items: [
        {
          icon: <MessageSquareIcon className="w-4 h-4" />,
          label: t("sidebar.support.tickets"),
          path: "/support/tickets",
          badge: openTickets?.length || 0,
        },
      ],
    },
  ];

  const warehouseNavigationSections: NavSection[] = [
    {
      title: t("sidebar.products.title"),
      items: [
        {
          icon: <BarChartIcon className="w-4 h-4" />,
          label: t("sidebar.dashboard"),
          path: "/warehouse",
        },
        {
          icon: <BoxesIcon className="w-4 h-4" />,
          label: t("sidebar.products.list"),
          path: "/products",
        },
      ],
    },
    {
      title: t("sidebar.support.title"),
      items: [
        {
          icon: <MessageSquareIcon className="w-4 h-4" />,
          label: t("sidebar.support.tickets"),
          path: "/support",
          badge: openTickets?.length || 0,
        },
      ],
    },
  ];

  const superadminFooterNavItems: NavItem[] = [
    {
      icon: <SettingsIcon className="w-4 h-4" />,
      label: t("sidebar.settings"),
      path: "/settings",
    },
    {
      icon: <LogOutIcon className="w-4 h-4" />,
      label: t("sidebar.logout"),
      path: "/logout",
      onClick: handleLogout,
    },
  ];

  const warehouseFooterNavItems: NavItem[] = [
    {
      icon: <LogOutIcon className="w-4 h-4" />,
      label: t("sidebar.logout"),
      path: "/logout",
      onClick: handleLogout,
    },
  ];

  const footerNavItems = isWarehouse
    ? warehouseFooterNavItems
    : superadminFooterNavItems;

  const navigationSections = isWarehouse
    ? warehouseNavigationSections
    : isAdminMode
    ? adminNavigationSections
    : clientNavigationSections;

  return (
    <aside className="flex flex-col h-screen items-start justify-between pl-4 py-6 bg-defaultwhite border-r border-1-tokens-color-modes-common-neutral-lower overflow-hidden">
      <div className="flex flex-col items-start justify-center w-full">
        <div className="inline-flex flex-col items-end">
          <img
            className="w-40 object-contain"
            alt="Logo"
            src={
              isWarehouse
                ? "/img/Black_logo_sedis.png"
                : companyLogo || "/img/image-280.png"
            }
          />
          <span
            style={{ marginTop: isWarehouse ? "-8px" : "0px" }}
            className="font-text-small text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] text-[length:var(--text-small-font-size)] tracking-[var(--text-small-letter-spacing)] leading-[var(--text-small-line-height)] whitespace-nowrap"
          >
            {t("sidebar.admin")}
          </span>
        </div>
      </div>

      <div className="flex flex-col w-full h-[calc(100vh-120px)]">
        <nav className="flex flex-col w-52 items-start gap-2 overflow-y-auto flex-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
          {navigationSections.map((section, sectionIndex) => (
            <div
              key={sectionIndex}
              className="flex flex-col items-start gap-1.5 w-full"
            >
              {section.title && (
                <h3 className="w-fit mt-[-1.00px] font-label-small font-[number:var(--label-small-font-weight)] text-[color:var(--1-tokens-color-modes-input-primary-focused-text)] text-[length:var(--label-small-font-size)] tracking-[var(--label-small-letter-spacing)] leading-[var(--label-small-line-height)] whitespace-nowrap">
                  {section.title}
                </h3>
              )}
              <div className="flex flex-col items-start w-full">
                {section.items.map((item, itemIndex) => (
                  <NavButton key={itemIndex} {...item} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="flex flex-col items-start w-full mt-6 pt-6 border-t border-1-tokens-color-modes-common-neutral-lower">
          {footerNavItems.map((item, index) => (
            <NavButton key={index} {...item} />
          ))}
        </div>
      </div>
    </aside>
  );
};
