import { OrderDetailsSection } from "../OrderDetailsSection/OrderDetailsSection";
import { OrderHistorySection } from "../OrderHistorySection/OrderHistorySection";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders } from "../../store/features/cartSlice";
import { getHost } from "../../utils/hostUtils";
import { useAppSelector } from "../../store/store";

export default function History(): JSX.Element {
  const dispatch = useDispatch();
  const dns_prefix = getHost();
  const { selectedStore } = useAppSelector((state) => state.agency);
  const orders = useSelector((state: any) => state.cart.orders);
  console.log({ orders });
  useEffect(() => {
    if (selectedStore) {
      dispatch(
        getAllOrders({
          dns_prefix,
          store_id: selectedStore,
          page: 1,
          limit: 10,
          search: "",
        })
      );
    }
  }, [dispatch, selectedStore]);

  return (
    <main className="flex flex-col w-full gap-8 p-6">
      <OrderHistorySection />
      <OrderDetailsSection />
    </main>
  );
}
