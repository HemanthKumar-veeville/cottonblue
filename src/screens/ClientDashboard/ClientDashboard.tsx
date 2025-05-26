import { DashboardSection } from "../GlobalDashboard/DashboardSection";
import { StatsSection } from "../GlobalDashboard/StatsSection";
import { TopClientsSection } from "../GlobalDashboard/TopClientsSection";
import { TopProductsSection } from "../GlobalDashboard/TopProductsSection";
import {
  DashboardSectionSkeleton,
  StatsSkeleton,
  TopClientsSkeleton,
  TopProductsSkeleton,
} from "../GlobalDashboard/DashboardSkeletons";
import React from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../store/store";

const ClientDashboard: React.FC = () => {
  const { t } = useTranslation();

  const { loading } = useAppSelector((state) => state.dashboard);

  return (
    <main className="flex flex-col gap-8 p-6">
      <SectionWrapper>
        {loading ? (
          <>
            <TopProductsSection />
            <TopClientsSkeleton />
            <StatsSkeleton />
            <DashboardSectionSkeleton />
          </>
        ) : (
          <>
            <TopProductsSection />
            <TopClientsSection />
            <StatsSection />
            <DashboardSection />
          </>
        )}
      </SectionWrapper>
    </main>
  );
};

const SectionWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <section className="flex flex-col gap-6 w-full">{children}</section>;

export { ClientDashboard };
