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
import { useState, useMemo, useEffect, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../../store/store";
import type { Product } from "../../store/features/productSlice";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "../../components/Skeleton";
import EmptyState from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";
import {
  Boxes,
  Package,
  MoreVertical,
  Eye,
  Edit,
  Power,
  ImageOff,
} from "lucide-react";
import {
  fetchAllProducts,
  updateProduct,
} from "../../store/features/productSlice";
export const ProductTableSection = ({
  isWarehouse,
  searchQuery,
}: {
  isWarehouse: boolean;
  searchQuery: string;
}): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { products, loading, error } = useAppSelector((state) => state.product);
  const productList = products?.products || [];
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});
  const dispatch = useAppDispatch();
  const ITEMS_PER_PAGE = 25;

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return productList;

    const query = searchQuery.toLowerCase();
    return productList.filter((product) => {
      return (
        product.name?.toLowerCase().includes(query) ||
        product.id?.toString().includes(query) ||
        product.suitable_for?.toLowerCase().includes(query) ||
        product.size?.toLowerCase().includes(query) ||
        product.pack_quantity?.toString().includes(query) ||
        product.available_packs?.toString().includes(query) ||
        product.price_of_pack?.toString().includes(query)
      );
    });
  }, [productList, searchQuery]);

  // Get current page products from filtered list
  const currentProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  // Calculate total pages based on filtered products
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const { selectedCompany } = useAppSelector((state) => state.client);

  // Calculate dropdown position
  const getDropdownPosition = (buttonElement: HTMLButtonElement | null) => {
    if (!buttonElement) return {};
    const rect = buttonElement.getBoundingClientRect();
    return {
      top: `${rect.bottom + 8}px`,
      right: `${window.innerWidth - rect.right}px`,
    };
  };

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  // Handle actions
  const handleViewDetails = (productId: number) => {
    navigate(`/products/${productId}`);
    setActiveDropdown(null);
  };

  const handleEdit = (productId: number) => {
    navigate(`/products/edit/${productId}`);
    setActiveDropdown(null);
  };

  const handleToggleActive = async (product: any) => {
    if (product.id && selectedCompany?.dns) {
      await dispatch(
        updateProduct({
          dnsPrefix: selectedCompany.dns,
          productId: product.id,
          data: {
            is_active: !product.is_active,
          },
        })
      ).unwrap();
      dispatch(fetchAllProducts(selectedCompany?.dns));
      setActiveDropdown(null);
    }
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
                  {!isWarehouse && (
                    <TableHead className="w-[145px] text-left text-[#1e2324] font-text-small">
                      {t("productList.table.priceOfPack")}
                    </TableHead>
                  )}
                  <TableHead className="w-[145px] text-left text-[#1e2324] font-text-small">
                    {t("productList.table.status")}
                  </TableHead>
                  {!isWarehouse && (
                    <TableHead className="w-[145px] text-left text-[#1e2324] font-text-small">
                      {t("productList.actions.link")}
                    </TableHead>
                  )}
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
                      {product?.product_images &&
                      product?.product_images.length > 0 &&
                      product?.product_images[0] ? (
                        <div className="w-[150px] h-[150px] rounded-[var(--2-tokens-screen-modes-button-border-radius)] flex items-center justify-center">
                          <img
                            src={product?.product_images[0]}
                            alt={product?.name}
                            className="w-full h-auto min-h-[150px] max-h-[150px] object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-[50px] h-[50px] rounded-[var(--2-tokens-screen-modes-button-border-radius)] flex items-center justify-center">
                          <ImageOff className="w-10 h-10 text-gray-400" />
                        </div>
                      )}
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
                    {!isWarehouse && (
                      <TableCell className="w-[145px] text-left font-text-smaller text-black align-middle">
                        {product.price_of_pack
                          ? `${product.price_of_pack}€`
                          : "Not available"}
                      </TableCell>
                    )}
                    <TableCell className="w-[145px] text-left font-text-smaller text-black align-middle">
                      <Badge
                        variant={product.is_active ? "active" : "inactive"}
                      >
                        {product.is_active
                          ? t("productList.table.active")
                          : t("productList.table.inactive")}
                      </Badge>
                    </TableCell>
                    {!isWarehouse && (
                      <TableCell className="w-[15px] text-left align-middle">
                        <div
                          onClick={() => handleLinkProducts(product.id)}
                          className="text-[color:var(--1-tokens-color-modes-button-ghost-default-text)] cursor-pointer"
                        >
                          <Boxes className="w-5 h-5" />
                        </div>
                      </TableCell>
                    )}
                    <TableCell className="w-[145px] text-left align-middle">
                      {isWarehouse ? (
                        <Button
                          variant="ghost"
                          className="flex items-center gap-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 px-3 py-2"
                          onClick={() => handleViewDetails(product.id)}
                          aria-label="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      ) : (
                        <div
                          className="relative inline-flex items-center"
                          ref={dropdownRef}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            ref={(el) => (buttonRefs.current[product.id] = el)}
                            className={`h-8 w-8 hover:bg-gray-100 rounded-full transition-colors duration-200 ${
                              activeDropdown === product.id ? "bg-gray-100" : ""
                            }`}
                            onClick={() =>
                              setActiveDropdown(
                                activeDropdown === product.id
                                  ? null
                                  : product.id
                              )
                            }
                            aria-expanded={activeDropdown === product.id}
                            aria-haspopup="true"
                            aria-label="Open actions menu"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>

                          {activeDropdown === product.id && (
                            <div
                              ref={menuRef}
                              className="fixed w-44 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-[9999] transform opacity-100 scale-100 transition-all duration-200 ease-out origin-top-right"
                              role="menu"
                              aria-orientation="vertical"
                              aria-labelledby="actions-menu"
                              style={{
                                position: "fixed",
                                zIndex: 9999,
                                ...getDropdownPosition(
                                  buttonRefs.current[product.id]
                                ),
                              }}
                            >
                              <div className="py-1 divide-y divide-gray-100">
                                <button
                                  className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 group"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewDetails(product.id);
                                  }}
                                  role="menuitem"
                                >
                                  <Eye className="mr-3 h-4 w-4 text-gray-400 group-hover:text-primary-600" />
                                  <span className="font-medium">
                                    {t("productList.table.details")}
                                  </span>
                                </button>
                                <button
                                  className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 group"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit(product.id);
                                  }}
                                  role="menuitem"
                                >
                                  <Edit className="mr-3 h-4 w-4 text-gray-400 group-hover:text-primary-600" />
                                  <span className="font-medium">
                                    {t("productList.table.actions.edit")}
                                  </span>
                                </button>
                                <button
                                  className={`flex items-center w-full px-4 py-3 text-sm transition-colors duration-150 group ${
                                    product.is_active
                                      ? "text-red-600 hover:bg-red-50"
                                      : "text-green-600 hover:bg-green-50"
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleActive(product);
                                  }}
                                  role="menuitem"
                                >
                                  <Power
                                    className={`mr-3 h-4 w-4 ${
                                      product.is_active
                                        ? "text-red-400 group-hover:text-red-600"
                                        : "text-green-400 group-hover:text-green-600"
                                    }`}
                                  />
                                  <span className="font-medium">
                                    {product.is_active
                                      ? t(
                                          "productList.table.actions.deactivate"
                                        )
                                      : t("productList.table.actions.activate")}
                                  </span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {currentProducts.length > 0 && (
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
