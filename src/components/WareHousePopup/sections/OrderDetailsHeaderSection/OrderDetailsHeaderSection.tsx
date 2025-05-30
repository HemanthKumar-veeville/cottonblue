import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "../../../../components/ui/card";

interface OrderDetails {
  date: string;
  client: string;
  status: string;
}

// Format date function
const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  } catch (error) {
    return "Invalid Date";
  }
};

// Format status function
const formatStatus = (status: string) => {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const DetailItem: React.FC<{
  label: string;
  value: string;
  isStatus?: boolean;
  isDate?: boolean;
}> = ({ label, value, isStatus, isDate }) => (
  <div className="mb-2">
    <dt className="inline font-bold text-[#1e2324]">{label} : </dt>
    <dd
      className={`inline ${
        isStatus ? "font-bold text-orange-500" : "text-[#1e2324]"
      }`}
    >
      {isStatus ? formatStatus(value) : isDate ? formatDate(value) : value}
    </dd>
  </div>
);

export default function OrderDetailsHeaderSection({
  order,
}: {
  order: any;
}): JSX.Element {
  const { t } = useTranslation();

  return (
    <Card className="w-full border-0 shadow-none">
      <CardContent className="p-0">
        <div className="flex flex-col gap-2">
          <dl className="text-base font-normal">
            <DetailItem
              label={t("warehouse.popup.orderInfo.date")}
              value={order?.created_at}
              isDate
            />
            <DetailItem
              label={t("warehouse.popup.orderInfo.customer")}
              value={order?.company_dns_prefix}
            />
            <DetailItem
              label={t("warehouse.popup.orderInfo.status")}
              value={order?.order_status}
              isStatus
            />
          </dl>
        </div>
      </CardContent>
    </Card>
  );
}
