import { TFunction } from "i18next";

export const getTicketStatusText = (status: string, t: TFunction): string => {
  return t(`ticket_status.${status}`);
};

export const getOrderStatusText = (status: string, t: TFunction): string => {
  return t(`order_status.${status}`);
};

export const getTicketStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "border-blue-200 text-blue-700 bg-blue-50/50 hover:bg-blue-100/50";
      case "in_progress":
        return "border-amber-200 text-amber-700 bg-amber-50/50 hover:bg-amber-100/50";
      case "closed":
        return "border-emerald-200 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-100/50";
      default:
        return "border-gray-200 text-gray-700 bg-gray-50/50 hover:bg-gray-100/50";
    }
  };

export const getOrderStatusColor = (status: string): string => {
    switch (status?.toLowerCase()) {
        case "pending":
            return "border-yellow-200 text-yellow-700 bg-yellow-50/50 hover:bg-yellow-100/50";
        case "approved":
            return "border-emerald-200 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-100/50";
        case "rejected":
            return "border-red-200 text-red-700 bg-red-50/50 hover:bg-red-100/50";
        case "refused":
            return "border-rose-200 text-rose-700 bg-rose-50/50 hover:bg-rose-100/50";
        case "confirmed":
            return "border-blue-200 text-blue-700 bg-blue-50/50 hover:bg-blue-100/50";
        case "processing":
            return "border-amber-200 text-amber-700 bg-amber-50/50 hover:bg-amber-100/50";
        case "shipped":
            return "border-indigo-200 text-indigo-700 bg-indigo-50/50 hover:bg-indigo-100/50";
        case "delivered":
            return "border-green-200 text-green-700 bg-green-50/50 hover:bg-green-100/50";
        case "on_hold":
            return "border-purple-200 text-purple-700 bg-purple-50/50 hover:bg-purple-100/50";
        case "approval_pending":
            return "border-cyan-200 text-cyan-700 bg-cyan-50/50 hover:bg-cyan-100/50";
        case "pending_approval":
            return "border-gray-200 text-gray-700 bg-gray-50/50 hover:bg-gray-100/50";
        default:
            return "border-gray-200 text-gray-700 bg-gray-50/50 hover:bg-gray-100/50";
    }
};

