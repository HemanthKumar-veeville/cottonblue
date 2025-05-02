import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Package2Icon } from "lucide-react";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  getProductById,
  type Product,
  deleteProduct,
} from "../../store/features/productSlice";
import { useTranslation } from "react-i18next";
import { Skeleton } from "../../components/Skeleton";

const ProductHeader = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-start gap-2 w-full">
      <div className="inline-flex items-center gap-1">
        <div className="flex w-6 h-6 items-center justify-center p-0.5">
          <Package2Icon className="w-5 h-5" />
        </div>
        <h1 className="font-heading-h3 font-bold text-gray-800 text-lg tracking-wide leading-tight">
          {t("productDetails.header")}
        </h1>
      </div>
    </div>
  );
};

const ProductImage = ({ imageUrl }: { imageUrl: string | null }) => {
  return (
    <div className="w-[300px] h-[300px] rounded-lg overflow-hidden">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Product"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <Package2Icon className="w-12 h-12 text-gray-400" />
        </div>
      )}
    </div>
  );
};

const ProductInfo = ({ product }: { product: any }) => {
  const { t } = useTranslation();

  const productDetails = [
    {
      label: t("productDetails.info.category"),
      value: product.available_region || "Not Available",
    },
    {
      label: t("productDetails.info.sizes"),
      value: product.sizes || "Not Available",
    },
    {
      label: t("productDetails.info.soldBy"),
      value: product.unit || "Not Available",
    },
    {
      label: t("productDetails.info.price"),
      value: product.price ? `${product.price}€` : "Not Available",
      isPrice: true,
    },
    {
      label: t("productDetails.info.availableStock"),
      value: product.available_stock?.toString() || "Not Available",
    },
    {
      label: t("productDetails.info.totalStock"),
      value: product.total_stock?.toString() || "Not Available",
    },
  ];

  return (
    <div className="flex flex-col items-start gap-4">
      <div className="flex flex-col items-start gap-1">
        <h2 className="font-heading-h2 font-bold text-gray-900 text-xl tracking-wide leading-tight">
          {product.name || "Not Available"}
        </h2>
        <p className="font-heading-h3 font-bold text-gray-500 text-lg tracking-wide leading-tight">
          {t("productDetails.reference")}
          {product.id || "Not Available"}
        </p>
      </div>
      {productDetails.map((detail, index) => (
        <div key={index} className="flex flex-col items-start gap-1">
          <h3 className="text-gray-500 text-lg leading-tight font-heading-h3 font-bold tracking-wide">
            {detail.label}
          </h3>
          <p
            className={`${
              detail.isPrice ? "text-green-600" : "text-gray-900"
            } text-base leading-tight font-medium tracking-wide`}
          >
            {detail.value}
          </p>
        </div>
      ))}
    </div>
  );
};

const ProductActions = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const { selectedCompany } = useAppSelector((state) => state.client);

  const handleEdit = () => {
    navigate(`/products/edit/${id}`);
  };

  const handleDelete = async () => {
    if (id && selectedCompany?.dns) {
      const resultAction = await dispatch(
        deleteProduct({ dnsPrefix: selectedCompany.dns, productId: id })
      ).unwrap();

      if (resultAction?.product_id) {
        navigate("/products");
      }
    }
  };

  return (
    <div className="flex items-start gap-2 w-full">
      <Button
        className="flex-1 bg-teal-700 text-white rounded-lg border border-solid border-gray-300"
        onClick={handleEdit}
      >
        {t("productDetails.actions.modify")}
      </Button>
      <Button
        variant="destructive"
        className="flex-1 bg-red-600 rounded-lg border border-solid border-red-200"
        onClick={handleDelete}
      >
        {t("productDetails.actions.delete")}
      </Button>
    </div>
  );
};

const ProductDescription = ({ description }: { description: string }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col w-[700px] items-start gap-1">
      <h3 className="font-heading-h3 font-bold text-lg leading-tight text-gray-900 tracking-wide">
        {t("productDetails.description.title")}
      </h3>
      <p className="font-medium text-base leading-tight text-gray-900 tracking-wide">
        {description || "Not Available"}
      </p>
    </div>
  );
};

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentProduct, loading, error } = useAppSelector(
    (state) => state.product
  );
  const product = currentProduct || ({} as Product);
  const { selectedCompany } = useAppSelector((state) => state.client);

  useEffect(() => {
    if (id && selectedCompany?.dns) {
      dispatch(
        getProductById({ dnsPrefix: selectedCompany.dns, productId: id })
      );
    }
  }, [dispatch, id, selectedCompany?.dns]);

  if (loading) {
    return (
      <Card className="w-full">
        <Skeleton variant="details" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="flex flex-col items-center gap-8 p-6 bg-white rounded-lg overflow-hidden">
        <div className="text-center py-4 text-red-600">{error}</div>
      </Card>
    );
  }

  if (!currentProduct) {
    return (
      <Card className="flex flex-col items-center gap-8 p-6 bg-white rounded-lg overflow-hidden">
        <div className="text-center py-4">Product not found</div>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col items-center gap-8 p-6 bg-white rounded-lg overflow-hidden">
      <ProductHeader />
      <CardContent className="flex flex-col items-start gap-4 p-0 w-full">
        <section className="flex flex-col items-start gap-8 p-8 w-full rounded-sm overflow-hidden">
          <div className="flex items-center gap-6 w-full">
            <ProductImage imageUrl={product.product_image} />
            <div className="flex flex-col items-start gap-8 flex-1">
              <ProductInfo product={product} />
              <ProductActions />
            </div>
          </div>
          <ProductDescription description={product.description} />
        </section>
      </CardContent>
    </Card>
  );
}
