import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Checkbox } from "../../components/ui/checkbox";
import { StatusIcon } from "../../components/ui/status-icon";
import { DownloadIcon, FileText, SearchIcon, ShoppingBag } from "lucide-react";
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
import ErrorState from "../../components/ErrorState";
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
  store_id: number;
  store_name: string;
  store_address: string;
  created_at: string;
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

const Heading = ({ text }: { text: string }) => (
  <h3 className="text-[length:var(--heading-h3-font-size)] font-heading-h3 font-[number:var(--heading-h3-font-weight)] text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] tracking-[var(--heading-h3-letter-spacing)] leading-[var(--heading-h3-line-height)] [font-style:var(--heading-h3-font-style)]">
    {text}
  </h3>
);

const DownloadButton = ({
  label,
  disabled,
}: {
  label: string;
  disabled: boolean;
}) => (
  <Button
    variant="ghost"
    className="flex items-center gap-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-gap)]"
    disabled={disabled}
  >
    <span className="text-[length:var(--label-small-font-size)] leading-[var(--label-small-line-height)] font-label-small font-[number:var(--label-small-font-weight)] text-[color:var(--1-tokens-color-modes-button-ghost-default-text)] tracking-[var(--label-small-letter-spacing)] [font-style:var(--label-small-font-style)]">
      {label}
    </span>
    <DownloadIcon className="w-4 h-4" />
  </Button>
);

const StatusText = ({ status, type }: { status: string; type: string }) => {
  const textColorClassMap: { [key: string]: string } = {
    approval_pending: "text-1-tokens-color-modes-common-warning-medium",
    confirmed: "text-1-tokens-color-modes-common-success-medium",
    refused: "text-1-tokens-color-modes-common-danger-medium",
    shipped: "text-1-tokens-color-modes-common-success-medium",
    in_transit: "text-1-tokens-color-modes-common-success-medium",
    delivered: "text-1-tokens-color-modes-common-success-medium",
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

const OrderRow = ({ order, index }: { order: Order; index: number }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Calculate total price for the order
  const totalPrice = order?.order_items?.reduce(
    (sum: number, item: OrderItem) => {
      return sum + (item?.product_price ?? 0) * (item?.quantity ?? 0);
    },
    0
  );

  // Format date
  const formattedDate = order?.created_at
    ? new Date(order.created_at).toLocaleDateString()
    : t("common.notAvailable");

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
    <TableRow
      key={index}
      className="border-b border-primary-neutal-300 py-[var(--2-tokens-screen-modes-common-spacing-XS)]"
    >
      <TableCell className="w-11">
        <div className="flex justify-center">
          <Checkbox className="w-5 h-5 bg-color-white rounded border-[1.5px] border-solid border-1-tokens-color-modes-common-neutral-medium" />
        </div>
      </TableCell>
      <TableCell className="w-[129px] text-left">
        <span className="font-text-smaller text-coolgray-100">
          {order?.order_id ?? t("common.notAvailable")}
        </span>
      </TableCell>
      <TableCell className="w-[145px] text-left">
        <span className="font-text-smaller text-black">{formattedDate}</span>
      </TableCell>
      <TableCell className="w-[145px] text-left">
        <span className="font-text-smaller text-black">
          {order?.store_name}
        </span>
      </TableCell>
      <TableCell className="w-[145px] text-left">
        <span className="font-text-smaller text-black">
          {totalPrice ?? t("common.notAvailable")}
        </span>
      </TableCell>
      <TableCell className="w-[145px] text-left">
        <div className="flex items-center gap-2">
          <StatusIcon type={statusIcon[order?.order_status ?? "default"]} />
          <StatusText
            status={order?.order_status ?? ""}
            type={order?.order_status ?? "default"}
          />
        </div>
      </TableCell>
      <TableCell className="w-[69px] text-left">
        <FileText className="inline-block w-4 h-4" />
      </TableCell>
      <TableCell className="w-[145px] text-left">
        <Button
          variant="link"
          onClick={() =>
            navigate(`/order-details/${order?.store_id}/${order?.order_id}`)
          }
          disabled={!order?.order_id}
          className="text-[color:var(--1-tokens-color-modes-button-ghost-default-text)] font-text-small underline"
        >
          {t("history.superAdmin.orderHistory.table.details")}
        </Button>
      </TableCell>
    </TableRow>
  );
};

const paginationItems = [
  { page: 1, active: true },
  { page: 2, active: false },
  { page: 3, active: false },
  { page: 4, active: false },
  { page: 5, active: false },
  { page: 24, active: false },
];

export const SuperAdminOrderHistorySection = (): JSX.Element => {
  const { t } = useTranslation();
  const orders = useSelector((state: any) => state.cart.orders);
  const loading = useSelector((state: any) => state.cart.loading);
  const error = useSelector((state: any) => state.cart.error);
  const [searchQuery, setSearchQuery] = useState("");
  console.log({ orders });
  const orderList = orders ?? [];

  if (loading) {
    return <Skeleton variant="table" />;
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        variant="inline"
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (orderList.length === 0) {
    return (
      <section className="flex flex-col gap-[var(--2-tokens-screen-modes-common-spacing-m)] w-full">
        <header>
          <h3 className="font-heading-h3 text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] text-[length:var(--heading-h3-font-size)] tracking-[var(--heading-h3-letter-spacing)] leading-[var(--heading-h3-line-height)] font-[number:var(--heading-h3-font-weight)] [font-style:var(--heading-h3-font-style)]">
            {t("history.superAdmin.orderHistory.title")}
          </h3>
        </header>
        <div className="flex items-center justify-between w-full">
          <div className="relative w-[400px]">
            <Input
              className="pl-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-h)] pr-12 py-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-v)] bg-[color:var(--1-tokens-color-modes-input-primary-default-background)] border-[color:var(--1-tokens-color-modes-input-primary-default-border)] rounded-[var(--2-tokens-screen-modes-input-border-radius)]"
              placeholder={t(
                "history.superAdmin.orderHistory.search.placeholder"
              )}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-line-height)] h-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-line-height)]">
              <SearchIcon className="w-5 h-5 text-[color:var(--1-tokens-color-modes-input-primary-default-icon)]" />
            </div>
          </div>
          <Button
            className="flex items-center gap-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-gap)] py-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-h)] px-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-v)] min-w-[92px] bg-[#07515f] rounded-[var(--2-tokens-screen-modes-nav-tab-border-radius)]"
            disabled={true}
          >
            <span className="font-label-smaller text-[length:var(--label-smaller-font-size)] leading-[var(--label-smaller-line-height)] tracking-[var(--label-smaller-letter-spacing)] font-[number:var(--label-smaller-font-weight)] text-[color:var(--1-tokens-color-modes-button-primary-default-text)] [font-style:var(--label-smaller-font-style)]">
              {t("history.superAdmin.orderHistory.downloadSelectedInvoices")}
            </span>
            <DownloadIcon className="w-6 h-6" />
          </Button>
        </div>
        <div className="flex-grow flex items-center justify-center min-h-[400px] bg-white rounded-lg">
          <EmptyState
            icon={ShoppingBag}
            title={
              t("history.superAdmin.orderHistory.empty.title") ||
              "No Orders Found"
            }
            description={
              searchQuery
                ? t(
                    "history.superAdmin.orderHistory.empty.searchDescription"
                  ) ||
                  "No orders match your search criteria. Try adjusting your search terms."
                : t("history.superAdmin.orderHistory.empty.description") ||
                  "There are no orders in the system yet."
            }
            className="max-w-md"
          />
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-[var(--2-tokens-screen-modes-common-spacing-m)] w-full">
      <header>
        <h3 className="font-heading-h3 text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] text-[length:var(--heading-h3-font-size)] tracking-[var(--heading-h3-letter-spacing)] leading-[var(--heading-h3-line-height)] font-[number:var(--heading-h3-font-weight)] [font-style:var(--heading-h3-font-style)]">
          {t("history.superAdmin.orderHistory.title")}
        </h3>
      </header>

      <div className="flex items-center justify-between w-full">
        <div className="relative w-[400px]">
          <Input
            className="pl-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-h)] pr-12 py-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-v)] bg-[color:var(--1-tokens-color-modes-input-primary-default-background)] border-[color:var(--1-tokens-color-modes-input-primary-default-border)] rounded-[var(--2-tokens-screen-modes-input-border-radius)]"
            placeholder={t(
              "history.superAdmin.orderHistory.search.placeholder"
            )}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-line-height)] h-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-line-height)]">
            <SearchIcon className="w-5 h-5 text-[color:var(--1-tokens-color-modes-input-primary-default-icon)]" />
          </div>
        </div>

        <Button
          className="flex items-center gap-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-gap)] py-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-h)] px-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-v)] min-w-[92px] bg-[#07515f] rounded-[var(--2-tokens-screen-modes-nav-tab-border-radius)]"
          disabled={loading || !orderList?.length}
        >
          <span className="font-label-smaller text-[length:var(--label-smaller-font-size)] leading-[var(--label-smaller-line-height)] tracking-[var(--label-smaller-letter-spacing)] font-[number:var(--label-smaller-font-weight)] text-[color:var(--1-tokens-color-modes-button-primary-default-text)] [font-style:var(--label-smaller-font-style)]">
            {t("history.superAdmin.orderHistory.downloadSelectedInvoices")}
          </span>
          <DownloadIcon className="w-6 h-6" />
        </Button>
      </div>

      <div className="flex flex-col h-screen">
        <div className="flex-grow overflow-auto pb-24">
          <Table className="w-full">
            <TableHeader className="bg-1-tokens-color-modes-common-primary-brand-lower rounded-md">
              <TableRow>
                <TableHead className="w-11">
                  <div className="flex justify-center">
                    <Checkbox className="w-5 h-5 bg-color-white rounded border-[1.5px] border-solid border-1-tokens-color-modes-common-neutral-medium" />
                  </div>
                </TableHead>
                {[
                  "table.order",
                  "table.date",
                  "table.store",
                  "table.totalPrice",
                  "table.status",
                  "table.invoice",
                  "table.details",
                ].map((key, index) => (
                  <TableHead
                    key={index}
                    className={`${
                      index === 5 ? "w-[69px]" : "w-[145px]"
                    } text-left text-[#1e2324] font-text-small`}
                  >
                    {t(`history.superAdmin.orderHistory.${key}`)}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderList?.map((order: any, index: number) => (
                <OrderRow key={order?.order_id} order={order} index={index} />
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
                {t("history.superAdmin.orderHistory.table.previous")}
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
                      <PaginationEllipsis className="w-9 h-9 flex items-center justify-center rounded border border-solid border-primary-neutal-300 font-bold text-[#023337]" />
                    )}
                  </React.Fragment>
                ))}
              </PaginationContent>

              <PaginationNext
                href="#"
                className="h-[42px] bg-white rounded-lg shadow-1dp-ambient flex items-center gap-1 pl-3 pr-2 py-2.5 font-medium text-black text-[15px]"
              >
                {t("history.superAdmin.orderHistory.table.next")}
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
    </section>
  );
};
