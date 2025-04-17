import React from "react";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
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

const orders = [
  {
    id: "KCJRTAEIJ",
    date: "15/02/2024",
    price: "499.90€",
    status: "history.status.delivered",
    statusType: "success",
    invoiceImg: "/img/invoice.svg",
  },
  {
    id: "KCJRTAEIJ",
    date: "22/03/2025",
    price: "149.90€",
    status: "history.status.inDelivery",
    statusType: "warning",
    invoiceImg: "/img/invoice-1.svg",
  },
  {
    id: "KCJRTAEIJ",
    date: "30/04/2024",
    price: "499.90€",
    status: "history.status.delivered",
    statusType: "success",
    invoiceImg: "/img/invoice-2.svg",
  },
  {
    id: "KCJRTAEIJ",
    date: "12/05/2025",
    price: "399.90€",
    status: "history.status.shipped",
    statusType: "default",
    invoiceImg: "/img/invoice-3.svg",
  },
  {
    id: "KCJRTAEIJ",
    date: "18/06/2024",
    price: "149.90€",
    status: "history.status.inDelivery",
    statusType: "warning",
    invoiceImg: "/img/invoice-4.svg",
  },
  {
    id: "KCJRTAEIJ",
    date: "25/07/2025",
    price: "799.90€",
    status: "history.status.cancelled",
    statusType: "danger",
    invoiceImg: "/img/invoice-5.svg",
  },
  {
    id: "KCJRTAEIJ",
    date: "09/08/2024",
    price: "499.90€",
    status: "history.status.delivered",
    statusType: "success",
    invoiceImg: "/img/invoice-6.svg",
  },
  {
    id: "KCJRTAEIJ",
    date: "14/09/2025",
    price: "399.90€",
    status: "history.status.delivered",
    statusType: "success",
    invoiceImg: "/img/invoice-7.svg",
  },
  {
    id: "KCJRTAEIJ",
    date: "30/10/2024",
    price: "799.90€",
    status: "history.status.delivered",
    statusType: "success",
    invoiceImg: "/img/invoice-8.svg",
  },
];

const paginationItems = [
  { page: 1, active: true },
  { page: 2, active: false },
  { page: 3, active: false },
  { page: 4, active: false },
  { page: 5, active: false },
  { page: 24, active: false },
];

const StatusIcon = ({ type }: { type: string }) => {
  const iconMap: { [key: string]: string } = {
    success: "/img/frame-5.svg",
    warning: "/img/group-2.png",
    danger: "/img/frame-2.svg",
    default: "/img/group-1.png",
  };
  const iconSrc = iconMap[type] || iconMap.default;
  const sizeClass =
    type === "warning"
      ? "w-[18px] h-[18px] top-[3px] left-[3px]"
      : type === "default"
      ? "w-[19px] h-[15px] top-[5px] left-0.5"
      : "w-6 h-6";

  return (
    <img className={`absolute ${sizeClass}`} alt="Status icon" src={iconSrc} />
  );
};

const StatusText = ({ status, type }: { status: string; type: string }) => {
  const textColorClassMap: { [key: string]: string } = {
    success: "text-1-tokens-color-modes-common-success-medium",
    warning: "text-1-tokens-color-modes-common-warning-medium",
    danger: "text-1-tokens-color-modes-common-danger-medium",
    default:
      "text-[color:var(--1-tokens-color-modes-input-primary-default-text)]",
  };
  const textColorClass = textColorClassMap[type] || textColorClassMap.default;

  return (
    <div
      className={`font-normal text-[15px] leading-normal whitespace-nowrap ${textColorClass} font-['Montserrat',Helvetica]`}
    >
      {status}
    </div>
  );
};

const OrderRow = ({ order, index }: { order: any; index: number }) => (
  <TableRow key={index} className="border-b border-primary-neutal-300">
    <TableCell className="w-11 py-3 px-2">
      <Checkbox className="w-5 h-5 rounded border-[1.5px] border-solid border-1-tokens-color-modes-common-neutral-medium" />
    </TableCell>
    <TableCell className="w-[129px] p-2.5 text-center">
      <span
        className={`font-normal ${
          index === 0 ? "text-coolgray-100" : "text-[#121619]"
        } text-[15px] tracking-[0] leading-normal whitespace-nowrap font-['Montserrat',Helvetica]`}
      >
        {order.id}
      </span>
    </TableCell>
    <TableCell className="w-[145px] p-2.5 text-center">
      <span className="font-normal text-black text-[15px] tracking-[0] leading-normal whitespace-nowrap font-['Montserrat',Helvetica]">
        {order.date}
      </span>
    </TableCell>
    <TableCell className="w-[145px] p-2.5 text-center">
      <span className="font-normal text-black text-[15px] tracking-[0] leading-normal whitespace-nowrap font-['Montserrat',Helvetica]">
        {order.price}
      </span>
    </TableCell>
    <TableCell className="w-[145px] p-2.5">
      <div className="flex items-center gap-2">
        <div className="relative w-6 h-6">
          <StatusIcon type={order.statusType} />
        </div>
        <StatusText status={order.status} type={order.statusType} />
      </div>
    </TableCell>
    <TableCell className="w-[69px] p-2.5 text-center">
      <img
        className="inline-block w-4 h-4"
        alt="Invoice"
        src={order.invoiceImg}
      />
    </TableCell>
    <TableCell className="w-[145px] p-2.5 text-center">
      <Button
        variant="ghost"
        className="p-0 underline font-medium text-[color:var(--1-tokens-color-modes-button-ghost-default-text)]"
      >
        Détails
      </Button>
    </TableCell>
  </TableRow>
);

export const OrderDetailsSection = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-between relative flex-1 self-stretch w-full grow">
      <Table className="bg-white rounded-[var(--2-tokens-screen-modes-common-spacing-XS)]">
        <TableHeader className="bg-[#eaf8e7] rounded-md">
          <TableRow>
            <TableHead className="w-11 p-2.5">
              <Checkbox className="w-5 h-5 rounded border-[1.5px] border-solid border-1-tokens-color-modes-common-neutral-medium" />
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
                className={`w-[${index === 4 ? 69 : 145}px] p-2.5 text-center`}
              >
                <span className="font-text-small text-[#1e2324] text-[length:var(--text-small-font-size)] tracking-[var(--text-small-letter-spacing)] leading-[var(--text-small-line-height)]">
                  {header}
                </span>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order, index) => (
            <TableRow
              key={index}
              className="border-b border-primary-neutal-300"
            >
              <TableCell className="w-11 py-3 px-2">
                <Checkbox className="w-5 h-5 rounded border-[1.5px] border-solid border-1-tokens-color-modes-common-neutral-medium" />
              </TableCell>
              <TableCell className="w-[129px] p-2.5 text-center">
                <span
                  className={`font-normal ${
                    index === 0 ? "text-coolgray-100" : "text-[#121619]"
                  } text-[15px] tracking-[0] leading-normal whitespace-nowrap font-['Montserrat',Helvetica]`}
                >
                  {order.id}
                </span>
              </TableCell>
              <TableCell className="w-[145px] p-2.5 text-center">
                <span className="font-normal text-black text-[15px] tracking-[0] leading-normal whitespace-nowrap font-['Montserrat',Helvetica]">
                  {order.date}
                </span>
              </TableCell>
              <TableCell className="w-[145px] p-2.5 text-center">
                <span className="font-normal text-black text-[15px] tracking-[0] leading-normal whitespace-nowrap font-['Montserrat',Helvetica]">
                  {order.price}
                </span>
              </TableCell>
              <TableCell className="w-[145px] p-2.5">
                <div className="flex items-center gap-2">
                  <div className="relative w-6 h-6">
                    <StatusIcon type={order.statusType} />
                  </div>
                  <StatusText
                    status={t(order.status)}
                    type={order.statusType}
                  />
                </div>
              </TableCell>
              <TableCell className="w-[69px] p-2.5 text-center">
                <img
                  className="inline-block w-4 h-4"
                  alt={t("history.table.invoice")}
                  src={order.invoiceImg}
                />
              </TableCell>
              <TableCell className="w-[145px] p-2.5 text-center">
                <Button
                  variant="ghost"
                  className="p-0 underline font-medium text-[color:var(--1-tokens-color-modes-button-ghost-default-text)]"
                >
                  {t("history.table.details")}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-end justify-center gap-[279px] mt-4">
        <Button
          variant="outline"
          className="h-[42px] gap-1 pl-2 pr-3 py-2.5 bg-white rounded-lg shadow-1dp-ambient"
        >
          <img
            className="w-6 h-6"
            alt={t("history.pagination.previous")}
            src="/img/arrow-left-sm.svg"
          />
          <span className="font-medium text-black text-[15px] tracking-[0] leading-normal whitespace-nowrap font-['Montserrat',Helvetica]">
            {t("history.pagination.previous")}
          </span>
        </Button>

        <Pagination>
          <PaginationContent className="gap-3">
            {paginationItems.map((item, index) => (
              <React.Fragment key={index}>
                {index === 5 && (
                  <PaginationItem>
                    <PaginationEllipsis className="w-9 h-9 flex items-center justify-center font-bold text-[#023337] text-[15px] border border-solid border-primary-neutal-300 rounded" />
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationLink
                    className={`w-9 h-9 flex items-center justify-center font-medium text-[#023337] text-[15px] ${
                      item.active
                        ? "bg-[#c1e6ba] font-bold"
                        : "border border-solid border-primary-neutal-300"
                    } rounded`}
                    isActive={item.active}
                  >
                    {item.page}
                  </PaginationLink>
                </PaginationItem>
              </React.Fragment>
            ))}
          </PaginationContent>
        </Pagination>

        <Button
          variant="outline"
          className="h-[42px] gap-1 pl-2 pr-3 py-2.5 bg-white rounded-lg shadow-1dp-ambient"
        >
          <span className="font-medium text-black text-[15px] tracking-[0] leading-normal whitespace-nowrap font-['Montserrat',Helvetica]">
            {t("history.pagination.next")}
          </span>
          <img
            className="w-6 h-6"
            alt={t("history.pagination.next")}
            src="/img/arrow-left-sm-1.svg"
          />
        </Button>
      </div>
    </div>
  );
};
