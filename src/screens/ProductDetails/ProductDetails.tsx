import { Button } from "../../components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  getProductById,
  type Product,
  updateProduct,
} from "../../store/features/productSlice";
import { useTranslation } from "react-i18next";
import { Skeleton } from "../../components/Skeleton";
import { cn } from "../../lib/utils";
import { isWarehouseHostname } from "../../utils/hostUtils";
const ProductHeader = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between w-full">
      <div className="inline-flex items-center gap-2">
        <ArrowLeft
          onClick={() => navigate("/products")}
          className="w-5 h-5 text-[#07515f] cursor-pointer hover:text-[#064a56] transition-colors duration-200"
        />
        <h1 className="font-heading-h3 font-bold text-gray-700 text-lg tracking-wide leading-6">
          {t("productDetails.header")}
        </h1>
      </div>
    </div>
  );
};

const ProductImage = ({ imageUrl }: { imageUrl: string | null }) => {
  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border border-solid border-gray-300 bg-white flex items-center justify-center">
      {imageUrl ? (
        <div className="w-full h-full flex items-center justify-center p-4">
          <img
            src={imageUrl}
            alt="Product"
            className="max-w-full max-h-full w-auto h-auto object-contain"
          />
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <ArrowLeft className="w-12 h-12 text-gray-400" />
        </div>
      )}
    </div>
  );
};

const ProductInfo = ({ product }: { product: Product }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { selectedCompany } = useAppSelector((state) => state.client);
  const isWarehouse = isWarehouseHostname();
  const availableSizes = [
    ...product?.linked_products,
    { size: product?.size },
  ].sort((a, b) => a.size.localeCompare(b.size));

  const productDetails = [
    {
      label: t("productDetails.info.sizes"),
      value: availableSizes ?? "Not Available",
      isSize: true,
    },
    {
      label: t("productDetails.info.suitableFor"),
      value: product?.suitable_for ?? "Not Available",
    },
    ...(isWarehouse
      ? []
      : [
          {
            label: t("productDetails.info.price"),
            value: product?.price_of_pack
              ? `${product.price_of_pack}€`
              : "Not Available",
            isPrice: true,
          },
        ]),
    {
      label: t("productDetails.info.availableStock"),
      value: product?.available_packs?.toString() ?? "Not Available",
    },
    {
      label: t("productDetails.info.totalStock"),
      value: product?.total_packs?.toString() ?? "Not Available",
    },
    {
      label: t("productDetails.info.packQuantity"),
      value: product?.pack_quantity?.toString() ?? "Not Available",
    },
  ];

  return (
    <div className="flex flex-col w-full h-full">
      <div className="mb-4">
        <h2 className="font-heading-h3 font-bold text-gray-700 text-xl tracking-wide leading-6 mb-1">
          {product?.name ?? "Not Available"}
        </h2>
        <p className="font-label-small text-gray-500 text-xs tracking-wide leading-4">
          Ref.: {product?.id ?? "Not Available"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-2 flex-1">
        {productDetails.map((detail, index) => (
          <div key={index} className="flex items-center py-2">
            <div className="flex items-center gap-2 w-[180px]">
              <span className="font-label-small font-bold text-gray-700 text-sm tracking-wide leading-5 w-[160px]">
                {detail.label}
              </span>
              <span className="font-label-small font-bold text-gray-700 text-sm tracking-wide leading-5 w-[20px]">
                :
              </span>
            </div>
            <div className="flex-1 pl-4">
              {detail.isSize && Array.isArray(detail.value) ? (
                <div className="flex flex-wrap gap-2">
                  {detail.value.map((item, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      className={cn(
                        "h-7 px-3 py-1 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50",
                        item.size === product?.size &&
                          "bg-[#07515f] text-white hover:bg-[#07515f]/90 hover:border-[#07515f]/90 hover:text-white"
                      )}
                      onClick={() => {
                        dispatch(
                          getProductById({
                            dnsPrefix: selectedCompany.dns,
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
        ))}
      </div>
    </div>
  );
};

const ProductActions = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const { selectedCompany } = useAppSelector((state) => state.client);
  const { currentProduct } = useAppSelector((state) => state.product);
  const isActive = currentProduct?.product?.is_active;
  const isWarehouse = isWarehouseHostname();

  if (isWarehouse) {
    return null;
  }

  const handleEdit = () => {
    navigate(`/products/edit/${id}`);
  };

  const handleToggleActivation = async () => {
    if (id && selectedCompany?.dns) {
      const resultAction = await dispatch(
        updateProduct({
          dnsPrefix: selectedCompany.dns,
          productId: id,
          data: {
            is_active: !isActive,
          },
        })
      ).unwrap();

      if (resultAction?.product_id) {
        // Refresh the product details
        dispatch(
          getProductById({ dnsPrefix: selectedCompany.dns, productId: id })
        );
      }
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Button
        className="flex-1 bg-[#07515f] text-white hover:bg-[#064a56] h-9 text-sm border-gray-300"
        onClick={handleEdit}
      >
        <span className="font-label-medium font-bold text-white text-sm tracking-wide leading-5">
          {t("productDetails.actions.modify")}
        </span>
      </Button>
      <Button
        variant={isActive ? "destructive" : "default"}
        className={`flex-1 h-9 text-sm ${
          isActive
            ? "bg-red-600 hover:bg-red-700"
            : "bg-emerald-600 hover:bg-emerald-700 text-white"
        }`}
        onClick={handleToggleActivation}
      >
        <span className="font-label-medium font-bold text-white text-sm tracking-wide leading-5">
          {t(
            isActive
              ? "productDetails.actions.deactivate"
              : "productDetails.actions.activate"
          )}
        </span>
      </Button>
    </div>
  );
};

const ProductDescription = ({
  description,
}: {
  description: string | null;
}) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const text = description ?? "Not Available";
  const maxLength = 300;
  const shouldTruncate = text.length > maxLength;

  return (
    <div>
      <h3 className="font-heading-h3 font-bold text-gray-700 text-sm tracking-wide leading-5 mb-2">
        {t("productDetails.description.title")}
      </h3>
      <div className="relative">
        <p className="font-label-small text-gray-700 text-sm tracking-wide leading-5 whitespace-pre-wrap">
          {shouldTruncate && !isExpanded
            ? `${text.slice(0, maxLength)}... `
            : text}
          {shouldTruncate && !isExpanded && (
            <button
              onClick={toggleExpand}
              className="text-[#07515f] hover:text-[#064a56] font-medium text-sm inline-block focus:outline-none"
            >
              {t("productDetails.description.readMore")}
            </button>
          )}
        </p>
        {shouldTruncate && isExpanded && (
          <button
            onClick={toggleExpand}
            className="text-[#07515f] hover:text-[#064a56] font-medium text-sm mt-1 focus:outline-none"
          >
            {t("productDetails.description.showLess")}
          </button>
        )}
      </div>
    </div>
  );
};

export default function ProductDetails() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentProduct, loading, error } = useAppSelector(
    (state) => state.product
  );
  const product = currentProduct?.product ?? ({} as Product);

  const { selectedCompany } = useAppSelector((state) => state.client);

  useEffect(() => {
    if (id && selectedCompany?.dns) {
      dispatch(
        getProductById({ dnsPrefix: selectedCompany.dns, productId: id })
      );
    }
  }, [dispatch, id, selectedCompany?.dns]);

  if (loading) {
    return <Skeleton variant="details" />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-8 p-6">
        <div className="text-center py-4 text-red-600 font-label-small text-sm tracking-wide leading-5">
          {error}
        </div>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="flex flex-col items-center gap-8 p-6">
        <div className="text-center py-4 font-label-small text-sm tracking-wide leading-5">
          {t("productDetails.notFound")}
        </div>
      </div>
    );
  }

  return (
    <main className="flex flex-col w-full gap-8 p-6 bg-white rounded-lg">
      <ProductHeader />
      <div className="mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ProductImage imageUrl={product.product_image} />
          </div>
          <div className="lg:col-span-2">
            <div className="flex flex-col h-[400px]">
              <div className="flex-none">
                <ProductInfo product={product} />
              </div>
              <div className="flex-none mt-6">
                <ProductActions />
              </div>
              <div className="flex-none mt-6">
                <ProductDescription description={product.description} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
