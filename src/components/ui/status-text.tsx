import { useTranslation } from "react-i18next";
import { getOrderStatusColor } from "../../utils/statusUtil";

export const StatusText = ({ status }: { status: string }) => {
  const { t } = useTranslation();

  return (
    <div
      className={`font-normal text-[15px] leading-normal whitespace-nowrap ${getOrderStatusColor(
        status
      )}`}
    >
      {t(`order_status.${status}`)}
    </div>
  );
};
