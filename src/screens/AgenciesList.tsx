import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AgencyListSection } from "./AgenciesListSection/AgencyListSection";
import { AgencyTableSection } from "./AgenciesListSection/AgencyTableSection";
import { RootState } from "../store/store";
import { AppDispatch } from "../store/store";
import { fetchAllStores } from "../store/features/agencySlice";

interface Agency {
  id: number;
  name: string;
  phone_number: string;
  city: string;
  address: string;
  status: string;
  created_at: string;
  contact_person: string;
  email: string;
}

interface AgenciesResponse {
  data?: Agency[];
  agencies?: Agency[];
}

export const AgenciesList = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const { stores, loading, error } = useSelector(
    (state: RootState) => state.agency
  );
  const company = useSelector((state: RootState) => state.auth.company);
  console.log("Company:", company);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Dispatch the fetchAllStores action to get agencies data
    if (company) {
      dispatch(fetchAllStores(company));
    }
  }, [dispatch, company]);

  // Debug: Log the agencies data
  useEffect(() => {
    console.log("Agencies from Redux store:", stores);
    console.log("Agencies type:", typeof stores);
    console.log("Is agencies an array?", Array.isArray(stores));
    if (Array.isArray(stores)) {
      console.log("Number of agencies:", stores.length);
    }
  }, [stores]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  // Ensure agencies is an array and has the correct structure
  let agenciesArray: Agency[] = [];

  if (Array.isArray(stores)) {
    agenciesArray = stores;
  } else if (stores && typeof stores === "object") {
    const agenciesObj = stores as AgenciesResponse;
    // If agencies is an object, it might be a response with a data property
    if (agenciesObj.data && Array.isArray(agenciesObj.data)) {
      agenciesArray = agenciesObj.data;
    } else if (agenciesObj.agencies && Array.isArray(agenciesObj.agencies)) {
      agenciesArray = agenciesObj.agencies;
    } else {
      // If it's an object but doesn't have expected properties, try to convert it to an array
      agenciesArray = Object.values(agenciesObj) as Agency[];
    }
  }

  return (
    <main className="flex flex-col w-full gap-8 p-6 bg-white rounded-lg">
      <AgencyListSection onSearch={handleSearch} />
      <AgencyTableSection
        agencies={agenciesArray}
        loading={loading}
        error={error}
        searchTerm={searchTerm}
      />
    </main>
  );
};
