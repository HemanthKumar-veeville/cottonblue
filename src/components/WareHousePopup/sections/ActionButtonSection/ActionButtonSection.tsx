import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../components/ui/button";
import { Loader, PackageIcon, TruckIcon, XIcon } from "lucide-react";
import { changeOrderStatus } from "../../../../store/features/cartSlice";
import { useAppDispatch, useAppSelector } from "../../../../store/store";

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

  const handleStatusChange = (orderIds: number[], status: string) => {
    if (dns_prefix) {
      dispatch(
        changeOrderStatus({
          dns_prefix,
          status,
          order_ids: orderIds.map((id) => parseInt(id)),
        })
      );
    }
  };

  const handleAction = (variant: ActionButton["variant"]) => {
    if (variant === "prepare") {
      handleStatusChange([orderId], "processing");
    } else if (variant === "complete") {
      handleStatusChange([orderId], "shipped");
    } else if (variant === "cancel") {
      handleStatusChange([orderId], "on_hold");
    }
  };

  return (
    <div className="flex items-center gap-3 justify-center  mx-auto">
      {actionButtons.map((button, index) => (
        <Button
          key={index}
          variant="outline"
          size="default"
          className={getButtonStyles(button.variant)}
          onClick={() => handleAction(button.variant)}
          disabled={isLoading}
        >
          {button.icon}
          <span>{t(button.translationKey)}</span>
        </Button>
      ))}
    </div>
  );
};

export default ActionButtonSection;
