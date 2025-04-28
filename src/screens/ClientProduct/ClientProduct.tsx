import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../../components/ui/breadcrumb";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Separator } from "../../components/ui/separator";
import {
  ChevronRight,
  Minus,
  Plus,
  ShoppingCart,
  ZoomIn,
  PackageX,
} from "lucide-react";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { getProductById } from "../../store/features/productSlice";
import { getHost } from "../../utils/hostUtils";
import { Skeleton } from "../../components/Skeleton";
import EmptyState from "../../components/EmptyState";

const productData = {
  title: "Polo homme",
  category: "VÊTEMENTS DE TRAVAIL",
  price: "25,75€",
  pricePerUnit: "/5 pcs",
  priceTax: "5,15€",
  description: {
    color: "rouge pour homme",
    sizes: "S, M, L, XL et XXL",
    composition: "65% Polyester + 35% coton - Polo piqué 220 g/m2",
    features:
      "Avec encolure à boutons, broderie logo Chronodrive et anneau porte badge sur le devant. Et flocage logo Chronodrive sur l'arrière",
    packaging: "Carton de 5 pièces",
  },
};

const relatedProducts = [
  {
    id: 1,
    name: "Magnet + stylo",
    price: "64,00€",
    pricePerUnit: "/200pcs",
    status: "En stock",
    statusColor: "text-1-tokens-color-modes-common-success-hight",
  },
  {
    id: 2,
    name: "Ballon de plage",
    price: "64,00€",
    pricePerUnit: "/200pcs",
    status: "Épuisé",
    statusColor: "text-defaultalert",
  },
  {
    id: 3,
    name: "Polo homme",
    price: "64,00€",
    pricePerUnit: "/200pcs",
    status: "En stock",
    statusColor: "text-1-tokens-color-modes-common-success-hight",
  },
  {
    id: 4,
    name: "Polo femme",
    price: "64,00€",
    pricePerUnit: "/200pcs",
    status: "En stock",
    statusColor: "text-1-tokens-color-modes-common-success-hight",
  },
  {
    id: 5,
    name: "Veste bodywarmer",
    price: "64,00€",
    pricePerUnit: "/200pcs",
    status: "Épuisé",
    statusColor: "text-defaultalert",
  },
];

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
  const [quantity, setQuantity] = React.useState(1);
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentProduct, loading, error } = useAppSelector(
    (state) => state.product
  );
  const dnsPrefix = getHost();

  useEffect(() => {
    if (id && dnsPrefix) {
      dispatch(getProductById({ dnsPrefix, productId: id }));
    }
  }, [dispatch, id, dnsPrefix]);

  const changeQuantity = (amount: number) => {
    setQuantity((prev) => Math.max(1, prev + amount));
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

  if (!currentProduct) {
    return <ProductNotFound />;
  }

  return (
    <div className="flex flex-col items-start gap-8 p-8 bg-white rounded-lg">
      <Breadcrumb className="flex items-center gap-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink className="font-normal text-gray-700 text-lg">
              {t("clientProduct.breadcrumb.catalog")}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="w-6 h-6" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink className="font-normal text-gray-700 text-lg">
              {t("clientProduct.breadcrumb.workwear")}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="w-6 h-6" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink className="font-normal text-gray-700 text-lg">
              {currentProduct.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col items-start gap-8 w-full">
        <div className="flex items-start gap-8 w-full">
          <ProductImages
            images={
              currentProduct.product_image ? [currentProduct.product_image] : []
            }
          />
          <ProductInfo
            product={currentProduct}
            quantity={quantity}
            changeQuantity={changeQuantity}
          />
        </div>
        <RelatedProducts />
      </div>
    </div>
  );
};

const ProductImages = ({ images }: { images: string[] }) => (
  <div className="flex flex-col items-start gap-2">
    <div className="relative">
      <div className="w-[456px] h-[456px] rounded-lg bg-gray-200">
        {images[0] && (
          <img
            src={images[0]}
            alt="Product"
            className="w-full h-full object-cover rounded-lg"
          />
        )}
      </div>
      <ZoomIn className="absolute w-6 h-6 top-3.5 right-3.5" />
    </div>
    <div className="flex items-center gap-4">
      {images.map((image, index) => (
        <div key={index} className="w-24 h-24 rounded-lg bg-gray-200">
          <img
            src={image}
            alt={`Product thumbnail ${index + 1}`}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      ))}
    </div>
  </div>
);

const ProductInfo = ({
  product,
  quantity,
  changeQuantity,
}: {
  product: any;
  quantity: number;
  changeQuantity: (amount: number) => void;
}) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-start justify-center gap-8 flex-1">
      <div className="font-medium text-gray-800">
        {t("clientProduct.category")}
      </div>
      <h1 className="font-bold text-2xl text-gray-900">{product.name}</h1>
      <ProductPrice price={product.price} />
      <ProductSelectors quantity={quantity} changeQuantity={changeQuantity} />
      <AddToCartButton />
      <ProductDescription description={product.description} />
    </div>
  );
};

const ProductPrice = ({ price }: { price: number }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-start gap-2">
      <div className="text-2xl text-gray-900">
        <span className="font-bold">{price}€</span>
      </div>
    </div>
  );
};

const ProductSelectors = ({
  quantity,
  changeQuantity,
}: {
  quantity: number;
  changeQuantity: (amount: number) => void;
}) => {
  const { t } = useTranslation();
  const [selectedSize, setSelectedSize] = React.useState<string>("M");

  return (
    <div className="flex items-start gap-8">
      <div className="flex flex-col items-center gap-2">
        <label className="font-medium text-black">
          {t("clientProduct.selectors.quantity")}
        </label>
        <div className="flex items-center justify-center gap-2 p-2 bg-gray-100 border border-gray-300 rounded-lg">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 p-0.5"
            onClick={() => changeQuantity(-1)}
          >
            <Minus className="w-4 h-4" />
          </Button>
          <span className="font-medium text-gray-700">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 p-0.5"
            onClick={() => changeQuantity(1)}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-start gap-2">
        <label className="font-medium text-black">
          {t("clientProduct.selectors.sizes")}
        </label>
        <Select value={selectedSize} onValueChange={setSelectedSize}>
          <SelectTrigger className="w-20">
            <SelectValue defaultValue={selectedSize} />
          </SelectTrigger>
          <SelectContent>
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <SelectItem key={size} value={size}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

const AddToCartButton = () => {
  const { t } = useTranslation();
  return (
    <Button className="w-88 gap-2 py-3 px-4 bg-green-600 border-green-700 text-white">
      <ShoppingCart className="w-4 h-4" />
      <span className="font-medium">
        {t("clientProduct.buttons.addToCart")}
      </span>
    </Button>
  );
};

const ProductDescription = ({ description }: { description: string }) => {
  const { t } = useTranslation();
  return (
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
          {description}
        </div>
      </div>
    </div>
  );
};

const RelatedProducts = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-start gap-8 w-full">
      <h2 className="font-bold text-black text-xl">
        {t("clientProduct.relatedProducts.title")}
      </h2>
      <div className="flex items-start gap-4 w-full">
        {relatedProducts.map((product) => (
          <Card key={product.id} className="flex-1 shadow-md">
            <CardContent className="p-0">
              <div className="flex flex-col items-start gap-4">
                <div className="w-full h-[134px] rounded-t-lg bg-gray-100" />
              </div>
              <div className="flex flex-col items-start gap-4 p-4">
                <div className="flex flex-col items-start gap-1">
                  <div className={`font-medium ${product.statusColor}`}>
                    {t(
                      `clientProduct.relatedProducts.status.${
                        product.status === "En stock" ? "inStock" : "outOfStock"
                      }`
                    )}
                  </div>
                  <div className="font-medium text-gray-900">
                    {product.name}
                  </div>
                </div>
                <div className="flex items-center justify-between w-full">
                  <div className="text-gray-700 text-lg">
                    <span className="font-medium">{product.price}</span>
                    <span className="font-medium">{product.pricePerUnit}</span>
                  </div>
                  <Button
                    size="icon"
                    className="inline-flex gap-2 p-2 bg-green-600 border-green-700"
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
