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
      // Generate last 12 weeks
      return Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i * 7);
        return `Week ${date.getDate()}/${date.getMonth() + 1}`;
      }).reverse();

    case "Monthly":
      // Generate last 12 months
      return [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

    case "Quarterly":
      // Generate quarters for current year
      return [
        `Q1 ${currentYear}`,
        `Q2 ${currentYear}`,
        `Q3 ${currentYear}`,
        `Q4 ${currentYear}`,
      ];

    case "Yearly":
      // Generate last 5 years
      return Array.from({ length: 5 }, (_, i) =>
        String(currentYear - i)
      ).reverse();

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

export default function ClientAdminDashboard(): JSX.Element {
  const [selectedTimeframe, setSelectedTimeframe] =
    useState<TimeframeOption>("Monthly");
  const [selectedPeriod, setSelectedPeriod] = useState<string>(
    getTimeframeValues("Monthly")[5]
  );
  const dispatch = useAppDispatch();

  const { summary } = useSelector((state: RootState) => ({
    summary: state.dashboard.summary,
  }));

  const { ordersForApproval, loading, error } = useAppSelector(
    (state: RootState) => state.cart
  );

  const orderList = ordersForApproval?.map((order) => {
    return {
      id: order.order_id,
      location: order.store_name,
      store_id: order.store_id,
    };
  });

  useEffect(() => {
    const dns_prefix = getHost();
    dispatch(getOrdersForApproval({ dns_prefix }));
    dispatch(fetchDashboard(dns_prefix));
  }, [dispatch]);

  const summaryData = summary?.dashboard_data;
  const averageBasketValue = summaryData?.average_basket_value;
  const totalOrders = summaryData?.total_orders;
  const totalAmount = summaryData?.total_amount;

  const budgetData: BudgetData = {
    expenses: {
      current: totalAmount || 0,
      total: totalAmount || 0,
    },
    orders: {
      current: totalOrders || 0,
      total: totalOrders || 0,
    },
    metrics: {
      totalExpenses: totalAmount || 0,
      totalOrders: totalOrders || 0,
      averageCart: averageBasketValue || 0,
    },
  };

  const handleTimeframeChange = (timeframe: TimeframeOption) => {
    setSelectedTimeframe(timeframe);
    setSelectedPeriod(getTimeframeValues(timeframe)[0]);
    // TODO: Fetch data for the new timeframe
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <main className="flex flex-col gap-6 p-6 font-montserrat">
      {loading ? (
        <>
          <OrdersSectionSkeleton />
          <BudgetSectionSkeleton />
        </>
      ) : (
        <>
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
          <BudgetSection budgetData={budgetData} orderList={orderList} />
        </>
      )}
    </main>
  );
}
