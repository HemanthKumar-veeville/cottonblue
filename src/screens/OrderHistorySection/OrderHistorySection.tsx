import { DownloadIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";

const Heading = ({ text }: { text: string }) => (
  <h3 className="text-[length:var(--heading-h3-font-size)] font-heading-h3 font-[number:var(--heading-h3-font-weight)] text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] tracking-[var(--heading-h3-letter-spacing)] leading-[var(--heading-h3-line-height)] [font-style:var(--heading-h3-font-style)]">
    {text}
  </h3>
);

const DownloadButton = ({
  label,
  disabled,
  onClick,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
}) => (
  <Button
    className="bg-[#00b85b] hover:bg-[#00a050] border border-[#1a8563] text-white"
    disabled={disabled}
    onClick={onClick}
  >
    <DownloadIcon className="mr-2 h-4 w-4" />
    {label}
  </Button>
);

export const OrderHistorySection = (): JSX.Element => {
  const { t } = useTranslation();
  const orders = useSelector((state: any) => state.cart.orders);
  const loading = useSelector((state: any) => state.cart.loading);

  const orderList = orders?.orders || [];

  const handleDownloadOrders = () => {
    // Prepare data for export
    const exportData = orderList.map((order: any) => {
      // Calculate total price for the order
      const totalPrice = order.order_items.reduce(
        (sum: number, item: any) => sum + (item.product_price * item.quantity),
        0
      );

      // Format date
      const formattedDate = order.created_at
        ? new Date(order.created_at).toLocaleDateString()
        : "";

      // Create row data
      return {
        "Order ID": order.order_id,
        "Date": formattedDate,
        "Store Name": order.store_name,
        "Store Address": order.store_address,
        "Total Price": totalPrice,
        "Status": order.order_status
          .split("_")
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        "Items": order.order_items
          .map((item: any) => `${item.product_name} (${item.quantity}x)`)
          .join(", "),
      };
    });

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Set column widths
    const colWidths = [
      { wch: 10 }, // Order ID
      { wch: 12 }, // Date
      { wch: 20 }, // Store Name
      { wch: 30 }, // Store Address
      { wch: 12 }, // Total Price
      { wch: 15 }, // Status
      { wch: 50 }, // Items
    ];
    ws["!cols"] = colWidths;

    // Create workbook and append worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");

    // Generate timestamp for filename
    const timestamp = new Date().toISOString().split("T")[0];

    // Save file
    XLSX.writeFile(wb, `orders_${timestamp}.xlsx`);
  };

  return (
    <header className="flex items-center justify-between w-full">
      <Heading text={t("history.title")} />
      <DownloadButton
        label={t("history.downloadSelectedInvoices")}
        disabled={loading || !orderList?.length}
        onClick={handleDownloadOrders}
      />
    </header>
  );
};
