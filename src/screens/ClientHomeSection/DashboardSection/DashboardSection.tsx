import { BellIcon, SearchIcon, ShoppingCartIcon, UserIcon } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface Product {
  id: number;
  name: string;
  price: string;
  quantity: string;
  status: string;
  statusColor: string;
  image: string;
}

interface ProductSectionProps {
  title: string;
  products: Product[];
}

const productData = {
  mostOrdered: [
    {
      id: 1,
      name: "Magnet + stylo",
      price: "64,00€",
      quantity: "/200pcs",
      status: "dashboard.status.inStock",
      statusColor: "text-1-tokens-color-modes-common-success-hight",
      image: "/img/product-image.png",
    },
    {
      id: 2,
      name: "Ballon de plage",
      price: "64,00€",
      quantity: "/200pcs",
      status: "dashboard.status.outOfStock",
      statusColor: "text-defaultalert",
      image: "/img/product-image-1.svg",
    },
    {
      id: 3,
      name: "Polo homme",
      price: "64,00€",
      quantity: "/200pcs",
      status: "dashboard.status.inStock",
      statusColor: "text-1-tokens-color-modes-common-success-hight",
      image: "/img/product-image-2.png",
    },
    {
      id: 4,
      name: "Polo femme",
      price: "64,00€",
      quantity: "/200pcs",
      status: "dashboard.status.inStock",
      statusColor: "text-1-tokens-color-modes-common-success-hight",
      image: "/img/product-image-3.png",
    },
    {
      id: 5,
      name: "Veste bodywarmer",
      price: "64,00€",
      quantity: "/200pcs",
      status: "dashboard.status.outOfStock",
      statusColor: "text-defaultalert",
      image: "/img/product-image-4.png",
    },
  ],
  storeRange: [
    {
      id: 1,
      name: "Magnet + stylo",
      price: "64,00€",
      quantity: "/200pcs",
      status: "dashboard.status.inStock",
      statusColor: "text-1-tokens-color-modes-common-success-hight",
      image: "/img/product-image-5.svg",
    },
    {
      id: 2,
      name: "Polo homme",
      price: "64,00€",
      quantity: "/200pcs",
      status: "dashboard.status.inStock",
      statusColor: "text-1-tokens-color-modes-common-success-hight",
      image: "/img/product-image-6.png",
    },
    {
      id: 3,
      name: "Polo femme",
      price: "64,00€",
      quantity: "/200pcs",
      status: "dashboard.status.inStock",
      statusColor: "text-1-tokens-color-modes-common-success-hight",
      image: "/img/product-image-7.png",
    },
  ],
  workClothes: [
    {
      id: 1,
      name: "Polo homme",
      price: "25,75€",
      quantity: "/5pcs",
      status: "dashboard.status.inStock",
      statusColor: "text-1-tokens-color-modes-common-success-hight",
      image: "/img/product-image-8.png",
    },
    {
      id: 2,
      name: "Polo femme",
      price: "24,25€",
      quantity: "/5pcs",
      status: "dashboard.status.inStock",
      statusColor: "text-1-tokens-color-modes-common-success-hight",
      image: "/img/product-image-9.png",
    },
    {
      id: 3,
      name: "Veste bodywarmer",
      price: "61,00 €",
      quantity: "/5pcs",
      status: "dashboard.status.outOfStock",
      statusColor: "text-defaultalert",
      image: "/img/product-image-10.png",
    },
    {
      id: 4,
      name: "Tour de cou",
      price: "8,65€",
      quantity: "/5pcs",
      status: "dashboard.status.outOfStock",
      statusColor: "text-defaultalert",
      image: "/img/product-image-11.png",
    },
    {
      id: 5,
      name: "Bonnet",
      price: "64,00€",
      quantity: "/200pcs",
      status: "dashboard.status.outOfStock",
      statusColor: "text-defaultalert",
      image: "/img/product-image-12.png",
    },
  ],
};

const ProductCard = ({ product }: { product: Product }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <Card
      className="w-[235.2px] shadow-shadow cursor-pointer"
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex flex-col items-start gap-4 relative self-stretch w-full">
          <div
            className="h-[134px] relative self-stretch w-full rounded-2xl bg-cover bg-[50%_50%]"
            style={{ backgroundImage: `url(${product.image})` }}
          />
          <div className="inline-flex flex-col items-start gap-1 relative">
            <div
              className={`relative w-fit mt-[-1.00px] font-text-small font-[number:var(--text-small-font-weight)] ${product.statusColor} text-[length:var(--text-small-font-size)] tracking-[var(--text-small-letter-spacing)] leading-[var(--text-small-line-height)] whitespace-nowrap [font-style:var(--text-small-font-style)]`}
            >
              {t(product.status)}
            </div>
            <div className="relative w-fit font-normal text-[color:var(--1-tokens-color-modes-input-primary-default-text)] text-base tracking-[0] leading-[22.4px] whitespace-nowrap">
              {product.name}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-5 relative self-stretch w-full mt-4">
          <div className="relative w-fit mt-[-1.00px] font-normal text-coolgray-100 text-lg tracking-[0] leading-[25.2px] whitespace-nowrap">
            <span className="font-[number:var(--body-l-font-weight)] font-body-l [font-style:var(--body-l-font-style)] tracking-[var(--body-l-letter-spacing)] leading-[var(--body-l-line-height)] text-[length:var(--body-l-font-size)]">
              {product.price}
            </span>
            <span className="text-[length:var(--body-s-font-size)] leading-[var(--body-s-line-height)] font-body-s [font-style:var(--body-s-font-style)] font-[number:var(--body-s-font-weight)] tracking-[var(--body-s-letter-spacing)]">
              {product.quantity}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ProductSection = ({ title, products }: ProductSectionProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-start gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
      <div className="flex items-center gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
        <h3 className="relative w-fit mt-[-1.00px] font-heading-h3 font-[number:var(--heading-h3-font-weight)] text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] text-[length:var(--heading-h3-font-size)] tracking-[var(--heading-h3-letter-spacing)] leading-[var(--heading-h3-line-height)] whitespace-nowrap [font-style:var(--heading-h3-font-style)]">
          {t(title)}
        </h3>
      </div>
      <div className="flex items-start gap-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-gap)] relative self-stretch w-full flex-[0_0_auto]">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export const DashboardSection = (): JSX.Element => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselImages = [
    "/img/image-1.png",
    "/img/image-1.png",
    "/img/image-1.png",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
        <div className="flex flex-col w-full items-start gap-8 p-[var(--2-tokens-screen-modes-common-spacing-l)]">
          <div className="flex flex-col items-center justify-center gap-2.5 relative self-stretch w-full">
            <div className="flex h-64 items-center justify-center gap-2.5 relative self-stretch w-full rounded-[var(--2-tokens-screen-modes-button-border-radius)] [background:linear-gradient(0deg,rgba(242,237,227,1)_0%,rgba(242,237,227,1)_100%)] overflow-hidden">
              {carouselImages.map((image, index) => (
                <img
                  key={index}
                  className={`absolute self-stretch w-[255px] object-cover transition-opacity duration-500 ${
                    currentSlide === index ? "opacity-100" : "opacity-0"
                  }`}
                  alt={`Banner image ${index + 1}`}
                  src={image}
                />
              ))}
            </div>
            <div className="inline-flex items-start gap-[var(--2-tokens-screen-modes-common-spacing-m)] relative flex-[0_0_auto]">
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`w-4 h-4 rounded-lg ${
                    currentSlide === index
                      ? "bg-[#00b85b]"
                      : "border border-solid border-[#00b85b]"
                  }`}
                />
              ))}
            </div>
          </div>
          <ProductSection
            title="dashboard.sections.mostOrdered"
            products={productData.mostOrdered}
          />
          <ProductSection
            title="dashboard.sections.storeRange"
            products={productData.storeRange}
          />
          <ProductSection
            title="dashboard.sections.workClothes"
            products={productData.workClothes}
          />
        </div>
      </div>
    </div>
  );
};
