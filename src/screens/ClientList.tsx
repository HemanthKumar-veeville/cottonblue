import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ClientListSection } from "./ClientListSection/ClientListSection";
import { ClientTableSection } from "./ClientListSection/ClientTableSection";
import { getAllCompanies } from "../store/features/clientSlice";
import { RootState } from "../store/store";
import { AppDispatch } from "../store/store";

interface Company {
  id: number;
  name: string;
  phone_number: string;
  city: string;
  address: string;
  status: string;
  created_at: string;
}

interface CompaniesResponse {
  data?: Company[];
  companies?: Company[];
}

export const ClientList = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const { companies, loading, error, total, currentPageClient } = useSelector(
    (state: RootState) => state.client
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(currentPageClient || 1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    if (searchTerm.trim().length >= 3 || searchTerm.trim().length === 0) {
      dispatch(
        getAllCompanies({
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          search: searchTerm.trim().length >= 3 ? searchTerm : "",
        })
      );
    }
  }, [dispatch, currentPage, searchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Ensure companies is an array and has the correct structure
  let companiesArray: Company[] = [];

  if (Array.isArray(companies)) {
    companiesArray = companies;
  } else if (companies && typeof companies === "object") {
    const companiesObj = companies as CompaniesResponse;
    // If companies is an object, it might be a response with a data property
    if (companiesObj.data && Array.isArray(companiesObj.data)) {
      companiesArray = companiesObj.data;
    } else if (
      companiesObj.companies &&
      Array.isArray(companiesObj.companies)
    ) {
      companiesArray = companiesObj.companies;
    } else {
      // If it's an object but doesn't have expected properties, try to convert it to an array
      companiesArray = Object.values(companiesObj) as Company[];
    }
  }

  return (
    <main className="flex flex-col w-full gap-8 p-6 bg-white rounded-lg overflow-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
      <ClientListSection onSearch={handleSearch} searchTerm={searchTerm} />
      <ClientTableSection
        companies={companiesArray}
        loading={loading}
        error={error}
        searchTerm={searchTerm}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={ITEMS_PER_PAGE}
        totalItems={total}
      />
    </main>
  );
};
