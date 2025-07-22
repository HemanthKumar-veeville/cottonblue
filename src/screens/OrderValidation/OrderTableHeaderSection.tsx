import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { CheckCircle, ArrowLeft, Download, XCircle } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { approveOrder, refuseOrder } from "../../store/features/cartSlice";
import { getHost } from "../../utils/hostUtils";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import { StatusText } from "../../components/ui/status-text";
import { StatusIcon } from "../../components/ui/status-icon";
import ErrorState from "../../components/ErrorState";
import { Skeleton } from "../../components/ui/skeleton";
import { useCompanyColors } from "../../hooks/useCompanyColors";
import { useTranslation } from "react-i18next";
import { getStoreBudget } from "../../store/features/agencySlice";
import { formatDateToParis } from "../../utils/dateUtils";

interface OrderItem {
  product_id: number;
  product_name: string;
  product_image: string;
  product_price: number;
  quantity: number;
}

interface OrderDetailsProps {
  order_id: number;
  created_at: string;
  order_status: string;
  store_name: string;
  store_address: string;
  order_items: OrderItem[];
  ordered_user?: {
    firstname: string;
    lastname: string;
  };
}

interface OrderTableHeaderSectionProps {
  orderDetails: OrderDetailsProps | null | undefined;
  isLoading?: boolean;
  checkBudgetLimits: () => boolean;
  setShowBudgetWarning: (show: boolean) => void;
  checkOrderLimits: () => boolean;
}

const OrderInfo: React.FC<{
  label: string;
  value: string;
  isLoading?: boolean;
}> = ({ label, value, isLoading = false }) => (
  <div className="contents">
    <span className="font-medium text-gray-600 group-hover:text-primary transition-colors whitespace-nowrap p-2">
      {label}
    </span>
    <div className="flex items-center gap-2 min-w-0 p-2">
      <span className="text-gray-600 shrink-0">:</span>
      {isLoading ? (
        <Skeleton className="h-4 w-32" />
      ) : (
        <span className="text-gray-900">{value}</span>
      )}
    </div>
  </div>
);

const OrderTableHeaderSection: React.FC<OrderTableHeaderSectionProps> = ({
  orderDetails,
  isLoading = false,
  checkBudgetLimits,
  checkOrderLimits,
  setShowBudgetWarning,
}) => {
  const navigate = useNavigate();
  const { buttonStyles } = useCompanyColors();
  const { t } = useTranslation();
  const { selectedStore } = useAppSelector((state) => state.agency);

  const dispatch = useAppDispatch();
  const dns_prefix = getHost();

  const handleApproveOrder = async () => {
    if (checkBudgetLimits()) {
      setShowBudgetWarning(true);
      return;
    }

    if (checkOrderLimits()) {
      setShowBudgetWarning(true);
      return;
    }

    try {
      await dispatch(
        approveOrder({
          dns_prefix,
          order_id: orderDetails?.order_id?.toString() ?? "",
        })
      ).unwrap();
      if (selectedStore) {
        await dispatch(
          getStoreBudget({ dnsPrefix: dns_prefix, storeId: selectedStore })
        );
      }
      navigate(-1);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRefuseOrder = async () => {
    try {
      await dispatch(
        refuseOrder({
          dns_prefix,
          order_id: orderDetails?.order_id?.toString() ?? "",
        })
      ).unwrap();

      navigate(-1);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card
      className="w-full p-6 md:p-8 space-y-8 shadow-lg transition-all duration-200 hover:shadow-xl"
      style={buttonStyles}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 hover:bg-primary/10 transition-colors"
            onClick={() => navigate(-1)}
            aria-label={t("common.previous")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h3 className="text-[length:var(--heading-h3-font-size)] font-heading-h3 font-[number:var(--heading-h3-font-weight)] text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] tracking-[var(--heading-h3-letter-spacing)] leading-[var(--heading-h3-line-height)] [font-style:var(--heading-h3-font-style)]">
            {t("orderValidation.orderDetails")}
          </h3>
        </div>
      </div>

      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row gap-8 w-full">
          <div className="flex-1">
            <div className="grid grid-cols-[minmax(150px,_auto)_1fr] items-start gap-y-2">
              <OrderInfo
                label={t("orderValidation.orderId")}
                value={orderDetails?.order_id?.toString() ?? ""}
                isLoading={isLoading}
              />
              <OrderInfo
                label={t("orderValidation.date")}
                value={formatDateToParis(orderDetails?.created_at)}
                isLoading={isLoading}
              />
              <OrderInfo
                label={t("orderValidation.orderTotal")}
                value={orderDetails?.order_total ?? ""}
                isLoading={isLoading}
              />
              <div className="contents">
                <span className="font-medium text-gray-600 group-hover:text-primary transition-colors whitespace-nowrap p-2">
                  {t("orderValidation.status")}
                </span>
                <div className="flex items-center gap-2 min-w-0 p-2">
                  <span className="text-gray-600 shrink-0">:</span>
                  {isLoading ? (
                    <Skeleton className="h-6 w-24" />
                  ) : (
                    <div className="flex items-center gap-2">
                      <StatusIcon status={orderDetails?.order_status ?? ""} />
                      <StatusText status={orderDetails?.order_status ?? ""} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="grid grid-cols-[minmax(150px,_auto)_1fr] items-start gap-y-2">
              <OrderInfo
                label={t("orderValidation.storeName")}
                value={orderDetails?.store_name ?? ""}
                isLoading={isLoading}
              />
              <OrderInfo
                label={t("orderValidation.orderedBy")}
                value={`${orderDetails?.ordered_user?.firstname ?? ""} ${
                  orderDetails?.ordered_user?.lastname ?? ""
                }`}
                isLoading={isLoading}
              />
              <OrderInfo
                label={t("orderValidation.storeAddress")}
                value={orderDetails?.store_address ?? ""}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </CardContent>

      {!isLoading && (
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Button
            className="flex-1 bg-green-600 border border-green-700 hover:bg-green-600/90 h-auto group transition-all duration-200"
            aria-label={t("orderValidation.approveOrder")}
            onClick={handleApproveOrder}
            disabled={
              orderDetails?.order_status?.toLowerCase() !== "approval_pending"
            }
          >
            <CheckCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            <span className="font-label-medium font-medium text-primary-text text-base tracking-normal leading-normal">
              {t("orderValidation.approveOrder")}
            </span>
          </Button>

          <Button
            className="flex-1 bg-red-500 border border-red-600 hover:bg-red-600 text-white h-auto group transition-all duration-200"
            aria-label={t("orderValidation.rejectOrder")}
            onClick={handleRefuseOrder}
            disabled={
              orderDetails?.order_status?.toLowerCase() !== "approval_pending"
            }
          >
            <XCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            <span className="font-label-medium font-medium text-base tracking-normal leading-normal">
              {t("orderValidation.rejectOrder")}
            </span>
          </Button>
        </div>
      )}
    </Card>
  );
};

export { OrderTableHeaderSection };
