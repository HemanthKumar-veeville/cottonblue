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
  Package2,
  ArrowLeft,
  ChevronLeft,
  Info,
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
import { cn } from "../../lib/utils";

const ProductNotFound = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="p-8 bg-white rounded-lg min-h-[400px] flex items-center justify-center">
      <div className="text-center">
        <div className="mb-6">
          <Package2 className="w-16 h-16 mx-auto text-gray-400" />
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
          <Package2 className="w-16 h-16 mx-auto text-red-400" />
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

// Move getStockStatus outside components
const getStockStatus = (product: Product) => {
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

const ProductPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentProduct, loading, error, products } = useAppSelector(
    (state) => state.product
  );
  const dnsPrefix = getHost();
  const { selectedStore } = useAppSelector((state) => state.agency);
  const product = currentProduct?.product || ({} as Product);
  const otherProducts = products?.products || [];
  const cart = useAppSelector((state) => state.cart);
  const items = cart?.items || [];

  // Get initial quantity from cart
  const cartItem = items.find((item) => item.product_id === product.id);
  const cartQuantity = cartItem?.quantity || 0;
  // Add local quantity state for pending changes
  const [localQuantity, setLocalQuantity] = useState(0);

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

  // Handle local quantity changes
  const handleQuantityChange = (amount: number) => {
    const newQuantity = localQuantity + amount;

    if (amount > 0 && newQuantity <= (product?.available_packs ?? 0)) {
      setLocalQuantity(newQuantity);
    } else if (amount < 0) {
      setLocalQuantity(newQuantity);
    } else if (newQuantity > (product?.available_packs ?? 0)) {
      toast.error(t("cart.error.notEnoughStock"));
    }
  };

  // New handler for adding to cart
  const handleAddToCart = async () => {
    if (localQuantity === 0) {
      return;
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
        await dispatch(
          addToCartAsync({
            dns_prefix: dnsPrefix,
            store_id: selectedStore,
            product_id: product.id.toString(),
            quantity: localQuantity,
          })
        ).unwrap();
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

        toast.error(t("cart.error.addFailed"));
      }
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
    <div className="min-h-screen bg-[#F8FAFC] mt-[-90px]">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 lg:p-12">
            <Breadcrumb className="flex items-center gap-2 w-full mb-8">
              <BreadcrumbList className="flex items-center gap-2">
                <BreadcrumbItem>
                  <BreadcrumbLink
                    onClick={() => navigate("/")}
                    className={cn(
                      "font-medium text-sm transition-all duration-200 cursor-pointer",
                      "flex items-center gap-1.5 group text-gray-600 hover:text-[#00b85b]",
                      "focus:outline-none focus:ring-2 focus:ring-[#00b85b]/20 focus:ring-offset-2 rounded-md"
                    )}
                  >
                    <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-0.5 transition-transform duration-200" />
                    {t("clientProduct.breadcrumb.catalog")}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <div className="text-gray-300">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    className={cn(
                      "font-semibold text-sm text-gray-800",
                      "focus:outline-none focus:ring-2 focus:ring-[#00b85b]/20 focus:ring-offset-2 rounded-md"
                    )}
                  >
                    {product?.name ?? t("clientProduct.notAvailable")}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 min-h-[600px]">
              <ProductImages
                images={product?.product_image ? [product.product_image] : []}
              />
              <ProductInfo
                product={product}
                quantity={cartQuantity}
                localQuantity={localQuantity}
                onQuantityChange={handleQuantityChange}
                onAddToCart={handleAddToCart}
              />
            </div>

            {/* Description Section - Now Full Width */}
            <div className="mt-12 border-t border-gray-100 pt-12">
              <div className="flex flex-col items-start gap-6 w-full">
                <div className="flex flex-col w-full items-start gap-4">
                  <h2 className="font-bold text-2xl text-gray-900 font-heading-h2">
                    {t("clientProduct.description.title")}
                  </h2>
                </div>
                <div className="w-full">
                  <div className="prose prose-gray max-w-none">
                    <p className="text-base leading-7 text-gray-700 whitespace-pre-wrap font-text-medium">
                      {product?.description ?? t("clientProduct.notAvailable")}
                    </p>
                  </div>
                </div>
              </div>
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

const ProductImages = ({ images }: { images: string[] }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="flex flex-col items-start gap-6 w-full h-full">
      <div
        className={cn(
          "w-full h-full aspect-square overflow-hidden",
          "relative bg-gray-50"
        )}
      >
        {images[selectedImage] ? (
          <div
            className={cn(
              "w-full h-full flex items-center justify-center p-6",
              "relative"
            )}
          >
            <img
              src={images[selectedImage]}
              alt={`Product view ${selectedImage + 1}`}
              className={cn(
                "max-w-full max-h-full w-auto h-auto object-contain",
                "transition-all duration-300 ease-in-out"
              )}
              style={{ objectFit: "contain" }}
            />
            {/* Image Navigation Dots */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1.5">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-200",
                      selectedImage === index
                        ? "bg-white"
                        : "bg-white/50 hover:bg-white/75"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(index);
                    }}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package2 className="w-20 h-20 text-gray-300" />
          </div>
        )}
        {/* Image Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              className={cn(
                "absolute left-4 top-1/2 -translate-y-1/2",
                "p-2 rounded-full",
                "bg-white/90 backdrop-blur-sm shadow-sm",
                "hover:bg-[#00b85b] hover:text-white",
                "transition-all duration-200",
                "text-gray-700",
                "border border-gray-200",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage((prev) => (prev > 0 ? prev - 1 : prev));
              }}
              disabled={selectedImage === 0}
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              className={cn(
                "absolute right-4 top-1/2 -translate-y-1/2",
                "p-2 rounded-full",
                "bg-white/90 backdrop-blur-sm shadow-sm",
                "hover:bg-[#00b85b] hover:text-white",
                "transition-all duration-200",
                "text-gray-700",
                "border border-gray-200",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage((prev) =>
                  prev < images.length - 1 ? prev + 1 : prev
                );
              }}
              disabled={selectedImage === images.length - 1}
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>
      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="flex items-center gap-4 overflow-x-auto pb-2 w-full scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          {images.map((image, index) => (
            <button
              key={index}
              className={cn(
                "min-w-[5rem] w-20 h-20 transition-all duration-200",
                "hover:opacity-100 focus:outline-none",
                selectedImage === index
                  ? "opacity-100 ring-2 ring-[#00b85b]"
                  : "opacity-70 hover:opacity-90"
              )}
              onClick={() => setSelectedImage(index)}
              aria-label={`Select image ${index + 1}`}
              aria-current={selectedImage === index}
            >
              <img
                src={image}
                alt={`Product thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ProductInfo = ({
  product,
  quantity: cartQuantity,
  localQuantity,
  onQuantityChange,
  onAddToCart,
}: {
  product: Product;
  quantity: number;
  localQuantity: number;
  onQuantityChange: (amount: number) => void;
  onAddToCart: () => void;
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const dnsPrefix = getHost();
  const stockStatus = product?.available_packs > 0 ? "inStock" : "outOfStock";
  const stockStatusColor =
    stockStatus === "inStock"
      ? "bg-white text-[#00b85b] border-[#00b85b]"
      : "bg-white text-red-600 border-red-300";

  const productDetails = [
    {
      label: t("clientProduct.suitableFor"),
      value: product?.suitable_for ?? t("clientProduct.notAvailable"),
      icon: Info,
    },
    {
      label: t("clientProduct.size"),
      value: product?.linked_products ?? t("clientProduct.notAvailable"),
      isSize: true,
      icon: Package2,
    },
    {
      label: t("clientProduct.availablePacks"),
      value: product?.available_packs?.toString() ?? "0",
      icon: ShoppingCart,
    },
    {
      label: t("clientProduct.totalPacks"),
      value: product?.total_packs?.toString() ?? "0",
      icon: Package2,
    },
    {
      label: t("clientProduct.packQuantity"),
      value: product?.pack_quantity?.toString() ?? "0",
      icon: Package2,
    },
  ];

  return (
    <div className="flex flex-col items-start justify-start gap-8 flex-1 h-full">
      <div className="w-full">
        <div className="flex items-center gap-3 mb-6">
          <Badge
            variant="active"
            className={`${stockStatusColor} border px-3 py-1.5 font-medium`}
          >
            {t(`clientProduct.status.${stockStatus}`)}
          </Badge>
          {!product.is_active && (
            <Badge
              variant="inactive"
              className="bg-white text-gray-600 border border-gray-300 px-3 py-1.5 font-medium"
            >
              {t("dashboard.status.inactive")}
            </Badge>
          )}
        </div>
        <h1 className="font-bold text-3xl text-gray-900 mb-2 tracking-tight font-heading-h1">
          {product?.name ?? t("clientProduct.notAvailable")}
        </h1>
        <p className="font-medium text-gray-500 text-sm mb-6 font-text-medium">
          Ref.: {product?.id ?? t("clientProduct.notAvailable")}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-4 w-full bg-gray-50 p-6 rounded-xl">
        {productDetails.map((detail, index) => (
          <div key={index} className="flex items-center gap-3 py-2 group">
            <detail.icon className="w-5 h-5 text-gray-400 group-hover:text-[#00b85b] transition-colors duration-200" />
            <div>
              <span className="font-medium text-gray-700 text-sm block font-label-medium">
                {detail.label}
              </span>
              <div className="flex-1">
                {detail.isSize && Array.isArray(detail.value) ? (
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button
                      key={"main"}
                      variant="outline"
                      size="sm"
                      className="h-7 px-3 py-1 bg-[#00b85b] border border-[#00b85b] text-white hover:bg-[#00b85b]/90 hover:border-[#00b85b]/90 hover:text-white"
                    >
                      {product?.size || "-"}
                    </Button>
                    {detail.value.map((item, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        size="sm"
                        className="h-7 px-3 py-1 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-[#00b85b] hover:text-[#00b85b]"
                        onClick={() => {
                          dispatch(
                            getProductById({
                              dnsPrefix,
                              productId: item.linked_product_id,
                            })
                          );
                        }}
                      >
                        {item.size}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <span
                    className={`${
                      detail.isPrice
                        ? "text-[#07515f] font-semibold"
                        : "text-gray-700"
                    } font-label-small text-sm tracking-wide leading-5`}
                  >
                    {Array.isArray(detail.value)
                      ? detail.value.map((item) => item.size).join(", ")
                      : detail.value}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 w-full">
        <div className="flex items-center justify-between">
          <div className="text-4xl text-gray-900 font-heading-h1">
            <span className="font-bold">
              {product?.price_of_pack
                ? `${product.price_of_pack.toFixed(2)}€`
                : t("clientProduct.notAvailable")}
            </span>
            <span className="text-base text-gray-500 ml-2 font-text-medium">
              {product?.pack_quantity ? `/${product.pack_quantity}pcs` : ""}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <label className="sr-only font-label-medium">
              {t("clientProduct.selectors.quantity")}
            </label>
            <div className="flex items-stretch bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "w-10 h-10",
                  "hover:bg-gray-50 transition-all duration-200",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "text-[#00b85b] border-r border-gray-200",
                  "rounded-l-lg rounded-r-none"
                )}
                onClick={() => onQuantityChange(-1)}
                disabled={localQuantity + cartQuantity <= 0}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <div className="px-3 min-w-[3rem] flex items-center justify-center border-r border-gray-200">
                <span className="font-semibold text-gray-900 text-lg font-text-bold-large">
                  {localQuantity + cartQuantity}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "w-10 h-10",
                  "hover:bg-gray-50 transition-all duration-200",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "text-[#00b85b]",
                  "rounded-r-lg rounded-l-none"
                )}
                onClick={() => onQuantityChange(1)}
                disabled={localQuantity >= (product?.available_packs ?? 0)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-sm text-gray-500 font-text-medium">
              (
              {t("clientProduct.stockAvailable", {
                stock: product?.available_packs ?? 0,
              })}
              )
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <Button
          className={cn(
            "w-full py-6 px-6 bg-[#00b85b] text-white text-lg font-medium rounded-xl",
            "shadow-sm transition-all duration-200 hover:shadow-md",
            "hover:bg-[#00b85b]/90 transform hover:-translate-y-0.5",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "relative"
          )}
          disabled={
            !product?.available_packs ||
            product.available_packs <= 0 ||
            localQuantity === 0
          }
          onClick={onAddToCart}
        >
          <div className="flex items-center justify-center gap-3">
            <ShoppingCart className="w-6 h-6" />
            <span className="font-text-bold-large">
              {t("clientProduct.buttons.addToCart")}
            </span>
          </div>
          {localQuantity !== 0 && (
            <div
              className={cn(
                "absolute -top-3 -right-3",
                "flex items-center justify-center",
                "min-w-[24px] h-6 px-2",
                "bg-red-500 text-white",
                "text-sm font-bold rounded-full",
                "shadow-lg animate-in fade-in zoom-in",
                "duration-200"
              )}
            >
              {localQuantity}
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};

const RelatedProductCard = ({ product }: { product: Product }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);
  const items = cart?.items || [];
  const { selectedStore } = useAppSelector((state) => state.agency);
  const dnsPrefix = getHost();
  const navigate = useNavigate();
  const cartItem = items.find((item) => item.product_id === product.id);
  const cartQuantity = cartItem?.quantity || 0;
  const [localQuantity, setLocalQuantity] = useState(0);

  const handleQuantityChange = (amount: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newQuantity = localQuantity + amount;

    if (amount > 0 && newQuantity <= (product.available_packs ?? 0)) {
      setLocalQuantity(newQuantity);
    } else if (amount < 0 && newQuantity >= 0) {
      setLocalQuantity(newQuantity);
    } else if (newQuantity > (product.available_packs ?? 0)) {
      toast.error(t("cart.error.notEnoughStock"));
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (localQuantity === 0) {
      return;
    }

    if (dnsPrefix && selectedStore) {
      try {
        await dispatch(
          addToCartAsync({
            dns_prefix: dnsPrefix,
            store_id: selectedStore,
            product_id: product.id.toString(),
            quantity: localQuantity,
          })
        ).unwrap();

        await dispatch(
          fetchCart({ dns_prefix: dnsPrefix, store_id: selectedStore })
        );

        setLocalQuantity(0);
      } catch (error) {
        toast.error(t("cart.error.addFailed"));
      }
    }
  };

  const stockStatus = getStockStatus(product);

  return (
    <Card
      className="w-full h-full bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 rounded-xl overflow-hidden border border-gray-100 cursor-pointer"
      onClick={() => navigate(`/product/${product.id}`)}
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
                  variant="active"
                  className={`${stockStatus.color} whitespace-nowrap text-xs font-medium px-2.5 py-0.5 rounded-md border ${stockStatus.borderColor} bg-white`}
                >
                  {t(stockStatus.status)}
                </Badge>
                {!product.is_active && (
                  <Badge
                    variant="inactive"
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
                  <div className="flex items-stretch bg-white border border-gray-200 rounded-md shadow-sm h-7">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-7 w-7",
                        "hover:bg-gray-50 transition-colors duration-200",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        "text-[#00b85b] border-r border-gray-200",
                        "rounded-l-md rounded-r-none"
                      )}
                      onClick={(e) => handleQuantityChange(-1, e)}
                      disabled={localQuantity <= 0}
                      aria-label={t("product.decreaseQuantity")}
                      title={t("product.decreaseQuantity")}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <div className="px-2 min-w-[2rem] flex items-center justify-center border-r border-gray-200">
                      <span
                        className="text-center text-sm font-medium text-gray-700"
                        role="status"
                        aria-label={t("product.quantityInCart", {
                          quantity: localQuantity + cartQuantity,
                        })}
                      >
                        {localQuantity + cartQuantity}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-7 w-7",
                        "hover:bg-gray-50 transition-colors duration-200",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        "text-[#00b85b]",
                        "rounded-r-md rounded-l-none"
                      )}
                      onClick={(e) => handleQuantityChange(1, e)}
                      disabled={localQuantity >= (product.available_packs ?? 0)}
                      aria-label={t("product.increaseQuantity")}
                      title={t("product.increaseQuantity")}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
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
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  className={cn(
                    "h-9 w-9 rounded-xl",
                    "bg-[#00b85b] hover:bg-[#00b85b]/90 text-white",
                    "shadow-sm hover:shadow-md transition-all duration-200",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "relative"
                  )}
                  onClick={handleAddToCart}
                  disabled={localQuantity === 0}
                  aria-label={t("product.addToCart")}
                  title={t("product.addToCart")}
                >
                  <ShoppingCart className="h-4 w-4 text-white" />
                  {localQuantity > 0 && (
                    <div
                      className={cn(
                        "absolute -top-2 -right-2",
                        "flex items-center justify-center",
                        "min-w-[20px] h-5 px-1.5",
                        "bg-red-500 text-white",
                        "text-xs font-bold rounded-full",
                        "shadow-md animate-in fade-in zoom-in",
                        "duration-200",
                        "border-2 border-white"
                      )}
                    >
                      {localQuantity}
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const RelatedProducts = ({ otherProducts }: { otherProducts: Product[] }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const relatedProducts = otherProducts?.slice(0, 4);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Package2 className="w-5 h-5 text-[#00b85b]" />
          <h2 className="font-bold text-xl text-gray-900">
            {t("clientProduct.relatedProducts.title")}
          </h2>
        </div>
        <div
          onClick={() => navigate("/")}
          className="font-medium text-[#00b85b] hover:text-[#00b85b]/90 transition-all duration-200 cursor-pointer flex items-center gap-1 group"
        >
          {t("common.viewAll")}
          <ChevronRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform duration-200" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-[1200px] mx-auto">
        {relatedProducts?.map((product) => (
          <div key={product.id} className="w-full max-w-[320px] mx-auto">
            <RelatedProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPage;
