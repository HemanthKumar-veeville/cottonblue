import React, { useEffect } from "react";
import { OrderTableHeaderSection } from "./OrderTableHeaderSection";
import { ProductListHeaderSection } from "./ProductListHeaderSection";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getOrder } from "../../store/features/cartSlice";
import { RootState, AppDispatch } from "../../store";
import { getHost } from "../../utils/hostUtils";
import { useAppSelector } from "../../store/store";
import { Skeleton } from "../../components/ui/skeleton";
import { Card } from "../../components/ui/card";

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
  const dnsPrefix = getHost();
  const { selectedStore } = useAppSelector((state) => state.agency);

  const dispatch = useDispatch<AppDispatch>();
  const { currentOrder, loading, error } = useSelector(
    (state: RootState) => state.cart
  );

  // Safely access order properties with fallbacks
  const orderDetails = {
    createdAt: currentOrder?.created_at ?? "Not available",
    orderId: currentOrder?.order_id ?? "Not available",
    orderItems: currentOrder?.order_items ?? [],
    orderStatus: currentOrder?.order_status ?? "Not available",
    storeAddress: currentOrder?.store_address ?? "Not available",
    storeName: currentOrder?.store_name ?? "Not available",
  };

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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
        <div className="bg-error/10 text-error rounded-lg p-6 max-w-md text-center">
          <h3 className="font-bold text-lg mb-2">Error Loading Order</h3>
          <p className="text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-error text-white rounded-md hover:bg-error/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="flex flex-col w-full max-w-[1208px] mx-auto gap-8 px-4 py-6 md:px-6 lg:px-8">
      <SectionWrapper>
        <OrderTableHeaderSection orderDetails={orderDetails} />
      </SectionWrapper>
      <SectionWrapper>
        <ProductListHeaderSection orderDetails={orderDetails.orderItems} />
      </SectionWrapper>
    </main>
  );
}
