import { BellIcon, SearchIcon, ShoppingCartIcon, UserIcon } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { fetchAllProducts } from "../../../store/features/productSlice";
import { getHost } from "../../../utils/hostUtils";
import { DashboardCarousel } from "../../../components/DashboardCarousel/DashboardCarousel";
import { Skeleton } from "../../../components/Skeleton";
import EmptyState from "../../../components/EmptyState";
import { Package } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  product_image: string;
  stock: number;
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
  allProducts: [
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
  const { t } = useTranslation();
  const stockStatus = getStockStatus(product.stock);

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <Card
      className="w-full h-full shadow-shadow cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={handleClick}
    >
      <CardContent className="p-4 h-full">
        <div className="flex flex-col h-full">
          <div
            className="aspect-[4/3] w-full rounded-2xl bg-cover bg-center bg-gray-100"
            style={{
              backgroundImage: product.product_image
                ? `url(${product.product_image})`
                : "none",
            }}
          >
            {!product.product_image && (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <ShoppingCartIcon size={48} />
              </div>
            )}
          </div>
          <div className="flex flex-col flex-grow gap-2 mt-4">
            <div className={`flex items-center gap-2`}>
              <Badge variant="outline" className={`${stockStatus.color}`}>
                {t(stockStatus.status)}
              </Badge>
              {!product.is_active && (
                <Badge variant="outline" className="text-gray-500">
                  {t("dashboard.status.inactive")}
                </Badge>
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
                {formatStock(product.stock)}
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
        icon={Package}
        title={t("productTable.noProducts")}
        description={t("productTable.emptyMessage")}
      />
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-4 w-full">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

// Product skeleton loader component
const ProductSkeleton = () => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-4 w-full">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="w-full h-full shadow-shadow">
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
  const dnsPrefix = getHost();

  useEffect(() => {
    if (dnsPrefix) {
      dispatch(fetchAllProducts(dnsPrefix));
    }
  }, [dispatch, dnsPrefix]);

  // Sort products by stock to get most ordered items
  const mostOrderedProducts = [...productList]
    .sort((a, b) => (b.stock ?? 0) - (a.stock ?? 0))
    .slice(0, 6);

  const tabs = [
    { id: "mostOrdered", title: "dashboard.sections.mostOrdered" },
    { id: "allProducts", title: "dashboard.sections.allProducts" },
  ];

  return (
    <div className="flex flex-col h-screen w-full">
      <div className="flex-1 overflow-y-auto w-full [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
        <div className="flex flex-col w-full items-start p-[var(--2-tokens-screen-modes-common-spacing-l)]">
          <DashboardCarousel />

          {/* Tabs */}
          <div className="flex items-center gap-6 border-b border-gray-200 w-full mb-8">
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
