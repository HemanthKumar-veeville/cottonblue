import { DashboardSection } from "./DashboardSection";
import { StatsSection } from "./StatsSection";
import { TopClientsSection } from "./TopClientsSection";
import { TopProductsSection } from "./TopProductsSection";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchDashboard } from "../../store/features/dashboardSlice";
import { AppDispatch } from "../../store";
import { getHost } from "../../utils/hostUtils";
import { useTranslation } from "react-i18next";

const GlobalDashboard: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const dns = getHost();
  useEffect(() => {
    dispatch(fetchDashboard(dns));
  }, [dispatch]);

  return (
    <main className="flex flex-col gap-8 p-6">
      <SectionWrapper>
        <TopProductsSection />
        <TopClientsSection />
        <StatsSection />
        <DashboardSection />
      </SectionWrapper>
    </main>
  );
};

const SectionWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <section className="flex flex-col gap-6 w-full">{children}</section>;

export { GlobalDashboard };
