import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import {
  ArrowLeft,
  Download,
  Package2,
  FileText,
  ImageOff,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getOrder } from "../../store/features/cartSlice";
import { useAppSelector, AppDispatch } from "../../store/store";
import { Skeleton } from "../../components/Skeleton";
import { StatusIcon } from "../../components/ui/status-icon";
import { StatusText } from "../../components/ui/status-text";
import { jsPDF } from "jspdf";
import { handleDownloadInvoice } from "../../utils/pdfUtil";

const OrderHeader = ({ order }: { order: any }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center w-full mb-8">
      <div className="inline-flex items-center gap-2">
        <ArrowLeft
          onClick={() => navigate(-1)}
          className="w-5 h-5 text-[#07515f] cursor-pointer hover:text-[#064a56] transition-colors duration-200"
        />
        <h1 className="font-heading-h3 font-bold text-gray-700 text-lg tracking-wide leading-6">
          {t("orderDetails.title")}
        </h1>
      </div>
      <Button
        className="bg-[#07515f] text-white hover:bg-[#064a56] h-9 text-sm"
        onClick={() =>
          handleDownloadInvoice(
            {
              ...order,
              ordered_user: {
                email: order?.company_email,
                phone: order?.company_phone,
                name: order?.company_name,
              },
            },
            "#07505e",
            "#ffffff",
            "Cotton Blue",
            "121 Rue du 8 Mai 1945, Villeneuve-d'Ascq - 59650",
            order?.vat_number ?? "FRXX999999999",
            "contact@cotton-blue.com",
            "03 20 41 09 09"
          )
        }
      >
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
    <h3 className="font-label-small font-bold text-gray-700 text-sm tracking-wide leading-5">
      {label}
    </h3>
    {isStatus ? (
      <div className="flex items-center gap-2">
        <StatusIcon status={value} />
        <StatusText status={value} />
      </div>
    ) : (
      <p className="font-text-medium text-black">{value}</p>
    )}
  </div>
);

const OrderDetailsCard = ({ order }: { order: any }) => {
  const { t } = useTranslation();

  if (!order) return null;

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <OrderHeader order={order} />
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
                    ? new Date(order.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : t("common.notAvailable")
                }
                isStatus={false}
              />
              <OrderInfo
                label={t("orderDetails.fields.store")}
                value={order?.store_name ?? t("common.notAvailable")}
                isStatus={false}
              />
              <OrderInfo
                label={t("orderDetails.fields.status")}
                value={order?.order_status ?? t("common.notAvailable")}
                isStatus={true}
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-4">
              <OrderInfo
                label={t("orderDetails.fields.storeAddress")}
                value={order?.store_address ?? t("common.notAvailable")}
                isStatus={false}
              />
              <OrderInfo
                label={t("orderDetails.fields.totalItems")}
                value={order?.order_items?.length?.toString() ?? "0"}
                isStatus={false}
              />
              <OrderInfo
                label={t("orderDetails.fields.totalQuantity")}
                value={
                  order?.order_items
                    ?.reduce(
                      (sum: number, item: any) => sum + (item?.quantity ?? 0),
                      0
                    )
                    .toString() ?? "0"
                }
                isStatus={false}
              />
              <OrderInfo
                label={t("orderDetails.fields.totalPrice")}
                value={
                  `${order?.order_items
                    ?.reduce(
                      (sum: number, item: any) =>
                        sum +
                        (item?.product_price ?? 0) * (item?.quantity ?? 0),
                      0
                    )
                    .toFixed(2)}€` ?? "0.00€"
                }
                isStatus={false}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ProductTableHeader = ({
  onSelectAll,
  isAllSelected,
}: {
  onSelectAll: (checked: boolean) => void;
  isAllSelected: boolean;
}) => {
  const { t } = useTranslation();
  return (
    <div className="bg-1-tokens-color-modes-common-primary-brand-lower rounded-md mb-2">
      <div className="flex items-center justify-between p-2">
        <div className="w-11 flex items-center justify-center">
          <Checkbox
            className="h-5 w-5 rounded border-[1.5px]"
            checked={isAllSelected}
            onCheckedChange={onSelectAll}
          />
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

const ProductRow = ({
  product,
  isSelected,
  onSelect,
}: {
  product: any;
  isSelected: boolean;
  onSelect: (productId: number) => void;
}) => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between px-2 py-3 border-b border-primary-neutal-300">
      <div className="w-11 flex items-center justify-center">
        <Checkbox
          className="h-5 w-5 rounded border-[1.5px]"
          checked={isSelected}
          onCheckedChange={() => onSelect(product.product_id)}
        />
      </div>
      <div className="w-[203px] flex items-center gap-3 px-3">
        <div className="w-10 h-10 rounded overflow-hidden border border-[color:var(--1-tokens-color-modes-border-primary)] flex items-center justify-center bg-[color:var(--1-tokens-color-modes-background-secondary)]">
          {product?.product_images?.length > 0 && product?.product_images[0] ? (
            <img
              src={product.product_images[0]}
              alt={product?.product_name ?? t("common.product")}
              className="w-full h-full object-contain"
              width={100}
              height={100}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageOff className="w-5 h-5 text-gray-400" />
            </div>
          )}
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
            ? `${product.product_price.toFixed(2)}€`
            : t("common.notAvailable")}
        </span>
      </div>
      <div className="w-[145px] flex items-center justify-center">
        <span className="font-text-medium text-black">
          {product?.quantity ?? 0}
        </span>
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
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  if (!order || !order.order_items) return null;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(
        order.order_items.map((product: any) => product.product_id)
      );
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: number) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const isAllSelected =
    order.order_items.length > 0 &&
    selectedProducts.length === order.order_items.length;

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <h2 className="font-heading-h3 font-bold text-gray-700 text-lg tracking-wide leading-6 mb-6">
          {t("orderDetails.products.title")}
        </h2>
        <div className="w-full">
          <ProductTableHeader
            onSelectAll={handleSelectAll}
            isAllSelected={isAllSelected}
          />
          <div className="overflow-y-auto">
            {order.order_items.map((product: any) => (
              <ProductRow
                key={product?.product_id}
                product={product}
                isSelected={selectedProducts.includes(product.product_id)}
                onSelect={handleSelectProduct}
              />
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
  const navigate = useNavigate();
  const { id, store_id } = useParams();
  const { currentOrder, loading, error } = useAppSelector(
    (state) => state.cart
  );
  const { selectedCompany } = useAppSelector((state) => state.client);

  useEffect(() => {
    if (id && store_id) {
      dispatch(
        getOrder({
          dns_prefix: selectedCompany?.dns,
          store_id: store_id,
          order_id: id,
        })
      );
    }
  }, [dispatch, id, store_id]);

  if (loading) {
    return (
      <div className="flex flex-col items-start gap-8 p-6">
        <Skeleton variant="details" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-6 p-6">
      <OrderDetailsCard order={currentOrder} />
      <ProductTable order={currentOrder} />
    </div>
  );
}
