import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../components/ui/button";
import { Loader, XIcon, CheckIcon } from "lucide-react";
import { changeOrderStatus } from "../../../../store/features/cartSlice";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import { ConfirmationDialog } from "../../../../components/ui/ConfirmationDialog";

interface ActionButtonProps {
  orderId: number;
  isLoading: boolean;
  orderStatus: string;
}

const ActionButtonSection = ({
  orderId,
  isLoading,
  orderStatus,
}: ActionButtonProps): JSX.Element => {
  const { t } = useTranslation();
  const { selectedCompany } = useAppSelector((state) => state.client);
  const dns_prefix = selectedCompany?.dns;
  const dispatch = useAppDispatch();

  // Add state for confirmation dialog
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: "confirm" | "hold" | null;
  }>({
    isOpen: false,
    type: null,
  });

  const getButtonConfig = () => {
    if (orderStatus === "confirmed") {
      return {
        translationKey: "warehouse.popup.actions.hold",
        icon: <XIcon className="h-4 w-4" />,
        variant: "hold" as const,
        style:
          "text-amber-600 border-amber-600 hover:bg-amber-50 hover:text-amber-600",
      };
    }
    return {
      translationKey: "warehouse.popup.actions.confirm",
      icon: <CheckIcon className="h-4 w-4" />,
      variant: "confirm" as const,
      style:
        "text-green-600 border-green-600 hover:bg-green-50 hover:text-green-600",
    };
  };

  const handleStatusChange = async (orderIds: number[], status: string) => {
    if (dns_prefix) {
      await dispatch(
        changeOrderStatus({
          dns_prefix,
          status,
          order_ids: orderIds.map(Number),
        })
      );
    }
  };

  const handleAction = (variant: "confirm" | "hold") => {
    setConfirmDialog({
      isOpen: true,
      type: variant,
    });
  };

  const handleConfirmAction = () => {
    if (!confirmDialog.type) return;

    const status = confirmDialog.type === "hold" ? "on_hold" : "confirmed";
    handleStatusChange([orderId], status);
    setConfirmDialog({ isOpen: false, type: null });
  };

  const handleCancelDialog = () => {
    setConfirmDialog({ isOpen: false, type: null });
  };

  const getConfirmationMessage = () => {
    switch (confirmDialog.type) {
      case "hold":
        return t("warehouse.confirmation.cancelSingle", { orderId });
      case "confirm":
        return t("warehouse.confirmation.confirmSingle", { orderId });
      default:
        return "";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Loader className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  const buttonConfig = getButtonConfig();

  return (
    <>
      <div className="flex gap-4">
        <Button
          variant="outline"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${buttonConfig.style}`}
          onClick={() => handleAction(buttonConfig.variant)}
        >
          {buttonConfig.icon}
          {t(buttonConfig.translationKey)}
        </Button>
      </div>

      <ConfirmationDialog
        open={confirmDialog.isOpen}
        title={t("warehouse.confirmation.title")}
        message={getConfirmationMessage()}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelDialog}
        confirmText={t("common.confirm")}
        cancelText={t("common.cancel")}
      />
    </>
  );
};

export default ActionButtonSection;
