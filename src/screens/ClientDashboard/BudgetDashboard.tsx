import { Card, CardContent } from "../../components/ui/card";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const budgetData = {
  title: "Budget du mois",
  expenses: {
    label: "Dépenses",
    current: "881,03€",
    total: "2000€",
  },
  orders: {
    label: "Commandes",
    current: "2",
    total: "2",
  },
};

const BudgetSection = ({
  label,
  current,
  total,
  textColor,
}: {
  label: string;
  current: string;
  total: string;
  textColor: string;
}) => (
  <Card className="flex-1">
    <CardContent className="p-4 flex flex-col justify-center">
      <div className="flex flex-col gap-2">
        <p className="font-medium text-base text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] mt-[-1px]">
          {label}
        </p>
        <div className="flex items-center">
          <p className={`font-bold text-2xl ${textColor}`}>
            <span className="text-2xl">{current}/</span>
            <span className="text-lg">{total}</span>
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function Content(): JSX.Element {
  const { summary } = useSelector((state: RootState) => state.dashboard);
  const dashboardData = summary?.dashboard_data;
  const current_month_orders = dashboardData?.current_month_orders || "-";
  const monthly_budget_limit = dashboardData?.monthly_budget_limit || "-";
  const current_month_amount = dashboardData?.current_month_amount || "-";
  const monthly_order_limit = dashboardData?.monthly_order_limit || "-";

  return (
    <Card className="p-4 shadow-shadow rounded-lg">
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col gap-1 w-full">
          <h2 className="font-bold text-lg text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)]">
            {budgetData.title}
          </h2>
        </div>

        <div className="flex gap-2 w-full">
          <BudgetSection
            label={budgetData.expenses.label}
            current={current_month_amount}
            total={monthly_budget_limit}
            textColor="text-emerald-500"
          />
          <BudgetSection
            label={budgetData.orders.label}
            current={current_month_orders}
            total={monthly_order_limit}
            textColor="text-red-500"
          />
        </div>
      </div>
    </Card>
  );
}
