import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { CheckCircle, ArrowLeft, Download, XCircle } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/store";
import { approveOrder, refuseOrder } from "../../store/features/cartSlice";
import { getHost } from "../../utils/hostUtils";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import { StatusText } from "../../components/ui/status-text";
import { StatusIcon } from "../../components/ui/status-icon";
interface OrderDetailsProps {
  createdAt: string;
  orderId: string | number;
  orderItems: Array<{ [key: string]: any }>;
  orderStatus: string;
  storeAddress: string;
  storeName: string;
}

const OrderInfo: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="group transition-all duration-200 ease-in-out hover:bg-gray-50 p-2 rounded-md -mx-2">
    <p className="font-text-medium font-medium text-black text-base tracking-normal leading-normal">
      <span className="font-medium text-gray-600 group-hover:text-primary transition-colors">
        {label}
      </span>
      <span className="ml-2 text-gray-900"> {value}</span>
    </p>
  </div>
);

const OrderTableHeaderSection: React.FC<{
  orderDetails: OrderDetailsProps;
}> = ({ orderDetails }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const dns_prefix = getHost();
  const handleApproveOrder = async () => {
    try {
      await dispatch(
        approveOrder({
          dns_prefix,
          order_id: orderDetails.orderId.toString(),
        })
      ).unwrap();
      toast.success("Order approved successfully");
      navigate(-1);
    } catch (error) {
      toast.error("Failed to approve order");
    }
  };

  const handleRefuseOrder = async () => {
    try {
      await dispatch(
        refuseOrder({
          dns_prefix,
          order_id: orderDetails.orderId.toString(),
        })
      ).unwrap();
      toast.success("Order refused successfully");
      navigate(-1);
    } catch (error) {
      toast.error("Failed to refuse order");
    }
  };

  const handleDownloadOrderForm = () => {
    const doc = new jsPDF();

    // Helper functions
    const drawBorder = () => {
      doc.setDrawColor(0, 184, 91); // Green color for order form
      doc.setLineWidth(0.5);
      doc.rect(10, 10, 190, 277);
      doc.setLineWidth(0.2);
      doc.rect(15, 15, 180, 267);
    };

    const drawHorizontalLine = (y: number) => {
      doc.setDrawColor(0, 184, 91);
      doc.setLineWidth(0.2);
      doc.line(15, y, 195, y);
    };

    // Add borders
    drawBorder();

    // Add header bar
    doc.setFillColor(0, 184, 91);
    doc.rect(10, 10, 190, 25, "F");

    // Add title
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("Order Form", 20, 27);

    // Add order details section
    doc.setTextColor(0, 184, 91);
    doc.setFontSize(12);
    doc.text("ORDER DETAILS:", 20, 50);

    // Add subtle divider
    drawHorizontalLine(53);

    // Order information
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    const orderInfo = [
      { label: "Order ID:", value: `#${orderDetails.orderId}` },
      {
        label: "Date:",
        value: new Date(orderDetails.createdAt).toLocaleDateString(),
      },
      {
        label: "Status:",
        value: orderDetails.orderStatus,
      },
      { label: "Store Name:", value: orderDetails.storeName },
      { label: "Store Address:", value: orderDetails.storeAddress },
    ];

    let yPos = 60;
    orderInfo.forEach(({ label, value }) => {
      doc.setFont("helvetica", "bold");
      doc.text(label, 20, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(value, 60, yPos);
      yPos += 8;
    });

    // Add products section
    yPos += 10;
    doc.setTextColor(0, 184, 91);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("ORDERED PRODUCTS:", 20, yPos);

    drawHorizontalLine(yPos + 3);

    // Table headers
    yPos += 10;
    doc.setFillColor(240, 255, 244); // Light green background
    doc.rect(15, yPos - 5, 180, 10, "F");

    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Product Name", 20, yPos);
    doc.text("Product ID", 90, yPos);
    doc.text("Unit Price", 130, yPos);
    doc.text("Quantity", 160, yPos);
    doc.text("Total", 180, yPos);

    // Table content
    yPos += 8;
    doc.setFont("helvetica", "normal");

    let totalAmount = 0;
    orderDetails.orderItems.forEach((item, index) => {
      // Alternate row background
      if (index % 2 === 0) {
        doc.setFillColor(250, 255, 252);
        doc.rect(15, yPos - 5, 180, 8, "F");
      }

      const itemTotal = item.product_price * item.quantity;
      totalAmount += itemTotal;

      // Truncate long product names
      const maxLength = 35;
      const displayName =
        item.product_name.length > maxLength
          ? item.product_name.substring(0, maxLength) + "..."
          : item.product_name;

      doc.text(displayName, 20, yPos);
      doc.text(item.product_id.toString(), 90, yPos);
      doc.text(`$${item.product_price.toFixed(2)}`, 130, yPos);
      doc.text(item.quantity.toString(), 160, yPos);
      doc.text(`$${itemTotal.toFixed(2)}`, 180, yPos);

      yPos += 8;
    });

    // Add total section
    yPos += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Total Amount:", 130, yPos);
    doc.text(`$${totalAmount.toFixed(2)}`, 180, yPos);

    // Add signature section
    yPos += 30;
    doc.text("Authorized Signature:", 20, yPos);
    doc.setDrawColor(0, 0, 0);
    doc.line(20, yPos + 20, 100, yPos + 20);

    doc.text("Date:", 120, yPos);
    doc.line(120, yPos + 20, 180, yPos + 20);

    // Add footer
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      "This is an official order form from Cotton Blue. Please keep for your records.",
      doc.internal.pageSize.width / 2,
      270,
      { align: "center" }
    );

    // Save the PDF
    const timestamp = new Date().toISOString().split("T")[0];
    doc.save(`CottonBlue_OrderForm_${orderDetails.orderId}_${timestamp}.pdf`);
  };

  return (
    <Card className="w-full p-6 md:p-8 space-y-8 shadow-lg transition-all duration-200 hover:shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 hover:bg-primary/10 transition-colors"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h3 className="text-[length:var(--heading-h3-font-size)] font-heading-h3 font-[number:var(--heading-h3-font-weight)] text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] tracking-[var(--heading-h3-letter-spacing)] leading-[var(--heading-h3-line-height)] [font-style:var(--heading-h3-font-style)]">
            Order Details
          </h3>
        </div>

        <Button
          className="bg-green-600 border border-green-700 hover:bg-green-600/90 h-auto group transition-all duration-200"
          aria-label="Download order form"
          onClick={handleDownloadOrderForm}
        >
          <Download className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
          <span className="font-label-medium font-medium text-base tracking-normal leading-normal">
            Download Order Form
          </span>
        </Button>
      </div>

      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row gap-8 w-full">
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <OrderInfo
                label="Order ID"
                value={orderDetails.orderId.toString()}
              />
              <OrderInfo
                label="Date"
                value={new Date(orderDetails.createdAt).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
              />
              <div className="flex items-center gap-2 p-2 -mx-2 group transition-all duration-200 ease-in-out hover:bg-gray-50 rounded-md">
                <span className="font-medium text-gray-600 group-hover:text-primary transition-colors">
                  Status
                </span>
                <div className="flex items-center gap-2">
                  <StatusIcon status={orderDetails.orderStatus} />
                  <StatusText status={orderDetails.orderStatus} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <OrderInfo label="Store Name" value={orderDetails.storeName} />
              <OrderInfo
                label="Store Address"
                value={orderDetails.storeAddress}
              />
            </div>
          </div>
        </div>
      </CardContent>

      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <Button
          className="flex-1 bg-green-600 border border-green-700 hover:bg-green-600/90 h-auto group transition-all duration-200"
          aria-label="Approve order"
          onClick={handleApproveOrder}
          disabled={
            orderDetails.orderStatus.toLowerCase() !== "approval_pending"
          }
        >
          <CheckCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
          <span className="font-label-medium font-medium text-primary-text text-base tracking-normal leading-normal">
            Approve Order
          </span>
        </Button>

        <Button
          className="flex-1 bg-red-500 border border-red-600 hover:bg-red-600 text-white h-auto group transition-all duration-200"
          aria-label="Reject order"
          onClick={handleRefuseOrder}
          disabled={
            orderDetails.orderStatus.toLowerCase() !== "approval_pending"
          }
        >
          <XCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
          <span className="font-label-medium font-medium text-base tracking-normal leading-normal">
            Reject Order
          </span>
        </Button>
      </div>
    </Card>
  );
};

export { OrderTableHeaderSection };
