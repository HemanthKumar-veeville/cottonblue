import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../components/ui/button";
import { PackageIcon, TruckIcon, XIcon } from "lucide-react";

interface ActionButton {
  translationKey: string;
  icon: React.ReactNode;
  variant: "prepare" | "complete" | "cancel";
}

const ActionButtonSection = (): JSX.Element => {
  const { t } = useTranslation();

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

  return (
    <div className="flex items-center gap-3">
      {actionButtons.map((button, index) => (
        <Button
          key={index}
          variant="outline"
          size="default"
          className={getButtonStyles(button.variant)}
        >
          {button.icon}
          <span>{t(button.translationKey)}</span>
        </Button>
      ))}
    </div>
  );
};

export default ActionButtonSection;
