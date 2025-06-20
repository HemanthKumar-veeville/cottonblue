import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "../../../../components/ui/card";
import { TFunction } from "i18next";
import { StatusIcon } from "../../../../components/ui/status-icon";
import { StatusText } from "../../../../components/ui/status-text";
import { useAppSelector } from "../../../../store/store";

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

const DetailItem: React.FC<{
  label: string;
  value: string;
  isStatus?: boolean;
  isDate?: boolean;
  t: TFunction;
}> = ({ label, value, isStatus, isDate, t }) => (
  <div className="mb-2">
    <dt className="inline font-bold text-[#1e2324]">{label} : </dt>
    <dd
      className={`inline ${
        isStatus ? "font-bold text-orange-500" : "text-[#1e2324]"
      }`}
    >
      {isDate ? formatDate(value) : value}
    </dd>
  </div>
);

export default function OrderDetailsHeaderSection({
  order,
}: {
  order: any;
}): JSX.Element {
  const { t } = useTranslation();
  const { selectedCompany } = useAppSelector((state) => state.client);
  const dns = selectedCompany?.dns || "admin";

  return (
    <Card className="w-full border-0 shadow-none">
      <CardContent className="p-0">
        <div className="flex flex-col gap-2">
          <dl className="text-base font-normal">
            <DetailItem
              label={t("warehouse.popup.orderInfo.date")}
              value={order?.created_at}
              isDate
              t={t}
            />
            <DetailItem
              label={t("warehouse.popup.orderInfo.customer")}
              value={order?.company_dns_prefix || dns}
              t={t}
            />
            <div className="flex items-center gap-2">
              <StatusIcon status={order?.order_status} />
              <StatusText status={order?.order_status} />
            </div>
          </dl>
        </div>
      </CardContent>
    </Card>
  );
}
