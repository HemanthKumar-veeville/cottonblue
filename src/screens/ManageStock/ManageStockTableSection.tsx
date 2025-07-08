import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Badge } from "../../components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { useTranslation } from "react-i18next";
import { useState, useMemo } from "react";
import { useAppSelector } from "../../store/store";
import { Skeleton } from "../../components/Skeleton";
import EmptyState from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";
import { ImageOff, Package, PlusCircle } from "lucide-react";
import { ProductStockPopup } from "../../components/ProductStockPopup/ProductStockPopup";

export const ManageStockTableSection = ({
  searchQuery,
}: {
  searchQuery: string;
}): JSX.Element => {
  const { t } = useTranslation();
  const { products, loading, error } = useAppSelector((state) => state.product);
  const productList = products?.products || [];
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStocks, setSelectedStocks] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const ITEMS_PER_PAGE = 25;

  // Filter stocks based on search query
  const filteredStocks = useMemo(() => {
    if (!searchQuery) return productList;

    const query = searchQuery.toLowerCase();
    return productList.filter((product) => {
      return (
        product.id?.toString().includes(query) ||
        product.name?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.suitable_for?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query) ||
        product.size?.toLowerCase().includes(query) ||
        product.available_packs?.toString().includes(query) ||
        product.pack_quantity?.toString().includes(query) ||
        product.price_of_pack?.toString().includes(query) ||
        product.total_packs?.toString().includes(query)
      );
    });
  }, [productList, searchQuery]);

  // Get current page stocks
  const currentStocks = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredStocks.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredStocks, currentPage]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredStocks.length / ITEMS_PER_PAGE);

  // Handle select all checkbox
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedStocks([]);
    } else {
      setSelectedStocks(currentStocks.map((stock) => stock.id));
    }
    setSelectAll(!selectAll);
  };

  // Handle individual stock selection
  const handleSelectStock = (stockId: number) => {
    setSelectedStocks((prev) => {
      if (prev.includes(stockId)) {
        return prev.filter((id) => id !== stockId);
      } else {
        return [...prev, stockId];
      }
    });
  };

  // Generate pagination items
  const paginationItems = useMemo(() => {
    const items = [];
    for (let i = 1; i <= totalPages; i++) {
      items.push(i);
    }
    return items;
  }, [totalPages]);

  return (
    <section className="flex flex-col h-full">
      <div className="flex-grow overflow-auto pb-24">
        <div className="w-full">
          {loading ? (
            <Skeleton variant="table" />
          ) : currentStocks.length === 0 ? (
            <EmptyState
              icon={Package}
              title={t("productList.noProducts")}
              description={t("productList.emptyMessage")}
              actionLabel={t("productList.clearSearch")}
              onAction={() => window.location.reload()}
            />
          ) : (
            <>
              <Table>
                <TableHeader className="bg-1-tokens-color-modes-common-primary-brand-lower rounded-md">
                  <TableRow>
                    <TableHead className="w-11">
                      <div className="flex justify-center">
                        <Checkbox
                          className="w-5 h-5 bg-color-white rounded border-[1.5px] border-solid border-1-tokens-color-modes-common-neutral-medium"
                          checked={selectAll}
                          onCheckedChange={handleSelectAll}
                        />
                      </div>
                    </TableHead>
                    <TableHead className="w-[77px] text-left text-[#1e2324] font-text-small">
                      {t("productList.table.sku")}
                    </TableHead>
                    <TableHead className="w-[77px] text-left text-[#1e2324] font-text-small">
                      {t("productList.table.photo")}
                    </TableHead>
                    <TableHead className="w-[145px] text-left text-[#1e2324] font-text-small">
                      {t("productList.table.name")}
                    </TableHead>
                    <TableHead className="w-[145px] text-left text-[#1e2324] font-text-small">
                      {t("productList.table.suitableFor")}
                    </TableHead>
                    <TableHead className="w-[145px] text-left text-[#1e2324] font-text-small">
                      {t("productList.table.size")}
                    </TableHead>
                    <TableHead className="w-[175px] text-left text-[#1e2324] font-text-small">
                      {t("productList.table.packQuantity")}
                    </TableHead>
                    <TableHead className="w-[175px] text-left text-[#1e2324] font-text-small">
                      {t("productList.table.availablePacks")}
                    </TableHead>
                    <TableHead className="w-[145px] text-left text-[#1e2324] font-text-small">
                      {t("productList.table.priceOfPack")}
                    </TableHead>
                    <TableHead className="w-[145px] text-left text-[#1e2324] font-text-small">
                      {t("productList.table.status")}
                    </TableHead>
                    <TableHead className="w-[145px] text-left text-[#1e2324] font-text-small">
                      {t("productList.table.addStock")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentStocks.map((stock: any) => (
                    <TableRow
                      key={stock.id}
                      className="border-b border-primary-neutal-300 py-[var(--2-tokens-screen-modes-common-spacing-XS)]"
                    >
                      <TableCell className="w-11">
                        <div className="flex justify-center">
                          <Checkbox
                            className="w-5 h-5 bg-color-white rounded border-[1.5px] border-solid border-1-tokens-color-modes-common-neutral-medium"
                            checked={selectedStocks.includes(stock.id)}
                            onCheckedChange={() => handleSelectStock(stock.id)}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="w-[77px] text-left font-text-smaller text-coolgray-100 align-middle">
                        {stock.id ?? "Not available"}
                      </TableCell>
                      <TableCell className="w-[77px] align-middle">
                        <div className="w-[50px] h-[50px] rounded-[var(--2-tokens-screen-modes-button-border-radius)] flex items-center justify-center">
                          {stock.product_images &&
                          stock.product_images.length > 0 &&
                          stock.product_images[0] ? (
                            <img
                              src={stock.product_images[0]}
                              alt={stock.name}
                              width={100}
                              height={100}
                            />
                          ) : (
                            <ImageOff className="w-10 h-10 text-gray-400" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="w-[145px] text-left font-text-bold-smaller text-[color:var(--1-tokens-color-modes-input-primary-default-text)] align-middle">
                        {stock.name ?? "Not available"}
                      </TableCell>
                      <TableCell className="w-[145px] text-left font-text-smaller text-black align-middle">
                        {stock.suitable_for ?? "Not available"}
                      </TableCell>
                      <TableCell className="w-[145px] text-left font-text-smaller text-black align-middle">
                        {stock.size ?? "Not available"}
                      </TableCell>
                      <TableCell className="w-[145px] text-left font-text-smaller text-black align-middle">
                        {stock.pack_quantity
                          ? `${stock.pack_quantity}`
                          : "Not available"}
                      </TableCell>
                      <TableCell className="w-[145px] text-left font-text-smaller text-black align-middle">
                        {stock.available_packs
                          ? `${stock.available_packs}`
                          : "Not available"}
                      </TableCell>
                      <TableCell className="w-[145px] text-left font-text-smaller text-black align-middle">
                        {stock.price_of_pack
                          ? `${stock.price_of_pack}€`
                          : "Not available"}
                      </TableCell>
                      <TableCell className="w-[145px] text-left font-text-smaller text-black align-middle">
                        <Badge
                          variant={stock.is_active ? "active" : "inactive"}
                        >
                          {stock.is_active
                            ? t("productList.table.active")
                            : t("productList.table.inactive")}
                        </Badge>
                      </TableCell>
                      <TableCell className="w-[145px] text-left align-middle">
                        <Button
                          variant="ghost"
                          className="flex items-center gap-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 px-3 py-2"
                          onClick={() => setSelectedProduct(stock)}
                        >
                          <PlusCircle className="h-5 w-5 text-primary-600" />
                          <span className="font-medium text-sm">
                            {t("productList.table.addStock")}
                          </span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {selectedProduct && (
                <ProductStockPopup
                  productId={selectedProduct.id}
                  product={selectedProduct}
                  open={!!selectedProduct}
                  onClose={() => setSelectedProduct(null)}
                />
              )}
            </>
          )}
        </div>
      </div>

      {currentStocks.length > 0 && (
        <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-primary-neutal-300 py-4">
          <div className="px-6 max-w-[calc(100%-2rem)]">
            <Pagination className="flex items-center justify-between w-full mx-auto">
              <PaginationPrevious
                href="#"
                className="h-[42px] bg-white rounded-lg shadow-1dp-ambient flex items-center gap-1 pl-2 pr-3 py-2.5 font-medium text-black text-[15px]"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <img
                  className="w-6 h-6"
                  alt="Arrow left"
                  src="/img/arrow-left-sm.svg"
                />
                {t("productList.pagination.previous")}
              </PaginationPrevious>

              <PaginationContent className="flex items-center gap-3">
                {paginationItems.map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      className={`flex items-center justify-center w-9 h-9 rounded ${
                        page === currentPage
                          ? "bg-cyan-100 font-bold text-[#1e2324]"
                          : "border border-solid border-primary-neutal-300 font-medium text-[#023337]"
                      }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                {totalPages > 5 && (
                  <>
                    <PaginationEllipsis className="w-9 h-9 flex items-center justify-center rounded border border-solid border-primary-neutal-300 font-bold text-[#023337]" />
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        className="flex items-center justify-center w-9 h-9 rounded border border-solid border-primary-neutal-300 font-medium text-[#023337]"
                        onClick={() => setCurrentPage(totalPages)}
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}
              </PaginationContent>

              <PaginationNext
                href="#"
                className="h-[42px] bg-white rounded-lg shadow-1dp-ambient flex items-center gap-1 pl-3 pr-2 py-2.5 font-medium text-black text-[15px]"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
              >
                {t("productList.pagination.next")}
                <img
                  className="w-6 h-6 rotate-180"
                  alt="Arrow right"
                  src="/img/arrow-left-sm-1.svg"
                />
              </PaginationNext>
            </Pagination>
          </div>
        </div>
      )}
    </section>
  );
};
