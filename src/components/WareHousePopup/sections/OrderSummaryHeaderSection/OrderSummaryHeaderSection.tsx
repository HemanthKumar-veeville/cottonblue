import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollArea } from "../../../../components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";

interface OrderItem {
  product: string;
  reference: string;
  unitPrice: string;
  quantity: string;
  total: string;
}

const orderItems: OrderItem[] = [
  {
    product: "Magnet + stylo",
    reference: "122043",
    unitPrice: "49,99€",
    quantity: "3",
    total: "149,97€",
  },
  {
    product: "Magnet + stylo",
    reference: "122043",
    unitPrice: "49,99€",
    quantity: "3",
    total: "149,97€",
  },
  {
    product: "Magnet + stylo",
    reference: "122043",
    unitPrice: "49,99€",
    quantity: "3",
    total: "149,97€",
  },
  {
    product: "Magnet + stylo",
    reference: "122043",
    unitPrice: "49,99€",
    quantity: "3",
    total: "149,97€",
  },
  {
    product: "Magnet + stylo",
    reference: "122043",
    unitPrice: "49,99€",
    quantity: "3",
    total: "149,97€",
  },
];

const OrderSummaryHeaderSection = (): JSX.Element => {
  const { t } = useTranslation();

  const tableHeaders = [
    t("cart.table.product"),
    t("productList.table.sku"),
    t("cart.table.unitPrice"),
    t("cart.table.quantity"),
    t("cart.table.total"),
  ];

  return (
    <section className="flex flex-col gap-2.5 w-full">
      <h2 className="font-bold text-1-tokens-color-modes-common-neutral-hightest text-base font-['Montserrat',Helvetica]">
        {t("warehouse.popup.orderSummary.title")}
      </h2>

      <ScrollArea className="h-[290px] w-full">
        <Table>
          <TableHeader className="bg-1-tokens-color-modes-common-primary-brand-lower rounded-md sticky top-0">
            <TableRow>
              {tableHeaders.map((header, index) => (
                <TableHead
                  key={index}
                  className={`w-[135px] h-10 text-center ${
                    index === 4 ? "" : "whitespace-nowrap"
                  }`}
                >
                  <span className="font-text-small text-1-tokens-color-modes-common-neutral-hightest">
                    {header}
                  </span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderItems.map((item, index) => (
              <TableRow
                key={index}
                className="border-b border-primary-neutal-300"
              >
                {Object.values(item).map((value, idx) => (
                  <TableCell
                    key={idx}
                    className="py-[var(--2-tokens-screen-modes-common-spacing-XS)] text-center"
                  >
                    <span className="font-text-smaller text-1-tokens-color-modes-common-neutral-hightest whitespace-nowrap">
                      {value}
                    </span>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </section>
  );
};

export default OrderSummaryHeaderSection;
