import { ManageStockSection } from "./ManageStockSection";
import { useEffect, useState } from "react";
import { ManageStockTableSection } from "./ManageStockTableSection";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { fetchAllProducts } from "../../store/features/productSlice";

const ManageStock: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useAppDispatch();
  const { selectedCompany } = useAppSelector((state) => state.client);
  const dnsPrefix = selectedCompany?.dns || "admin";

  useEffect(() => {
    dispatch(fetchAllProducts(dnsPrefix));
  }, [dispatch, dnsPrefix]);

  return (
    <main className="flex flex-col w-full gap-8 p-6 bg-white rounded-lg">
      <ManageStockSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <ManageStockTableSection searchQuery={searchQuery} />
    </main>
  );
};

export default ManageStock;
