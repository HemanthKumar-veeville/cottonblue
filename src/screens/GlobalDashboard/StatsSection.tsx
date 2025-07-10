import { Card, CardContent } from "../../components/ui/card";
import { Clock, UserPlus, Users } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { colors, typography } from "../../theme/constants";

interface StatCardProps {
  icon: React.ElementType;
  titleKey: string;
  value: string | number | undefined;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, titleKey, value }) => {
  const { t } = useTranslation();
  return (
    <Card className="flex-1 shadow-md rounded-md transition-all duration-200 hover:shadow-lg">
      <CardContent className="p-6 flex flex-col gap-4">
        <div className="flex items-center gap-4 w-full">
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

interface DashboardData {
  total_active_users?: number;
  total_users?: number;
  average_delivery_time?: string;
}

interface DashboardSummary {
  dashboard_data?: DashboardData;
}

const StatsSection: React.FC = () => {
  const { summary } = useSelector((state: RootState) => ({
    summary: state.dashboard.summary as DashboardSummary,
  }));

  const stats = summary?.dashboard_data;

  const statsData = [
    {
      icon: Users,
      titleKey: "dashboard.stats.activeUsers",
      value: stats?.total_active_users,
    },
    {
      icon: UserPlus,
      titleKey: "dashboard.stats.registeredUsers",
      value: stats?.total_users,
    },
  ];

  return (
    <div className="flex gap-6 w-full">
      {statsData.map((stat, index) => (
        <StatCard
          key={index}
          icon={stat.icon}
          titleKey={stat.titleKey}
          value={stat.value}
        />
      ))}
    </div>
  );
};

export { StatsSection };
