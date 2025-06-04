import {
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
  Truck,
  HourglassIcon,
  PackageCheck,
  PackageX,
  ShieldAlert,
  ShoppingCart,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { getOrderStatusColor } from "../../utils/statusUtil";

interface StatusIconProps {
  status: string;
  className?: string;
}

export const StatusIcon = ({
  status,
  className,
}: StatusIconProps): JSX.Element => {
  const iconMap = {
    pending: HourglassIcon,
    approved: CheckCircle2,
    rejected: XCircle,
    refused: PackageX,
    confirmed: ShoppingCart,
    processing: AlertCircle,
    shipped: Truck,
    delivered: PackageCheck,
    on_hold: ShieldAlert,
    approval_pending: Clock,
    default: Clock,
  };

  const Icon = iconMap[status as keyof typeof iconMap];

  return (
    <Icon className={cn("w-6 h-6", getOrderStatusColor(status), className)} />
  );
};
