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
import type { Product } from "../../store/features/productSlice";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "../../components/Skeleton";
import EmptyState from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";
import { LinkIcon, Package } from "lucide-react";

export const ProductTableSection = (): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { products, loading, error } = useAppSelector((state) => state.product);
  const productList = products?.products || [];
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const ITEMS_PER_PAGE = 5;

  // Calculate total pages
  const totalPages = Math.ceil(productList.length / ITEMS_PER_PAGE);

  // Get current page products
  const currentProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return productList.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [productList, currentPage]);

  // Handle select all checkbox
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(currentProducts.map((product) => product.id));
    }
    setSelectAll(!selectAll);
  };

  // Handle individual product selection
  const handleSelectProduct = (productId: number) => {
    setSelectedProducts((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleLinkProducts = (productId: number) => {
    navigate(`/products/link-products/${productId}`);
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
    <section className="flex flex-col h-screen">
      <div className="flex-grow overflow-auto pb-24">
        <div className="w-full">
          {loading ? (
            <Skeleton variant="table" />
          ) : error ? (
            <ErrorState
              message={error}
              variant="inline"
              onRetry={() => window.location.reload()}
            />
          ) : currentProducts.length === 0 ? (
            <EmptyState
              icon={Package}
              title={t("productTable.noProducts")}
              description={t("productTable.emptyMessage")}
              actionLabel={t("productTable.clearSearch")}
              onAction={() => window.location.reload()}
            />
          ) : (
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
                    {t("productList.actions.link")}
                  </TableHead>
                  <TableHead className="w-[145px] text-left text-[#1e2324] font-text-small">
                    {t("productList.table.details")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentProducts.map((product: Product) => (
                  <TableRow
                    key={product.id}
                    className="border-b border-primary-neutal-300 py-[var(--2-tokens-screen-modes-common-spacing-XS)]"
                  >
                    <TableCell className="w-11">
                      <div className="flex justify-center">
                        <Checkbox
                          className="w-5 h-5 bg-color-white rounded border-[1.5px] border-solid border-1-tokens-color-modes-common-neutral-medium"
                          checked={selectedProducts.includes(product.id)}
                          onCheckedChange={() =>
                            handleSelectProduct(product.id)
                          }
                        />
                      </div>
                    </TableCell>
                    <TableCell className="w-[77px] text-left font-text-smaller text-coolgray-100 align-middle">
                      {product.id ?? "Not available"}
                    </TableCell>
                    <TableCell className="w-[77px] align-middle">
                      <div
                        className="w-[50px] h-[50px] rounded-[var(--2-tokens-screen-modes-button-border-radius)]"
                        style={{
                          backgroundImage: product.product_image
                            ? `url(${product.product_image})`
                            : "none",
                          backgroundColor: !product.product_image
                            ? "#f0f0f0"
                            : "transparent",
                          backgroundSize: "contain",
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                        }}
                      />
                    </TableCell>
                    <TableCell className="w-[145px] text-left font-text-bold-smaller text-[color:var(--1-tokens-color-modes-input-primary-default-text)] align-middle">
                      {product.name ?? "Not available"}
                    </TableCell>
                    <TableCell className="w-[145px] text-left font-text-smaller text-black align-middle">
                      {product.suitable_for ?? "Not available"}
                    </TableCell>
                    <TableCell className="w-[145px] text-left font-text-smaller text-black align-middle">
                      {product.size ?? "Not available"}
                    </TableCell>
                    <TableCell className="w-[145px] text-left font-text-smaller text-black align-middle">
                      {product.pack_quantity
                        ? `${product.pack_quantity}`
                        : "Not available"}
                    </TableCell>
                    <TableCell className="w-[145px] text-left font-text-smaller text-black align-middle">
                      {product.available_packs
                        ? `${product.available_packs}`
                        : "Not available"}
                    </TableCell>
                    <TableCell className="w-[145px] text-left font-text-smaller text-black align-middle">
                      {product.price_of_pack
                        ? `${product.price_of_pack}€`
                        : "Not available"}
                    </TableCell>
                    <TableCell className="w-[145px] text-left font-text-smaller text-black align-middle">
                      <Badge
                        variant={product.is_active ? "active" : "inactive"}
                      >
                        {product.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="w-[15px] text-left align-middle">
                      <Button
                        variant="link"
                        onClick={() => handleLinkProducts(product.id)}
                        className="text-[color:var(--1-tokens-color-modes-button-ghost-default-text)] font-text-small underline"
                      >
                        <LinkIcon className="w-6 h-6" />
                      </Button>
                    </TableCell>
                    <TableCell className="w-[145px] text-left align-middle">
                      <Button
                        variant="link"
                        onClick={() => navigate(`/products/${product.id}`)}
                        className="text-[color:var(--1-tokens-color-modes-button-ghost-default-text)] font-text-small underline"
                      >
                        {t("productList.table.details")}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

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
    </section>
  );
};
