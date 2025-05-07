import { Card, CardContent } from "../../components/ui/card";
import { Clock, UserPlus, Users } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface StatCardProps {
  icon: React.ElementType;
  titleKey: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, titleKey, value }) => {
  const { t } = useTranslation();
  return (
    <Card className="flex-1 shadow-md rounded-md">
      <CardContent className="p-5 flex flex-col gap-3">
        <div className="flex items-center gap-2 w-full">
          <Icon className="w-6 h-6 text-[#475569]" />
          <div className="flex items-center">
            <h3 className="font-bold font-[Montserrat] text-lg leading-7 text-[#475569]">
              {t(titleKey)}
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold font-[Montserrat] text-[#475569] text-2xl">
            {value}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

const StatsSection = (): JSX.Element => {
  const { summary } = useSelector((state: RootState) => state.dashboard);
  console.log({ summary });
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
    {
      icon: Clock,
      titleKey: "dashboard.stats.averageDeliveryTime",
      value: "2.3 j",
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
