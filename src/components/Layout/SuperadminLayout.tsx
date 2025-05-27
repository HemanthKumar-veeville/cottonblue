import { Outlet } from "react-router-dom";
import { SuperadminSidebarSection } from "../../screens/SuperadminAdd/sections/SuperadminSidebarSection/SuperadminSidebarSection";
import { SuperadminHeader, useAdminMode } from "./SuperadminHeader";
import { isWarehouseHostname } from "../../utils/hostUtils";

export const SuperadminLayout = () => {
  const { isAdminMode } = useAdminMode();

  return (
    <div className="flex h-screen overflow-hidden">
      <SuperadminSidebarSection isAdminMode={isAdminMode} />
      <div className="flex flex-col flex-1 overflow-hidden">
        {!isWarehouseHostname() && (
          <div className="fixed top-0 right-0 left-[280px] z-10 md:left-[240px] sm:left-0">
            <SuperadminHeader />
          </div>
        )}

        <main className="flex-1 overflow-auto p-6 mt-[72px] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full sm:p-4 sm:mt-[60px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
