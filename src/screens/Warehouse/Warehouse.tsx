import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, useAppSelector } from "../../store/store";
import { AppDispatch } from "../../store/store";
import { WarehouseListSection } from "./WarehouseListSection/WarehouseListSection";
import { WarehouseTableSection } from "./WarehouseListSection/WarehouseTableSection";
import {
  getAllCompanyOrders,
  getAllOrders,
} from "../../store/features/cartSlice";

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

interface StoreFilter {
  id: string;
  name: string;
  dns_prefix: string;
}

export const Warehouse = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading, error } = useSelector(
    (state: RootState) => state.cart
  );
  const { adminMode } = useSelector((state: RootState) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeStoreFilter, setActiveStoreFilter] =
    useState<StoreFilter | null>(null);
  const [activeStatusFilter, setActiveStatusFilter] = useState<string | null>(
    null
  );
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const { selectedCompany } = useAppSelector((state) => state.client);
  const dnsPrefix = adminMode ? "admin" : selectedCompany?.dns || "admin";

  useEffect(() => {
    if (dnsPrefix) {
      if (activeStoreFilter) {
        dispatch(
          getAllOrders({
            dns_prefix: activeStoreFilter?.dns_prefix || dnsPrefix,
            store_id: activeStoreFilter.id,
            status: activeStatusFilter?.status,
          })
        );
      } else {
        dispatch(
          getAllCompanyOrders({
            dns_prefix: dnsPrefix,
            status: activeStatusFilter || undefined,
          })
        );
      }
    }
  }, [dispatch, dnsPrefix, activeStoreFilter, activeStatusFilter]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleStoreFilter = (
    storeId: string,
    storeName: string,
    dnsPrefix: string,
    status: string
  ) => {
    setActiveStoreFilter({
      id: storeId,
      name: storeName,
      dns_prefix: dnsPrefix,
      status,
    });
  };

  const clearStoreFilter = () => {
    setActiveStoreFilter(null);
  };

  const handleStatusFilter = (status: string | null) => {
    setActiveStatusFilter(status);
  };

  const clearStatusFilter = () => {
    setActiveStatusFilter(null);
  };

  const handleSelectedOrdersChange = (orderIds: number[]) => {
    setSelectedOrders(orderIds);
  };

  return (
    <main className="flex flex-col w-full gap-8 p-6 bg-white rounded-lg overflow-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
      <WarehouseListSection
        onSearch={handleSearch}
        activeStoreFilter={activeStoreFilter}
        activeStatusFilter={activeStatusFilter}
        onClearFilter={clearStoreFilter}
        onClearStatusFilter={clearStatusFilter}
        selectedOrders={selectedOrders}
        onSelectedOrdersChange={handleSelectedOrdersChange}
        setSelectedOrders={setSelectedOrders}
      />
      <WarehouseTableSection
        orders={orders || []}
        loading={loading}
        error={error}
        searchTerm={searchTerm}
        onStoreClick={handleStoreFilter}
        onStatusClick={handleStatusFilter}
        activeStoreFilter={activeStoreFilter}
        activeStatusFilter={activeStatusFilter}
        onSelectedOrdersChange={handleSelectedOrdersChange}
        onSearchChange={handleSearch}
        selectedOrders={selectedOrders}
        setSelectedOrders={setSelectedOrders}
      />
    </main>
  );
};
