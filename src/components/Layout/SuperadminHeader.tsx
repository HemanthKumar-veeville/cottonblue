import React from "react";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface NavTabItem {
  id: number;
  name: string;
  icon: string;
  active: boolean;
}

const navTabs: NavTabItem[] = [
  { id: 1, name: "Gestion Admin", icon: "/img/crown.svg", active: false },
  { id: 2, name: "Gestion par client", icon: "/img/icon-8.svg", active: true },
];

const NavTab = ({ tab }: { tab: NavTabItem }) => (
  <div
    className={`flex-1 grow flex items-center gap-3 pt-3 pr-3 pb-3 pl-3 relative rounded-lg ${
      tab.active ? "bg-[#07515f]" : "bg-gray-200"
    }`}
  >
    <div className="flex w-6 h-6 items-center justify-center shrink-0">
      <img
        className={`w-4 h-4 ${
          tab.active ? "brightness-0 invert" : "brightness-0 opacity-70"
        }`}
        alt={tab.name}
        src={tab.icon}
      />
    </div>
    <div
      className={`relative flex-1 font-label-small font-medium truncate ${
        tab.active ? "text-white" : "text-gray-700"
      } text-sm tracking-wide leading-5`}
    >
      {tab.name}
    </div>
  </div>
);

export const SuperadminHeader = (): JSX.Element => {
  return (
    <header className="flex flex-col items-start relative flex-1 self-stretch grow bg-white">
      <div className="flex items-center justify-between px-8 py-4 relative self-stretch w-full flex-[0_0_auto] border-b border-solid border-gray-300">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            <div className="flex w-[352px] items-start relative self-stretch gap-3">
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
