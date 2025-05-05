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

interface Product {
  id: number;
  product_id?: number;
  name: string;
  price: number;
  description: string;
  product_image: string | null;
  total_stock: number;
  available_stock: number;
  available_region: string;
  company_id: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
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
  stock: number | null | undefined
): { status: string; color: string } => {
  if (stock == null)
    return {
      status: "dashboard.status.unknown",
      color: "text-gray-500",
    };

  return stock > 0
    ? {
        status: "dashboard.status.inStock",
        color: "text-1-tokens-color-modes-common-success-hight",
      }
    : {
        status: "dashboard.status.outOfStock",
        color: "text-defaultalert",
      };
};

const ProductCard = ({ product }: { product: Product }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const stockStatus = getStockStatus(product.available_stock);
  const cart = useAppSelector((state) => state.cart);
  const items = cart?.items || [];

  const cartItem = items.find((item) => item.product_id === product.id);
  const quantity = cartItem?.quantity || 0;
  const { selectedStore } = useAppSelector((state) => state.agency);
  const dnsPrefix = getHost();

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleQuantityChange = async (amount: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newQuantity = quantity + amount;

    if (amount > 0 && newQuantity <= (product.available_stock ?? 0)) {
      if (dnsPrefix && selectedStore) {
        try {
          // Optimistic update
          dispatch(addToCart({ product, quantity: 1 }));

          await dispatch(
            addToCartAsync({
              dns_prefix: dnsPrefix,
              store_id: selectedStore,
              product_id: product.id.toString(),
              quantity: 1,
            })
          ).unwrap();
        } catch (error) {
          // Revert optimistic update
          dispatch(addToCart({ product, quantity: -1 }));
          toast.error(t("cart.error.addFailed"));
        }
      }
    } else if (amount < 0 && newQuantity >= 0) {
      if (dnsPrefix && selectedStore) {
        try {
          // Optimistic update
          dispatch(addToCart({ product, quantity: -1 }));

          await dispatch(
            addToCartAsync({
              dns_prefix: dnsPrefix,
              store_id: selectedStore,
              product_id: product.id.toString(),
              quantity: -1,
            })
          ).unwrap();
        } catch (error) {
          // Revert optimistic update
          dispatch(addToCart({ product, quantity: 1 }));
          toast.error(t("cart.error.removeFailed"));
        }
      }
    } else if (newQuantity > (product.available_stock ?? 0)) {
      toast.error(t("cart.error.notEnoughStock"));
    }
  };

  const handleInitialAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleQuantityChange(1, e);
  };

  return (
    <Card
      className="w-full h-full shadow-shadow cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={handleClick}
    >
      <CardContent className="p-4 h-full">
        <div className="flex flex-col h-full">
          <div
            className="aspect-[4/3] w-full rounded-2xl bg-gray-100 bg-no-repeat bg-center flex items-center justify-center overflow-hidden"
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
          <div className="flex flex-col flex-grow gap-2 mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Badge
                  variant="outline"
                  className={`${stockStatus.color} whitespace-nowrap text-xs px-2 py-0.5`}
                >
                  {t(stockStatus.status)}
                </Badge>
                {!product.is_active && (
                  <Badge
                    variant="outline"
                    className="text-gray-500 whitespace-nowrap text-xs px-2 py-0.5"
                  >
                    {t("dashboard.status.inactive")}
                  </Badge>
                )}
              </div>
              {/* Cart interaction button */}
              {(product.available_stock ?? 0) > 0 && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center"
                  role="group"
                  aria-label={t("product.cartControls")}
                >
                  {quantity === 0 ? (
                    <Button
                      size="icon"
                      className="h-7 w-7 rounded-full bg-[#00b85b] hover:bg-[#00b85b]/90 text-white shadow-sm transition-all duration-200 hover:scale-105"
                      onClick={handleInitialAdd}
                      aria-label={t("product.addToCart")}
                      title={t("product.addToCart")}
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                    </Button>
                  ) : (
                    <div className="flex items-center bg-gray-50 rounded-md shadow-sm border border-gray-100 h-7">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-full hover:bg-gray-50 transition-colors duration-200"
                        onClick={(e) => handleQuantityChange(-1, e)}
                        disabled={quantity <= 0}
                        aria-label={t("product.decreaseQuantity")}
                        title={t("product.decreaseQuantity")}
                      >
                        <MinusIcon className="h-3 w-3" />
                      </Button>
                      <span
                        className="w-6 text-center text-sm font-medium"
                        role="status"
                        aria-label={t("product.quantityInCart", { quantity })}
                      >
                        {quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-full hover:bg-gray-50 transition-colors duration-200"
                        onClick={(e) => handleQuantityChange(1, e)}
                        disabled={quantity >= (product.available_stock ?? 0)}
                        aria-label={t("product.increaseQuantity")}
                        title={t("product.increaseQuantity")}
                      >
                        <PlusIcon className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="font-medium text-[color:var(--1-tokens-color-modes-input-primary-default-text)] text-base tracking-[0] leading-[22.4px]">
              {product.name || "N/A"}
            </div>
          </div>
          <div className="mt-auto pt-4">
            <div className="font-normal text-coolgray-100 text-lg tracking-[0] leading-[25.2px]">
              <span className="font-[number:var(--body-l-font-weight)] font-body-l [font-style:var(--body-l-font-style)] tracking-[var(--body-l-letter-spacing)] leading-[var(--body-l-line-height)] text-[length:var(--body-l-font-size)]">
                {formatPrice(product.price)}
              </span>
              <span className="text-[length:var(--body-s-font-size)] leading-[var(--body-s-line-height)] font-body-s [font-style:var(--body-s-font-style)] font-[number:var(--body-s-font-weight)] tracking-[var(--body-s-letter-spacing)]">
                {formatStock(product.available_stock)}
              </span>
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
  const productList = products?.products || [];
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
    .sort((a, b) => (b.available_stock ?? 0) - (a.available_stock ?? 0))
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
