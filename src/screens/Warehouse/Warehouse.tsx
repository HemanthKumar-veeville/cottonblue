import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, useAppSelector } from "../../store/store";
import { AppDispatch } from "../../store/store";
import { Product } from "../../store/features/productSlice";
import { fetchAllProducts } from "../../store/features/productSlice";
import { WarehouseListSection } from "./WarehouseListSection/WarehouseListSection";
import { WarehouseTableSection } from "./WarehouseListSection/WarehouseTableSection";

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
  const { products, loading, error } = useSelector(
    (state: RootState) => state.product
  );
  const [searchTerm, setSearchTerm] = useState("");
  const { selectedCompany } = useAppSelector((state) => state.client);
  const dnsPrefix = selectedCompany?.dns || "admin";

  useEffect(() => {
    if (dnsPrefix) {
      dispatch(fetchAllProducts(dnsPrefix));
    }
  }, [dispatch, dnsPrefix]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  // Mock orders data (this should come from your actual data source)
  const ordersData = [
    {
      id: "#CMD-00125",
      date: "18/05/2025",
      client: "Chronodrive - Lille",
      quantity: 2,
      status: "Pending",
    },
    {
      id: "#CMD-00345",
      date: "31/01/2025",
      client: "Dassault System - Seclin",
      quantity: 10,
      status: "Prepared",
    },
  ];

  return (
    <main className="flex flex-col w-full gap-8 p-6 bg-white rounded-lg overflow-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
      <WarehouseListSection onSearch={handleSearch} />
      <WarehouseTableSection
        orders={ordersData}
        loading={loading}
        error={error}
        searchTerm={searchTerm}
      />
    </main>
  );
};
