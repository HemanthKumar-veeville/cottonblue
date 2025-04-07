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

// Client data for the table
const clientData = [
  {
    id: 1,
    clientId: "CLT001",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 8900",
    company: "Acme Corp",
    status: "Active",
    lastOrder: "2024-03-15",
  },
  {
    id: 2,
    clientId: "CLT002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1 234 567 8901",
    company: "Tech Solutions",
    status: "Active",
    lastOrder: "2024-03-14",
  },
  {
    id: 3,
    clientId: "CLT003",
    name: "Mike Johnson",
    email: "mike.j@example.com",
    phone: "+1 234 567 8902",
    company: "Global Industries",
    status: "Inactive",
    lastOrder: "2024-02-28",
  },
  {
    id: 4,
    clientId: "CLT004",
    name: "Sarah Williams",
    email: "sarah.w@example.com",
    phone: "+1 234 567 8903",
    company: "Digital Dynamics",
    status: "Active",
    lastOrder: "2024-03-13",
  },
  {
    id: 5,
    clientId: "CLT005",
    name: "Robert Brown",
    email: "robert.b@example.com",
    phone: "+1 234 567 8904",
    company: "Future Systems",
    status: "Active",
    lastOrder: "2024-03-12",
  },
];

// Pagination data
const paginationItems = [1, 2, 3, 4, 5];

export const ClientTableSection = (): JSX.Element => {
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
                Client ID
              </TableHead>
              <TableHead className="w-[145px] text-center text-[#1e2324] font-text-small">
                Name
              </TableHead>
              <TableHead className="w-[200px] text-center text-[#1e2324] font-text-small">
                Email
              </TableHead>
              <TableHead className="w-[145px] text-center text-[#1e2324] font-text-small">
                Phone
              </TableHead>
              <TableHead className="w-[145px] text-center text-[#1e2324] font-text-small">
                Company
              </TableHead>
              <TableHead className="w-[100px] text-center text-[#1e2324] font-text-small">
                Status
              </TableHead>
              <TableHead className="w-[120px] text-center text-[#1e2324] font-text-small">
                Last Order
              </TableHead>
              <TableHead className="w-[145px] text-center text-[#1e2324] font-text-small">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientData.map((client) => (
              <TableRow
                key={client.id}
                className="border-b border-primary-neutal-300 py-[var(--2-tokens-screen-modes-common-spacing-XS)]"
              >
                <TableCell className="w-11">
                  <div className="flex justify-center">
                    <Checkbox className="w-5 h-5 bg-color-white rounded border-[1.5px] border-solid border-1-tokens-color-modes-common-neutral-medium" />
                  </div>
                </TableCell>
                <TableCell className="w-[77px] text-center font-text-smaller text-coolgray-100">
                  {client.clientId}
                </TableCell>
                <TableCell className="w-[145px] text-center font-text-bold-smaller text-[color:var(--1-tokens-color-modes-input-primary-default-text)]">
                  {client.name}
                </TableCell>
                <TableCell className="w-[200px] text-center font-text-smaller text-black">
                  {client.email}
                </TableCell>
                <TableCell className="w-[145px] text-center font-text-smaller text-black">
                  {client.phone}
                </TableCell>
                <TableCell className="w-[145px] text-center font-text-smaller text-black">
                  {client.company}
                </TableCell>
                <TableCell className="w-[100px] text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      client.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {client.status}
                  </span>
                </TableCell>
                <TableCell className="w-[120px] text-center font-text-smaller text-black">
                  {client.lastOrder}
                </TableCell>
                <TableCell className="w-[145px] text-center">
                  <Button
                    variant="link"
                    className="text-[color:var(--1-tokens-color-modes-button-ghost-default-text)] font-text-small underline"
                  >
                    View Details
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
          Previous
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
          Next
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
