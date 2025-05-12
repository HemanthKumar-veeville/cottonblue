import { DashboardSection } from "./DashboardSection";
import { StatsSection } from "./StatsSection";
import { TopClientsSection } from "./TopClientsSection";
import { TopProductsSection } from "./TopProductsSection";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboard } from "../../store/features/dashboardSlice";
import { AppDispatch, RootState } from "../../store";
import { useTranslation } from "react-i18next";
import {
  DashboardSectionSkeleton,
  StatsSkeleton,
  TopClientsSkeleton,
  TopProductsSkeleton,
} from "./DashboardSkeletons";

const GlobalDashboard: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboard("admin"));
  }, [dispatch]);

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

export { GlobalDashboard };
