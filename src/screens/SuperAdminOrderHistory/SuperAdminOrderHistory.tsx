import { SuperAdminOrderHistorySection } from "./SuperAdminOrderHistorySection";
import { useAppDispatch } from "../../store/store";
import { getAllOrders } from "../../store/features/cartSlice";
import { useEffect } from "react";

export default function SuperAdminOrderHistory() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // TODO: Replace hardcoded values with dynamic values from store/context
    dispatch(getAllOrders({ dns_prefix: "chronodrive", store_id: "27" }));
  }, [dispatch]);

  return (
    <main className="flex flex-col w-full gap-8 p-6 bg-white rounded-lg">
      <SuperAdminOrderHistorySection />
    </main>
  );
}
