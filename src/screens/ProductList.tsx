import { ProductListSection, ProductTableSection } from "./ProductListSection";

export const ProductList = (): JSX.Element => {
  return (
    <main className="flex flex-col w-full gap-8 p-6 bg-white rounded-lg">
      <ProductListSection />
      <ProductTableSection />
    </main>
  );
};
