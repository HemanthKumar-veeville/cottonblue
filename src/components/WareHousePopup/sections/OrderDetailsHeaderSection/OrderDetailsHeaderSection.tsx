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
  value: string | React.ReactNode;
  isStatus?: boolean;
  isDate?: boolean;
  t: TFunction;
}> = ({ label, value, isStatus, isDate, t }) => (
  <div className="mb-2 flex items-start relative">
    <dt className="font-bold text-[#1e2324] w-[150px] relative">
      <span className="inline-block">{label}</span>
      <span className="absolute right-2">:</span>
    </dt>
    <dd
      className={`${
        isStatus ? "font-bold text-orange-500" : "text-[#1e2324]"
      } flex-1 pl-2 flex items-center w-[300px] text-wrap whitespace-normal break-words overflow-hidden text-ellipsis`}
    >
      {isDate ? formatDate(value as string) : value}
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
  const { store_address, store_name, store_phone, vat_number } = useAppSelector(
    (state) => state.cart
  );
  return (
    <Card className="w-full border-0 shadow-none">
      <CardContent className="p-0">
        <div className="flex flex-row justify-between items-center">
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
            <DetailItem
              label={t("warehouse.popup.orderInfo.status")}
              value={
                <div className="flex items-center gap-2">
                  <StatusIcon status={order?.order_status} />
                  <StatusText status={order?.order_status} />
                </div>
              }
              t={t}
            />
          </dl>
          <dl className="text-base font-normal pr-10">
            <DetailItem
              label={t("warehouse.popup.orderInfo.storeName")}
              value={order?.store_name || store_name}
              t={t}
            />
            <DetailItem
              label={t("warehouse.popup.orderInfo.storeAddress")}
              value={order?.store_address || store_address}
              t={t}
            />
            <DetailItem
              label={t("warehouse.popup.orderInfo.storePhone")}
              value={order?.store_phone || store_phone}
              t={t}
            />
            <DetailItem
              label={t("warehouse.popup.orderInfo.vatNumber")}
              value={order?.vat_number || vat_number}
              t={t}
            />
          </dl>
        </div>
      </CardContent>
    </Card>
  );
}
