import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import React, { useState } from "react";
import { ChevronDown, ChevronUp, ImageOff } from "lucide-react";

interface OrderItem {
  product_id: number;
  product_images: string[];
  product_name: string;
  product_price: number;
  quantity: number;
}

const ProductListHeaderSection: React.FC<{ orderDetails: OrderItem[] }> = ({
  orderDetails,
}) => {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof OrderItem | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(orderDetails.map((item) => item.product_id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (productId: number) => {
    setSelectedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSort = (key: keyof OrderItem) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedItems = [...orderDetails].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortConfig.direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return sortConfig.direction === "asc"
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number);
  });

  const SortIcon = ({ columnKey }: { columnKey: keyof OrderItem }) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <section className="flex flex-col items-start gap-8 p-4 w-full bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-center w-full">
        <h3 className="text-[length:var(--heading-h3-font-size)] font-heading-h3 font-[number:var(--heading-h3-font-weight)] text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] tracking-[var(--heading-h3-letter-spacing)] leading-[var(--heading-h3-line-height)] [font-style:var(--heading-h3-font-style)]">
          Ordered Products
        </h3>
        <div className="text-sm text-gray-600">
          {selectedItems.length} of {orderDetails.length} selected
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow className="hover:bg-gray-50/80 transition-colors">
              <TableCell className="w-11 p-2">
                <Checkbox
                  checked={selectedItems.length === orderDetails.length}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all items"
                />
              </TableCell>
              {[
                { key: "product_name" as const, label: "Product" },
                { key: "product_id" as const, label: "Product ID" },
                { key: "product_price" as const, label: "Unit Price" },
                { key: "quantity" as const, label: "Quantity" },
              ].map(({ key, label }) => (
                <TableCell
                  key={key}
                  className="p-3 cursor-pointer group"
                  onClick={() => handleSort(key)}
                >
                  <div className="flex items-center gap-2 font-medium text-gray-800 text-sm tracking-wide">
                    {label}
                    <span className="text-gray-400 group-hover:text-primary transition-colors">
                      <SortIcon columnKey={key} />
                    </span>
                  </div>
                </TableCell>
              ))}
              <TableCell className="p-3 font-medium text-gray-800 text-sm tracking-wide">
                Total
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedItems.map((item, index) => (
              <TableRow
                key={item.product_id}
                className={`
                  border-b border-gray-200 hover:bg-gray-50/50 transition-colors
                  ${
                    selectedItems.includes(item.product_id)
                      ? "bg-primary/5"
                      : ""
                  }
                `}
              >
                <TableCell className="w-11 p-2">
                  <Checkbox
                    checked={selectedItems.includes(item.product_id)}
                    onCheckedChange={() => handleSelectItem(item.product_id)}
                    aria-label={`Select ${item.product_name}`}
                  />
                </TableCell>
                <TableCell className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center bg-white">
                      {item?.product_images &&
                      item?.product_images.length > 0 &&
                      item?.product_images[0] ? (
                        <img
                          className="w-full h-auto min-h-[100px] max-h-[100px] object-contain"
                          width={100}
                          height={100}
                          alt={item.product_name}
                          src={item?.product_images[0]}
                        />
                      ) : (
                        <ImageOff className="w-10 h-10 text-gray-400" />
                      )}
                    </div>
                    <span className="font-medium text-gray-900 text-sm">
                      {item.product_name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="p-3 text-gray-600 text-sm">
                  {item.product_id}
                </TableCell>
                <TableCell className="p-3 text-gray-900 text-sm">
                  {formatCurrency(item.product_price)}
                </TableCell>
                <TableCell className="p-3 text-gray-900 text-sm">
                  {item.quantity}
                </TableCell>
                <TableCell className="p-3 font-medium text-primary text-sm">
                  {formatCurrency(item.product_price * item.quantity)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

export { ProductListHeaderSection };
