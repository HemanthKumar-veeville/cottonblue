import { OrderDetailsSection } from "../OrderDetailsSection/OrderDetailsSection";
import { OrderHistorySection } from "../OrderHistorySection/OrderHistorySection";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getAllOrders } from "../../store/features/cartSlice";
import { getHost } from "../../utils/hostUtils";
import { useAppSelector, AppDispatch } from "../../store/store";

export default function History(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const dns_prefix = getHost();
  const { selectedStore } = useAppSelector((state) => state.agency);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    if (selectedStore) {
      if (searchQuery.trim() !== "") {
        setCurrentPage(1);
      }
      searchQuery?.trim()?.length >= 3
        ? dispatch(
            getAllOrders({
              dns_prefix,
              store_id: selectedStore,
              page: currentPage,
              limit: ITEMS_PER_PAGE,
              search: searchQuery?.trim()?.length >= 3 ? searchQuery : "",
            })
          )
        : searchQuery?.trim()?.length === 0 &&
          dispatch(
            getAllOrders({
              dns_prefix,
              store_id: selectedStore,
              page: currentPage,
              limit: ITEMS_PER_PAGE,
              search: searchQuery?.trim()?.length >= 3 ? searchQuery : "",
            })
          );
    }
  }, [dispatch, selectedStore, currentPage, searchQuery, dns_prefix]);

  return (
    <main className="flex flex-col w-full gap-8 p-6">
      <OrderHistorySection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={ITEMS_PER_PAGE}
      />
      <OrderDetailsSection
        currentPage={currentPage}
        itemsPerPage={ITEMS_PER_PAGE}
        setCurrentPage={setCurrentPage}
      />
    </main>
  );
}
