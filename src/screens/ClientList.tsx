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
  const { companies, loading, error } = useSelector(
    (state: RootState) => state.client
  );
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getAllCompanies());
  }, [dispatch]);

  // Debug: Log the companies data
  useEffect(() => {
    console.log("Companies from Redux store:", companies);
    console.log("Companies type:", typeof companies);
    console.log("Is companies an array?", Array.isArray(companies));
    if (Array.isArray(companies)) {
      console.log("Number of companies:", companies.length);
    }
  }, [companies]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
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
    <main className="flex flex-col w-full gap-8 p-6 bg-white rounded-lg">
      <ClientListSection onSearch={handleSearch} />
      <ClientTableSection
        companies={companiesArray}
        loading={loading}
        error={error}
        searchTerm={searchTerm}
      />
    </main>
  );
};
