import { BudgetSection } from "./BudgetSection";
import { OrdersSection } from "./OrdersSection";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { getOrdersForApproval } from "../../store/features/cartSlice";
import { RootState } from "../../store/store";
import { getHost } from "../../utils/hostUtils";
import { OrdersSectionSkeleton } from "./OrdersSection";
import { BudgetSectionSkeleton } from "./BudgetSection";

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
  const [selectedMonth, setSelectedMonth] = useState<string>("Juin");
  const dispatch = useAppDispatch();
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
  }, [dispatch]);

  // Calculate budget data from orders
  const budgetData: BudgetData = {
    expenses: {
      current:
        ordersForApproval?.reduce(
          (sum: number, order: any) => sum + parseFloat(order.price),
          0
        ) || 0,
      total: 2000, // This should come from your budget settings
    },
    orders: {
      current: ordersForApproval?.length || 0,
      total: ordersForApproval?.length || 0,
    },
    metrics: {
      totalExpenses:
        ordersForApproval?.reduce(
          (sum: number, order: any) => sum + parseFloat(order.price),
          0
        ) || 0,
      totalOrders: ordersForApproval?.length || 0,
      averageCart:
        ordersForApproval?.length > 0
          ? ordersForApproval?.reduce(
              (sum: number, order: any) => sum + parseFloat(order.price),
              0
            ) / ordersForApproval?.length
          : 0,
    },
  };

  // Handle month change from OrdersSection
  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    // TODO: Fetch budget data for the selected month
    console.log("Fetching budget data for", month);
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
          <OrdersSection
            selectedMonth={selectedMonth}
            onMonthChange={handleMonthChange}
          />
          <BudgetSection budgetData={budgetData} orderList={orderList} />
        </>
      )}
    </main>
  );
}
