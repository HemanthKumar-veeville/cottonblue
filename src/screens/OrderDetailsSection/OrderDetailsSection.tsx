import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { StatusIcon } from "../../components/ui/status-icon";
import { FileText, ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Skeleton } from "../../components/Skeleton";
import EmptyState from "../../components/EmptyState";

interface OrderItem {
  product_id: number;
  product_name: string;
  product_image: string;
  product_price: number;
  quantity: number;
}

interface Order {
  order_id: number;
  created_at: string;
  total_amount: number;
  order_status:
    | "approval_pending"
    | "confirmed"
    | "refused"
    | "shipped"
    | "in_transit"
    | "delivered";
  order_items: OrderItem[];
}

type StatusIconType = "warning" | "success" | "danger" | "default";

const paginationItems = [
  { page: 1, active: true },
  { page: 2, active: false },
  { page: 3, active: false },
  { page: 4, active: false },
  { page: 5, active: false },
  { page: 24, active: false },
];

const StatusText = ({ status, type }: { status: string; type: string }) => {
  const textColorClassMap: { [key: string]: string } = {
    approval_pending: "text-1-tokens-color-modes-common-warning-medium",
    confirmed: "text-1-tokens-color-modes-common-success-medium",
    refused: "text-1-tokens-color-modes-common-danger-medium",
    shipped: "text-1-tokens-color-modes-common-success-medium",
    in_transit: "text-1-tokens-color-modes-common-success-medium",
    delivered: "text-1-tokens-color-modes-common-success-medium",
    success: "text-1-tokens-color-modes-common-success-medium",
    warning: "text-1-tokens-color-modes-common-warning-medium",
    danger: "text-1-tokens-color-modes-common-danger-medium",
    default:
      "text-[color:var(--1-tokens-color-modes-input-primary-default-text)]",
  };
  const textColorClass = textColorClassMap[type] || textColorClassMap.default;

  return (
    <div
      className={`font-normal text-[15px] leading-normal whitespace-nowrap ${textColorClass}`}
    >
      {status
        ?.split("_")
        ?.join(" ")
        ?.replace(/_/g, " ")
        ?.replace(/\b\w/g, (char) => char.toUpperCase())}
    </div>
  );
};

const OrderRow = ({
  order,
  index,
  isSelected,
  onSelect,
}: {
  order: Order;
  index: number;
  isSelected: boolean;
  onSelect: (orderId: number) => void;
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Format date
  const formattedDate = order?.created_at
    ? new Date(order.created_at).toLocaleDateString()
    : "";

  const statusIcon: Record<Order["order_status"] | "default", StatusIconType> =
    {
      approval_pending: "warning",
      confirmed: "success",
      refused: "danger",
      shipped: "success",
      in_transit: "success",
      delivered: "success",
      default: "default",
    };

  return (
    <TableRow key={index} className="border-b border-primary-neutal-300">
      <TableCell className="w-11 py-3 px-2 align-middle">
        <Checkbox
          className="w-5 h-5 rounded border-[1.5px] border-solid border-1-tokens-color-modes-common-neutral-medium"
          checked={isSelected}
          onCheckedChange={() => onSelect(order.order_id)}
        />
      </TableCell>
      <TableCell className="w-[129px] p-2.5 text-left align-middle">
        <span
          className={`font-normal ${
            index === 0 ? "text-coolgray-100" : "text-[#121619]"
          } text-[15px] tracking-[0] leading-normal whitespace-nowrap`}
        >
          {order?.order_id}
        </span>
      </TableCell>
      <TableCell className="w-[145px] p-2.5 text-left align-middle">
        <span className="font-normal text-black text-[15px] tracking-[0] leading-normal whitespace-nowrap">
          {formattedDate}
        </span>
      </TableCell>
      <TableCell className="w-[145px] p-2.5 text-left align-middle">
        <span className="font-normal text-black text-[15px] tracking-[0] leading-normal whitespace-nowrap">
          {order?.total_amount}€
        </span>
      </TableCell>
      <TableCell className="w-[145px] p-2.5 align-middle">
        <div className="flex items-center gap-2">
          <StatusIcon type={statusIcon[order?.order_status]} />
          <StatusText
            status={t(order?.order_status)}
            type={order?.order_status}
          />
        </div>
      </TableCell>
      <TableCell className="w-[69px] p-2.5 text-left align-middle">
        <FileText className="inline-block w-4 h-4" />
      </TableCell>
      <TableCell className="w-[145px] p-2.5 text-right align-middle">
        <Button
          variant="ghost"
          className="p-0 underline font-medium text-[color:var(--1-tokens-color-modes-button-ghost-default-text)]"
          onClick={() => navigate(`/order-details/${order?.order_id}`)}
        >
          {t("history.table.details")}
        </Button>
      </TableCell>
    </TableRow>
  );
};

export const OrderDetailsSection = (): JSX.Element => {
  const { t } = useTranslation();
  const orders = useSelector((state: any) => state.cart.orders);
  const loading = useSelector((state: any) => state.cart.loading);
  const error = useSelector((state: any) => state.cart.error);
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);

  const orderList = orders?.orders || [];

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(orderList.map((order: Order) => order.order_id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId: number) => {
    setSelectedOrders((prev) => {
      if (prev.includes(orderId)) {
        return prev.filter((id) => id !== orderId);
      } else {
        return [...prev, orderId];
      }
    });
  };

  if (loading) {
    return <Skeleton variant="table" />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!orderList.length) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        <EmptyState
          icon={ShoppingBag}
          title={t("history.empty.title") || "No Orders Yet"}
          description={
            t("history.empty.description") ||
            "You haven't placed any orders yet. Start shopping to see your order history here."
          }
          className="max-w-md"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-auto pb-24">
        <Table className="bg-white rounded-[var(--2-tokens-screen-modes-common-spacing-XS)]">
          <TableHeader className="bg-[#eaf8e7] rounded-md">
            <TableRow>
              <TableHead className="w-11 p-2.5 align-middle">
                <Checkbox
                  className="w-5 h-5 rounded border-[1.5px] border-solid border-1-tokens-color-modes-common-neutral-medium"
                  checked={
                    selectedOrders.length === orderList.length &&
                    orderList.length > 0
                  }
                  onCheckedChange={(checked: boolean | "indeterminate") =>
                    handleSelectAll(checked === true)
                  }
                />
              </TableHead>
              {[
                t("history.table.order"),
                t("history.table.date"),
                t("history.table.totalPrice"),
                t("history.table.status"),
                t("history.table.invoice"),
                t("history.table.details"),
              ].map((header, index) => (
                <TableHead
                  key={index}
                  className={`w-[${index === 4 ? 69 : 145}px] p-2.5 ${
                    index === 5 ? "text-right" : "text-left"
                  } align-middle`}
                >
                  <span className="font-text-small text-[#1e2324] text-[length:var(--text-small-font-size)] tracking-[var(--text-small-letter-spacing)] leading-[var(--text-small-line-height)]">
                    {header}
                  </span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList?.map((order: Order, index: number) => (
              <OrderRow
                key={order?.order_id}
                order={order}
                index={index}
                isSelected={selectedOrders.includes(order.order_id)}
                onSelect={handleSelectOrder}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-primary-neutal-300 py-4">
        <div className="px-6 max-w-[calc(100%-2rem)]">
          <Pagination className="flex items-center justify-between w-full mx-auto">
            <PaginationPrevious
              href="#"
              className="h-[42px] bg-white rounded-lg shadow-1dp-ambient flex items-center gap-1 pl-2 pr-3 py-2.5 font-medium text-black text-[15px]"
            >
              <img
                className="w-6 h-6"
                alt="Arrow left"
                src="/img/arrow-left-sm.svg"
              />
              {t("history.table.previous")}
            </PaginationPrevious>

            <PaginationContent className="flex items-center gap-3">
              {paginationItems.map((item, index) => (
                <React.Fragment key={index}>
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      className={`flex items-center justify-center w-9 h-9 rounded ${
                        item.active
                          ? "bg-cyan-100 font-bold text-[#1e2324]"
                          : "border border-solid border-primary-neutal-300 font-medium text-[#023337]"
                      }`}
                    >
                      {item.page}
                    </PaginationLink>
                  </PaginationItem>
                  {index === paginationItems.length - 2 && (
                    <PaginationItem>
                      <PaginationEllipsis className="w-9 h-9 flex items-center justify-center rounded border border-solid border-primary-neutal-300 font-bold text-[#023337]" />
                    </PaginationItem>
                  )}
                </React.Fragment>
              ))}
            </PaginationContent>

            <PaginationNext
              href="#"
              className="h-[42px] bg-white rounded-lg shadow-1dp-ambient flex items-center gap-1 pl-2 pr-3 py-2.5 font-medium text-black text-[15px]"
            >
              {t("history.table.next")}
              <img
                className="w-6 h-6 rotate-180"
                alt="Arrow right"
                src="/img/arrow-left-sm-1.svg"
              />
            </PaginationNext>
          </Pagination>
        </div>
      </div>
    </div>
  );
};
