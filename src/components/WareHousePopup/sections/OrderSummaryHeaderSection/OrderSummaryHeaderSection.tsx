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

const OrderSummaryHeaderSection = ({
  products,
}: {
  products: any;
}): JSX.Element => {
  const { t } = useTranslation();

  const tableHeaders = [
    t("cart.table.product"),
    t("productList.table.sku"),
    t("cart.table.unitPrice"),
    t("cart.table.quantity"),
    t("cart.table.total"),
  ];
  products = products.map((product: any) => ({
    product: product.product_name,
    reference: product.product_id,
    unitPrice: product.product_price || product.price_of_pack,
    quantity: product.quantity,
    total: (product.product_price || product.price_of_pack) * product.quantity,
  }));

  return (
    <section className="flex flex-col gap-2.5 w-full">
      <h2 className="font-bold text-1-tokens-color-modes-common-neutral-hightest text-base font-['Montserrat',Helvetica]">
        {t("warehouse.popup.orderSummary.title")}
      </h2>

      <ScrollArea className="h-full w-full">
        <Table>
          <TableHeader className="bg-1-tokens-color-modes-common-primary-brand-lower rounded-md sticky top-0">
            <TableRow>
              {tableHeaders.map((header, index) => (
                <TableHead
                  key={index}
                  className={`h-10 ${
                    index === 0 || index === 1
                      ? "text-left"
                      : index === 2 || index === 4
                      ? "text-right"
                      : "text-center"
                  } ${index === 4 ? "" : "whitespace-nowrap"}`}
                >
                  <span className="font-text-small text-1-tokens-color-modes-common-neutral-hightest">
                    {header}
                  </span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((item: any, index: number) => (
              <TableRow
                key={index}
                className="border-b border-primary-neutal-300"
              >
                {Object.values(item).map((value: any, idx: number) => (
                  <TableCell
                    key={idx}
                    className={`py-[var(--2-tokens-screen-modes-common-spacing-XS)] ${
                      idx === 0 || idx === 1
                        ? "text-left"
                        : idx === 2 || idx === 4
                        ? "text-right"
                        : "text-center"
                    }`}
                  >
                    <span className="font-text-smaller text-1-tokens-color-modes-common-neutral-hightest whitespace-nowrap">
                      {idx === 2 || idx === 4 ? `€${value}` : value}
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
