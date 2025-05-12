import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import {
  ArrowLeft,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  CheckCircle2,
  RefreshCw,
  Circle,
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";
import { useAppDispatch } from "../../store/store";
import { approveOrder, refuseOrder } from "../../store/features/cartSlice";
import { getHost } from "../../utils/hostUtils";
import { toast } from "sonner";

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

const getStatusColor = (status: string) => {
  const statusMap: {
    [key: string]: {
      bg: string;
      text: string;
      border: string;
      icon: JSX.Element;
    };
  } = {
    approval_pending: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      icon: <Clock className="w-3.5 h-3.5" />,
    },
    approved: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
    rejected: {
      bg: "bg-rose-50",
      text: "text-rose-700",
      border: "border-rose-200",
      icon: <XCircle className="w-3.5 h-3.5" />,
    },
    processing: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      icon: <RefreshCw className="w-3.5 h-3.5" />,
    },
    default: {
      bg: "bg-gray-50",
      text: "text-gray-700",
      border: "border-gray-200",
      icon: <Circle className="w-3.5 h-3.5" />,
    },
  };
  return statusMap[status.toLowerCase()] || statusMap.default;
};

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
                <Badge
                  className={cn(
                    "border px-3 py-1.5 rounded-full flex items-center gap-2 transition-all duration-200 shadow-sm",
                    getStatusColor(orderDetails.orderStatus).bg,
                    getStatusColor(orderDetails.orderStatus).text,
                    getStatusColor(orderDetails.orderStatus).border,
                    "hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                  )}
                >
                  <span
                    className={cn(
                      "flex items-center transition-transform",
                      orderDetails.orderStatus.toLowerCase() ===
                        "approval_pending" && "animate-spin"
                    )}
                  >
                    {getStatusColor(orderDetails.orderStatus).icon}
                  </span>
                  <span className="font-medium text-sm tracking-normal leading-normal capitalize whitespace-nowrap">
                    {orderDetails.orderStatus.toLowerCase() ===
                    "approval_pending"
                      ? "Approval Pending"
                      : orderDetails.orderStatus.toLowerCase()}
                  </span>
                </Badge>
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
