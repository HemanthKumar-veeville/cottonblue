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
import dayjs from "dayjs";
import { TimeframeType } from "../OrderHistorySection/TimeframeSelect";

interface DateRange {
  startDate: string;
  endDate: string;
}

export default function History(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const dns_prefix = getHost();
  const { selectedStore } = useAppSelector((state) => state.agency);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"all" | "selected">("selected");
  const [selectedTimeframe, setSelectedTimeframe] =
    useState<TimeframeType>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<DateRange>({
    startDate: dayjs().startOf("year").format("YYYY-MM-DD"),
    endDate: dayjs().format("YYYY-MM-DD"),
  });

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    if (selectedStore && activeTab === "selected") {
      if (searchQuery.trim() !== "") {
        setCurrentPage(1);
      }

      const params = {
        dns_prefix,
        store_id: selectedStore,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: searchQuery?.trim()?.length >= 3 ? searchQuery : "",
        ...(selectedTimeframe === "custom" && {
          ...(selectedPeriod.startDate !== "Invalid Date" && {
            startDate: selectedPeriod.startDate,
          }),
          ...(selectedPeriod.endDate !== "Invalid Date" && {
            endDate: selectedPeriod.endDate,
          }),
        }),
        ...(selectedStatus !== "all" && {
          status: selectedStatus,
        }),
      };

      if (
        searchQuery?.trim()?.length >= 3 ||
        searchQuery?.trim()?.length === 0
      ) {
        dispatch(getAllOrders(params));
      }
    } else if (activeTab === "all") {
      if (dns_prefix) {
        if (searchQuery.trim() !== "") {
          setCurrentPage(1);
        }

        const params = {
          dns_prefix: dns_prefix,
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          search: searchQuery?.trim()?.length >= 3 ? searchQuery : "",
          ...(selectedTimeframe === "custom" && {
            ...(selectedPeriod.startDate !== "Invalid Date" && {
              startDate: selectedPeriod.startDate,
            }),
            ...(selectedPeriod.endDate !== "Invalid Date" && {
              endDate: selectedPeriod.endDate,
            }),
          }),
          ...(selectedStatus !== "all" && {
            status: selectedStatus,
          }),
        };

        if (
          searchQuery?.trim()?.length >= 3 ||
          searchQuery?.trim()?.length === 0
        ) {
          dispatch(getAllCompanyOrders(params));
        }
      }
    }
  }, [
    dispatch,
    selectedStore,
    currentPage,
    searchQuery,
    dns_prefix,
    activeTab,
    selectedTimeframe,
    selectedPeriod,
    selectedStatus,
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
        selectedTimeframe={selectedTimeframe}
        setSelectedTimeframe={setSelectedTimeframe}
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
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
