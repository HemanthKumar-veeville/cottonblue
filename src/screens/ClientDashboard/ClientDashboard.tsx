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
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchDashboard } from "../../store/features/dashboardSlice";
import { AppDispatch } from "../../store";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../store/store";

const ClientDashboard: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedCompany } = useAppSelector((state) => state.client);
  const { loading } = useAppSelector((state) => state.dashboard);
  const dns = selectedCompany?.dns;

  useEffect(() => {
    if (dns) {
      dispatch(fetchDashboard(dns));
    }
  }, [dispatch, dns]);

  return (
    <main className="flex flex-col gap-8 p-6">
      <SectionWrapper>
        {loading ? (
          <>
            <TopProductsSkeleton />
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
