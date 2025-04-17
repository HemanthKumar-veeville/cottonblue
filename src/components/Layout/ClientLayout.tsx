import { Outlet } from "react-router-dom";
import { ClientSidebarSection } from "../../screens/ClientHomeSection/ClientSidebarSection/ClientSidebarSection";
import { ClientHeader } from "./ClientHeader";

export const ClientLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <ClientSidebarSection />
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="fixed top-0 right-0 left-64 z-10">
          <ClientHeader />
        </div>
        <main className="flex-1 overflow-auto p-6 mt-[72px] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
