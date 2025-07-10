import { UserListSection } from "./UserListSection";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { fetchUsers } from "../store/features/userSlice";

export const UserList = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const { selectedCompany } = useAppSelector((state) => state.client);

  // Fetch users when page changes
  useEffect(() => {
    if (selectedCompany?.dns && searchQuery?.trim()?.length >= 3) {
      if (searchQuery.trim() !== "") {
        setCurrentPage(1);
      }
      dispatch(
        fetchUsers({
          dnsPrefix: selectedCompany.dns,
          params: {
            page: currentPage,
            limit: ITEMS_PER_PAGE,
            search: searchQuery?.trim()?.length >= 3 ? searchQuery : "",
          },
        })
      );
    }
    if (selectedCompany?.dns && searchQuery?.trim()?.length === 0) {
      if (searchQuery.trim() !== "") {
        setCurrentPage(1);
      }
      dispatch(
        fetchUsers({
          dnsPrefix: selectedCompany.dns,
          params: {
            page: currentPage,
            limit: ITEMS_PER_PAGE,
            search: searchQuery?.trim()?.length >= 3 ? searchQuery : "",
          },
        })
      );
    }
  }, [dispatch, selectedCompany?.dns, currentPage, searchQuery]);

  return (
    <main className="flex flex-col w-full gap-8 p-6 bg-white rounded-lg">
      <UserListSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={ITEMS_PER_PAGE}
      />
    </main>
  );
};
