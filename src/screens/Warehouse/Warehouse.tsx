import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, useAppSelector } from "../../store/store";
import { AppDispatch } from "../../store/store";
import { WarehouseListSection } from "./WarehouseListSection/WarehouseListSection";
import { WarehouseTableSection } from "./WarehouseListSection/WarehouseTableSection";
import { getAllCompanyOrders } from "../../store/features/cartSlice";
interface Order {
  id: string;
  date: string;
  client: string;
  quantity: number;
  status: "Pending" | "Prepared";
}

interface OrdersResponse {
  data?: Order[];
  orders?: Order[];
}

export const Warehouse = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading, error } = useSelector(
    (state: RootState) => state.cart
  );
  console.log({ orders });
  const { adminMode } = useSelector((state: RootState) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  const { selectedCompany } = useAppSelector((state) => state.client);
  const dnsPrefix = adminMode ? "admin" : selectedCompany?.dns || "admin";

  useEffect(() => {
    if (dnsPrefix) {
      dispatch(getAllCompanyOrders({ dns_prefix: dnsPrefix }));
    }
  }, [dispatch, dnsPrefix]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <main className="flex flex-col w-full gap-8 p-6 bg-white rounded-lg overflow-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
      <WarehouseListSection onSearch={handleSearch} />
      <WarehouseTableSection
        orders={Array.isArray(orders) ? orders : orders?.orders || []}
        loading={loading}
        error={error}
        searchTerm={searchTerm}
      />
    </main>
  );
};
