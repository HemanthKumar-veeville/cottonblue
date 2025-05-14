import React, { useState, useCallback, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import {
  ArrowLeft,
  Info,
  Search,
  Package2,
  Loader2,
  Check,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "../../lib/utils";
import { useNavigate, useParams } from "react-router-dom";
import {
  getProductById,
  Product,
  linkProducts,
  fetchAllProducts,
} from "../../store/features/productSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

// Types
interface ProductWithSelection extends Product {
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
}) => (
  <div className="w-3/4">
    <div className="flex gap-4">
      <div className="flex-1 relative">
        <FormField>
          <div className="relative">
            <Input
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 h-auto transition-all duration-200 focus:ring-2 focus:ring-[#07515f] focus:border-transparent"
              onChange={(e) => onSearch(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </FormField>
      </div>
    </div>
  </div>
);

// Product Selection Skeleton Component
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

const NoProductsAvailable = ({ searchQuery }: { searchQuery: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="flex flex-col items-center justify-start h-[340px] w-full"
  >
    <div className="flex flex-col items-center gap-4 max-w-md text-center">
      <div className="p-4 rounded-full bg-gray-50">
        <Package2 className="w-8 h-8 text-gray-400" />
      </div>
      <div className="space-y-2">
        <h3 className="font-heading-h4 text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] text-lg font-semibold">
          {searchQuery ? "No matching products found" : "No products available"}
        </h3>
        <p className="text-sm text-gray-500">
          {searchQuery
            ? `We couldn't find any products matching "${searchQuery}". Try adjusting your search terms.`
            : "There are currently no products available. Products will appear here once they are added to the system."}
        </p>
      </div>
    </div>
  </motion.div>
);

const ProductList = ({
  products,
  onToggleProduct,
  searchQuery,
}: {
  products: ProductWithSelection[];
  onToggleProduct: (productId: string) => void;
  searchQuery: string;
}) => {
  if (products.length === 0) {
    return <NoProductsAvailable searchQuery={searchQuery} />;
  }

  return (
    <div className="h-[340px] overflow-y-auto pr-4 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => onToggleProduct(product.id.toString())}
            className="flex items-start p-3 border rounded-md hover:bg-gray-50 transition-all duration-200 bg-white shadow-sm cursor-pointer group"
          >
            <div className="flex items-start gap-3 w-full">
              <Checkbox
                checked={product.isSelected}
                onCheckedChange={() => onToggleProduct(product.id.toString())}
                className="w-4 h-4 mt-1 border-gray-300 data-[state=checked]:bg-[#07515f] data-[state=checked]:border-[#07515f]"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              />
              <div className="w-16 h-16 flex-shrink-0 rounded-md border border-gray-100 overflow-hidden bg-white">
                {product.product_image ? (
                  <img
                    src={product.product_image}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50">
                    <Package2 className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-label-small font-bold text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] text-sm tracking-wide leading-5 truncate">
                  {product.name}
                </span>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                  <span className="truncate">{product.size || "No Size"}</span>
                  {product.pack_quantity && (
                    <>
                      <span>•</span>
                      <span className="truncate">
                        Pack of {product.pack_quantity}
                      </span>
                    </>
                  )}
                </div>
                {product.category && (
                  <span className="text-xs text-gray-400 mt-1 truncate">
                    {product.category}
                  </span>
                )}
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
  const {
    currentProduct,
    linkSuccess,
    products,
    loading: productsLoading,
  } = useAppSelector((state) => state.product);
  const product = currentProduct?.product as Product;
  const linkedProducts = product?.linked_products;
  const productsList = products?.products || [];
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productsWithSelection, setProductsWithSelection] = useState<
    ProductWithSelection[]
  >([]);
  console.log(linkedProducts);
  useEffect(() => {
    if (selectedCompany?.dns) {
      dispatch(fetchAllProducts(selectedCompany.dns));
    }
  }, [dispatch, selectedCompany?.dns]);

  useEffect(() => {
    if (id && selectedCompany?.dns) {
      dispatch(
        getProductById({ dnsPrefix: selectedCompany.dns, productId: id })
      );
    }
  }, [dispatch, id, selectedCompany?.dns]);

  useEffect(() => {
    if (productsList) {
      setProductsWithSelection(
        productsList.map((product: Product) => ({
          ...product,
          isSelected:
            linkedProducts?.some(
              (linkedProduct: any) =>
                linkedProduct.linked_product_id === product.id ||
                currentProduct?.product.id === product.id
            ) || false,
        }))
      );
    }
  }, [productsList, linkedProducts]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleToggleProduct = useCallback((productId: string) => {
    setProductsWithSelection((prev) =>
      prev.map((product) =>
        product.id.toString() === productId
          ? { ...product, isSelected: !product.isSelected }
          : product
      )
    );
  }, []);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleSelectAll = useCallback((checked: boolean) => {
    setProductsWithSelection((prev) =>
      prev.map((product) => ({
        ...product,
        isSelected: checked,
      }))
    );
  }, []);

  const allProductsSelected =
    productsWithSelection.length > 0 &&
    productsWithSelection.every((product) => product.isSelected);

  const filteredProducts = productsWithSelection.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.category &&
        product.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handlePublish = async () => {
    if (!id || !selectedCompany?.dns) {
      toast.error(t("addProduct.errors.missingInfo"));
      return;
    }

    const selectedProductIds = productsWithSelection
      .filter((product) => product.isSelected)
      .map((product) => product.id);

    if (selectedProductIds.length === 0) {
      toast.error(t("addProduct.errors.noProductsSelected"));
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(
        linkProducts({
          dnsPrefix: selectedCompany.dns,
          productIds: [...selectedProductIds, id].map((id) => parseInt(id)), // Convert all IDs to strings
        })
      ).unwrap();

      toast.success(t("addProduct.success.productsLinked"));
      // Navigate to the product details page
      navigate(`/products/${id}`);
    } catch (error) {
      toast.error(t("addProduct.errors.linkingFailed"));
      console.error("Failed to link products:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col w-full gap-8 pt-10"
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
            {product?.name}
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
            {product?.product_image ? (
              <div className="w-full h-full flex items-center justify-center p-4 relative">
                <img
                  src={product.product_image}
                  alt={product.name}
                  className="max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-200 group-hover:scale-105"
                />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package2 className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Column - Product Details and Product Selection */}
        <div className="lg:col-span-8 h-full">
          <div className="flex flex-col gap-8 h-full">
            {/* Product Selection */}
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
                      searchQuery={searchQuery}
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
                    Linking Products...
                  </span>
                </div>
              ) : (
                <span className="font-label-medium font-bold text-white text-sm tracking-wide leading-5 whitespace-nowrap">
                  {t("productDetails.actions.linkProducts")}
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
