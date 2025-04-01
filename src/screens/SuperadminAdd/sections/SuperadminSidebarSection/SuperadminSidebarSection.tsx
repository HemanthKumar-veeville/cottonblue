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

interface NavItem {
  icon: JSX.Element;
  label: string;
  active: boolean;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

const NavButton = ({ icon, label, active }: NavItem) => (
  <button
    className={`flex items-center gap-3 p-2.5 w-full rounded ${
      active
        ? "bg-[#e9fffd]"
        : "bg-[color:var(--1-tokens-color-modes-nav-tab-primary-default-background)]"
    }`}
  >
    <div className="flex w-5 h-5 items-center justify-center">{icon}</div>
    <span
      className={`flex-1 font-label-small font-[number:var(--label-small-font-weight)] text-[length:var(--label-small-font-size)] tracking-[var(--label-small-letter-spacing)] leading-[var(--label-small-line-height)] text-left ${
        active
          ? "text-[#07515f]"
          : "text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)]"
      }`}
    >
      {label}
    </span>
  </button>
);

export const SuperadminSidebarSection = (): JSX.Element => {
  const navigationSections: NavSection[] = [
    {
      items: [
        {
          icon: <HomeIcon className="w-4 h-4" />,
          label: "Tableau de bord",
          active: false,
        },
        {
          icon: <FileTextIcon className="w-4 h-4" />,
          label: "Historique de commande",
          active: false,
        },
      ],
    },
    {
      title: "Produits",
      items: [
        {
          icon: <BookOpenIcon className="w-4 h-4" />,
          label: "Liste des produits",
          active: false,
        },
        {
          icon: <PlusCircleIcon className="w-4 h-4" />,
          label: "Ajouter un produit",
          active: true,
        },
        {
          icon: <PackageIcon className="w-4 h-4" />,
          label: "Gérer le stock",
          active: false,
        },
        {
          icon: <LayersIcon className="w-4 h-4" />,
          label: "Catégories de produit",
          active: false,
        },
        {
          icon: <LayersIcon className="w-4 h-4" />,
          label: "Carrousel d'accueil",
          active: false,
        },
      ],
    },
    {
      title: "Clients",
      items: [
        {
          icon: <BookOpenIcon className="w-4 h-4" />,
          label: "Liste des clients",
          active: false,
        },
        {
          icon: <UserPlusIcon className="w-4 h-4" />,
          label: "Ajouter un client",
          active: false,
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          icon: <MessageSquareIcon className="w-4 h-4" />,
          label: "Messages",
          active: false,
        },
      ],
    },
  ];

  const footerNavItems: NavItem[] = [
    {
      icon: <SettingsIcon className="w-4 h-4" />,
      label: "Paramètres",
      active: false,
    },
    {
      icon: <LogOutIcon className="w-4 h-4" />,
      label: "Déconnexion",
      active: false,
    },
  ];

  return (
    <aside className="flex flex-col w-64 h-full items-start justify-center gap-12 px-4 py-6 bg-defaultwhite border-r border-1-tokens-color-modes-common-neutral-lower">
      <div className="flex flex-col items-center justify-center w-full">
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

      <div className="flex flex-col items-center justify-between flex-1 w-full">
        <nav className="flex flex-col w-56 items-start gap-2">
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

        <div className="flex flex-col items-start w-full">
          {footerNavItems.map((item, index) => (
            <NavButton key={index} {...item} />
          ))}
        </div>
      </div>
    </aside>
  );
};
