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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
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
  Trash2,
} from "lucide-react";
import {
  fetchAllProducts,
  updateProduct,
  deleteProduct,
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
  const { selectedCompany } = useAppSelector((state) => state.client);
  const productList = products?.products?.product_list || [];
  const totalProducts = products?.products?.total || 0;
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showToggleDialog, setShowToggleDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [productToToggle, setProductToToggle] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingActive, setIsTogglingActive] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});
  const dispatch = useAppDispatch();

  // Fetch products when page changes
  useEffect(() => {
    if (selectedCompany?.dns && searchQuery?.trim()?.length >= 3) {
      if (searchQuery.trim() !== "") {
        setCurrentPage(1);
      }
      dispatch(
        fetchAllProducts({
          dnsPrefix: selectedCompany.dns,
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          searchQuery: searchQuery?.trim()?.length >= 3 ? searchQuery : "",
        })
      );
    }
    if (selectedCompany?.dns && searchQuery?.trim()?.length === 0) {
      dispatch(
        fetchAllProducts({
          dnsPrefix: selectedCompany.dns,
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          searchQuery: "",
        })
      );
    }
  }, [dispatch, selectedCompany?.dns, currentPage, searchQuery]);

  // Filter products based on search query
  const filteredProducts = productList;

  // Calculate total pages based on total products from API
  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

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
      setSelectedProducts(filteredProducts.map((product) => product.id));
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

  const handleToggleActiveClick = (product: Product) => {
    setProductToToggle(product);
    setShowToggleDialog(true);
    setActiveDropdown(null);
  };

  const handleToggleActive = async () => {
    if (productToToggle?.id && selectedCompany?.dns) {
      setIsTogglingActive(true);
      try {
        await dispatch(
          updateProduct({
            dnsPrefix: selectedCompany.dns,
            productId: productToToggle.id,
            data: {
              is_active: !productToToggle.is_active,
            },
          })
        ).unwrap();
        dispatch(
          fetchAllProducts({
            dnsPrefix: selectedCompany.dns,
            page: currentPage,
            limit: ITEMS_PER_PAGE,
          })
        );
      } catch (error) {
        console.error("Failed to toggle product status:", error);
      } finally {
        setIsTogglingActive(false);
        setShowToggleDialog(false);
        setProductToToggle(null);
      }
    }
  };

  const handleDelete = async () => {
    if (productToDelete?.id && selectedCompany?.dns) {
      setIsDeleting(true);
      try {
        await dispatch(
          deleteProduct({
            dnsPrefix: selectedCompany.dns,
            productId: productToDelete.id.toString(),
          })
        ).unwrap();
        // Refresh the products list after successful deletion
        dispatch(fetchAllProducts(selectedCompany.dns));
      } catch (error) {
        console.error("Failed to delete product:", error);
      } finally {
        setIsDeleting(false);
        setShowDeleteDialog(false);
        setProductToDelete(null);
        setActiveDropdown(null);
      }
    }
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setShowDeleteDialog(true);
    setActiveDropdown(null);
  };

  return (
    <section className="flex flex-col h-full">
      <div className="flex-grow overflow-auto pb-24">
        <div className="w-full">
          {loading ? (
            <Skeleton variant="table" />
          ) : filteredProducts.length === 0 ? (
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
                  <TableHead className="w-[77px] text-center text-[#1e2324] font-text-small">
                    <span className="text-primary-600 font-medium text-center">
                      #
                    </span>
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
                {filteredProducts.map((product: Product, index: number) => (
                  <TableRow
                    key={product.id}
                    className="border-b border-primary-neutal-300 py-[var(--2-tokens-screen-modes-common-spacing-XS)]"
                  >
                    <TableCell className="w-[77px] text-center font-text-smaller text-coolgray-100 align-middle">
                      <span className="text-primary-600 font-medium text-center">
                        {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                      </span>
                    </TableCell>
                    <TableCell className="w-[77px] text-left font-text-smaller text-coolgray-100 align-middle">
                      <span
                        className="text-primary-600 font-semibold text-center cursor-pointer hover:underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(product.id);
                        }}
                      >
                        {product.id ?? "Not available"}
                      </span>
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
                                    handleToggleActiveClick(product);
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
                                <button
                                  className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 group"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteClick(product);
                                  }}
                                  role="menuitem"
                                >
                                  <Trash2 className="mr-3 h-4 w-4 text-red-400 group-hover:text-red-600" />
                                  <span className="font-medium">
                                    {t("productList.table.actions.delete")}
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

      {filteredProducts.length > 0 && (
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("productList.dialogs.delete.title")}</DialogTitle>
            <DialogDescription>
              {t("productList.dialogs.delete.description")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setProductToDelete(null);
              }}
            >
              {t("common.cancel")}
            </Button>
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting
                ? t("common.deleting")
                : t("productList.table.actions.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toggle Active Confirmation Dialog */}
      <Dialog open={showToggleDialog} onOpenChange={setShowToggleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t(
                `productList.dialogs.${
                  productToToggle?.is_active ? "deactivate" : "activate"
                }.title`
              )}
            </DialogTitle>
            <DialogDescription>
              {t(
                `productList.dialogs.${
                  productToToggle?.is_active ? "deactivate" : "activate"
                }.description`
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowToggleDialog(false);
                setProductToToggle(null);
              }}
            >
              {t("common.cancel")}
            </Button>
            <Button
              variant={productToToggle?.is_active ? "destructive" : "default"}
              className={
                productToToggle?.is_active
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }
              onClick={handleToggleActive}
              disabled={isTogglingActive}
            >
              {isTogglingActive
                ? t("common.loading")
                : t(
                    `productList.table.actions.${
                      productToToggle?.is_active ? "deactivate" : "activate"
                    }`
                  )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};
