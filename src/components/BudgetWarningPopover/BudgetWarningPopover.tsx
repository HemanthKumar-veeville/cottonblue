import React from "react";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { formatCurrency } from "../../utils/statusUtil";
import { Card } from "../ui/card";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { approveOrder } from "../../store/features/cartSlice";
import { getHost } from "../../utils/hostUtils";
import { useNavigate } from "react-router-dom";
import { getStoreBudget } from "../../store/features/agencySlice";

interface BudgetWarningPopoverProps {
  currentMonthAmount: number;
  monthlyExpenseLimit: number;
  orderTotal: number;
  currentMonthOrders: number;
  monthlyOrderLimit: number;
  onClose?: () => void;
  checkBudgetLimits: () => boolean;
  checkOrderLimits: () => boolean;
  orderId?: string;
}

export const BudgetWarningPopover: React.FC<BudgetWarningPopoverProps> = ({
  currentMonthAmount,
  monthlyExpenseLimit,
  orderTotal,
  onClose,
  currentMonthOrders,
  monthlyOrderLimit,
  checkBudgetLimits,
  checkOrderLimits,
  orderDetails,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const dns_prefix = getHost();
  const remainingBudget = monthlyExpenseLimit - currentMonthAmount;
  const exceedAmount = orderTotal - remainingBudget;
  const { selectedStore } = useAppSelector((state) => state.agency);
  const handleProceed = async () => {
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

  return (
    <Card className="w-full max-w-md mx-auto bg-white">
      <div className="flex flex-col items-center justify-center p-6">
        <div className="text-center mb-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            {t("budget.warning.title")}
          </h2>
          <p className="text-sm text-gray-600">{t("budget.warning.message")}</p>
        </div>

        <div className="w-full space-y-4 text-sm text-gray-600">
          {checkBudgetLimits() && (
            <>
              <div className="flex justify-between">
                <span>{t("budget.currentMonth")}:</span>
                <span className="font-medium">
                  {formatCurrency(currentMonthAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t("budget.monthlyLimit")}:</span>
                <span className="font-medium">
                  {formatCurrency(monthlyExpenseLimit)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t("budget.orderTotal")}:</span>
                <span className="font-medium">
                  {formatCurrency(orderTotal)}
                </span>
              </div>
              <div className="flex justify-between text-red-600 font-medium">
                <span>{t("budget.exceedAmount")}:</span>
                <span>{formatCurrency(exceedAmount)}</span>
              </div>
            </>
          )}
          {checkOrderLimits() && (
            <>
              <div className="flex justify-between">
                <span>{t("budget.currentMonthOrders")}:</span>
                <span className="font-medium">{currentMonthOrders}</span>
              </div>
              <div className="flex justify-between">
                <span>{t("budget.monthlyOrderLimit")}:</span>
                <span className="font-medium">{monthlyOrderLimit}</span>
              </div>
              <div className="flex justify-between text-red-600 font-medium">
                <span>{t("budget.exceedOrderLimit")}</span>
              </div>
            </>
          )}
        </div>

        <div className="mt-6 flex gap-3 w-full">
          <Button
            className="flex-1 bg-red-500 border border-red-600 hover:bg-red-600 text-white h-auto group transition-all duration-200"
            onClick={onClose}
          >
            <XCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            <span className="font-label-medium font-medium text-base tracking-normal leading-normal">
              {t("common.cancel")}
            </span>
          </Button>
          <Button
            className="flex-1 bg-green-600 border border-green-700 hover:bg-green-600/90 h-auto group transition-all duration-200"
            onClick={handleProceed}
          >
            <CheckCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            <span className="font-label-medium font-medium text-primary-text text-base tracking-normal leading-normal">
              {t("common.proceed")}
            </span>
          </Button>
        </div>
      </div>
    </Card>
  );
};
