import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import { ArrowLeft, Download, ImageOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getOrder } from "../../store/features/cartSlice";
import { useAppSelector, AppDispatch } from "../../store/store";
import { getHost } from "../../utils/hostUtils";
import { Skeleton } from "../../components/Skeleton";
import { getOrderStatusText } from "../../utils/statusUtil";
import { StatusText } from "../../components/ui/status-text";
import { StatusIcon } from "../../components/ui/status-icon";
import { useCompanyColors } from "../../hooks/useCompanyColors";
import { handleDownloadInvoice } from "../../utils/pdfUtil";

const OrderHeader = ({ order }: { order: any }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { buttonStyles } = useCompanyColors();

  return (
    <div
      className="flex items-center justify-between mb-8"
      style={buttonStyles}
    >
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-[length:var(--heading-h3-font-size)] font-heading-h3 font-[number:var(--heading-h3-font-weight)] text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] tracking-[var(--heading-h3-letter-spacing)] leading-[var(--heading-h3-line-height)] [font-style:var(--heading-h3-font-style)]">
          {t("orderDetails.title")}
        </h2>
      </div>
      <Button
        className="bg-[var(--primary-color)] hover:bg-[var(--primary-hover-color)] border border-[var(--primary-color)] text-white"
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
        style={{
          backgroundColor: "var(--primary-color)",
          color: "var(--primary-text-color)",
        }}
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
}) => {
  const statusColorMap: { [key: string]: string } = {
    approval_pending: "text-1-tokens-color-modes-common-warning-medium",
    confirmed: "text-1-tokens-color-modes-common-success-medium",
    refused: "text-1-tokens-color-modes-common-danger-medium",
    shipped: "text-1-tokens-color-modes-common-success-medium",
    in_transit: "text-1-tokens-color-modes-common-success-medium",
    delivered: "text-1-tokens-color-modes-common-success-medium",
  };
  const { t } = useTranslation();
  return (
    <p className="text-base">
      <span className="font-medium">{label}</span>
      <span> : </span>
      <span
        className={
          isStatus
            ? statusColorMap[value.toLowerCase()] ||
              "text-1-tokens-color-modes-common-neutral-medium"
            : ""
        }
      >
        {isStatus ? getOrderStatusText(value, t) : value}
      </span>
    </p>
  );
};

const OrderDetailsCard = ({ order }: { order: any }) => {
  const { t } = useTranslation();

  if (!order) return null;

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <OrderHeader order={order} />
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="space-y-2">
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
                  order?.order_items
                    ? `${order?.order_items
                        ?.reduce(
                          (acc: number, item: any) =>
                            acc + item.product_price * item.quantity,
                          0
                        )
                        ?.toFixed(2)}€`
                    : t("common.notAvailable")
                }
                isStatus={false}
              />
              <div className="flex items-center gap-2">
                <StatusIcon status={order?.order_status} />
                <StatusText status={order?.order_status} />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <OrderInfo
                label={t("orderDetails.fields.customer")}
                value={order?.store_name ?? t("common.notAvailable")}
                isStatus={false}
              />
              <OrderInfo
                label={t("orderDetails.fields.managementEmail")}
                value={order?.customer_email ?? t("common.notAvailable")}
                isStatus={false}
              />
              <OrderInfo
                label={t("orderDetails.fields.vatNumber")}
                value={order?.vat_number ?? t("common.notAvailable")}
                isStatus={false}
              />
              <OrderInfo
                label={t("orderDetails.fields.shippingAddress")}
                value={order?.store_address ?? t("common.notAvailable")}
                isStatus={false}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ProductTable = ({ order }: { order: any }) => {
  const { t } = useTranslation();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const { buttonStyles } = useCompanyColors();
  if (!order || !order.order_items) return null;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(
        order.order_items.map((item: any) => item.product_id)
      );
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    }
  };

  const isAllSelected =
    order.order_items.length > 0 &&
    selectedProducts.length === order.order_items.length;

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[length:var(--heading-h3-font-size)] font-heading-h3 font-[number:var(--heading-h3-font-weight)] text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] tracking-[var(--heading-h3-letter-spacing)] leading-[var(--heading-h3-line-height)] [font-style:var(--heading-h3-font-style)]">
            {t("orderDetails.products.title")}
          </h2>
          {selectedProducts.length > 0 && (
            <span className="text-sm text-gray-600">
              {selectedProducts.length} {t("orderDetails.products.selected")}
            </span>
          )}
        </div>
        <div className="w-full" style={buttonStyles}>
          <div className="bg-[var(--primary-light-color)] rounded-md mb-2">
            <div className="flex items-center justify-between p-2">
              <div className="w-11 flex items-center justify-center">
                <span className="text-sm text-[#1e2324]">Indéfini</span>
              </div>
              <div className="w-[203px] flex items-center">
                <span className="text-sm text-[#1e2324]">
                  {t("orderDetails.products.table.product")}
                </span>
              </div>
              <div className="w-[129px] flex items-center justify-center">
                <span className="text-sm text-[#1e2324]">
                  {t("orderDetails.products.table.ref")}
                </span>
              </div>
              <div className="w-[145px] flex items-center justify-center">
                <span className="text-sm text-[#1e2324]">
                  {t("orderDetails.products.table.unitPrice")}
                </span>
              </div>
              <div className="w-[145px] flex items-center justify-center">
                <span className="text-sm text-[#1e2324]">
                  {t("orderDetails.products.table.quantity")}
                </span>
              </div>
              <div className="w-[145px] flex items-center justify-center">
                <span className="text-sm text-[#1e2324]">
                  {t("orderDetails.products.table.total")}
                </span>
              </div>
            </div>
          </div>
          <div className="overflow-y-auto">
            {order.order_items.map((product: any, index: number) => (
              <div
                key={product.product_id}
                className="flex items-center justify-between px-2 py-3 border-b border-primary-neutal-300"
              >
                <div className="w-11 flex items-center justify-center">
                  <span className="text-sm text-[#1e2324]">{index + 1}</span>
                </div>
                <div className="w-[203px] flex items-center gap-3 px-3">
                  <div className="w-10 h-10 rounded overflow-hidden border border-primary-neutal-200 flex items-center justify-center bg-gray-50">
                    {product?.product_images &&
                    product?.product_images.length > 0 &&
                    product?.product_images[0] ? (
                      <img
                        src={product?.product_images[0]}
                        alt={product?.product_name ?? "Product"}
                        className="w-full h-full object-contain"
                        width={100}
                        height={100}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          e.currentTarget.parentElement
                            ?.querySelector(".placeholder-icon")
                            ?.classList.remove("hidden");
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ImageOff className="w-10 h-10 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <span className="text-base text-coolgray-100">
                    {`${product?.product_name} - ${product?.product_suitable_for} - ${product?.product_size}`}
                  </span>
                </div>
                <div className="w-[129px] flex items-center justify-center">
                  <span className="text-sm text-coolgray-100">
                    {product?.product_id ?? t("common.notAvailable")}
                  </span>
                </div>
                <div className="w-[145px] flex items-center justify-center">
                  <span className="text-[15px] text-black">
                    {product?.product_price
                      ? `${product.product_price}€`
                      : t("common.notAvailable")}
                  </span>
                </div>
                <div className="w-[145px] flex items-center justify-center">
                  <span className="text-[15px] text-black">
                    {product?.quantity ?? 0}
                  </span>
                </div>
                <div className="w-[145px] flex items-center justify-center">
                  <span className="text-[15px]">
                    {product?.product_price && product?.quantity
                      ? `${(product.product_price * product.quantity).toFixed(
                          2
                        )}€`
                      : t("common.notAvailable")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function OrderDetails() {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();
  const dns_prefix = getHost();
  const { selectedStore } = useAppSelector((state) => state.agency);
  const { currentOrder, loading, error } = useAppSelector(
    (state) => state.cart
  );

  useEffect(() => {
    if (dns_prefix && selectedStore && id) {
      dispatch(
        getOrder({
          dns_prefix,
          store_id: selectedStore,
          order_id: id,
        })
      );
    }
  }, [dispatch, dns_prefix, selectedStore, id]);

  if (loading) {
    return (
      <div className="flex flex-col items-start gap-8 p-6">
        <Skeleton variant="details" />
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
