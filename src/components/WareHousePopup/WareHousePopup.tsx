import { XIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { useTranslation } from "react-i18next";
import ActionButtonSection from "./sections/ActionButtonSection/ActionButtonSection";
import OrderDetailsHeaderSection from "./sections/OrderDetailsHeaderSection/OrderDetailsHeaderSection";
import OrderSummaryHeaderSection from "./sections/OrderSummaryHeaderSection/OrderSummaryHeaderSection";
import { Separator } from "../ui/separator";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

interface PopupOrderProps {
  orderId: number;
  onClose: () => void;
  open: boolean;

  isLoading?: boolean;
}

const CloseButton = ({ onClose }: { onClose: () => void }) => (
  <Button
    variant="ghost"
    size="icon"
    className="w-8 h-8 p-0.5"
    onClick={onClose}
  >
    <XIcon className="w-6 h-6" />
  </Button>
);

const PopupOrderHeader = ({
  orderId,
  onClose,
}: {
  orderId: number;
  onClose: () => void;
}) => {
  const { t } = useTranslation();
  return (
    <DialogHeader className="flex flex-row items-center justify-between p-0 space-y-0">
      <DialogTitle className="font-['Montserrat',Helvetica] font-bold text-1-tokens-color-modes-common-neutral-hightest text-base">
        {t("warehouse.popup.orderDetails", { orderId })}
      </DialogTitle>
    </DialogHeader>
  );
};

export const PopupOrder = ({
  orderId,
  onClose,
  open,
  isLoading = false,
}: PopupOrderProps): JSX.Element => {
  const { orders } = useSelector((state: RootState) => state.cart);
  const order = orders.find((order) => order.order_id === orderId);
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent
        className="flex flex-col gap-4 p-8 bg-white max-w-full w-auto"
        data-model-id="3548:17449"
      >
        <PopupOrderHeader orderId={orderId} onClose={onClose} />
        <OrderDetailsHeaderSection order={order} />
        <Separator className="bg-gray-200" />
        <OrderSummaryHeaderSection
          products={order?.order_items}
          totalAmount={order?.total_amount}
        />
        <Separator className="bg-gray-200" />
        <div className="flex justify-end">
          <ActionButtonSection orderId={orderId} isLoading={isLoading} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
