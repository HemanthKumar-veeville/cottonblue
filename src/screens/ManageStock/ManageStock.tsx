import { ManageStockSection } from "./ManageStockSection";
import { useState } from "react";
import { ManageStockTableSection } from "./ManageStockTableSection";

const ManageStock: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

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
