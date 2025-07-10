import { ClientUserListSection } from "./UserListSection/ClientUserListSection";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { fetchUsers } from "../store/features/userSlice";
import { getHost } from "../utils/hostUtils";

export const ClientUserList = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const { selectedCompany } = useAppSelector((state) => state.client);
  const host = getHost();
  const dnsPrefix = host;
  console.log({ dnsPrefix });
  // Fetch users when page changes or search query changes
  useEffect(() => {
    if (dnsPrefix) {
      if (searchQuery.trim() !== "") {
        setCurrentPage(1);
      }
      dispatch(
        fetchUsers({
          dnsPrefix: dnsPrefix,
          params: {
            page: currentPage,
            limit: ITEMS_PER_PAGE,
            search: searchQuery.trim(),
          },
        })
      );
    }
  }, [dispatch, dnsPrefix, currentPage, searchQuery]);

  return (
    <main className="flex flex-col w-full gap-8 p-6 bg-white rounded-lg">
      <ClientUserListSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={ITEMS_PER_PAGE}
      />
    </main>
  );
};
