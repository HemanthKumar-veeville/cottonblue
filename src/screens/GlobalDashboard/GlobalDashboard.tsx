import { SalesOverviewSection } from "../SalesOverviewSection/SalesOverviewSection";
import { SupportTicketsSection } from "../SupportTicketsSection/SupportTicketsSection";

export const GlobalDashboard = (): JSX.Element => {
  return (
    <main className="flex flex-col gap-8 p-6">
      <SalesOverviewSection />
      <SupportTicketsSection />
    </main>
  );
};
