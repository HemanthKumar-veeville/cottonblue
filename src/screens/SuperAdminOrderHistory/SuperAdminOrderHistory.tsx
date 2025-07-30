import { SuperAdminOrderHistorySection } from "./SuperAdminOrderHistorySection";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { getAllCompanyOrders } from "../../store/features/cartSlice";
import { useEffect, useState } from "react";

export default function SuperAdminOrderHistory() {
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const { selectedCompany } = useAppSelector((state) => state.client);
  const dns = selectedCompany?.dns || "admin";

  return (
    <main className="flex flex-col w-full gap-8 p-6 bg-white rounded-lg">
      <SuperAdminOrderHistorySection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={ITEMS_PER_PAGE}
        dns_prefix={dns}
      />
    </main>
  );
}
