import { Outlet } from "react-router-dom";
import { SuperadminSidebarSection } from "../../screens/SuperadminAdd/sections/SuperadminSidebarSection/SuperadminSidebarSection";
import { SuperadminHeader } from "./SuperadminHeader";

export const SuperadminLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <SuperadminSidebarSection />
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="fixed top-0 right-0 left-[280px] z-10">
          <SuperadminHeader />
        </div>
        <main className="flex-1 overflow-auto p-6 mt-[72px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
