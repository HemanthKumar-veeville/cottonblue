import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../../components/ui/breadcrumb";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  ChevronRight,
  Minus,
  Plus,
  ShoppingCart,
  ZoomIn,
  PackageX,
  Package2,
  ArrowLeft,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { getProductById, Product } from "../../store/features/productSlice";
import {
  addToCart,
  addToCartAsync,
  fetchCart,
} from "../../store/features/cartSlice";
import { getHost } from "../../utils/hostUtils";
import { Skeleton } from "../../components/Skeleton";
import { toast } from "sonner";
import { getProductsByStoreId } from "../../store/features/productSlice";
const ProductNotFound = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="p-8 bg-white rounded-lg min-h-[400px] flex items-center justify-center">
      <div className="text-center">
        <div className="mb-6">
          <PackageX className="w-16 h-16 mx-auto text-gray-400" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          {t("clientProduct.notFound.title", "Product Not Found")}
        </h2>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          {t(
            "clientProduct.notFound.description",
            "The product you're looking for doesn't exist or has been removed."
          )}
        </p>
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2"
        >
          {t("clientProduct.notFound.action", "Back to Products")}
        </Button>
      </div>
    </div>
  );
};

const ProductError = ({ error }: { error: string }) => {
  const { t } = useTranslation();

  return (
    <div className="p-8 bg-white rounded-lg min-h-[400px] flex items-center justify-center">
      <div className="text-center">
        <div className="mb-6">
          <PackageX className="w-16 h-16 mx-auto text-red-400" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          {t("clientProduct.error.title", "Error Loading Product")}
        </h2>
        <p className="text-red-500 mb-6 max-w-md mx-auto">{error}</p>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2"
        >
          {t("common.retry", "Try Again")}
        </Button>
      </div>
    </div>
  );
};

const ProductPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentProduct, loading, error, products } = useAppSelector(
    (state) => state.product
  );
  console.log({ products });
  const dnsPrefix = getHost();
  const { selectedStore } = useAppSelector((state) => state.agency);
  const product = currentProduct?.product || ({} as Product);
  const otherProducts = products?.products || [];
  console.log({ otherProducts });
  const cart = useAppSelector((state) => state.cart);
  const items = cart?.items || [];

  // Get initial quantity from cart
  const cartItem = items.find((item) => item.product_id === product.id);
  const [quantity, setQuantity] = useState(cartItem?.quantity || 1);

  useEffect(() => {
    if (id && dnsPrefix && selectedStore) {
      dispatch(getProductById({ dnsPrefix, productId: id }));
      dispatch(getProductsByStoreId({ dnsPrefix, storeId: selectedStore }));
    }
  }, [dispatch, id, dnsPrefix, selectedStore]);

  useEffect(() => {
    if (dnsPrefix && selectedStore) {
      dispatch(fetchCart({ dns_prefix: dnsPrefix, store_id: selectedStore }));
    }
  }, [dispatch, dnsPrefix, selectedStore]);

  // Update local quantity when cart changes
  useEffect(() => {
    const updatedCartItem = items.find(
      (item) => item.product_id === Number(id)
    );
    if (updatedCartItem) {
      setQuantity(updatedCartItem.quantity);
    }
  }, [items, id]);

  const handleQuantityChange = async (amount: number) => {
    const newQuantity = quantity + amount;

    if (amount > 0 && newQuantity <= (product?.available_packs ?? 0)) {
      if (dnsPrefix && selectedStore) {
        try {
          // Optimistic update
          dispatch(addToCart({ product, quantity: 1 }));
          setQuantity(newQuantity);

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
          setQuantity(quantity);
          toast.error(t("cart.error.addFailed"));
        }
      }
    } else if (amount < 0 && newQuantity >= 0) {
      if (dnsPrefix && selectedStore) {
        try {
          // Optimistic update
          dispatch(addToCart({ product, quantity: -1 }));
          setQuantity(newQuantity);

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
          setQuantity(quantity);
          toast.error(t("cart.error.removeFailed"));
        }
      }
    } else if (newQuantity > (product?.available_packs ?? 0)) {
      toast.error(t("cart.error.notEnoughStock"));
    }
  };

  if (loading) {
    return (
      <div className="p-8 bg-white rounded-lg">
        <Skeleton variant="details" />
      </div>
    );
  }

  if (error) {
    return <ProductError error={error} />;
  }

  if (!product) {
    return <ProductNotFound />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 lg:p-12">
            <Breadcrumb className="flex items-center gap-2 w-full mb-8">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    onClick={() => navigate("/")}
                    className="font-medium text-[#07515f] text-base hover:text-[#064a56] transition-all duration-200 cursor-pointer flex items-center gap-1 group"
                  >
                    <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform duration-200" />
                    {t("clientProduct.breadcrumb.catalog")}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink className="font-medium text-gray-900 text-base">
                    {product?.name ?? t("clientProduct.notAvailable")}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <ProductImages
                images={product?.product_image ? [product.product_image] : []}
              />
              <ProductInfo
                product={product}
                quantity={quantity}
                changeQuantity={handleQuantityChange}
              />
            </div>
          </div>
        </div>

        <div className="mt-12">
          <RelatedProducts otherProducts={otherProducts} />
        </div>
      </div>
    </div>
  );
};

const ProductImages = ({ images }: { images: string[] }) => (
  <div className="flex flex-col items-start gap-4 w-full">
    <div className="relative group w-full">
      <div className="w-full aspect-square rounded-2xl bg-gray-50 overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
        {images[0] ? (
          <div className="w-full h-full flex items-center justify-center p-4">
            <img
              src={images[0]}
              alt="Product"
              className="max-w-full max-h-full w-auto h-auto object-contain rounded-xl transition-all duration-300 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package2 className="w-20 h-20 text-gray-300" />
          </div>
        )}
      </div>
      {images[0] && (
        <div className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md hover:bg-white cursor-pointer">
          <ZoomIn className="w-5 h-5 text-[#07515f]" />
        </div>
      )}
    </div>
  </div>
);

const ProductInfo = ({
  product,
  quantity,
  changeQuantity,
}: {
  product: Product;
  quantity: number;
  changeQuantity: (amount: number) => void;
}) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const stockStatus = product?.available_packs > 0 ? "inStock" : "outOfStock";
  const stockStatusColor =
    stockStatus === "inStock" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700";

  const productDetails = [
    {
      label: t("clientProduct.suitableFor"),
      value: product?.suitable_for ?? t("clientProduct.notAvailable"),
    },
    {
      label: t("clientProduct.size"),
      value: product?.size ?? t("clientProduct.notAvailable"),
    },
    {
      label: t("clientProduct.availablePacks"),
      value: product?.available_packs?.toString() ?? "0",
    },
    {
      label: t("clientProduct.totalPacks"),
      value: product?.total_packs?.toString() ?? "0",
    },
    {
      label: t("clientProduct.packQuantity"),
      value: product?.pack_quantity?.toString() ?? "0",
    },
  ];

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const text = product?.description ?? t("clientProduct.notAvailable");
  const maxLength = 300;
  const shouldTruncate = text.length > maxLength;

  return (
    <div className="flex flex-col items-start justify-start gap-8 flex-1">
      <div className="w-full">
        <div className="flex items-center gap-3 mb-6">
          <Badge variant="outline" className={`${stockStatusColor} border-0 px-3 py-1.5 font-medium`}>
            {t(`clientProduct.status.${stockStatus}`)}
          </Badge>
          {!product.is_active && (
            <Badge variant="outline" className="bg-gray-50 text-gray-600 border-0 px-3 py-1.5 font-medium">
              {t("dashboard.status.inactive")}
            </Badge>
          )}
        </div>
        <h1 className="font-bold text-3xl text-gray-900 mb-2 tracking-tight">
          {product?.name ?? t("clientProduct.notAvailable")}
        </h1>
        <p className="font-medium text-gray-500 text-sm mb-6">
          SKU: {product?.id ?? t("clientProduct.notAvailable")}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-4 w-full">
        {productDetails.map((detail, index) => (
          <div key={index} className="flex items-center py-2">
            <span className="font-medium text-gray-700 text-sm min-w-[120px]">
              {detail.label}
            </span>
            <span className="text-gray-600 text-sm">
              {detail.value}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 w-full">
        <div className="text-3xl text-[#07515f]">
          <span className="font-bold">
            {product?.price_of_pack
              ? `${product.price_of_pack.toFixed(2)}€`
              : t("clientProduct.notAvailable")}
          </span>
          <span className="text-base text-gray-500 ml-2">
            {product?.pack_quantity ? `/${product.pack_quantity}pcs` : ""}
          </span>
        </div>
      </div>

      <div className="flex items-start gap-8 w-full">
        <div className="flex flex-col items-center gap-3">
          <label className="font-medium text-gray-700 text-base">
            {t("clientProduct.selectors.quantity")}
          </label>
          <div className="flex items-center justify-center gap-3 p-2.5 bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
            <Button
              variant="ghost"
              size="icon"
              className="w-9 h-9 p-0.5 hover:bg-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => changeQuantity(-1)}
              disabled={quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="font-semibold text-gray-900 min-w-[2.5rem] text-center text-lg">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="w-9 h-9 p-0.5 hover:bg-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => changeQuantity(1)}
              disabled={quantity >= (product?.available_packs ?? 0)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {t("clientProduct.stockAvailable", {
              stock: product?.available_packs ?? 0,
            })}
          </div>
        </div>
      </div>

      <Button
        className="w-full gap-3 py-4 px-6 bg-[#07515f] hover:bg-[#064a56] text-white text-base font-medium rounded-lg shadow-sm transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
        disabled={!product?.available_packs || product.available_packs <= 0}
        onClick={() => changeQuantity(1)}
      >
        <ShoppingCart className="w-5 h-5" />
        <span>{t("clientProduct.buttons.addToCart")}</span>
      </Button>

      <div className="flex flex-col items-start gap-6 w-full">
        <div className="flex flex-col w-full items-start gap-4">
          <h2 className="font-bold text-xl text-gray-900">
            {t("clientProduct.description.title")}
          </h2>
          <hr className="w-full border-t border-gray-200" />
        </div>
        <div className="flex flex-col items-start gap-6">
          <div className="relative">
            <p className="w-full text-base leading-7 text-gray-700 whitespace-pre-wrap">
              {shouldTruncate && !isExpanded
                ? `${text.slice(0, maxLength)}... `
                : text}
              {shouldTruncate && !isExpanded && (
                <button
                  onClick={toggleExpand}
                  className="text-[#07515f] hover:text-[#064a56] font-medium text-sm inline-block focus:outline-none"
                >
                  Read More
                </button>
              )}
            </p>
            {shouldTruncate && isExpanded && (
              <button
                onClick={toggleExpand}
                className="text-[#07515f] hover:text-[#064a56] font-medium text-sm mt-1 focus:outline-none"
              >
                Show Less
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const RelatedProducts = ({ otherProducts }: { otherProducts: Product[] }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);
  const items = cart?.items || [];
  const { selectedStore } = useAppSelector((state) => state.agency);
  const dnsPrefix = getHost();
  const navigate = useNavigate();

  const relatedProducts = otherProducts?.slice(0, 4);

  const getStockStatus = (product: any) => {
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

  const handleQuantityChange = async (product: Product, amount: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const cartItem = items.find((item) => item.product_id === product.id);
    const quantity = cartItem?.quantity || 0;
    const newQuantity = quantity + amount;

    if (amount > 0 && newQuantity <= (product.available_packs ?? 0)) {
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
    } else if (newQuantity > (product.available_packs ?? 0)) {
      toast.error(t("cart.error.notEnoughStock"));
    }
  };

  const handleInitialAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    handleQuantityChange(product, 1, e);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Package2 className="w-5 h-5 text-[#07515f]" />
          <h2 className="font-bold text-xl text-gray-900">
            {t("clientProduct.relatedProducts.title")}
          </h2>
        </div>
        <div
          onClick={() => navigate("/")}
          className="font-medium text-[#07515f] text-base hover:text-[#064a56] transition-all duration-200 cursor-pointer flex items-center gap-1 group"
        >
          {t("common.viewAll")}
          <ChevronRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform duration-200" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-[1200px] mx-auto">
        {relatedProducts.map((product) => {
          const stockStatus = getStockStatus(product);
          const cartItem = items.find((item) => item.product_id === product.id);
          const quantity = cartItem?.quantity || 0;

          return (
            <Card
              key={product.id}
              className="w-full h-full bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 rounded-xl overflow-hidden border border-gray-100"
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
                          {quantity === 0 ? (
                            <Button
                              size="icon"
                              className="h-7 w-7 rounded-md bg-[#00b85b] hover:bg-[#00b85b]/90 text-white shadow-sm transition-all duration-200 hover:scale-105"
                              onClick={(e) => handleInitialAdd(product, e)}
                              aria-label={t("product.addToCart")}
                              title={t("product.addToCart")}
                            >
                              <ShoppingCart className="h-3.5 w-3.5 text-white" />
                            </Button>
                          ) : (
                            <div className="flex items-center bg-white rounded-md shadow-sm border border-gray-200 h-7 p-0.5">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 rounded-md hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={(e) => handleQuantityChange(product, -1, e)}
                                disabled={quantity <= 0}
                                aria-label={t("product.decreaseQuantity")}
                                title={t("product.decreaseQuantity")}
                              >
                                <Minus className="h-3 w-3 text-[#00b85b]" />
                              </Button>
                              <span
                                className="w-6 text-center text-sm font-medium text-gray-700"
                                role="status"
                                aria-label={t("product.quantityInCart", { quantity })}
                              >
                                {quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 rounded-md hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={(e) => handleQuantityChange(product, 1, e)}
                                disabled={quantity >= (product.available_packs ?? 0)}
                                aria-label={t("product.increaseQuantity")}
                                title={t("product.increaseQuantity")}
                              >
                                <Plus className="h-3 w-3 text-[#00b85b]" />
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Product Name with Truncation */}
                    <div className="font-medium text-[color:var(--1-tokens-color-modes-input-primary-default-text)] text-base tracking-[0] leading-[22.4px] line-clamp-2 min-h-[44px]">
                      {product.name || "N/A"}
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
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ProductPage;
