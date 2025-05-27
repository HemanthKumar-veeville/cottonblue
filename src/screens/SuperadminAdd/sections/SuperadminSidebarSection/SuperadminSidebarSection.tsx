import {
  BookOpenIcon,
  FileTextIcon,
  HomeIcon,
  LayersIcon,
  LogOutIcon,
  MessageSquareIcon,
  PackageIcon,
  PlusCircleIcon,
  SettingsIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../../store/features/authSlice";
import {
  RootState,
  AppDispatch,
  useAppSelector,
} from "../../../../store/store";
import { isWarehouseHostname } from "../../../../utils/hostUtils";
interface NavItem {
  icon: JSX.Element;
  label: string;
  path: string;
  onClick?: () => void;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

const NavButton = ({
  icon,
  label,
  path,
  onClick,
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
      ],
    },
    {
      title: t("sidebar.customers.title"),
      items: [
        {
          icon: <BookOpenIcon className="w-4 h-4" />,
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
    {
      title: t("sidebar.support.title"),
      items: [
        {
          icon: <MessageSquareIcon className="w-4 h-4" />,
          label: t("sidebar.support.tickets"),
          path: "/support/tickets",
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
          icon: <FileTextIcon className="w-4 h-4" />,
          label: t("sidebar.orderHistory"),
          path: "/order-history",
        },
      ],
    },
    {
      title: t("sidebar.products.title"),
      items: [
        {
          icon: <BookOpenIcon className="w-4 h-4" />,
          label: t("sidebar.products.list"),
          path: "/products",
        },
        {
          icon: <PlusCircleIcon className="w-4 h-4" />,
          label: t("sidebar.products.add"),
          path: "/products/add",
        },
        {
          icon: <LayersIcon className="w-4 h-4" />,
          label: t("sidebar.products.carousel"),
          path: "/products/carousel",
        },
      ],
    },
    {
      title: t("sidebar.agencies.title"),
      items: [
        {
          icon: <BookOpenIcon className="w-4 h-4" />,
          label: t("sidebar.agencies.list"),
          path: "/agencies",
        },
        {
          icon: <PlusCircleIcon className="w-4 h-4" />,
          label: t("sidebar.agencies.add"),
          path: "/agencies/add",
        },
        {
          icon: <UserPlusIcon className="w-4 h-4" />,
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
    {
      title: t("sidebar.support.title"),
      items: [
        {
          icon: <MessageSquareIcon className="w-4 h-4" />,
          label: t("sidebar.support.tickets"),
          path: "/support/tickets",
        },
      ],
    },
  ];

  const warehouseNavigationSections: NavSection[] = [
    {
      title: t("sidebar.products.title"),
      items: [
        {
          icon: <HomeIcon className="w-4 h-4" />,
          label: t("sidebar.dashboard"),
          path: "/warehouse",
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
            src={companyLogo || "/img/image-280.png"}
          />
          <span className="font-text-small text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] text-[length:var(--text-small-font-size)] tracking-[var(--text-small-letter-spacing)] leading-[var(--text-small-line-height)] whitespace-nowrap">
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
