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

const OrderSummaryHeaderSection = ({
  products,
  totalAmount,
}: {
  products: any;
  totalAmount: number;
}): JSX.Element => {
  const { t } = useTranslation();

  const tableHeaders = [
    "#",
    t("cart.table.product"),
    t("productList.table.sku"),
    t("cart.table.unitPrice"),
    t("cart.table.quantity"),
    t("cart.table.total"),
  ];
  products = products?.map((product: any) => ({
    product: product?.product_name,
    reference: product?.product_id,
    unitPrice: product?.product_price || product?.price_of_pack,
    quantity: product?.quantity,
    total:
      (product?.product_price || product?.price_of_pack) * product?.quantity,
  }));

  return (
    <section className="flex flex-col gap-2.5 w-full">
      <h2 className="font-bold text-1-tokens-color-modes-common-neutral-hightest text-base font-['Montserrat',Helvetica]">
        {t("warehouse.popup.orderSummary.title")}
      </h2>

      <div className="relative w-full rounded-md border">
        <div className="sticky top-0 z-10 bg-1-tokens-color-modes-common-primary-brand-lower rounded-t-md">
          <Table className="w-full table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[5%] h-10 text-center whitespace-nowrap">
                  <span className="font-text-small text-1-tokens-color-modes-common-neutral-hightest">
                    {tableHeaders[0]}
                  </span>
                </TableHead>
                <TableHead className="w-[25%] h-10 text-left whitespace-nowrap">
                  <span className="font-text-small text-1-tokens-color-modes-common-neutral-hightest">
                    {tableHeaders[1]}
                  </span>
                </TableHead>
                <TableHead className="w-[20%] h-10 text-left whitespace-nowrap">
                  <span className="font-text-small text-1-tokens-color-modes-common-neutral-hightest">
                    {tableHeaders[2]}
                  </span>
                </TableHead>
                <TableHead className="w-[20%] h-10 text-right whitespace-nowrap">
                  <span className="font-text-small text-1-tokens-color-modes-common-neutral-hightest">
                    {tableHeaders[3]}
                  </span>
                </TableHead>
                <TableHead className="w-[15%] h-10 text-center whitespace-nowrap">
                  <span className="font-text-small text-1-tokens-color-modes-common-neutral-hightest">
                    {tableHeaders[4]}
                  </span>
                </TableHead>
                <TableHead className="w-[15%] h-10 text-right">
                  <span className="font-text-small text-1-tokens-color-modes-common-neutral-hightest">
                    {tableHeaders[5]}
                  </span>
                </TableHead>
              </TableRow>
            </TableHeader>
          </Table>
        </div>

        <div className="max-h-[200px] h-full overflow-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
          <Table className="w-full table-fixed">
            <TableBody>
              {products?.map((item: any, index: number) => (
                <TableRow
                  key={index}
                  className="border-b border-primary-neutal-300"
                >
                  <TableCell className="w-[5%] py-[var(--2-tokens-screen-modes-common-spacing-XS)] text-center">
                    <span className="font-text-smaller text-1-tokens-color-modes-common-neutral-hightest whitespace-nowrap">
                      {index + 1}
                    </span>
                  </TableCell>
                  <TableCell className="w-[25%] py-[var(--2-tokens-screen-modes-common-spacing-XS)] text-left">
                    <span className="font-text-smaller text-1-tokens-color-modes-common-neutral-hightest whitespace-nowrap">
                      {item?.product}
                    </span>
                  </TableCell>
                  <TableCell className="w-[20%] py-[var(--2-tokens-screen-modes-common-spacing-XS)] text-left">
                    <span className="font-text-smaller text-1-tokens-color-modes-common-neutral-hightest whitespace-nowrap">
                      {item?.reference}
                    </span>
                  </TableCell>
                  <TableCell className="w-[20%] py-[var(--2-tokens-screen-modes-common-spacing-XS)] text-right">
                    <span className="font-text-smaller text-1-tokens-color-modes-common-neutral-hightest whitespace-nowrap">
                      €{item?.unitPrice}
                    </span>
                  </TableCell>
                  <TableCell className="w-[15%] py-[var(--2-tokens-screen-modes-common-spacing-XS)] text-center">
                    <span className="font-text-smaller text-1-tokens-color-modes-common-neutral-hightest whitespace-nowrap">
                      {item?.quantity}
                    </span>
                  </TableCell>
                  <TableCell className="w-[15%] py-[var(--2-tokens-screen-modes-common-spacing-XS)] text-right">
                    <span className="font-text-smaller text-1-tokens-color-modes-common-neutral-hightest whitespace-nowrap">
                      €{item?.total}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <div className="flex flex-row justify-between items-center w-[150px]">
          <span className="font-medium text-1-tokens-color-modes-common-neutral-hightest">
            Total HT :
          </span>
          <span className="font-medium text-1-tokens-color-modes-common-neutral-hightest">
            €{totalAmount}
          </span>
        </div>
      </div>
    </section>
  );
};

export default OrderSummaryHeaderSection;
