import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../components/ui/button";
import { Loader, PackageIcon, TruckIcon, XIcon } from "lucide-react";
import { changeOrderStatus } from "../../../../store/features/cartSlice";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import { ConfirmationDialog } from "../../../../components/ui/ConfirmationDialog";

interface ActionButton {
  translationKey: string;
  icon: React.ReactNode;
  variant: "prepare" | "complete" | "cancel";
}

const ActionButtonSection = ({
  orderId,
  isLoading,
}: {
  orderId: number;
  isLoading: boolean;
}): JSX.Element => {
  const { t } = useTranslation();
  const { selectedCompany } = useAppSelector((state) => state.client);
  const dns_prefix = selectedCompany?.dns;
  const dispatch = useAppDispatch();

  // Add state for confirmation dialog
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: ActionButton["variant"] | null;
  }>({
    isOpen: false,
    type: null,
  });

  const actionButtons: ActionButton[] = [
    {
      translationKey: "warehouse.popup.actions.prepare",
      icon: <PackageIcon className="h-4 w-4" />,
      variant: "prepare",
    },
    {
      translationKey: "warehouse.popup.actions.complete",
      icon: <TruckIcon className="h-4 w-4" />,
      variant: "complete",
    },
    {
      translationKey: "warehouse.popup.actions.cancel",
      icon: <XIcon className="h-4 w-4" />,
      variant: "cancel",
    },
  ];

  const getButtonStyles = (variant: ActionButton["variant"]) => {
    const baseStyles =
      "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200";

    switch (variant) {
      case "prepare":
        return `${baseStyles} text-amber-600 border-amber-600 hover:bg-amber-50 hover:text-amber-600`;
      case "complete":
        return `${baseStyles} text-green-600 border-green-600 hover:bg-green-50 hover:text-green-600`;
      case "cancel":
        return `${baseStyles} text-red-600 border-red-600 hover:bg-red-50 hover:text-red-600`;
      default:
        return baseStyles;
    }
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

  const handleAction = (variant: ActionButton["variant"]) => {
    setConfirmDialog({
      isOpen: true,
      type: variant,
    });
  };

  const handleConfirmAction = () => {
    if (!confirmDialog.type) return;

    const statusMap = {
      prepare: "processing",
      complete: "shipped",
      cancel: "on_hold",
    };

    handleStatusChange([orderId], statusMap[confirmDialog.type]);
    setConfirmDialog({ isOpen: false, type: null });
  };

  const handleCancelDialog = () => {
    setConfirmDialog({ isOpen: false, type: null });
  };

  const getConfirmationMessage = () => {
    switch (confirmDialog.type) {
      case "prepare":
        return t("warehouse.confirmation.prepareSingle", { orderId });
      case "complete":
        return t("warehouse.confirmation.completeSingle", { orderId });
      case "cancel":
        return t("warehouse.confirmation.cancelSingle", { orderId });
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

  return (
    <>
      <div className="flex gap-4">
        {actionButtons.map((button) => (
          <Button
            key={button.variant}
            variant="outline"
            className={getButtonStyles(button.variant)}
            onClick={() => handleAction(button.variant)}
          >
            {button.icon}
            {t(button.translationKey)}
          </Button>
        ))}
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
