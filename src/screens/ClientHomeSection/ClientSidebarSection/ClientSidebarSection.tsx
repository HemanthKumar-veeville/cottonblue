import {
  ClipboardListIcon,
  HelpCircleIcon,
  HomeIcon,
  LifeBuoyIcon,
  LogOutIcon,
  SettingsIcon,
} from "lucide-react";
import React from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";

const navItems = [
  {
    icon: <HomeIcon className="w-4 h-4" />,
    label: "Accueil",
    active: true,
  },
  {
    icon: <ClipboardListIcon className="w-4 h-4" />,
    label: "Historique de commande",
    active: false,
  },
];

const bottomNavItems = [
  {
    icon: <LifeBuoyIcon className="w-4 h-4" />,
    label: "Support",
  },
  {
    icon: <SettingsIcon className="w-4 h-4" />,
    label: "Paramètres",
  },
  {
    icon: <LogOutIcon className="w-4 h-4" />,
    label: "Déconnexion",
  },
];

const budgetCards = [
  {
    title: "Dépenses",
    value: (
      <>
        <span className="text-emerald-500 text-2xl font-bold">881,03€/</span>
        <span className="text-lg leading-[19.8px]">2000€</span>
      </>
    ),
  },
  {
    title: "Commandes",
    value: (
      <>
        <span className="text-red-500 text-2xl font-bold">2/</span>
        <span className="text-lg leading-[19.8px]">2</span>
      </>
    ),
  },
];

const LogoSection = () => (
  <div className="flex flex-col items-end justify-center w-full">
    <img
      className="w-full h-9"
      alt="Logo vert"
      src="/img/logo-vert-chronodrive-page-0001-1.png"
    />
    <div className="w-fit font-text-small text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)]">
      by Cotton Blue
    </div>
  </div>
);

const NavigationMenu = () => (
  <nav className="w-full">
    {navItems.map((item, index) => (
      <Button
        key={index}
        variant="ghost"
        className={`flex items-center justify-start w-full gap-2 py-2 px-4 rounded-lg ${
          item.active
            ? "bg-[#e9f9ef] text-[#1e2324]"
            : "bg-[color:var(--1-tokens-color-modes-nav-tab-primary-default-background)] text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)]"
        }`}
      >
        <div className="flex w-6 h-6 items-center justify-center p-0.5">
          {item.icon}
        </div>
        <span className="flex-1 mt-[-1.00px] font-label-small">
          {item.label}
        </span>
      </Button>
    ))}
  </nav>
);

const BudgetSection = () => (
  <section className="flex flex-col items-start gap-4 w-full">
    <div className="flex items-center justify-between w-full">
      <h2 className="w-fit mt-[-1.00px] font-bold text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] text-lg leading-7">
        Budget du mois
      </h2>
      <HelpCircleIcon className="w-6 h-6" />
    </div>
    <div className="flex flex-col items-start gap-2 w-full">
      {budgetCards.map((card, index) => (
        <Card
          key={index}
          className="w-full border-1-tokens-color-modes-border-secondary"
        >
          <CardContent className="flex flex-col items-center gap-4 p-4">
            <div className="flex items-center gap-4 w-full">
              <div className="flex flex-col items-start gap-2 flex-1">
                <div className="w-fit mt-[-1.00px] font-text-medium text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)]">
                  {card.title}
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

const BottomNavigation = () => (
  <div className="flex flex-col items-start gap-2 w-full">
    {bottomNavItems.map((item, index) => (
      <Button
        key={index}
        variant="ghost"
        className="flex gap-2 py-2 px-4 w-full items-center justify-start rounded-lg bg-[color:var(--1-tokens-color-modes-nav-tab-primary-default-background)]"
      >
        <div className="flex w-6 h-6 items-center justify-center p-0.5">
          {item.icon}
        </div>
        <span className="flex-1 mt-[-1.00px] font-label-small text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)]">
          {item.label}
        </span>
      </Button>
    ))}
  </div>
);

export const ClientSidebarSection = (): JSX.Element => {
  return (
    <aside className="flex flex-col w-64 h-full items-start justify-center gap-12 px-4 py-6 bg-defaultwhite border-r border-solid border-1-tokens-color-modes-common-neutral-lower">
      <LogoSection />
      <div className="flex flex-col items-center justify-between flex-1 w-full">
        <div className="flex flex-col items-start w-full gap-8">
          <NavigationMenu />
          <BudgetSection />
        </div>
        <BottomNavigation />
      </div>
    </aside>
  );
};
