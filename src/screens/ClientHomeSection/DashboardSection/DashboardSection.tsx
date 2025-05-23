import {
  BellIcon,
  MinusIcon,
  PlusIcon,
  SearchIcon,
  UserIcon,
  ShoppingCart,
} from "lucide-react";
import { FaCartPlus } from "react-icons/fa";
import { Badge } from "../../../components/ui/badge";
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import {
  fetchAllProducts,
  getProductsByStoreId,
} from "../../../store/features/productSlice";
import { getHost } from "../../../utils/hostUtils";
import { DashboardCarousel } from "../../../components/DashboardCarousel/DashboardCarousel";
import { Skeleton } from "../../../components/Skeleton";
import EmptyState from "../../../components/EmptyState";
import { Package2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  addToCart,
  fetchCart,
  addToCartAsync,
} from "../../../store/features/cartSlice";
import { toast } from "react-hot-toast";
import { cn } from "../../../lib/utils";

interface Product {
  id: number;
  name: string;
  suitable_for: string;
  size: string;
  price_of_pack: number;
  is_active: boolean;
  product_image: string | null;
  description: string;
  category: string | null;
  pack_quantity: number;
  total_packs: number;
  available_packs: number;
  created_at: string;
  updated_at: string;
  company_id: number;
}

interface ProductSectionProps {
  title: string;
  products: Product[];
}

// Utility functions for handling null values
const formatPrice = (price: number | null | undefined): string => {
  if (price == null) return "N/A";
  return `${price.toFixed(2)}€`;
};

const formatStock = (stock: number | null | undefined): string => {
  if (stock == null) return "N/A";
  return `/${stock}pcs`;
};

const getStockStatus = (
  product: Product
): { status: string; color: string; borderColor: string } => {
  if (product.available_packs == null) {
    return {
      status: "dashboard.status.unknown",
      color: "text-gray-600",
      borderColor: "border-gray-300",
    };
  }

  return product.available_packs > 0
    ? {
        status: "dashboard.status.inStock",
        color: "text-[#00b85b]",
        borderColor: "border-[#00b85b]",
      }
    : {
        status: "dashboard.status.outOfStock",
        color: "text-red-600",
        borderColor: "border-red-300",
      };
};

const ProductCard = ({ product }: { product: Product }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const cart = useAppSelector((state) => state.cart);
  const items = cart?.items || [];
  const { selectedStore } = useAppSelector((state) => state.agency);
  const dnsPrefix = getHost();
  const cartItem = items.find((item) => item.product_id === product.id);
  const quantity = cartItem?.quantity || 0;
  // Local state for quantity instead of reading from cart
  const [localQuantity, setLocalQuantity] = useState(0);

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  // Updated to handle negative quantities
  const handleQuantityChange = (amount: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newQuantity = localQuantity + amount;

    if (amount > 0 && newQuantity <= (product.available_packs ?? 0)) {
      setLocalQuantity(newQuantity);
    } else if (amount < 0) {
      // Allow negative quantities for cart removals
      setLocalQuantity(newQuantity);
    } else if (newQuantity > (product.available_packs ?? 0)) {
      toast.error(t("cart.error.notEnoughStock"));
    }
  };

  // New handler for cart icon click that handles both additions and removals
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (localQuantity === 0) {
      return; // Don't do anything if quantity is 0
    }

    if (dnsPrefix && selectedStore) {
      // Optimistic update - Update UI immediately
      dispatch(
        addToCart({
          product: product,
          quantity: localQuantity,
        })
      );

      // Store the quantity for potential rollback
      const quantityToAdd = localQuantity;

      // Reset local quantity immediately for better UX
      setLocalQuantity(0);

      try {
        // Make API call in the background
        await dispatch(
          addToCartAsync({
            dns_prefix: dnsPrefix,
            store_id: selectedStore,
            product_id: product.id.toString(),
            quantity: quantityToAdd,
          })
        ).unwrap();

        // No need to fetch cart again as we've already updated the UI optimistically
      } catch (error) {
        // Revert the optimistic update on failure
        dispatch(
          addToCart({
            product: product,
            quantity: -quantityToAdd, // Reverse the quantity change
          })
        );

        // Restore the local quantity
        setLocalQuantity(quantityToAdd);

        toast.error(t("cart.error.updateFailed"));
      }
    }
  };

  const stockStatus = getStockStatus(product);

  return (
    <Card
      className="w-full h-full bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 rounded-xl overflow-hidden border border-gray-100"
      onClick={handleClick}
    >
      <CardContent className="p-4 h-full">
        <div className="flex flex-col h-full">
          {/* Image Container with Hover Effect */}
          <div className="relative group">
            <div
              className="aspect-[4/3] w-full rounded-2xl bg-gray-100 bg-no-repeat bg-center flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]"
              style={{
                backgroundImage: product.product_image
                  ? `url(${product.product_image})`
                  : "none",
                backgroundSize: "contain",
              }}
            >
              {!product.product_image && (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Package2 size={48} />
                </div>
              )}
            </div>
            {/* Quick View Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                Click to view details
              </span>
            </div>
          </div>

          <div className="flex flex-col flex-grow gap-2 mt-4">
            {/* Status Badges */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={`${stockStatus.color} whitespace-nowrap text-xs font-medium px-2.5 py-0.5 rounded-md border ${stockStatus.borderColor} bg-white`}
                >
                  {t(stockStatus.status)}
                </Badge>
                {!product.is_active && (
                  <Badge
                    variant="outline"
                    className="text-gray-600 whitespace-nowrap text-xs font-medium px-2.5 py-0.5 rounded-md border border-gray-300 bg-white"
                  >
                    {t("dashboard.status.inactive")}
                  </Badge>
                )}
              </div>
              {/* Cart Controls */}
              {(product.available_packs ?? 0) > 0 && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center"
                  role="group"
                  aria-label={t("product.cartControls")}
                >
                  <div className="flex items-center bg-white rounded-md shadow-sm border border-gray-200">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "w-8 h-8",
                        "hover:bg-gray-50 transition-all duration-200",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        "text-[#00b85b] border-r border-gray-200",
                        "rounded-l-lg rounded-r-none",
                        "border-r-2 border-gray-200"
                      )}
                      onClick={(e) => handleQuantityChange(-1, e)}
                      disabled={localQuantity + quantity <= 0}
                      aria-label={t("product.decreaseQuantity")}
                      title={t("product.decreaseQuantity")}
                    >
                      <MinusIcon className="h-4 w-4 text-[#00b85b]" />
                    </Button>
                    <span
                      className="w-8 text-center text-sm font-medium text-gray-700 bg-white"
                      role="status"
                      aria-label={t("product.quantityInCart", {
                        quantity: localQuantity + quantity,
                      })}
                    >
                      {localQuantity + quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "w-8 h-8",
                        "hover:bg-gray-50 transition-all duration-200",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        "text-[#00b85b]",
                        "rounded-r-lg rounded-l-none",
                        "border-l-2 border-gray-200"
                      )}
                      onClick={(e) => handleQuantityChange(1, e)}
                      disabled={
                        localQuantity + quantity >=
                        (product.available_packs ?? 0)
                      }
                      aria-label={t("product.increaseQuantity")}
                      title={t("product.increaseQuantity")}
                    >
                      <PlusIcon className="h-4 w-4 text-[#00b85b]" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Product Name with Truncation */}
            <div className="font-medium text-[color:var(--1-tokens-color-modes-input-primary-default-text)] text-base tracking-[0] leading-[22.4px] line-clamp-2 min-h-[44px]">
              {product?.size?.toLowerCase() !== "free"
                ? `${product?.name} - ${product?.size}`
                : product?.name}
            </div>

            {/* Available Packs with Icon */}
            <div className="text-sm text-gray-500 flex items-center gap-1">
              <Package2 className="h-4 w-4" />
              <span>Available: {product.available_packs ?? 0} packs</span>
            </div>
          </div>

          {/* Price Section */}
          <div className="mt-auto pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="font-normal text-coolgray-100 text-lg tracking-[0] leading-[25.2px]">
                <span className="font-[number:var(--body-l-font-weight)] font-body-l [font-style:var(--body-l-font-style)] tracking-[var(--body-l-letter-spacing)] leading-[var(--body-l-line-height)] text-[length:var(--body-l-font-size)]">
                  {product.price_of_pack
                    ? `${product.price_of_pack.toFixed(2)}€`
                    : "N/A"}
                </span>
                <span className="text-[length:var(--body-s-font-size)] leading-[var(--body-s-line-height)] font-body-s [font-style:var(--body-s-font-style)] font-[number:var(--body-s-font-weight)] tracking-[var(--body-s-letter-spacing)] ml-1">
                  {product.pack_quantity ? `/${product.pack_quantity}pcs` : ""}
                </span>
              </div>
              <Button
                size="icon"
                className="h-8 w-8 rounded-r-md bg-[#00b85b] hover:bg-[#00b85b]/90 text-white transition-all duration-200 relative"
                onClick={handleAddToCart}
                aria-label={t("product.addToCart")}
                title={t("product.addToCart")}
                disabled={localQuantity === 0}
              >
                <ShoppingCart className="h-4 w-4 text-white" />
                {localQuantity !== 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-in fade-in duration-200">
                    {localQuantity}
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ProductSection = ({ title, products }: ProductSectionProps) => {
  const { t } = useTranslation();

  if (products.length === 0) {
    return (
      <EmptyState
        icon={Package2}
        title={t("productTable.noProducts")}
        description={t("productTable.emptyMessage")}
      />
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 gap-4 w-full max-w-[1200px] mx-auto">
        {products.map((product) => (
          <div key={product.id} className="w-full max-w-[320px] mx-auto">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

// Product skeleton loader component
const ProductSkeleton = () => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 gap-4 w-full max-w-[1200px] mx-auto">
        {[...Array(8)].map((_, index) => (
          <div className="w-full max-w-[320px] mx-auto" key={index}>
            <Card className="w-full h-full shadow-shadow">
              <CardContent className="p-4 h-full">
                <div className="flex flex-col h-full">
                  <div className="aspect-[4/3] w-full rounded-2xl bg-gray-200 animate-pulse"></div>
                  <div className="flex flex-col flex-grow gap-2 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="mt-auto pt-4">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-6 w-12 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export const DashboardSection = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState("mostOrdered");
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { products, loading } = useAppSelector((state) => state.product);
  const productList =
    products?.products?.filter((product) => !product.linked) || [];
  const cart = useAppSelector((state) => state.cart);
  const cartProducts = cart?.items || [];
  const dnsPrefix = getHost();
  const user = useAppSelector((state) => state.auth.user);
  const isStoreUser = user?.store_details?.length > 0;
  const { selectedStore } = useAppSelector((state) => state.agency);

  useEffect(() => {
    if (dnsPrefix && selectedStore && selectedStore !== "all") {
      // Fetch cart data when component mounts and when store changes
      dispatch(fetchCart({ dns_prefix: dnsPrefix, store_id: selectedStore }));
    }
  }, [dispatch, dnsPrefix, selectedStore]);

  useEffect(() => {
    if (dnsPrefix) {
      if (isStoreUser) {
        if (selectedStore) {
          dispatch(
            getProductsByStoreId({
              dnsPrefix,
              storeId: selectedStore,
            })
          );
        }
      } else {
        if (selectedStore && selectedStore !== "all") {
          dispatch(
            getProductsByStoreId({
              dnsPrefix,
              storeId: selectedStore,
            })
          );
        } else {
          dispatch(fetchAllProducts(dnsPrefix));
        }
      }
    }
  }, [dispatch, dnsPrefix, isStoreUser, selectedStore]);

  // Sort products by stock to get most ordered items
  const mostOrderedProducts = [...productList]
    .sort((a, b) => (b.available_packs ?? 0) - (a.available_packs ?? 0))
    .slice(0, 6);

  const tabs = [
    { id: "mostOrdered", title: "dashboard.sections.mostOrdered" },
    { id: "allProducts", title: "dashboard.sections.allProducts" },
  ];

  return (
    <div className="flex flex-col h-screen w-full">
      <div className="flex-1 overflow-y-auto w-full [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
        <div className="flex flex-col w-full items-start p-4 lg:p-5">
          <DashboardCarousel />

          {/* Tabs */}
          <div className="flex items-center gap-6 border-b border-gray-200 w-full mb-5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-4 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "text-[#00b85b] border-b-2 border-[#00b85b]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {t(tab.title)}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="w-full">
            {loading ? (
              <ProductSkeleton />
            ) : (
              <>
                {activeTab === "mostOrdered" && (
                  <ProductSection
                    title="dashboard.sections.mostOrdered"
                    products={mostOrderedProducts}
                  />
                )}
                {activeTab === "allProducts" && (
                  <ProductSection
                    title="dashboard.sections.allProducts"
                    products={productList}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
