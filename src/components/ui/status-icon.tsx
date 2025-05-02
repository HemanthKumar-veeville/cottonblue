import { CheckCircle2, AlertCircle, XCircle, Clock } from "lucide-react";
import { cn } from "../../lib/utils";

interface StatusIconProps {
  type: "success" | "warning" | "danger" | "default";
  className?: string;
}

export const StatusIcon = ({
  type,
  className,
}: StatusIconProps): JSX.Element => {
  const iconMap = {
    success: CheckCircle2,
    warning: AlertCircle,
    danger: XCircle,
    default: Clock,
  };

  const colorMap = {
    success: "text-1-tokens-color-modes-common-success-medium",
    warning: "text-1-tokens-color-modes-common-warning-medium",
    danger: "text-1-tokens-color-modes-common-danger-medium",
    default:
      "text-[color:var(--1-tokens-color-modes-input-primary-default-text)]",
  };

  const Icon = iconMap[type];

  return <Icon className={cn("w-6 h-6", colorMap[type], className)} />;
};
