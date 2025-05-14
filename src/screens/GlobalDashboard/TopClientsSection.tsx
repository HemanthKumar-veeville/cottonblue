import { Card, CardContent } from "../../components/ui/card";
import { Euro, ShoppingBag, ShoppingCart } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { colors, typography } from "../../theme/constants";

interface Metric {
  titleKey: string;
  value: string | number | undefined;
  icon: React.ComponentType<{ className?: string }>;
}

interface DashboardData {
  total_amount?: string;
  total_orders?: number;
  average_basket_value?: string;
}

interface DashboardSummary {
  dashboard_data?: DashboardData;
}

const MetricCard: React.FC<Metric> = ({ titleKey, value, icon: Icon }) => {
  const { t } = useTranslation();
  return (
    <Card className="flex-1 shadow-md rounded-md transition-all duration-200 hover:shadow-lg">
      <CardContent className="p-6 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Icon className="w-6 h-6 text-[#07515F]" />
          <div className="flex items-center">
            <h3 className="font-semibold text-lg text-[#475569]">
              {t(titleKey)}
            </h3>
          </div>
        </div>
        <div className="flex items-center">
          <span className="font-bold text-2xl text-[#475569]">
            {value || "-"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

const TopClientsSection: React.FC = () => {
  const { t } = useTranslation();
  const { summary } = useSelector((state: RootState) => ({
    summary: state.dashboard.summary as DashboardSummary,
  }));

  const stats = summary?.dashboard_data;

  const metricsData: Metric[] = [
    {
      titleKey: "dashboard.metrics.revenue",
      value: stats?.total_amount,
      icon: Euro,
    },
    {
      titleKey: "dashboard.metrics.totalOrders",
      value: stats?.total_orders,
      icon: ShoppingCart,
    },
    {
      titleKey: "dashboard.metrics.averageBasket",
      value: stats?.average_basket_value,
      icon: ShoppingBag,
    },
  ];

  return (
    <div className="flex gap-6 w-full">
      {metricsData.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
};

export { TopClientsSection };
