import React, { useEffect, useState } from "react";
import { OrderTableHeaderSection } from "./OrderTableHeaderSection";
import { ProductListHeaderSection } from "./ProductListHeaderSection";
import { useParams, useNavigate } from "react-router-dom";
import { getOrder } from "../../store/features/cartSlice";
import { getHost } from "../../utils/hostUtils";
import { Skeleton } from "../../components/ui/skeleton";
import { Card } from "../../components/ui/card";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { Dialog, DialogContent } from "../../components/ui/dialog";
import { BudgetWarningPopover } from "../../components/BudgetWarningPopover/BudgetWarningPopover";

interface OrderItem {
  product_id: number;
  product_image: string;
  product_name: string;
  product_price: number;
  quantity: number;
}

interface Order {
  created_at: string;
  order_id: number;
  order_items: OrderItem[];
  order_status: string;
  store_address: string;
  store_name: string;
  order_total: number;
}

const SectionWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <section className="mb-8 transition-all duration-200 ease-in-out">
    {children}
  </section>
);

const OrderDetailsSkeleton = () => (
  <Card className="w-full p-6 md:p-8 space-y-8 shadow-lg">
    <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-md" />
        <Skeleton className="h-8 w-48" />
      </div>
      <Skeleton className="h-10 w-48" />
    </div>

    <div className="flex flex-col md:flex-row gap-8 w-full">
      <div className="flex-1 space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-2/3" />
      </div>
      <div className="flex-1 space-y-4">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-4/5" />
      </div>
    </div>

    <div className="flex flex-col sm:flex-row gap-4 w-full">
      <Skeleton className="h-10 flex-1" />
      <Skeleton className="h-10 flex-1" />
    </div>
  </Card>
);

const ProductListSkeleton = () => (
  <div className="flex flex-col items-start gap-8 p-4 w-full bg-white rounded-lg shadow-md">
    <div className="flex justify-between items-center w-full">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-6 w-32" />
    </div>

    <div className="w-full">
      <div className="flex flex-col gap-4">
        <div className="flex gap-4 items-center">
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4 items-center">
            <Skeleton className="h-6 w-6" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <Skeleton className="h-6 w-32" />
            </div>
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default function Container(): JSX.Element {
  const { id, store_id } = useParams();
  const navigate = useNavigate();
  const dnsPrefix = getHost();
  const [showBudgetWarning, setShowBudgetWarning] = useState(false);

  const { storeBudget } = useAppSelector((state) => state.agency);
  const storeBudgetData = storeBudget?.budget;

  const currentMonthAmount = storeBudgetData?.current_month_expenses || 0;
  const monthlyExpenseLimit = storeBudgetData?.budget || 0;
  const currentMonthOrders = storeBudgetData?.order_count || 0;
  const monthlyOrderLimit = storeBudgetData?.order_limit || 0;

  const dispatch = useAppDispatch();
  const { currentOrder, loading, error } = useAppSelector(
    (state) => state.cart
  );

  useEffect(() => {
    if (id && store_id) {
      dispatch(
        getOrder({
          dns_prefix: dnsPrefix,
          store_id: store_id,
          order_id: id,
        })
      );
    }
  }, [dispatch, id, store_id, dnsPrefix]);

  const handleClose = () => {
    setShowBudgetWarning(false);
  };

  const checkBudgetLimits = () => {
    if (!monthlyExpenseLimit) {
      return false;
    }

    return currentOrder?.order_total + currentMonthAmount > monthlyExpenseLimit;
  };

  const checkOrderLimits = () => {
    if (!monthlyOrderLimit) {
      return false;
    }

    return currentMonthOrders >= monthlyOrderLimit;
  };

  if (loading) {
    return (
      <main className="flex flex-col w-full max-w-[1208px] mx-auto gap-8 px-4 py-6 md:px-6 lg:px-8">
        <SectionWrapper>
          <OrderDetailsSkeleton />
        </SectionWrapper>
        <SectionWrapper>
          <ProductListSkeleton />
        </SectionWrapper>
      </main>
    );
  }

  return (
    <>
      <Dialog open={showBudgetWarning} onOpenChange={handleClose}>
        <DialogContent className="p-0 border-none bg-transparent shadow-none">
          <BudgetWarningPopover
            currentMonthAmount={currentMonthAmount}
            monthlyExpenseLimit={monthlyExpenseLimit}
            currentMonthOrders={currentMonthOrders}
            monthlyOrderLimit={monthlyOrderLimit}
            orderTotal={currentOrder?.order_total || 0}
            onClose={handleClose}
            checkBudgetLimits={checkBudgetLimits}
            checkOrderLimits={checkOrderLimits}
            orderDetails={currentOrder}
          />
        </DialogContent>
      </Dialog>

      <main className="flex flex-col w-full max-w-[1208px] mx-auto gap-8 px-4 py-6 md:px-6 lg:px-8">
        <SectionWrapper>
          <OrderTableHeaderSection
            orderDetails={currentOrder}
            checkBudgetLimits={checkBudgetLimits}
            checkOrderLimits={checkOrderLimits}
            setShowBudgetWarning={setShowBudgetWarning}
          />
        </SectionWrapper>
        <SectionWrapper>
          <ProductListHeaderSection
            orderDetails={currentOrder?.order_items || []}
          />
        </SectionWrapper>
      </main>
    </>
  );
}
