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
} from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";

interface NavItem {
  icon: JSX.Element;
  label: string;
  path: string;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

const NavButton = ({ icon, label, path }: NavItem) => {
  const location = useLocation();
  const isActive = location.pathname === path;

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

export const SuperadminSidebarSection = (): JSX.Element => {
  const navigationSections: NavSection[] = [
    {
      items: [
        {
          icon: <HomeIcon className="w-4 h-4" />,
          label: "Tableau de bord",
          path: "/dashboard",
        },
        {
          icon: <FileTextIcon className="w-4 h-4" />,
          label: "Historique de commande",
          path: "/order-history",
        },
      ],
    },
    {
      title: "Produits",
      items: [
        {
          icon: <BookOpenIcon className="w-4 h-4" />,
          label: "Liste des produits",
          path: "/products",
        },
        {
          icon: <PlusCircleIcon className="w-4 h-4" />,
          label: "Ajouter un produit",
          path: "/products/add",
        },
        {
          icon: <PackageIcon className="w-4 h-4" />,
          label: "Gérer le stock",
          path: "/products/stock",
        },
        {
          icon: <LayersIcon className="w-4 h-4" />,
          label: "Carrousel d'accueil",
          path: "/products/carousel",
        },
      ],
    },
    {
      title: "Clients",
      items: [
        {
          icon: <BookOpenIcon className="w-4 h-4" />,
          label: "Liste des clients",
          path: "/customers",
        },
        {
          icon: <UserPlusIcon className="w-4 h-4" />,
          label: "Ajouter un client",
          path: "/customers/add",
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          icon: <MessageSquareIcon className="w-4 h-4" />,
          label: "Tickets",
          path: "/support/tickets",
        },
      ],
    },
  ];

  const footerNavItems: NavItem[] = [
    {
      icon: <SettingsIcon className="w-4 h-4" />,
      label: "Paramètres",
      path: "/settings",
    },
    {
      icon: <LogOutIcon className="w-4 h-4" />,
      label: "Déconnexion",
      path: "/logout",
    },
  ];

  return (
    <aside className="flex flex-col h-screen items-start justify-between pl-4 py-6 bg-defaultwhite border-r border-1-tokens-color-modes-common-neutral-lower overflow-hidden">
      <div className="flex flex-col items-start justify-center w-full">
        <div className="inline-flex flex-col items-end">
          <img
            className="w-[183px] h-[33px]"
            alt="Logo"
            src="/img/image-280.png"
          />
          <span className="font-text-small text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] text-[length:var(--text-small-font-size)] tracking-[var(--text-small-letter-spacing)] leading-[var(--text-small-line-height)] whitespace-nowrap">
            Admin
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
