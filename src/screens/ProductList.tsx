import { ProductListSection, ProductTableSection } from "./ProductListSection";
import { isWarehouseHostname } from "../utils/hostUtils";
import { useState } from "react";

export const ProductList = (): JSX.Element => {
  const isWarehouse = isWarehouseHostname();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <main className="flex flex-col w-full gap-8 p-6 bg-white rounded-lg">
      <ProductListSection
        isWarehouse={isWarehouse}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <ProductTableSection
        isWarehouse={isWarehouse}
        searchQuery={searchQuery}
      />
    </main>
  );
};
