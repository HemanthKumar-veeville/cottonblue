import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
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

// Product data for the table
const productData = [
  {
    id: 1,
    sku: "ABC123",
    photo: "/img/frame-4347-4.png",
    name: "Veste polaire",
    category: "Vêtements",
    size: "S,M,L",
    soldBy: "Carton",
    price: "64,00€/5pcs",
  },
  {
    id: 2,
    sku: "ABC123",
    photo: "/img/frame-4347-4.png",
    name: "Veste polaire",
    category: "Vêtements",
    size: "S,M,L",
    soldBy: "Carton",
    price: "64,00€/5pcs",
  },
  {
    id: 3,
    sku: "ABC123",
    photo: "/img/frame-4347-4.png",
    name: "Veste polaire",
    category: "Vêtements",
    size: "S,M,L",
    soldBy: "Carton",
    price: "64,00€/5pcs",
  },
  {
    id: 4,
    sku: "ABC123",
    photo: "/img/frame-4347-4.png",
    name: "Veste polaire",
    category: "Vêtements",
    size: "S,M,L",
    soldBy: "Carton",
    price: "64,00€/5pcs",
  },
  {
    id: 5,
    sku: "ABC123",
    photo: "/img/frame-4347-4.png",
    name: "Veste polaire",
    category: "Vêtements",
    size: "S,M,L",
    soldBy: "Carton",
    price: "64,00€/5pcs",
  },
];

// Pagination data
const paginationItems = [1, 2, 3, 4, 5];

export const ProductTableSection = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <section className="flex flex-col items-center justify-between w-full gap-6">
      <div className="w-full max-w-[1160px]">
        <Table>
          <TableHeader className="bg-1-tokens-color-modes-common-primary-brand-lower rounded-md">
            <TableRow>
              <TableHead className="w-11">
                <div className="flex justify-center">
                  <Checkbox className="w-5 h-5 bg-color-white rounded border-[1.5px] border-solid border-1-tokens-color-modes-common-neutral-medium" />
                </div>
              </TableHead>
              <TableHead className="w-[77px] text-center text-[#1e2324] font-text-small">
                {t("productList.table.sku")}
              </TableHead>
              <TableHead className="w-[77px] text-center text-[#1e2324] font-text-small">
                {t("productList.table.photo")}
              </TableHead>
              <TableHead className="w-[145px] text-center text-[#1e2324] font-text-small">
                {t("productList.table.name")}
              </TableHead>
              <TableHead className="w-[145px] text-center text-[#1e2324] font-text-small">
                {t("productList.table.category")}
              </TableHead>
              <TableHead className="w-[145px] text-center text-[#1e2324] font-text-small">
                {t("productList.table.size")}
              </TableHead>
              <TableHead className="w-[145px] text-center text-[#1e2324] font-text-small">
                {t("productList.table.soldBy")}
              </TableHead>
              <TableHead className="w-[69px] text-center text-[#1e2324] font-text-small">
                {t("productList.table.price")}
              </TableHead>
              <TableHead className="w-[145px] text-center text-[#1e2324] font-text-small">
                {t("productList.table.details")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productData.map((product) => (
              <TableRow
                key={product.id}
                className="border-b border-primary-neutal-300 py-[var(--2-tokens-screen-modes-common-spacing-XS)]"
              >
                <TableCell className="w-11">
                  <div className="flex justify-center">
                    <Checkbox className="w-5 h-5 bg-color-white rounded border-[1.5px] border-solid border-1-tokens-color-modes-common-neutral-medium" />
                  </div>
                </TableCell>
                <TableCell className="w-[77px] text-center font-text-smaller text-coolgray-100">
                  {product.sku}
                </TableCell>
                <TableCell className="w-[77px] text-center">
                  <div className="mx-auto w-[50px] h-[50px] rounded-[var(--2-tokens-screen-modes-button-border-radius)] bg-[url(/img/frame-4347-4.png)] bg-cover bg-center" />
                </TableCell>
                <TableCell className="w-[145px] text-center font-text-bold-smaller text-[color:var(--1-tokens-color-modes-input-primary-default-text)]">
                  {product.name}
                </TableCell>
                <TableCell className="w-[145px] text-center font-text-smaller text-black">
                  {product.category}
                </TableCell>
                <TableCell className="w-[145px] text-center font-text-smaller text-black">
                  {product.size}
                </TableCell>
                <TableCell className="w-[145px] text-center font-text-smaller text-black">
                  {product.soldBy}
                </TableCell>
                <TableCell className="w-[69px] text-center font-text-smaller text-black">
                  {product.price}
                </TableCell>
                <TableCell className="w-[145px] text-center">
                  <Button
                    variant="link"
                    className="text-[color:var(--1-tokens-color-modes-button-ghost-default-text)] font-text-small underline"
                  >
                    {t("productList.table.details")}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination className="flex items-center justify-between w-full max-w-[1160px]">
        <PaginationPrevious
          href="#"
          className="h-[42px] bg-white rounded-lg shadow-1dp-ambient flex items-center gap-1 pl-2 pr-3 py-2.5 font-medium text-black text-[15px]"
        >
          <img
            className="w-6 h-6"
            alt="Arrow left"
            src="/img/arrow-left-sm.svg"
          />
          {t("productList.pagination.previous")}
        </PaginationPrevious>

        <PaginationContent className="flex items-center gap-3">
          {paginationItems.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                className={`flex items-center justify-center w-9 h-9 rounded ${
                  page === 1
                    ? "bg-cyan-100 font-bold text-[#1e2324]"
                    : "border border-solid border-primary-neutal-300 font-medium text-[#023337]"
                }`}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationEllipsis className="w-9 h-9 flex items-center justify-center rounded border border-solid border-primary-neutal-300 font-bold text-[#023337]" />
          <PaginationItem>
            <PaginationLink
              href="#"
              className="flex items-center justify-center w-9 h-9 rounded border border-solid border-primary-neutal-300 font-medium text-[#023337]"
            >
              24
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>

        <PaginationNext
          href="#"
          className="h-[42px] bg-white rounded-lg shadow-1dp-ambient flex items-center gap-1 pl-2 pr-3 py-2.5 font-medium text-black text-[15px]"
        >
          {t("productList.pagination.next")}
          <img
            className="w-6 h-6 rotate-180"
            alt="Arrow right"
            src="/img/arrow-left-sm-1.svg"
          />
        </PaginationNext>
      </Pagination>
    </section>
  );
};
