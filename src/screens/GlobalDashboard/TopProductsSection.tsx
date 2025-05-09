import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Download } from "lucide-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { colors, typography } from "../../theme/constants";

type TimeframeOption = "Weekly" | "Monthly" | "Quarterly";

const timeframeOptions: TimeframeOption[] = ["Weekly", "Monthly", "Quarterly"];

const getQuarterRange = (quarter: number): string => {
  const quarters = {
    1: "Jan-Mar",
    2: "Apr-Jun",
    3: "Jul-Sep",
    4: "Oct-Dec",
  };
  return quarters[quarter as keyof typeof quarters];
};

const getWeekRange = (weekNumber: number): string => {
  const startDate = new Date(2024, 0, 1);
  startDate.setDate(startDate.getDate() + (weekNumber - 1) * 7);

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);

  const formatDate = (date: Date) => {
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    return `${day} ${month}`;
  };

  return `${formatDate(startDate)}-${formatDate(endDate)}`;
};

const getTimeframeValues = (timeframe: TimeframeOption): string[] => {
  const { t } = useTranslation();
  switch (timeframe) {
    case "Weekly":
      return Array.from({ length: 52 }, (_, i) => {
        const weekNum = i + 1;
        return t("dashboard.timeframes.week", {
          number: weekNum,
          range: getWeekRange(weekNum),
        });
      });
    case "Monthly":
      return [
        t("common.months.january"),
        t("common.months.february"),
        t("common.months.march"),
        t("common.months.april"),
        t("common.months.may"),
        t("common.months.june"),
        t("common.months.july"),
        t("common.months.august"),
        t("common.months.september"),
        t("common.months.october"),
        t("common.months.november"),
        t("common.months.december"),
      ];
    case "Quarterly":
      return Array.from({ length: 4 }, (_, i) => {
        const quarterNum = i + 1;
        return t("dashboard.timeframes.quarter", {
          number: quarterNum,
          range: getQuarterRange(quarterNum),
        });
      });
    default:
      return [];
  }
};

interface TimeframeSelectProps {
  value: TimeframeOption;
  onChange: (value: TimeframeOption) => void;
}

const TimeframeSelect: React.FC<TimeframeSelectProps> = ({
  value,
  onChange,
}) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-1">
      <Select
        value={value}
        onValueChange={(val) => onChange(val as TimeframeOption)}
      >
        <SelectTrigger className="w-[180px] h-10 rounded-md border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] transition-all duration-200 px-4">
          <SelectValue
            placeholder={t("dashboard.timeframes.selectTimeframe")}
            className="font-[Montserrat] text-[#475569] text-sm font-medium"
          />
        </SelectTrigger>
        <SelectContent className="rounded-md border-[#E2E8F0] shadow-md">
          {timeframeOptions.map((option) => (
            <SelectItem
              key={option}
              value={option}
              className="font-[Montserrat] text-sm font-medium text-[#475569] hover:bg-[#F8FAFC] hover:text-[#07515F] transition-all duration-200 cursor-pointer px-4 py-2"
            >
              {t(`dashboard.timeframes.${option.toLowerCase()}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

interface PeriodSelectProps {
  timeframe: TimeframeOption;
  value: string;
  onChange: (value: string) => void;
}

const PeriodSelect: React.FC<PeriodSelectProps> = ({
  timeframe,
  value,
  onChange,
}) => {
  const { t } = useTranslation();
  const options = getTimeframeValues(timeframe);

  return (
    <div className="flex flex-col gap-1">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[240px] h-10 rounded-md border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] transition-all duration-200 px-4">
          <SelectValue
            placeholder={t("dashboard.timeframes.selectPeriod")}
            className="font-[Montserrat] text-[#475569] text-sm font-medium"
          />
        </SelectTrigger>
        <SelectContent className="rounded-md border-[#E2E8F0] shadow-md">
          {options.map((option) => (
            <SelectItem
              key={option}
              value={option}
              className="font-[Montserrat] text-sm font-medium text-[#475569] hover:bg-[#F8FAFC] hover:text-[#07515F] transition-all duration-200 cursor-pointer px-4 py-2"
            >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

const TopProductsSection: React.FC = () => {
  const { t } = useTranslation();
  const [selectedTimeframe, setSelectedTimeframe] =
    useState<TimeframeOption>("Monthly");
  const [selectedPeriod, setSelectedPeriod] = useState<string>(
    getTimeframeValues("Monthly")[5]
  );

  const handleTimeframeChange = (timeframe: TimeframeOption) => {
    setSelectedTimeframe(timeframe);
    setSelectedPeriod(getTimeframeValues(timeframe)[0]);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-start gap-6">
          <TimeframeSelect
            value={selectedTimeframe}
            onChange={handleTimeframeChange}
          />
          <PeriodSelect
            timeframe={selectedTimeframe}
            value={selectedPeriod}
            onChange={setSelectedPeriod}
          />
        </div>

        <Button className="bg-[#07515F] hover:bg-[#064249] text-white gap-3 px-5 py-2.5 h-10 rounded-md transition-all duration-200 font-[Montserrat] text-sm font-medium">
          <Download className="w-4 h-4" />
          <span>{t("dashboard.actions.exportKPI")}</span>
        </Button>
      </div>
    </div>
  );
};

export { TopProductsSection };
