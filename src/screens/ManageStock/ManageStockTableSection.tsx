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
import { useState, useMemo, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../store/store";
import { Skeleton } from "../../components/Skeleton";
import EmptyState from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";
import { ImageOff, Package, PlusCircle } from "lucide-react";
import { ProductStockPopup } from "../../components/ProductStockPopup/ProductStockPopup";
import { fetchAllProducts } from "../../store/features/productSlice";

export const ManageStockTableSection = ({
  searchQuery,
}: {
  searchQuery: string;
}): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector((state) => state.product);
  const { selectedCompany } = useAppSelector((state) => state.client);
  const dnsPrefix = selectedCompany?.dns || "admin";
  const productList = products?.products?.product_list || [];
  const totalProducts = products?.products?.total || 0;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStocks, setSelectedStocks] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    if (dnsPrefix && searchQuery?.trim()?.length >= 3) {
      if (searchQuery.trim() !== "") {
        setCurrentPage(1);
      }
      dispatch(
        fetchAllProducts({
          dnsPrefix,
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          searchQuery: searchQuery?.trim()?.length >= 3 ? searchQuery : "",
        })
      );
    }
    if (dnsPrefix && searchQuery?.trim()?.length === 0) {
      dispatch(
        fetchAllProducts({
          dnsPrefix,
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          searchQuery: "",
        })
      );
    }
  }, [dispatch, dnsPrefix, currentPage, searchQuery]);

  // Filter stocks based on search query
  const filteredStocks = productList;

  // Calculate total pages based on total products from API
  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

  // Handle select all checkbox
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedStocks([]);
    } else {
      setSelectedStocks(filteredStocks.map((stock) => stock.id));
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

  // Generate pagination items with a maximum of 5 visible pages
  const paginationItems = useMemo(() => {
    const maxVisiblePages = 5;
    const items = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(i);
    }

    return items;
  }, [currentPage, totalPages]);

  return (
    <section className="flex flex-col h-full">
      <div className="flex-grow overflow-auto pb-24">
        <div className="w-full">
          {loading ? (
            <Skeleton variant="table" />
          ) : filteredStocks.length === 0 ? (
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
                    <TableHead className="w-[77px] text-left text-[#1e2324] font-text-small">
                      <span className="text-center text-[#1e2324]">#</span>
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
                  {filteredStocks.map((stock, index) => (
                    <TableRow
                      key={stock.id}
                      className="border-b border-primary-neutal-300 py-[var(--2-tokens-screen-modes-common-spacing-XS)]"
                    >
                      <TableCell className="w-[77px] text-left font-text-smaller text-coolgray-100 align-middle">
                        <span className="font-text-smaller text-coolgray-100">
                          {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                        </span>
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

      {filteredStocks.length > 0 && (
        <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-primary-neutal-300 py-4">
          <div className="px-6 max-w-[calc(100%-2rem)]">
            <Pagination className="flex items-center justify-between w-full mx-auto">
              <PaginationPrevious
                href="#"
                className={`h-[42px] bg-white rounded-lg shadow-1dp-ambient flex items-center gap-1 pl-2 pr-3 py-2.5 font-medium text-[15px] ${
                  currentPage === 1
                    ? "opacity-50 cursor-not-allowed text-gray-400"
                    : "text-black hover:bg-gray-50"
                }`}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <img
                  className={`w-6 h-6 ${currentPage === 1 ? "opacity-50" : ""}`}
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
                {totalPages > 5 && currentPage < totalPages - 2 && (
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
                className={`h-[42px] bg-white rounded-lg shadow-1dp-ambient flex items-center gap-1 pl-3 pr-2 py-2.5 font-medium text-[15px] ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed text-gray-400"
                    : "text-black hover:bg-gray-50"
                }`}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
              >
                {t("productList.pagination.next")}
                <img
                  className={`w-6 h-6 rotate-180 ${
                    currentPage === totalPages ? "opacity-50" : ""
                  }`}
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
