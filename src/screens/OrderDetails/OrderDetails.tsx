import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import { ArrowLeft, Download, Package2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getOrder } from "../../store/features/cartSlice";
import { useAppSelector, AppDispatch } from "../../store/store";
import { getHost } from "../../utils/hostUtils";
import { Skeleton } from "../../components/Skeleton";
import { jsPDF } from "jspdf";
import { TFunction } from "i18next";

// Utility function to format status
const formatStatus = (status: string, t: TFunction): string => {
  // Replace underscores with spaces and convert to sentence case
  return t(`order_status.${status}`);
};

const OrderHeader = ({ order }: { order: any }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleDownloadInvoice = (order: any) => {
    // Validate order data
    if (!order?.order_items?.length) {
      console.error("No order items found");
      return;
    }

    const doc = new jsPDF();

    // Helper function to draw borders
    const drawBorder = () => {
      doc.setDrawColor(7, 81, 95); // #07515f
      doc.setLineWidth(0.5);
      doc.rect(10, 10, 190, 277);
      doc.setLineWidth(0.2);
      doc.rect(15, 15, 180, 267);
    };

    // Helper function to draw horizontal line
    const drawHorizontalLine = (y: number, opacity = 1) => {
      doc.setDrawColor(7, 81, 95);
      doc.setLineWidth(0.2);
      doc.line(15, y, 195, y);
    };

    // Helper function to format price
    const formatPrice = (price: number | undefined): string => {
      return typeof price === "number" ? price.toFixed(2) : "0.00";
    };

    // Add borders
    drawBorder();

    // Add header bar
    doc.setFillColor(7, 81, 95);
    doc.rect(10, 10, 190, 25, "F");

    // Add company logo/header
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("Cotton Blue", 20, 27);

    // Add "INVOICE" text
    doc.setFontSize(16);
    doc.text("INVOICE", 160, 27);

    // Add invoice details section
    doc.setTextColor(7, 81, 95);
    doc.setFontSize(12);
    doc.text("BILL TO:", 20, 50);

    // Add subtle divider
    drawHorizontalLine(53);

    // Store information
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(order.store_name || "Customer", 20, 60);
    doc.text(order.store_address || "", 20, 66);

    // Add invoice info box
    doc.setDrawColor(7, 81, 95);
    doc.setFillColor(247, 250, 252);
    doc.rect(120, 45, 70, 35, "FD");

    doc.setFont("helvetica", "bold");
    doc.text("Invoice Number:", 125, 53);
    doc.text("Date:", 125, 61);
    doc.text("Status:", 125, 69);

    doc.setFont("helvetica", "normal");
    doc.text(`#${order.order_id}`, 165, 53);
    doc.text(new Date(order.created_at).toLocaleDateString(), 165, 61);

    // Status with color coding
    const statusColors = {
      approval_pending: [245, 158, 11], // warning-medium
      confirmed: [16, 185, 129], // success-medium
      refused: [239, 68, 68], // danger-medium
      shipped: [16, 185, 129], // success-medium
      in_transit: [16, 185, 129], // success-medium
      delivered: [16, 185, 129], // success-medium
    };
    const [r, g, b] = statusColors[
      order.order_status as keyof typeof statusColors
    ] || [0, 0, 0];
    doc.setTextColor(r, g, b);
    doc.text(formatStatus(order.order_status, t), 165, 69);
    doc.setTextColor(0, 0, 0);

    // Add order items table
    drawHorizontalLine(85);

    // Table headers
    doc.setFillColor(247, 250, 252);
    doc.rect(15, 90, 180, 10, "F");
    doc.setFont("helvetica", "bold");
    doc.text("Item", 20, 97);
    doc.text("Quantity", 120, 97);
    doc.text("Price", 150, 97);
    doc.text("Total", 175, 97);

    // Table content
    let yPos = 107;
    doc.setFont("helvetica", "normal");

    order.order_items.forEach((item: any, index: number) => {
      if (!item) return; // Skip if item is undefined

      // Alternate row background
      if (index % 2 === 0) {
        doc.setFillColor(252, 252, 252);
        doc.rect(15, yPos - 5, 180, 8, "F");
      }

      const itemTotal = (item.product_price || 0) * (item.quantity || 0);

      // Truncate long product names
      const maxLength = 45;
      const displayName =
        (item.product_name || "Unknown Product").length > maxLength
          ? (item.product_name || "Unknown Product").substring(0, maxLength) +
            "..."
          : item.product_name || "Unknown Product";

      doc.text(displayName, 20, yPos);
      doc.text(item.quantity?.toString() || "0", 120, yPos);
      doc.text(`$${formatPrice(item.product_price)}`, 150, yPos);
      doc.text(`$${formatPrice(itemTotal)}`, 175, yPos);
      yPos += 8;
    });

    // Calculate total with safe checks
    const subtotal = order.order_items.reduce(
      (sum: number, item: any) =>
        sum + (item?.product_price || 0) * (item?.quantity || 0),
      0
    );
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    // Add total section
    yPos += 5;
    doc.setFillColor(247, 250, 252);
    doc.rect(120, yPos - 5, 75, 35, "F");

    doc.setFont("helvetica", "normal");
    doc.text("Subtotal:", 125, yPos + 5);
    doc.text(`$${formatPrice(subtotal)}`, 175, yPos + 5);

    doc.text("Tax (10%):", 125, yPos + 15);
    doc.text(`$${formatPrice(tax)}`, 175, yPos + 15);

    doc.setFont("helvetica", "bold");
    doc.text("Total:", 125, yPos + 25);
    doc.text(`$${formatPrice(total)}`, 175, yPos + 25);

    // Add payment terms
    yPos += 45;
    doc.setFont("helvetica", "bold");
    doc.text("Payment Terms", 20, yPos);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Payment is due within 30 days of invoice date.", 20, yPos + 7);
    doc.text("Please include invoice number with your payment.", 20, yPos + 14);

    // Add footer
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(128, 128, 128);

    // Add divider before footer
    drawHorizontalLine(260);

    // Footer text
    doc.text(
      "Thank you for your business with Cotton Blue!",
      doc.internal.pageSize.width / 2,
      265,
      { align: "center" }
    );
    doc.setFontSize(8);
    doc.text(
      "For any questions about this invoice, please contact support@cottonblue.com",
      doc.internal.pageSize.width / 2,
      270,
      { align: "center" }
    );
    doc.text(
      "Cotton Blue Inc. | 123 Fashion Street, Style City, SC 12345 | +1 (555) 123-4567",
      doc.internal.pageSize.width / 2,
      275,
      { align: "center" }
    );

    try {
      // Save the PDF with a clean name
      const timestamp = new Date().toISOString().split("T")[0];
      doc.save(`CottonBlue_Invoice_${order.order_id}_${timestamp}.pdf`);
    } catch (error) {
      console.error("Error saving PDF:", error);
    }
  };

  return (
    <div className="flex items-center justify-between mb-8">
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
        className="bg-[#00b85b] hover:bg-[#00a050] border border-[#1a8563] text-white"
        onClick={() => handleDownloadInvoice(order)}
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
        {isStatus ? formatStatus(value, t) : value}
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
              <OrderInfo
                label={t("orderDetails.fields.status")}
                value={order?.order_status ?? t("common.notAvailable")}
                isStatus={!!order?.order_status}
              />
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

const ProductTableHeader = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-[#eaf8e7] rounded-md mb-2">
      <div className="flex items-center justify-between p-2">
        <div className="w-11 flex items-center justify-center">
          <Checkbox className="h-5 w-5 rounded border-[1.5px]" />
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
        <div className="w-10 h-10 rounded overflow-hidden border border-primary-neutal-200 flex items-center justify-center bg-gray-50">
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
        <span className="text-base text-coolgray-100">
          {product?.product_name ?? t("common.notAvailable")}
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
        <span className="text-[15px] text-black">{product?.quantity ?? 0}</span>
      </div>
      <div className="w-[145px] flex items-center justify-center">
        <span className="text-[15px]">
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
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

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
        <div className="w-full">
          <div className="bg-[#eaf8e7] rounded-md mb-2">
            <div className="flex items-center justify-between p-2">
              <div className="w-11 flex items-center justify-center">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={(checked: boolean | "indeterminate") =>
                    handleSelectAll(checked === true)
                  }
                  className="h-5 w-5 rounded border-[1.5px]"
                />
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
            {order.order_items.map((product: any) => (
              <div
                key={product.product_id}
                className="flex items-center justify-between px-2 py-3 border-b border-primary-neutal-300"
              >
                <div className="w-11 flex items-center justify-center">
                  <Checkbox
                    checked={selectedProducts.includes(product.product_id)}
                    onCheckedChange={(checked: boolean | "indeterminate") =>
                      handleSelectProduct(product.product_id, checked === true)
                    }
                    className="h-5 w-5 rounded border-[1.5px]"
                  />
                </div>
                <div className="w-[203px] flex items-center gap-3 px-3">
                  <div className="w-10 h-10 rounded overflow-hidden border border-primary-neutal-200 flex items-center justify-center bg-gray-50">
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
                  <span className="text-base text-coolgray-100">
                    {product?.product_name ?? t("common.notAvailable")}
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
  const { t } = useTranslation();
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

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col items-start gap-2.5 p-2.5">
      <OrderDetailsCard order={currentOrder} />
      <ProductTable order={currentOrder} />
    </div>
  );
}
