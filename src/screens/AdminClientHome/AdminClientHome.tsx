import { DashboardSection } from "../ClientHomeSection/DashboardSection/DashboardSection";

export const AdminClientHome = (): JSX.Element => {
  return (
    <main className="flex h-full bg-gray-50 flex-1 overflow-y-auto w-full [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
      <DashboardSection />
    </main>
  );
};
