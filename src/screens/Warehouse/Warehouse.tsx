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

  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    if (dnsPrefix) {
      // Reset to first page when search term changes
      if (searchTerm.trim() !== "") {
        setCurrentPage(1);
      }

      // Only search if term is 3+ characters or empty
      const shouldSearch =
        searchTerm.trim().length >= 3 || searchTerm.trim().length === 0;

      if (shouldSearch) {
        if (activeStoreFilter) {
          setCurrentPage(1);
          dispatch(
            getAllOrders({
              dns_prefix: activeStoreFilter?.dns_prefix || dnsPrefix,
              store_id: activeStoreFilter.id,
              status: activeStatusFilter || undefined,
              page: currentPage,
              limit: ITEMS_PER_PAGE,
              search: searchTerm.trim(),
            })
          );
        } else {
          dispatch(
            getAllCompanyOrders({
              dns_prefix: dnsPrefix,
              status: activeStatusFilter || undefined,
              page: currentPage,
              limit: ITEMS_PER_PAGE,
              search: searchTerm.trim(),
            })
          );
        }
      }
    }
  }, [
    dispatch,
    dnsPrefix,
    activeStoreFilter,
    activeStatusFilter,
    currentPage,
    searchTerm,
  ]);

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
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={ITEMS_PER_PAGE}
      />
    </main>
  );
};
