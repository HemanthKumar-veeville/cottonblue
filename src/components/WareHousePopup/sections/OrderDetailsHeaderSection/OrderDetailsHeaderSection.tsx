import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "../../../../components/ui/card";

interface OrderDetails {
  date: string;
  client: string;
  status: string;
}

const orderDetails: OrderDetails = {
  date: "18/05/2025",
  client: "Sophie Martin",
  status: "En attente",
};

const DetailItem: React.FC<{
  label: string;
  value: string;
  isStatus?: boolean;
}> = ({ label, value, isStatus }) => (
  <div className="mb-2">
    <dt className="inline font-bold text-[#1e2324]">{label} : </dt>
    <dd
      className={`inline ${
        isStatus ? "font-bold text-orange-500" : "text-[#1e2324]"
      }`}
    >
      {value}
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
