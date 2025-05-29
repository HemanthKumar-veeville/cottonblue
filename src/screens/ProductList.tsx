import { ProductListSection, ProductTableSection } from "./ProductListSection";
import { isWarehouseHostname } from "../utils/hostUtils";

export const ProductList = (): JSX.Element => {
  const isWarehouse = isWarehouseHostname();
  return (
    <main className="flex flex-col w-full gap-8 p-6 bg-white rounded-lg">
      <ProductListSection isWarehouse={isWarehouse} />
      <ProductTableSection isWarehouse={isWarehouse} />
    </main>
  );
};
