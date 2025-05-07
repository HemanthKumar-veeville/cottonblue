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
  const startDate = new Date(2024, 0, 1); // Start from January 1st, 2024
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

const TimeframeSelect = ({
  value,
  onChange,
}: {
  value: TimeframeOption;
  onChange: (value: TimeframeOption) => void;
}) => {
  const { t } = useTranslation();
  return (
    <Select
      value={value}
      onValueChange={(val) => onChange(val as TimeframeOption)}
    >
      <SelectTrigger className="w-[180px] rounded border-[color:var(--1-tokens-color-modes-border-primary)] bg-[color:var(--1-tokens-color-modes-nav-tab-primary-default-background)]">
        <SelectValue placeholder={t("dashboard.timeframes.selectTimeframe")} />
      </SelectTrigger>
      <SelectContent className="rounded">
        {timeframeOptions.map((option) => (
          <SelectItem key={option} value={option}>
            {t(`dashboard.timeframes.${option.toLowerCase()}`)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const PeriodSelect = ({
  timeframe,
  value,
  onChange,
}: {
  timeframe: TimeframeOption;
  value: string;
  onChange: (value: string) => void;
}) => {
  const { t } = useTranslation();
  const options = getTimeframeValues(timeframe);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[240px] rounded border-[color:var(--1-tokens-color-modes-border-primary)] bg-[color:var(--1-tokens-color-modes-nav-tab-primary-default-background)]">
        <SelectValue placeholder={t("dashboard.timeframes.selectPeriod")} />
      </SelectTrigger>
      <SelectContent className="rounded">
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const TopProductsSection = (): JSX.Element => {
  const { t } = useTranslation();
  const [selectedTimeframe, setSelectedTimeframe] =
    useState<TimeframeOption>("Monthly");
  const [selectedPeriod, setSelectedPeriod] = useState<string>(
    getTimeframeValues("Monthly")[5]
  ); // Default to June

  const handleTimeframeChange = (timeframe: TimeframeOption) => {
    setSelectedTimeframe(timeframe);
    // Reset period to first option when timeframe changes
    setSelectedPeriod(getTimeframeValues(timeframe)[0]);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
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

        <Button className="bg-[#07515f] hover:bg-[#07515f]/90 text-white gap-2 px-4 py-2 h-auto rounded">
          <Download className="w-4 h-4" />
          <span className="font-label-medium">
            {t("dashboard.actions.exportKPI")}
          </span>
        </Button>
      </div>
    </div>
  );
};

export { TopProductsSection };
