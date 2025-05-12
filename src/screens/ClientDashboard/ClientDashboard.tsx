import { DashboardSection } from "../GlobalDashboard/DashboardSection";
import { StatsSection } from "../GlobalDashboard/StatsSection";
import { TopClientsSection } from "../GlobalDashboard/TopClientsSection";
import { TopProductsSection } from "../GlobalDashboard/TopProductsSection";
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
  const dns = selectedCompany?.dns;
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

export { ClientDashboard };
