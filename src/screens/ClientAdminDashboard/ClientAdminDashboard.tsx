import { BudgetSection } from "./BudgetSection";
import { OrdersSection } from "./OrdersSection";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { getOrdersForApproval } from "../../store/features/cartSlice";
import { RootState } from "../../store/store";
import { getHost } from "../../utils/hostUtils";
import { OrdersSectionSkeleton } from "./OrdersSection";
import { BudgetSectionSkeleton } from "./BudgetSection";
import { fetchDashboard } from "../../store/features/dashboardSlice";

import { useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useTranslation } from "react-i18next";

type TimeframeOption = "Weekly" | "Monthly" | "Quarterly" | "Yearly";

const timeframeOptions: TimeframeOption[] = [
  "Weekly",
  "Monthly",
  "Quarterly",
  "Yearly",
];

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
      return [String(currentYear - 1), String(currentYear)];

    default:
      return [];
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

const getTimeframeLabel = (value: string, t: any): string => {
  const monthKey = `dashboard.timeframes.periods.month.${value}`;
  return t(monthKey);
};

const getWeekLabel = (value: string, t: any): string => {
  const currentYear = new Date().getFullYear();
  const weekNumber = parseInt(value);

  // Create a date for January 1st of current year
  const yearStart = new Date(currentYear, 0, 1);

  // Calculate the first day of the week (adding (weekNumber - 1) weeks to yearStart)
  const weekStart = new Date(yearStart);
  weekStart.setDate(yearStart.getDate() + (weekNumber - 1) * 7);

  // Calculate the last day of the week
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  // Format the dates with fixed width
  const formatDate = (date: Date) => {
    const month = date.toLocaleString("default", { month: "short" });
    const day = String(date.getDate()).padStart(2, "0");
    return `${month.substring(0, 3)} ${day}`;
  };

  // Use translation for "Week" and format
  return t("dashboard.timeframes.periods.week", {
    number: String(value).padStart(2, "0"),
    startDate: formatDate(weekStart),
    endDate: formatDate(weekEnd),
  });
};

const getQuarterLabel = (value: string, t: any): string => {
  const quarterKey = `dashboard.timeframes.periods.quarter.${value}`;
  return t(quarterKey);
};

const getDisplayLabel = (
  option: string,
  timeframe: TimeframeOption,
  t: any
): string => {
  switch (timeframe) {
    case "Monthly":
      return getTimeframeLabel(option, t);
    case "Weekly":
      return getWeekLabel(option, t);
    case "Quarterly":
      return getQuarterLabel(option, t);
    default:
      return option;
  }
};

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
            className="text-[#475569] text-sm font-medium truncate"
          />
        </SelectTrigger>
        <SelectContent className="rounded-md border-[#E2E8F0] shadow-md min-w-[180px]">
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
        <SelectTrigger className="w-[320px] h-10 rounded-md border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] transition-all duration-200 px-4">
          <SelectValue
            placeholder={t("dashboard.timeframes.selectPeriod")}
            className="text-[#475569] text-sm font-medium truncate font-mono"
          >
            {getDisplayLabel(value, timeframe, t)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="rounded-md border-[#E2E8F0] shadow-md min-w-[320px] max-h-[300px]">
          {options.map((option) => (
            <SelectItem
              key={option}
              value={option}
              className="text-sm font-medium text-[#475569] hover:bg-[#F8FAFC] hover:text-[#07515F] transition-all duration-200 cursor-pointer px-4 py-2 font-mono"
            >
              {getDisplayLabel(option, timeframe, t)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export interface BudgetData {
  expenses: {
    current: number;
    total: number;
  };
  orders: {
    current: number;
    total: number;
  };
  metrics: {
    totalExpenses: number;
    totalOrders: number;
    averageCart: number;
  };
}

interface Order {
  id: string;
  date: string;
  price: string;
  status: {
    text: string;
    type: "success" | "warning" | "danger" | "default";
  };
  hasInvoice: boolean;
}

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

export default function ClientAdminDashboard(): JSX.Element {
  const [selectedTimeframe, setSelectedTimeframe] =
    useState<TimeframeOption>("Monthly");
  const [selectedPeriod, setSelectedPeriod] = useState<string>(
    getDefaultPeriodValue("Monthly")
  );
  const dispatch = useAppDispatch();
  const { isClientAdmin } = useAppSelector((state) => state.auth);

  const { summary, loading: dashboardLoading } = useSelector(
    (state: RootState) => ({
      summary: state.dashboard.summary,
      loading: state.dashboard.loading,
    })
  );

  const {
    ordersForApproval,
    loading: ordersLoading,
    error,
  } = useAppSelector((state: RootState) => state.cart);

  const orderList = ordersForApproval?.map((order) => {
    return {
      id: order.order_id,
      location: order.store_name,
      store_id: order.store_id,
    };
  });

  const dns_prefix = getHost();

  useEffect(() => {
    dispatch(getOrdersForApproval({ dns_prefix }));
  }, [dispatch]);

  useEffect(() => {
    if (isClientAdmin) {
      dispatch(
        fetchDashboard({
          dns_prefix,
          filter_by: selectedTimeframe.toLowerCase(),
          filter_value: selectedPeriod,
        })
      );
    }
  }, [dispatch, selectedPeriod, selectedTimeframe]);

  const summaryData = summary?.dashboard_data;
  const averageBasketValue = summaryData?.average_basket_value;
  const totalOrders = summaryData?.total_orders;
  const totalAmount = summaryData?.total_amount;
  const currentMonthOrders = summaryData?.current_month_orders;
  const currentMonthAmount = summaryData?.current_month_amount;
  const monthlyOrderLimit = summaryData?.monthly_order_limit;
  const monthlyExpenseLimit = summaryData?.monthly_budget_limit;

  const budgetData: BudgetData = {
    expenses: {
      current: currentMonthAmount || "-",
      total: monthlyExpenseLimit || "-",
    },
    orders: {
      current: currentMonthOrders || "-",
      total: monthlyOrderLimit || "-",
    },
    metrics: {
      totalExpenses: totalAmount || "-",
      totalOrders: totalOrders || "-",
      averageCart: averageBasketValue || "-",
    },
  };

  const handleTimeframeChange = (timeframe: TimeframeOption) => {
    setSelectedTimeframe(timeframe);
    setSelectedPeriod(getDefaultPeriodValue(timeframe));
  };

  const isLoading = ordersLoading || dashboardLoading;

  return (
    <main className="flex flex-col gap-6 p-6">
      <div className="flex items-start gap-6 mb-4 mt-[-30px]">
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

      {isLoading ? (
        <>
          <OrdersSectionSkeleton />
          <BudgetSectionSkeleton />
        </>
      ) : (
        <BudgetSection
          budgetData={budgetData}
          orderList={orderList}
          dashboardLoading={false}
        />
      )}
    </main>
  );
}
