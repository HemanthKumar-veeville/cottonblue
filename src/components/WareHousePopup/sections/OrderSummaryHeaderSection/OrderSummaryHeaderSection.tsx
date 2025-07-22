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
    product: `${product?.product_name} - ${product?.product_suitable_for} - ${product?.product_size}`,
    product_name: product?.product_name,
    product_suitable_for: product?.product_suitable_for,
    product_size: product?.product_size,
    reference: product?.product_id,
    unitPrice: product?.product_price || product?.price_of_pack,
    quantity: product?.quantity,
    total:
      (product?.product_price || product?.price_of_pack) * product?.quantity,
  }));

  return (
    <section className="flex flex-col gap-2.5 w-full">
      <h2 className="font-bold text-1-tokens-color-modes-common-neutral-hightest text-base">
        {t("warehouse.popup.orderSummary.title")}
      </h2>

      <div className="relative w-full rounded-md border">
        <div className="sticky top-0 z-10 bg-1-tokens-color-modes-common-primary-brand-lower rounded-t-md">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-16 py-2.5 align-middle">
                  <div className="flex items-center justify-center">
                    <span className="font-text-small text-1-tokens-color-modes-common-neutral-hightest">
                      {tableHeaders[0]}
                    </span>
                  </div>
                </TableHead>
                <TableHead className="w-[45%] py-2.5 align-middle">
                  <div className="flex items-center">
                    <span className="font-text-small text-1-tokens-color-modes-common-neutral-hightest">
                      {tableHeaders[1]}
                    </span>
                  </div>
                </TableHead>
                <TableHead className="w-[10%] py-2.5 align-middle">
                  <div className="flex items-center justify-start">
                    <span className="font-text-small text-1-tokens-color-modes-common-neutral-hightest">
                      {tableHeaders[2]}
                    </span>
                  </div>
                </TableHead>
                <TableHead className="w-[15%] py-2.5 align-middle">
                  <div className="flex items-center justify-start">
                    <span className="font-text-small text-1-tokens-color-modes-common-neutral-hightest">
                      {tableHeaders[3]}
                    </span>
                  </div>
                </TableHead>
                <TableHead className="w-[10%] py-2.5 align-middle">
                  <div className="flex items-center justify-start">
                    <span className="font-text-small text-1-tokens-color-modes-common-neutral-hightest">
                      {tableHeaders[4]}
                    </span>
                  </div>
                </TableHead>
                <TableHead className="w-[15%] py-2.5 align-middle">
                  <div className="flex items-center justify-end">
                    <span className="w-3/4 text-left font-text-small text-1-tokens-color-modes-common-neutral-hightest">
                      {tableHeaders[5]}
                    </span>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
          </Table>
        </div>

        <div className="max-h-[200px] h-full overflow-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
          <Table className="w-full">
            <TableBody>
              {products?.map((item: any, index: number) => (
                <TableRow
                  key={index}
                  className="border-b border-primary-neutal-300"
                >
                  <TableCell className="w-16 py-2.5 align-middle">
                    <div className="flex items-center justify-center">
                      <span className="font-text-smaller text-1-tokens-color-modes-common-neutral-hightest">
                        {index + 1}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="w-[45%] py-2.5 align-middle">
                    <div className="w-full">
                      <span
                        className="font-semibold text-[#07515f] text-sm break-words w-full"
                        style={{ wordBreak: "break-word" }}
                        title={`${item?.product_name || ""} - ${
                          item?.product_suitable_for || ""
                        } - ${item?.product_size || ""}`}
                      >
                        <span className="text-[#07515f]">
                          {item?.product_name}
                        </span>
                        {item?.product_suitable_for && (
                          <>
                            <span className="text-gray-400 mx-1"> - </span>
                            <span className="text-gray-500">
                              {item?.product_suitable_for}
                            </span>
                          </>
                        )}
                        {item?.product_size && (
                          <>
                            <span className="text-gray-400 mx-1"> - </span>
                            <span className="text-[#00b85b]">
                              {item?.product_size}
                            </span>
                          </>
                        )}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="w-[10%] py-2.5 align-middle">
                    <div className="flex items-center justify-start">
                      <span className="font-text-smaller text-1-tokens-color-modes-common-neutral-hightest break-words">
                        {item?.reference}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="w-[15%] py-2.5 align-middle">
                    <div className="flex items-center justify-start">
                      <span className="font-text-smaller text-1-tokens-color-modes-common-neutral-hightest">
                        €{item?.unitPrice}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="w-[10%] py-2.5 align-middle">
                    <div className="flex items-center justify-start">
                      <span className="font-text-smaller text-1-tokens-color-modes-common-neutral-hightest">
                        {item?.quantity}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="w-[15%] py-2.5 align-middle">
                    <div className="flex items-center justify-end">
                      <span className="w-3/4 text-left font-text-smaller text-1-tokens-color-modes-common-neutral-hightest">
                        €{item?.total}
                      </span>
                    </div>
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
