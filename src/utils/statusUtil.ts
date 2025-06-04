import { TFunction } from "i18next";

export const getTicketStatusText = (status: string, t: TFunction): string => {
  const statusObject: { [key: string]: string } = {
    "open":  t("ticket_status.open"),
    "in_progress": t("ticket_status.in_progress"),
    "closed": t("ticket_status.closed"),
  };
  
  return statusObject[status];
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