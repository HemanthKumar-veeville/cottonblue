import React, { useState, useCallback, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import {
  ArrowLeft,
  Info,
  Search,
  Store,
  Loader2,
  Check,
  ImageOff,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "../../lib/utils";
import { useNavigate, useParams } from "react-router-dom";
import {
  getProductById,
  Product,
  allocateProductToStores,
  getAllocatedStores,
  allocateMultipleProductsToStores,
} from "../../store/features/productSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { fetchAllStores, Agency } from "../../store/features/agencySlice";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

// Types
interface StoreWithSelection extends Agency {
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

const ProgressIndicator = () => (
  <div className="flex items-center justify-center w-full mt-8">
    <div className="flex items-center justify-center gap-2">
      {[1, 2, 3].map((step, index) => (
        <React.Fragment key={step}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center"
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-200",
                step <= 3
                  ? "bg-[#07515f] text-white"
                  : "bg-gray-100 text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)]"
              )}
            >
              {step === 1 || step === 2 ? (
                <Check className="w-4 h-4 stroke-[2.5]" />
              ) : (
                <span className="font-label-medium">{step}</span>
              )}
            </div>
            {step < 3 && (
              <div
                className={cn(
                  "w-12 h-0.5 mx-2 transition-colors duration-200",
                  step === 1 ? "bg-[#07515f]" : "bg-gray-200"
                )}
              />
            )}
          </motion.div>
        </React.Fragment>
      ))}
    </div>
  </div>
);

const StoreSelectionControls = ({
  onSearch,
  onSelectAll,
  allSelected,
}: {
  onSearch: (query: string) => void;
  onSelectAll: (checked: boolean) => void;
  allSelected: boolean;
}) => (
  <div className="w-3/4">
    <div className="flex gap-4">
      <div className="flex-1 relative">
        <FormField label="Available stores">
          <div className="relative">
            <Input
              placeholder="Search stores..."
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
          Select All Stores
        </label>
      </div>
    </div>
  </div>
);

// Store Selection Skeleton Component
const StoreSelectionSkeleton = () => (
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

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-[340px] w-full">
    <Store className="w-12 h-12 text-gray-300 mb-4" />
    <h3 className="text-lg font-semibold text-gray-700 mb-2">
      No Stores Available
    </h3>
    <p className="text-sm text-gray-500 text-center max-w-md">
      There are no stores available at the moment. Please add stores to your
      account to continue.
    </p>
  </div>
);

const StoreList = ({
  stores,
  onToggleStore,
}: {
  stores: StoreWithSelection[];
  onToggleStore: (storeId: string) => void;
}) => {
  if (stores.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="h-[340px] overflow-y-auto pr-4 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {stores.map((store) => (
          <motion.div
            key={store.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => onToggleStore(store.id.toString())}
            className="flex items-center p-3 border rounded-md hover:bg-gray-50 transition-all duration-200 bg-white shadow-sm cursor-pointer"
          >
            <div className="flex items-center gap-3 w-full">
              <Checkbox
                checked={store.isSelected}
                onCheckedChange={() => onToggleStore(store.id.toString())}
                className="w-4 h-4 border-gray-300 data-[state=checked]:bg-[#07515f] data-[state=checked]:border-[#07515f]"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              />
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-label-small font-bold text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] text-sm tracking-wide leading-5 truncate">
                  {store.name}
                </span>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <span className="truncate">{store.city}</span>
                  {store.region && (
                    <>
                      <span>•</span>
                      <span className="truncate">{store.region}</span>
                    </>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="flex-shrink-0 ml-2 p-1 hover:bg-gray-100"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              >
                <Info className="w-4 h-4 text-gray-400" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const ProductDetails = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedCompany } = useAppSelector((state) => state.client);
  const { id } = useParams<{ id: string }>();
  const { currentProduct, allocationSuccess, allocatedStores } = useAppSelector(
    (state) => state.product
  );
  const { stores, loading: storesLoading } = useAppSelector(
    (state) => state.agency
  );
  const product = currentProduct?.product as Product;
  const allocatedStoresList = allocatedStores?.stores || [];
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productIds, setProductIds] = useState<string[]>([]);
  const [storesWithSelection, setStoresWithSelection] = useState<
    StoreWithSelection[]
  >([]);

  useEffect(() => {
    if (selectedCompany?.dns) {
      dispatch(fetchAllStores(selectedCompany.dns));
    }
  }, [dispatch, selectedCompany?.dns]);

  useEffect(() => {
    if (id && selectedCompany?.dns) {
      dispatch(
        getProductById({ dnsPrefix: selectedCompany.dns, productId: id })
      );
      dispatch(
        getAllocatedStores({ dnsPrefix: selectedCompany.dns, productId: id })
      );
    }
  }, [dispatch, id, selectedCompany?.dns]);

  useEffect(() => {
    if (stores?.stores) {
      setStoresWithSelection(
        stores.stores.map((store: Agency) => ({
          ...store,
          isSelected: allocatedStoresList
            ?.map((store) => store.store_id)
            ?.includes(store.id),
        }))
      );
    }
  }, [stores, allocatedStoresList]);

  useEffect(() => {
    if (currentProduct?.product) {
      const mainProductId = currentProduct?.product?.id;
      const variantProductIds = currentProduct?.product?.linked_products?.map(
        (variant: any) => variant.linked_product_id
      );
      setProductIds([mainProductId, ...variantProductIds]);
    }
  }, [currentProduct?.product]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleToggleStore = useCallback((storeId: string) => {
    setStoresWithSelection((prev) =>
      prev.map((store) =>
        store.id.toString() === storeId
          ? { ...store, isSelected: !store.isSelected }
          : store
      )
    );
  }, []);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleSelectAll = useCallback((checked: boolean) => {
    setStoresWithSelection((prev) =>
      prev.map((store) => ({
        ...store,
        isSelected: checked,
      }))
    );
  }, []);

  const allStoresSelected =
    storesWithSelection.length > 0 &&
    storesWithSelection.every((store) => store.isSelected);

  const filteredStores = storesWithSelection.filter(
    (store) =>
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePublish = async () => {
    if (!id || !selectedCompany?.dns) {
      toast.error(t("addProduct.errors.missingInfo"));
      return;
    }

    const selectedStoreIds = storesWithSelection
      .filter((store) => store.isSelected)
      .map((store) => store.id);

    if (selectedStoreIds.length === 0) {
      toast.error(t("addProduct.errors.noStoresSelected"));
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await dispatch(
        allocateMultipleProductsToStores({
          dnsPrefix: selectedCompany.dns,
          storeIds: selectedStoreIds,
          productIds,
        })
      ).unwrap();

      if (response?.product_id) {
        const productId = id;
        toast.success(t("addProduct.success.storesAllocated"));
        // Navigate to next step
        navigate(`/products/${productId}`);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      toast.error(t("addProduct.errors.allocationFailed"));
      console.error("Failed to allocate product to stores:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col w-full gap-8"
    >
      <ProgressIndicator />

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
            {t("addProduct.step1.title")}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[calc(100vh-300px)]">
        {/* Left Column - Product Image */}
        <div className="lg:col-span-4 h-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="sticky top-6 w-full aspect-square rounded-lg overflow-hidden border border-solid border-gray-200 bg-white flex items-center justify-center group hover:border-[#07515f] transition-all duration-200"
          >
            {product?.product_images &&
            product?.product_images.length > 0 &&
            product?.product_images[0] ? (
              <div className="w-full h-full flex items-center justify-center p-4 relative">
                <img
                  src={product?.product_images[0]}
                  alt={product?.name}
                  className="max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-200 group-hover:scale-105"
                  width={100}
                  height={100}
                />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageOff className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Column - Product Details and Store Selection */}
        <div className="lg:col-span-8 h-full">
          <div className="flex flex-col gap-8 h-full">
            {/* Store Selection */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-white rounded-lg h-full"
            >
              <div className="flex flex-col gap-6">
                <StoreSelectionControls
                  onSearch={handleSearch}
                  onSelectAll={handleSelectAll}
                  allSelected={allStoresSelected}
                />

                <div className="relative">
                  {storesLoading ? (
                    <StoreSelectionSkeleton />
                  ) : (
                    <StoreList
                      stores={filteredStores}
                      onToggleStore={handleToggleStore}
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
                    Publishing...
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
};

export default ProductDetails;
