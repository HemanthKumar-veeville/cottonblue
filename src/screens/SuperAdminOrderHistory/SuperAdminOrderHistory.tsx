import { SuperAdminOrderHistorySection } from "./SuperAdminOrderHistorySection";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  getAllOrders,
  getAllCompanyOrders,
} from "../../store/features/cartSlice";
import { useEffect } from "react";

export default function SuperAdminOrderHistory() {
  const dispatch = useAppDispatch();
  const { selectedCompany } = useAppSelector((state) => state.client);
  const dns = selectedCompany?.dns || "admin";
  useEffect(() => {
    // TODO: Replace hardcoded values with dynamic values from store/context
    dispatch(getAllCompanyOrders({ dns_prefix: dns }));
  }, [dispatch, dns]);

  return (
    <main className="flex flex-col w-full gap-8 p-6 bg-white rounded-lg">
      <SuperAdminOrderHistorySection />
    </main>
  );
}
