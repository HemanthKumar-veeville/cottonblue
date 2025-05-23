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
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "../../components/Skeleton";
import EmptyState from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";
import { Users } from "lucide-react";

// Pagination data
const paginationItems = [1, 2, 3, 4, 5];

interface ClientTableSectionProps {
  companies: any[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
}

export const ClientTableSection = ({
  companies,
  loading,
  error,
  searchTerm,
}: ClientTableSectionProps): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClients, setSelectedClients] = useState<number[]>([]);

  // Ensure companies is always an array
  const companiesArray = Array.isArray(companies) ? companies : [];

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Filter companies based on search term
  const filteredCompanies = companiesArray.filter(
    (client) =>
      client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone_number?.includes(searchTerm) ||
      client.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const itemsPerPage = 25;
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCompanies = filteredCompanies.slice(startIndex, endIndex);

  // Handle checkbox selection
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedClients(currentCompanies.map((client) => client.id));
    } else {
      setSelectedClients([]);
    }
  };

  const handleSelectClient = (clientId: number, checked: boolean) => {
    if (checked) {
      setSelectedClients([...selectedClients, clientId]);
    } else {
      setSelectedClients(selectedClients.filter((id) => id !== clientId));
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Handle view details click
  const handleViewDetails = (clientId: number) => {
    navigate(`/customers/${clientId}`);
  };

  return (
    <section className="flex flex-col h-full">
      <div className="flex-grow overflow-auto pb-24">
        <div className="w-full">
          {loading ? (
            <Skeleton variant="table" />
          ) : error ? (
            <ErrorState
              message={error}
              variant="inline"
              onRetry={() => window.location.reload()}
            />
          ) : currentCompanies.length === 0 ? (
            <EmptyState
              icon={Users}
              title={t("clientTable.noClients")}
              description={
                searchTerm
                  ? t("clientTable.noSearchResults")
                  : t("clientTable.emptyMessage")
              }
              actionLabel={
                searchTerm ? t("clientTable.clearSearch") : undefined
              }
              onAction={searchTerm ? () => window.location.reload() : undefined}
            />
          ) : (
            <Table>
              <TableHeader className="bg-1-tokens-color-modes-common-primary-brand-lower rounded-md">
                <TableRow>
                  <TableHead className="w-11">
                    <div className="flex justify-start">
                      <Checkbox
                        className="w-5 h-5 bg-color-white rounded border-[1.5px] border-solid border-1-tokens-color-modes-common-neutral-medium"
                        checked={
                          selectedClients.length === currentCompanies.length &&
                          currentCompanies.length > 0
                        }
                        onCheckedChange={handleSelectAll}
                      />
                    </div>
                  </TableHead>
                  <TableHead className="w-[77px] text-left text-[#1e2324] font-text-small">
                    {t("clientTable.columns.id")}
                  </TableHead>
                  <TableHead className="w-[145px] text-left text-[#1e2324] font-text-small">
                    {t("clientTable.columns.name")}
                  </TableHead>
                  <TableHead className="w-[145px] text-left text-[#1e2324] font-text-small">
                    {t("clientTable.columns.phone")}
                  </TableHead>
                  <TableHead className="w-[145px] text-left text-[#1e2324] font-text-small">
                    {t("clientTable.columns.city")}
                  </TableHead>
                  <TableHead className="w-[145px] text-left text-[#1e2324] font-text-small">
                    {t("clientTable.columns.address")}
                  </TableHead>
                  <TableHead className="w-[100px] text-left text-[#1e2324] font-text-small">
                    {t("clientTable.columns.status")}
                  </TableHead>
                  <TableHead className="w-[120px] text-left text-[#1e2324] font-text-small">
                    {t("clientTable.columns.createdAt")}
                  </TableHead>
                  <TableHead className="w-[145px] text-center text-[#1e2324] font-text-small">
                    {t("clientTable.columns.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentCompanies.length > 0 ? (
                  currentCompanies.map((client) => (
                    <TableRow
                      key={client.id}
                      className="border-b border-primary-neutal-300 py-[var(--2-tokens-screen-modes-common-spacing-XS)]"
                    >
                      <TableCell className="w-11">
                        <div className="flex justify-start">
                          <Checkbox
                            className="w-5 h-5 bg-color-white rounded border-[1.5px] border-solid border-1-tokens-color-modes-common-neutral-medium"
                            checked={selectedClients.includes(client.id)}
                            onCheckedChange={(
                              checked: boolean | "indeterminate"
                            ) =>
                              handleSelectClient(client.id, checked as boolean)
                            }
                          />
                        </div>
                      </TableCell>
                      <TableCell className="w-[77px] text-left font-text-smaller text-coolgray-100">
                        {client.id}
                      </TableCell>
                      <TableCell className="w-[145px] text-left font-text-bold-smaller text-[color:var(--1-tokens-color-modes-input-primary-default-text)]">
                        {client.name}
                      </TableCell>
                      <TableCell className="w-[145px] text-left font-text-smaller text-black">
                        {client.phone_number}
                      </TableCell>
                      <TableCell className="w-[145px] text-left font-text-smaller text-black">
                        {client.city}
                      </TableCell>
                      <TableCell className="w-[145px] text-left font-text-smaller text-black">
                        {client.address}
                      </TableCell>
                      <TableCell className="w-[100px] text-left">
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${
                            client.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {client.is_active
                            ? t("clientTable.status.active")
                            : t("clientTable.status.inactive")}
                        </span>
                      </TableCell>
                      <TableCell className="w-[120px] text-left font-text-smaller text-black">
                        {formatDate(client.created_at)}
                      </TableCell>
                      <TableCell className="w-[145px] text-center">
                        <Button
                          variant="link"
                          className="text-[color:var(--1-tokens-color-modes-button-ghost-default-text)] font-text-small underline"
                          onClick={() => handleViewDetails(client.dns_prefix)}
                        >
                          {t("clientTable.actions.viewDetails")}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-4">
                      {t("clientTable.noClients")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {!loading && !error && filteredCompanies.length > 0 && (
        <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-primary-neutal-300 py-4">
          <div className="px-6 max-w-[calc(100%-2rem)]">
            <Pagination className="flex items-center justify-between w-full mx-auto">
              <PaginationPrevious
                href="#"
                className="h-[42px] bg-white rounded-lg shadow-1dp-ambient flex items-center gap-1 pl-2 pr-3 py-2.5 font-medium text-black text-[15px]"
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  if (currentPage > 1) handlePageChange(currentPage - 1);
                }}
                disabled={currentPage === 1}
              >
                <img
                  className="w-6 h-6"
                  alt="Arrow left"
                  src="/img/arrow-left-sm.svg"
                />
                {t("clientTable.pagination.previous")}
              </PaginationPrevious>

              <PaginationContent className="flex items-center gap-3">
                {Array.from(
                  { length: Math.min(5, totalPages) },
                  (_, i) => i + 1
                ).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      className={`flex items-center justify-center w-9 h-9 rounded ${
                        page === currentPage
                          ? "bg-cyan-100 font-bold text-[#1e2324]"
                          : "border border-solid border-primary-neutal-300 font-medium text-[#023337]"
                      }`}
                      onClick={(e: React.MouseEvent) => {
                        e.preventDefault();
                        handlePageChange(page);
                      }}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                {totalPages > 5 && (
                  <>
                    <PaginationEllipsis className="w-9 h-9 flex items-center justify-center rounded border border-solid border-primary-neutal-300 font-bold text-[#023337]" />
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        className="flex items-center justify-center w-9 h-9 rounded border border-solid border-primary-neutal-300 font-medium text-[#023337]"
                        onClick={(e: React.MouseEvent) => {
                          e.preventDefault();
                          handlePageChange(totalPages);
                        }}
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}
              </PaginationContent>

              <PaginationNext
                href="#"
                className="h-[42px] bg-white rounded-lg shadow-1dp-ambient flex items-center gap-1 pl-3 pr-2 py-2.5 font-medium text-black text-[15px]"
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  if (currentPage < totalPages)
                    handlePageChange(currentPage + 1);
                }}
                disabled={currentPage === totalPages}
              >
                {t("clientTable.pagination.next")}
                <img
                  className="w-6 h-6 rotate-180"
                  alt="Arrow right"
                  src="/img/arrow-left-sm-1.svg"
                />
              </PaginationNext>
            </Pagination>
          </div>
        </div>
      )}
    </section>
  );
};
