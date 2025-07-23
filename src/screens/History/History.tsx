import { OrderDetailsSection } from "../OrderDetailsSection/OrderDetailsSection";
import { OrderHistorySection } from "../OrderHistorySection/OrderHistorySection";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  getAllCompanyOrders,
  getAllOrders,
} from "../../store/features/cartSlice";
import { getHost } from "../../utils/hostUtils";
import { useAppSelector, AppDispatch } from "../../store/store";

export default function History(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const dns_prefix = getHost();
  const { selectedStore } = useAppSelector((state) => state.agency);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"all" | "selected">("selected");

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    if (selectedStore && activeTab === "selected") {
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
    } else if (activeTab === "all") {
      if (dns_prefix) {
        if (searchQuery.trim() !== "") {
          setCurrentPage(1);
        }
        searchQuery?.trim()?.length >= 3
          ? dispatch(
              getAllCompanyOrders({
                dns_prefix: dns_prefix,
                page: currentPage,
                limit: ITEMS_PER_PAGE,
                search: searchQuery?.trim()?.length >= 3 ? searchQuery : "",
              })
            )
          : searchQuery?.trim()?.length === 0 &&
            dispatch(
              getAllCompanyOrders({
                dns_prefix: dns_prefix,
                page: currentPage,
                limit: ITEMS_PER_PAGE,
                search: searchQuery?.trim()?.length >= 3 ? searchQuery : "",
              })
            );
      }
    }
  }, [
    dispatch,
    selectedStore,
    currentPage,
    searchQuery,
    dns_prefix,
    activeTab,
  ]);

  return (
    <main className="flex flex-col w-full gap-8 p-6">
      <OrderHistorySection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={ITEMS_PER_PAGE}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <OrderDetailsSection
        currentPage={currentPage}
        itemsPerPage={ITEMS_PER_PAGE}
        setCurrentPage={setCurrentPage}
        activeTab={activeTab}
      />
    </main>
  );
}
