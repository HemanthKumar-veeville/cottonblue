import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Download } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  fetchDashboard,
  resetDashboard,
} from "../../store/features/dashboardSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { RootState } from "../../store/store";
import { getHost } from "../../utils/hostUtils";
import { useSelector } from "react-redux";

type TimeframeOption = "Weekly" | "Monthly" | "Quarterly" | "Yearly";

const timeframeOptions: TimeframeOption[] = [
  "Weekly",
  "Monthly",
  "Quarterly",
  "Yearly",
];

// Constants for localStorage keys
const TIMEFRAME_KEY = "dashboard_timeframe";
const PERIOD_KEY = "dashboard_period";

// Function to get stored value with fallback
const getStoredValue = (key: string, fallback: string): string => {
  const stored = localStorage.getItem(key);
  return stored || fallback;
};

const getTimeframeValues = (timeframe: TimeframeOption): string[] => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  switch (timeframe) {
    case "Weekly":
      // Generate weeks 1-52
      return Array.from({ length: 52 }, (_, i) => String(i + 1));

    case "Monthly":
      // Generate months 1-12
      return Array.from({ length: 12 }, (_, i) => String(i + 1));

    case "Quarterly":
      // Generate quarters 1-4
      return ["1", "2", "3", "4"];

    case "Yearly":
      // Generate next year and current year
      return [String(currentYear + 1), String(currentYear)];

    default:
      return [];
  }
};

const getTimeframeLabel = (value: string): string => {
  switch (value) {
    case "1":
      return "January";
    case "2":
      return "February";
    case "3":
      return "March";
    case "4":
      return "April";
    case "5":
      return "May";
    case "6":
      return "June";
    case "7":
      return "July";
    case "8":
      return "August";
    case "9":
      return "September";
    case "10":
      return "October";
    case "11":
      return "November";
    case "12":
      return "December";
    default:
      return value;
  }
};

const getWeekLabel = (value: string): string => {
  return `Week ${value}`;
};

const getQuarterLabel = (value: string): string => {
  const currentYear = new Date().getFullYear();
  return `Q${value} ${currentYear}`;
};

const getDisplayLabel = (
  option: string,
  timeframe: TimeframeOption
): string => {
  switch (timeframe) {
    case "Monthly":
      return getTimeframeLabel(option);
    case "Weekly":
      return getWeekLabel(option);
    case "Quarterly":
      return getQuarterLabel(option);
    default:
      return option;
  }
};

interface TimeframeSelectProps {
  value: TimeframeOption;
  onChange: (value: TimeframeOption) => void;
}

interface PeriodSelectProps {
  timeframe: TimeframeOption;
  value: string;
  onChange: (value: string) => void;
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
            className="text-[#475569] text-sm font-medium"
          />
        </SelectTrigger>
        <SelectContent className="rounded-md border-[#E2E8F0] shadow-md">
          {timeframeOptions.map((option) => (
            <SelectItem
              key={option}
              value={option}
              className="text-sm font-medium text-[#475569] hover:bg-[#F8FAFC] hover:text-[#07515F] transition-all duration-200 cursor-pointer px-4 py-2"
            >
              {t(`dashboard.timeframes.${option.toLowerCase()}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

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
            className="text-[#475569] text-sm font-medium"
          >
            {getDisplayLabel(value, timeframe)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="rounded-md border-[#E2E8F0] shadow-md">
          {options.map((option) => (
            <SelectItem
              key={option}
              value={option}
              className="text-sm font-medium text-[#475569] hover:bg-[#F8FAFC] hover:text-[#07515F] transition-all duration-200 cursor-pointer px-4 py-2"
            >
              {getDisplayLabel(option, timeframe)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

const getDefaultPeriodValue = (timeframe: TimeframeOption): string => {
  const currentDate = new Date();

  switch (timeframe) {
    case "Weekly":
      // Get current week number (1-52)
      const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
      const days = Math.floor(
        (currentDate.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)
      );
      const currentWeek = Math.ceil((days + startOfYear.getDay() + 1) / 7);
      return String(currentWeek);

    case "Monthly":
      // Get current month (1-12)
      return String(currentDate.getMonth() + 1);

    case "Quarterly":
      // Get current quarter (1-4)
      return String(Math.floor(currentDate.getMonth() / 3) + 1);

    case "Yearly":
      // Get current year
      return String(currentDate.getFullYear());

    default:
      return "";
  }
};

const TopProductsSection: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  // Initialize state with stored values
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeframeOption>(
    getStoredValue(TIMEFRAME_KEY, "Monthly") as TimeframeOption
  );
  const [selectedPeriod, setSelectedPeriod] = useState<string>(() => {
    const storedPeriod = localStorage.getItem(PERIOD_KEY);
    return storedPeriod || getDefaultPeriodValue("Monthly");
  });

  const { summary } = useSelector((state: RootState) => state.dashboard);
  const { selectedCompany } = useSelector((state: RootState) => state.client);

  const dns_prefix = selectedCompany?.dns ?? getHost();

  useEffect(() => {
    if (!summary) {
      dispatch(
        fetchDashboard({
          dns_prefix,
          filter_by: selectedTimeframe.toLowerCase(),
          filter_value: selectedPeriod,
        })
      );
    }
  }, [dispatch, selectedPeriod, selectedTimeframe, dns_prefix, summary]);

  const handleTimeframeChange = (timeframe: TimeframeOption) => {
    dispatch(resetDashboard());
    setSelectedTimeframe(timeframe);
    localStorage.setItem(TIMEFRAME_KEY, timeframe);

    const newPeriodValue = getDefaultPeriodValue(timeframe);
    setSelectedPeriod(newPeriodValue);
    localStorage.setItem(PERIOD_KEY, newPeriodValue);
  };

  const handlePeriodChange = (period: string) => {
    dispatch(resetDashboard());
    setSelectedPeriod(period);
    localStorage.setItem(PERIOD_KEY, period);
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
            onChange={handlePeriodChange}
          />
        </div>

        <Button className="bg-[#07515F] hover:bg-[#064249] text-white gap-3 px-5 py-2.5 h-10 rounded-md transition-all duration-200 font-medium">
          <Download className="w-4 h-4" />
          <span>{t("dashboard.actions.exportKPI")}</span>
        </Button>
      </div>
    </div>
  );
};

export { TopProductsSection };
