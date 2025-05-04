import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import { ArrowLeft, Download, Package2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getOrder } from "../../store/features/cartSlice";
import { useAppSelector, AppDispatch } from "../../store/store";
import { getHost } from "../../utils/hostUtils";
import { Skeleton } from "../../components/Skeleton";

const OrderHeader = () => {
  const { t } = useTranslation();
  return (
    <div className="flex justify-between items-center w-full mb-8">
      <div className="inline-flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-10 w-10">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="font-heading-h3 text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)]">
          {t("orderDetails.title")}
        </h1>
      </div>
      <Button className="bg-[#07515f] text-[color:var(--1-tokens-color-modes-button-primary-default-text)]">
        <Download className="mr-2 h-4 w-4" />
        {t("orderDetails.downloadInvoice")}
      </Button>
    </div>
  );
};

const OrderInfo = ({
  label,
  value,
  isStatus,
}: {
  label: string;
  value: string;
  isStatus: boolean;
}) => (
  <div className="flex flex-col items-start gap-1">
    <h3 className="font-text-medium text-black">{label}</h3>
    <p
      className={`font-text-medium ${
        isStatus
          ? "text-[color:var(--1-tokens-color-modes-common-warning-medium)]"
          : "text-black"
      }`}
    >
      {value}
    </p>
  </div>
);

const OrderDetailsCard = ({ order }: { order: any }) => {
  const { t } = useTranslation();
  console.log({ order });
  if (!order) return null;

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <OrderHeader />
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="space-y-4">
              <OrderInfo
                label={t("orderDetails.fields.order")}
                value={order?.order_id?.toString() ?? t("common.notAvailable")}
                isStatus={false}
              />
              <OrderInfo
                label={t("orderDetails.fields.date")}
                value={
                  order?.created_at
                    ? new Date(order.created_at).toLocaleDateString()
                    : t("common.notAvailable")
                }
                isStatus={false}
              />
              <OrderInfo
                label={t("orderDetails.fields.totalPrice")}
                value={
                  order?.total_price
                    ? `${order.total_price}€`
                    : t("common.notAvailable")
                }
                isStatus={false}
              />
              <OrderInfo
                label={t("orderDetails.fields.status")}
                value={order?.order_status ?? t("common.notAvailable")}
                isStatus={!!order?.order_status}
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-4">
              <OrderInfo
                label={t("orderDetails.fields.customer")}
                value={order?.customer_name ?? t("common.notAvailable")}
                isStatus={false}
              />
              <OrderInfo
                label={t("orderDetails.fields.managementEmail")}
                value={order?.customer_email ?? t("common.notAvailable")}
                isStatus={false}
              />
              <OrderInfo
                label={t("orderDetails.fields.shippingAddress")}
                value={order?.shipping_address ?? t("common.notAvailable")}
                isStatus={false}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ProductTableHeader = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-1-tokens-color-modes-common-primary-brand-lower rounded-md mb-2">
      <div className="flex items-center justify-between p-2">
        <div className="w-11 flex items-center justify-center">
          <Checkbox className="h-5 w-5 rounded border-[1.5px]" />
        </div>
        <div className="w-[203px] flex items-center">
          <span className="font-text-small text-[#1e2324]">
            {t("orderDetails.products.table.product")}
          </span>
        </div>
        <div className="w-[129px] flex items-center justify-center">
          <span className="font-text-small text-[#1e2324]">
            {t("orderDetails.products.table.ref")}
          </span>
        </div>
        <div className="w-[145px] flex items-center justify-center">
          <span className="font-text-small text-[#1e2324]">
            {t("orderDetails.products.table.unitPrice")}
          </span>
        </div>
        <div className="w-[145px] flex items-center justify-center">
          <span className="font-text-small text-[#1e2324]">
            {t("orderDetails.products.table.quantity")}
          </span>
        </div>
        <div className="w-[145px] flex items-center justify-center">
          <span className="font-text-small text-[#1e2324]">
            {t("orderDetails.products.table.total")}
          </span>
        </div>
      </div>
    </div>
  );
};

const ProductRow = ({ product }: { product: any }) => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between px-2 py-3 border-b border-primary-neutal-300">
      <div className="w-11 flex items-center justify-center">
        <Checkbox className="h-5 w-5 rounded border-[1.5px]" />
      </div>
      <div className="w-[203px] flex items-center gap-3 px-3">
        <div className="w-10 h-10 rounded overflow-hidden border border-[color:var(--1-tokens-color-modes-border-primary)] flex items-center justify-center bg-[color:var(--1-tokens-color-modes-background-secondary)]">
          {product?.product_image ? (
            <img
              src={product.product_image}
              alt={product?.product_name ?? "Product"}
              className="w-[30px] h-[29px] object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.parentElement
                  ?.querySelector(".placeholder-icon")
                  ?.classList.remove("hidden");
              }}
            />
          ) : null}
          <div
            className={`placeholder-icon ${
              product?.product_image ? "hidden" : ""
            } text-gray-400`}
          >
            <Package2 className="w-5 h-5" />
          </div>
        </div>
        <span className="font-text-medium text-black">
          {product?.product_name ?? t("common.notAvailable")}
        </span>
      </div>
      <div className="w-[129px] flex items-center justify-center">
        <span className="font-text-medium text-black">
          {product?.product_id ?? t("common.notAvailable")}
        </span>
      </div>
      <div className="w-[145px] flex items-center justify-center">
        <span className="font-text-medium text-black">
          {product?.product_price
            ? `${product.product_price}€`
            : t("common.notAvailable")}
        </span>
      </div>
      <div className="w-[145px] flex items-center justify-center">
        <Badge
          variant="secondary"
          className="w-full flex justify-center bg-[color:var(--1-tokens-color-modes-background-secondary)] text-black"
        >
          {product?.quantity ?? 0}
        </Badge>
      </div>
      <div className="w-[145px] flex items-center justify-center">
        <span className="font-text-medium text-[color:var(--1-tokens-color-modes-common-success-medium)]">
          {product?.product_price && product?.quantity
            ? `${(product.product_price * product.quantity).toFixed(2)}€`
            : t("common.notAvailable")}
        </span>
      </div>
    </div>
  );
};

const ProductTable = ({ order }: { order: any }) => {
  const { t } = useTranslation();

  if (!order || !order.order_items) return null;

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <h2 className="font-heading-h3 text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] mb-6">
          {t("orderDetails.products.title")}
        </h2>
        <div className="w-full">
          <ProductTableHeader />
          <div className="overflow-y-auto">
            {order.order_items.map((product: any) => (
              <ProductRow key={product.product_id} product={product} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function SuperAdminOrderDetails() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();
  const { currentOrder, loading, error } = useAppSelector(
    (state) => state.cart
  );

  useEffect(() => {
    if (id) {
      dispatch(
        getOrder({
          dns_prefix: "chronodrive",
          store_id: "27",
          order_id: id,
        })
      );
    }
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="flex flex-col items-start gap-8 p-6">
        <Skeleton variant="details" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4 text-[color:var(--1-tokens-color-modes-common-danger-medium)]">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-2.5 p-2.5">
      <OrderDetailsCard order={currentOrder} />
      <ProductTable order={currentOrder} />
    </div>
  );
}
