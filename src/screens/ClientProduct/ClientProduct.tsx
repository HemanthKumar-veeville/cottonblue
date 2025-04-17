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
import { ChevronRight, Minus, Plus, ShoppingCart, ZoomIn } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

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

const ProductPage = () => {
  const [quantity, setQuantity] = React.useState(1);
  const { t } = useTranslation();

  const changeQuantity = (amount: number) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

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
              {productData.title}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col items-start gap-8 w-full">
        <div className="flex items-start gap-8 w-full">
          <ProductImages />
          <ProductInfo quantity={quantity} changeQuantity={changeQuantity} />
        </div>
        <RelatedProducts />
      </div>
    </div>
  );
};

const ProductImages = () => (
  <div className="flex flex-col items-start gap-2">
    <div className="relative">
      <div className="w-[456px] h-[456px] rounded-lg bg-gray-200" />
      <ZoomIn className="absolute w-6 h-6 top-3.5 right-3.5" />
    </div>
    <div className="flex items-center gap-4">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="w-24 h-24 rounded-lg bg-gray-200" />
      ))}
    </div>
  </div>
);

const ProductInfo = ({
  quantity,
  changeQuantity,
}: {
  quantity: number;
  changeQuantity: (amount: number) => void;
}) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-start justify-center gap-8 flex-1">
      <div className="font-medium text-gray-800">
        {t("clientProduct.category")}
      </div>
      <h1 className="font-bold text-2xl text-gray-900">{productData.title}</h1>
      <ProductPrice />
      <ProductSelectors quantity={quantity} changeQuantity={changeQuantity} />
      <AddToCartButton />
      <ProductDescription />
    </div>
  );
};

const ProductPrice = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-start gap-2">
      <div className="text-2xl text-gray-900">
        <span className="font-bold">{productData.price}</span>
        <span className="font-bold"> {t("clientProduct.price.perUnit")} </span>
        <span className="font-medium">
          {productData.pricePerUnit.substring(1)}
        </span>
      </div>
      <div className="font-medium text-gray-900">
        <span>
          {t("clientProduct.price.vatExcluded")}: {productData.priceTax}
        </span>
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
        <Select defaultValue="M">
          <SelectTrigger className="w-20 font-medium">
            <SelectValue placeholder={t("clientProduct.selectors.sizes")} />
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

const ProductDescription = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-start gap-4">
      <div className="flex flex-col w-[462px] items-start gap-3">
        <div className="flex items-start gap-4">
          <h2 className="font-bold text-base text-gray-900">
            {t("clientProduct.description.title")}
          </h2>
        </div>
        <Separator className="w-full" />
      </div>
      <div className="flex flex-col items-start gap-6">
        <div className="w-[462px] text-sm leading-6 text-gray-900">
          <span className="text-gray-800">
            {t("clientProduct.description.color")}:{" "}
            {productData.description.color}
            <br />
          </span>
          <span className="font-bold">
            {t("clientProduct.description.sizes")}
          </span>
          <span className="text-gray-800">
            : {productData.description.sizes}
            <br />
          </span>
          <span className="font-bold">
            {t("clientProduct.description.composition")}
          </span>
          <span className="text-gray-800">
            : {productData.description.composition}
            <br />
            {productData.description.features}
            <br />
            <br />
          </span>
          <span className="font-bold">{productData.description.packaging}</span>
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
