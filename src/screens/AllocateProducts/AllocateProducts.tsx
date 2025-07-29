import React, { useState, useCallback, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import {
  ArrowLeft,
  Info,
  Search,
  Package,
  Loader2,
  Check,
  ImageOff,
  Plus,
  Warehouse,
  StoreIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "../../lib/utils";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  getProductById,
  allocateMultipleProductsToStores,
  getProductsByStoreId,
  fetchAllProducts,
  allocateProductsToStore,
} from "../../store/features/productSlice";
import { getStoreDetails } from "../../store/features/agencySlice";

import { useAppDispatch, useAppSelector } from "../../store/store";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

// Types
interface ProductWithSelection {
  id: string;
  name: string;
  product_image?: string;
  product_images?: string[]; // Add this to fix TypeScript error
  description?: string;
  price?: number;
  available_packs?: number;
  isSelected: boolean;
}

const FormField = ({
  label,
  children,
  className,
}: {
  label?: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("relative w-full", className)}>
    <div className="relative">
      {children}
      {label && (
        <span className="absolute -top-[10px] left-[10px] px-1 bg-white text-sm font-medium text-gray-600">
          {label}
        </span>
      )}
    </div>
  </div>
);

const ProductSelectionControls = ({
  onSearch,
  onSelectAll,
  allSelected,
}: {
  onSearch: (query: string) => void;
  onSelectAll: (checked: boolean) => void;
  allSelected: boolean;
}) => {
  const { t } = useTranslation();

  return (
    <div className="w-3/4">
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <FormField label={t("addProduct.step1.availableProducts")}>
            <div className="relative">
              <Input
                placeholder={t("addProduct.step1.searchProducts")}
                className="pl-10 pr-4 py-2 h-auto transition-all duration-200 focus:ring-2 focus:ring-[#07515f] focus:border-transparent"
                onChange={(e) => onSearch(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </FormField>
        </div>
        <div className="flex items-center gap-2 px-2">
          <Checkbox
            id="selectAll"
            className="w-4 h-4 border-gray-300 data-[state=checked]:bg-[#07515f] data-[state=checked]:border-[#07515f]"
            checked={allSelected}
            onCheckedChange={(checked: boolean) => onSelectAll(checked)}
          />
          <label
            htmlFor="selectAll"
            className="font-label-small font-bold text-gray-700 text-sm tracking-wide leading-5"
          >
            {t("addProduct.step1.selectAllProducts")}
          </label>
        </div>
      </div>
    </div>
  );
};

const ProductSelectionSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    {[...Array(6)].map((_, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: index * 0.05 }}
        className="flex items-center p-3 border rounded-md bg-white shadow-sm"
      >
        <div className="flex items-center gap-3 w-full">
          <div className="w-4 h-4 rounded bg-gray-200 animate-pulse" />
          <div className="flex flex-col min-w-0 flex-1 gap-2">
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
            <div className="flex items-center gap-1">
              <div className="h-3 w-1/4 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-2 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-1/4 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
          <div className="w-6 h-6 rounded bg-gray-200 animate-pulse" />
        </div>
      </motion.div>
    ))}
  </div>
);

const EmptyState = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleCreateProduct = () => {
    navigate("/products/add");
  };

  return (
    <div className="flex flex-col items-center justify-center h-[340px] w-full">
      <Package className="w-12 h-12 text-gray-300 mb-4" />
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        {t("addProduct.step1.noProductsAvailable")}
      </h3>
      <p className="text-sm text-gray-500 text-center max-w-md mb-6">
        {t("addProduct.step1.noProductsAvailableDescription")}
      </p>
      <Button
        onClick={handleCreateProduct}
        className="inline-flex items-center gap-2 bg-[#07515f] hover:bg-[#064a56] text-white transition-colors duration-200"
      >
        <Plus className="w-4 h-4" />
        <span className="font-label-medium font-bold text-sm tracking-wide leading-5">
          {t("addProduct.step1.createProduct")}
        </span>
      </Button>
    </div>
  );
};

const ProductList = ({
  products,
  onToggleProduct,
}: {
  products: ProductWithSelection[];
  onToggleProduct: (productId: string) => void;
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  console.log({ product: products[0] });
  const handleCreateProduct = () => {
    navigate("/products/add");
  };

  // If there are no products, show the empty state
  if (products.length === 0) {
    return <EmptyState />;
  }

  // Sort products to put selected ones at the top
  const sortedProducts = [...products].sort((a, b) => {
    if (a.isSelected === b.isSelected) return 0;
    return a.isSelected ? -1 : 1;
  });

  return (
    <div className="h-[340px] overflow-y-auto pr-4 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {sortedProducts.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "flex items-center p-3 border rounded-md transition-all duration-200 bg-white shadow-sm cursor-pointer",
              product.isSelected
                ? "border-[#07515f] bg-[#07515f]/5"
                : "hover:bg-gray-50"
            )}
          >
            <div
              className="flex items-center gap-3 w-full"
              onClick={() => onToggleProduct(product.id)}
            >
              <Checkbox
                checked={product.isSelected}
                onClick={(e: any) => {
                  e.stopPropagation();
                  onToggleProduct(product.id);
                }}
                className={cn(
                  "w-4 h-4 border-gray-300",
                  "data-[state=checked]:bg-[#07515f] data-[state=checked]:border-[#07515f]",
                  "transition-colors duration-200"
                )}
              />
              <div className="flex items-center gap-3 flex-1">
                <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                  {(product.product_images?.length ?? 0) > 0 ? (
                    <img
                      src={product.product_images?.[0] ?? product.product_image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="font-label-small font-bold text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] text-sm tracking-wide leading-5 truncate">
                    {product.name}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="truncate">
                      {product.available_packs} {t("common.packs")}
                    </span>
                    {product.price && (
                      <>
                        <span>•</span>
                        <span className="truncate">
                          {new Intl.NumberFormat("fr-FR", {
                            style: "currency",
                            currency: "EUR",
                          }).format(product.price)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleCreateProduct}
          className="flex items-center justify-center p-3 border-2 border-dashed border-gray-300 rounded-md hover:border-[#07515f] hover:bg-gray-50 transition-all duration-200 bg-white shadow-sm cursor-pointer group"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="p-2 rounded-full bg-gray-100 group-hover:bg-[#07515f]/10 transition-colors duration-200">
              <Plus className="w-5 h-5 text-gray-500 group-hover:text-[#07515f] transition-colors duration-200" />
            </div>
            <span className="font-label-medium font-bold text-gray-600 group-hover:text-[#07515f] text-sm tracking-wide leading-5">
              {t("addProduct.step1.createProduct")}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

function AllocateProducts() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedCompany } = useAppSelector((state) => state.client);
  const { id } = useParams<{ id: string }>();
  const { products, loading: productsLoading } = useAppSelector(
    (state) => state.product
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productsWithSelection, setProductsWithSelection] = useState<
    ProductWithSelection[]
  >([]);
  const [storeProducts, setStoreProducts] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [storeInfo, setStoreInfo] = useState<any>(null);

  useEffect(() => {
    if (selectedCompany?.dns && id) {
      // Fetch both store products and all products
      dispatch(
        getProductsByStoreId({ dnsPrefix: selectedCompany.dns, storeId: id })
      ).then((action: any) => {
        if (action.payload?.products) {
          setStoreProducts(action.payload.products);
        }
      });

      dispatch(
        getStoreDetails({ dnsPrefix: selectedCompany.dns, storeId: id })
      ).then((action: any) => {
        if (action.payload?.store) {
          console.log({ storeinfo: action.payload.store });
          setStoreInfo(action.payload.store);
        }
      });

      dispatch(
        fetchAllProducts({
          dnsPrefix: selectedCompany.dns,
          page: 1,
          limit: 1000,
        })
      ).then((action: any) => {
        if (action.payload?.products) {
          setAllProducts(action.payload.products.product_list);
        }
      });
    }
  }, [dispatch, selectedCompany?.dns, id]);

  useEffect(() => {
    console.log({ allProducts, storeProducts });
    if (allProducts.length > 0) {
      // Create products with selection state based on whether they exist in store products
      const productsWithSelectionState = allProducts.map((product: any) => ({
        ...product,
        isSelected: storeProducts.some(
          (storeProduct) => storeProduct.id === product.id
        ),
      }));
      setProductsWithSelection(productsWithSelectionState);
    }
  }, [allProducts, storeProducts]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleToggleProduct = useCallback((productId: string) => {
    console.log("Toggling product:", productId); // Add this for debugging
    console.log({ products: productsWithSelection[0] });
    setProductsWithSelection((prev) =>
      prev.map((product) =>
        product.id === productId
          ? { ...product, isSelected: !product.isSelected }
          : product
      )
    );
  }, []);

  const handleSelectAll = useCallback((checked: boolean) => {
    console.log("Select all:", checked); // Add this for debugging
    setProductsWithSelection((prev) =>
      prev.map((product) => ({
        ...product,
        isSelected: checked,
      }))
    );
  }, []);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const allProductsSelected =
    productsWithSelection.length > 0 &&
    productsWithSelection.every((product) => product.isSelected);

  const filteredProducts = productsWithSelection.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePublish = async () => {
    if (!id || !selectedCompany?.dns) {
      toast.error(t("addProduct.errors.missingInfo"));
      return;
    }

    const selectedProductIds = productsWithSelection
      .filter((product) => product.isSelected)
      .map((product) => product.id);

    setIsSubmitting(true);
    try {
      const response = await dispatch(
        allocateProductsToStore({
          dnsPrefix: selectedCompany.dns,
          storeId: id,
          productIds: selectedProductIds,
        })
      ).unwrap();

      if (response?.store_id) {
        navigate(`/customers/chronodrive/agencies/${response.store_id}`);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error("Failed to allocate products to store:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col w-full gap-8 mt-10"
    >
      <div className="flex items-center justify-between w-full">
        <div className="inline-flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="hover:bg-gray-100 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 text-[#07515f]" />
          </Button>
          <h1 className="font-heading-h3 text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] text-[length:var(--heading-h3-font-size)] tracking-[var(--heading-h3-letter-spacing)] leading-[var(--heading-h3-line-height)] font-[number:var(--heading-h3-font-weight)] [font-style:var(--heading-h3-font-style)]">
            {t("addProduct.step1.allocateProducts")}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[calc(100vh-300px)]">
        {/* Left Column - Store Image */}
        <div className="lg:col-span-4 h-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="sticky top-6 w-full aspect-square rounded-lg overflow-hidden border border-solid border-gray-200 bg-white flex items-center justify-center group hover:border-[#07515f] transition-all duration-200"
          >
            <div className="w-full h-full flex flex-col items-center justify-center">
              {storeInfo && (
                <div className="w-full px-6 space-y-3">
                  <div className="flex items-center justify-start gap-4">
                    <StoreIcon className="w-12 h-12 text-gray-300" />
                    <h3 className="text-lg font-semibold text-gray-800 text-left">
                      {storeInfo?.name}
                    </h3>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    {/* 
                      To align all colons vertically, 
                      use a fixed-width label container and place the colon in a separate span,
                      so all colons are in the same column, aligned with the widest label.
                    */}
                    <div className="flex">
                      <span className="font-medium min-w-[145px] text-left block">
                        {t("storeInfo.fields.city")}
                      </span>
                      <span className="inline-block w-2 text-right">:</span>
                      <span className="ml-2">{storeInfo?.city}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium min-w-[145px] text-left block">
                        {t("storeInfo.fields.postalCode")}
                      </span>
                      <span className="inline-block w-2 text-right">:</span>
                      <span className="ml-2">{storeInfo?.postal_code}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium min-w-[145px] text-left block">
                        {t("storeInfo.fields.phone")}
                      </span>
                      <span className="inline-block w-2 text-right">:</span>
                      <span className="ml-2">{storeInfo?.phone_number}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium min-w-[145px] text-left block">
                        {t("storeInfo.fields.budgetLimit")}
                      </span>
                      <span className="inline-block w-2 text-right">:</span>
                      <span className="ml-2">
                        {new Intl.NumberFormat("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        }).format(storeInfo?.budget_limit ?? 0)}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="font-medium min-w-[145px] text-left block">
                        {t("storeInfo.fields.orderLimit")}
                      </span>
                      <span className="inline-block w-2 text-right">:</span>
                      <span className="ml-2">
                        {storeInfo?.order_limit}{" "}
                        {t("storeInfo.fields.orderLimitSuffix")}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="font-medium min-w-[145px] text-left block">
                        {t("storeInfo.fields.status")}
                      </span>
                      <span className="inline-block w-2 text-right">:</span>
                      <span
                        className={cn(
                          "ml-2 font-medium",
                          storeInfo?.is_active
                            ? "text-green-600"
                            : "text-red-600"
                        )}
                      >
                        {storeInfo?.is_active
                          ? t("storeInfo.fields.active")
                          : t("storeInfo.fields.inactive")}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-medium min-w-[145px] text-left block">
                        {t("storeInfo.fields.address")}
                      </span>
                      <span className="inline-block w-2 text-right">:</span>
                      <span className="ml-2">{storeInfo?.address}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Column - Product Selection */}
        <div className="lg:col-span-8 h-full">
          <div className="flex flex-col gap-8 h-full">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-white rounded-lg h-full"
            >
              <div className="flex flex-col gap-6">
                <ProductSelectionControls
                  onSearch={handleSearch}
                  onSelectAll={handleSelectAll}
                  allSelected={allProductsSelected}
                />

                <div className="relative">
                  {productsLoading ? (
                    <ProductSelectionSkeleton />
                  ) : (
                    <ProductList
                      products={filteredProducts}
                      onToggleProduct={handleToggleProduct}
                    />
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-primary-neutal-300 py-4">
        <div className="px-6 max-w-[calc(100%-2rem)]">
          <div className="flex items-center justify-end w-full mx-auto">
            <Button
              onClick={handlePublish}
              disabled={isSubmitting}
              className={cn(
                "gap-4 py-4 px-4 self-stretch bg-[#07515f] border-gray-300",
                "hover:bg-[#064a56] transition-colors duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                isSubmitting && "animate-pulse"
              )}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="font-label-medium font-bold text-white text-sm tracking-wide leading-5 whitespace-nowrap">
                    {t("addProduct.step1.publishing")}
                  </span>
                </div>
              ) : (
                <span className="font-label-medium font-bold text-white text-sm tracking-wide leading-5 whitespace-nowrap">
                  {t("productDetails.actions.publish")}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </motion.main>
  );
}

export default AllocateProducts;
