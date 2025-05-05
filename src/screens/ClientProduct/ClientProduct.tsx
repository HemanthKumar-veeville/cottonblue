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
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { getProductById, Product } from "../../store/features/productSlice";
import { addToCart, addToCartAsync } from "../../store/features/cartSlice";
import { getHost } from "../../utils/hostUtils";
import { Skeleton } from "../../components/Skeleton";
import { toast } from "sonner";

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
          onClick={() => navigate("/products")}
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
  const { currentProduct, loading, error } = useAppSelector(
    (state) => state.product
  );
  const { items } = useAppSelector((state) => state.cart);
  const dnsPrefix = getHost();
  const { selectedStore } = useAppSelector((state) => state.agency);
  const product = currentProduct?.product || ({} as Product);

  // Get initial quantity from cart
  const cartItem = items.find((item) => item.product_id === Number(id));
  const [quantity, setQuantity] = useState(cartItem?.quantity || 1);

  useEffect(() => {
    if (id && dnsPrefix) {
      dispatch(getProductById({ dnsPrefix, productId: id }));
    }
  }, [dispatch, id, dnsPrefix]);

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

    if (amount > 0 && newQuantity <= (product?.available_stock ?? 0)) {
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
    } else if (newQuantity > (product?.available_stock ?? 0)) {
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
    <div className="flex flex-col items-start gap-8 p-8 bg-white rounded-lg">
      <Breadcrumb className="flex items-center gap-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              onClick={() => navigate("/products")}
              className="font-normal text-gray-700 text-lg hover:text-primary cursor-pointer"
            >
              {t("clientProduct.breadcrumb.catalog")}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="w-6 h-6" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink className="font-normal text-gray-700 text-lg">
              {product?.name ?? t("clientProduct.notAvailable")}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col items-start gap-8 w-full">
        <div className="flex items-start gap-8 w-full">
          <ProductImages
            images={product?.product_image ? [product.product_image] : []}
          />
          <ProductInfo
            product={product}
            quantity={quantity}
            changeQuantity={handleQuantityChange}
          />
        </div>
        <RelatedProducts />
      </div>
    </div>
  );
};

const ProductImages = ({ images }: { images: string[] }) => (
  <div className="flex flex-col items-start gap-2">
    <div className="relative group">
      <div className="w-[456px] h-[456px] rounded-lg bg-gray-100 overflow-hidden">
        {images[0] ? (
          <img
            src={images[0]}
            alt="Product"
            className="w-full h-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package2 className="w-16 h-16 text-gray-400" />
          </div>
        )}
      </div>
      {images[0] && (
        <div className="absolute top-3.5 right-3.5 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <ZoomIn className="w-5 h-5 text-gray-700" />
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
  const stockStatus = product?.available_stock > 0 ? "inStock" : "outOfStock";
  const stockStatusColor =
    stockStatus === "inStock" ? "text-green-600" : "text-red-600";

  return (
    <div className="flex flex-col items-start justify-start gap-6 flex-1">
      <div className="w-full">
        <Badge variant="outline" className={`mb-4 ${stockStatusColor}`}>
          {t(`clientProduct.status.${stockStatus}`)}
        </Badge>
        <h1 className="font-bold text-2xl text-gray-900 mb-2">
          {product?.name}
        </h1>
        <p className="text-gray-600">{product?.available_region}</p>
      </div>

      <div className="text-2xl text-gray-900">
        <span className="font-bold">
          {product?.price
            ? `${product.price.toFixed(2)}€`
            : t("clientProduct.notAvailable")}
        </span>
      </div>
      <div className="text-gray-600">
        <span>
          {t("clientProduct.availableStock")}: {product?.available_stock}
        </span>
      </div>
      <div className="text-gray-600">
        <span>
          {t("clientProduct.totalStock")}: {product?.total_stock}
        </span>
      </div>

      <div className="flex items-start gap-8">
        <div className="flex flex-col items-center gap-2">
          <label className="font-medium text-gray-700">
            {t("clientProduct.selectors.quantity")}
          </label>
          <div className="flex items-center justify-center gap-2 p-2 bg-gray-50 border border-gray-200 rounded-lg">
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 p-0.5"
              onClick={() => changeQuantity(-1)}
              disabled={quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="font-medium text-gray-900 min-w-[2rem] text-center">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 p-0.5"
              onClick={() => changeQuantity(1)}
              disabled={quantity >= (product?.available_stock ?? 0)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {t("clientProduct.stockAvailable", {
              stock: product?.available_stock,
            })}
          </div>
        </div>
      </div>

      <Button
        className="w-88 gap-2 py-3 px-4 bg-primary hover:bg-primary/90 text-white"
        disabled={!product?.available_stock || product.available_stock <= 0}
        onClick={() => changeQuantity(1)}
      >
        <ShoppingCart className="w-4 h-4" />
        <span className="font-medium">
          {t("clientProduct.buttons.addToCart")}
        </span>
      </Button>

      <div className="flex flex-col items-start gap-4">
        <div className="flex flex-col w-[462px] items-start gap-3">
          <div className="flex items-start gap-4">
            <h2 className="font-bold text-base text-gray-900">
              {t("clientProduct.description.title")}
            </h2>
          </div>
          <hr className="w-full border-t border-gray-200" />
        </div>
        <div className="flex flex-col items-start gap-6">
          <div className="w-[462px] text-sm leading-6 text-gray-900">
            {product?.description || t("clientProduct.notAvailable")}
          </div>
        </div>
      </div>
    </div>
  );
};

const RelatedProducts = () => {
  const { t } = useTranslation();

  const relatedProducts = [
    {
      id: 1,
      name: "Magnet + stylo",
      price: "64,00€",
      pricePerUnit: "/200pcs",
      status: "inStock",
      statusColor: "text-green-600",
    },
    {
      id: 2,
      name: "Ballon de plage",
      price: "64,00€",
      pricePerUnit: "/200pcs",
      status: "outOfStock",
      statusColor: "text-red-600",
    },
    {
      id: 3,
      name: "Polo homme",
      price: "64,00€",
      pricePerUnit: "/200pcs",
      status: "inStock",
      statusColor: "text-green-600",
    },
    {
      id: 4,
      name: "Polo femme",
      price: "64,00€",
      pricePerUnit: "/200pcs",
      status: "inStock",
      statusColor: "text-green-600",
    },
    {
      id: 5,
      name: "Veste bodywarmer",
      price: "64,00€",
      pricePerUnit: "/200pcs",
      status: "outOfStock",
      statusColor: "text-red-600",
    },
  ];

  return (
    <div className="flex flex-col items-start gap-8 w-full">
      <h2 className="font-bold text-black text-xl">
        {t("clientProduct.relatedProducts.title")}
      </h2>
      <div className="grid grid-cols-5 gap-4 w-full">
        {relatedProducts.map((product) => (
          <Card
            key={product.id}
            className="flex-1 shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <CardContent className="p-0">
              <div className="flex flex-col items-start gap-4">
                <div className="w-full h-[134px] rounded-t-lg bg-gray-100" />
              </div>
              <div className="flex flex-col items-start gap-4 p-4">
                <div className="flex flex-col items-start gap-1">
                  <Badge variant="outline" className={product.statusColor}>
                    {t(`clientProduct.status.${product.status}`)}
                  </Badge>
                  <div className="font-medium text-gray-900">
                    {product.name}
                  </div>
                </div>
                <div className="flex items-center justify-between w-full">
                  <div className="text-gray-700 text-lg">
                    <span className="font-medium">{product.price}</span>
                    <span className="text-sm text-gray-500">
                      {product.pricePerUnit}
                    </span>
                  </div>
                  <Button
                    size="icon"
                    className="inline-flex gap-2 p-2 bg-primary hover:bg-primary/90 text-white"
                    disabled={product.status === "outOfStock"}
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductPage;
