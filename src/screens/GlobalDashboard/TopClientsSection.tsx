import { Card, CardContent } from "../../components/ui/card";
import { Euro, ShoppingBag, ShoppingCart } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface Metric {
  titleKey: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TopClientsSection = (): JSX.Element => {
  const { t } = useTranslation();
  const { summary } = useSelector((state: RootState) => state.dashboard);
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

  const MetricCard: React.FC<Metric> = ({ titleKey, value, icon: Icon }) => (
    <Card className="flex-1 shadow-md rounded-md">
      <CardContent className="p-5 flex flex-col gap-3">
        <div className="flex items-center gap-2 mt-0">
          <Icon className="w-6 h-6 text-[#475569]" />
          <div className="font-bold text-lg leading-7 font-['Montserrat',Helvetica] text-[#475569]">
            {t(titleKey)}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="font-bold text-2xl text-[#475569] font-['Montserrat',Helvetica]">
            {value}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex items-center gap-6 w-full">
      {metricsData.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
};

export { TopClientsSection };
