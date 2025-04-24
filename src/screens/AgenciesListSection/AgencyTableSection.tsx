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
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../../store/store";
import { Skeleton } from "../../components/Skeleton";
import EmptyState from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";
import { Store } from "lucide-react";

// Pagination data
const paginationItems = [1, 2, 3, 4, 5];

interface Agency {
  id: number;
  name: string;
  phone_number: string;
  city: string;
  address: string;
  longitude: string;
  latitude: string;
  created_at: string;
  updated_at: string;
  company_id: number;
  postal_code: string;
  is_active: boolean;
}

interface AgencyTableSectionProps {
  agencies: Agency[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
}

export const AgencyTableSection: React.FC<AgencyTableSectionProps> = ({
  agencies,
  loading,
  error,
  searchTerm,
}: AgencyTableSectionProps): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAgencies, setSelectedAgencies] = useState<number[]>([]);
  const { selectedCompany } = useAppSelector((state) => state.client);
  // Debug: Log the props received by this component
  useEffect(() => {
    console.log("AgencyTableSection received agencies:", agencies);
    console.log("AgencyTableSection agencies type:", typeof agencies);
    console.log(
      "AgencyTableSection is agencies an array?",
      Array.isArray(agencies)
    );
    if (Array.isArray(agencies)) {
      console.log("AgencyTableSection number of agencies:", agencies.length);
      if (agencies.length > 0) {
        console.log("First agency:", agencies[0]);
      }
    }
  }, [agencies]);

  // Ensure agencies is always an array
  const agenciesArray = Array.isArray(agencies) ? agencies : [];

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Filter agencies based on search term
  const filteredAgencies = agenciesArray.filter(
    (agency) =>
      agency.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agency.phone_number?.includes(searchTerm) ||
      agency.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agency.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agency.postal_code?.includes(searchTerm)
  );

  // Debug: Log the filtered agencies
  useEffect(() => {
    console.log("Filtered agencies:", filteredAgencies);
    console.log("Number of filtered agencies:", filteredAgencies.length);
  }, [filteredAgencies]);

  // Pagination logic
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredAgencies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAgencies = filteredAgencies.slice(startIndex, endIndex);

  // Debug: Log the current agencies for pagination
  useEffect(() => {
    console.log("Current agencies for pagination:", currentAgencies);
    console.log("Number of current agencies:", currentAgencies.length);
  }, [currentAgencies]);

  // Handle checkbox selection
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAgencies(currentAgencies.map((agency) => agency.id));
    } else {
      setSelectedAgencies([]);
    }
  };

  const handleSelectAgency = (agencyId: number, checked: boolean) => {
    if (checked) {
      setSelectedAgencies([...selectedAgencies, agencyId]);
    } else {
      setSelectedAgencies(selectedAgencies.filter((id) => id !== agencyId));
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleViewDetails = (agencyId: number) => {
    navigate(`/customers/${selectedCompany?.name}/agencies/${agencyId}`);
  };

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

  return (
    <section className="flex flex-col items-center justify-between w-full gap-6">
      <div className="w-full max-w-[1160px]">
        {loading ? (
          <Skeleton variant="table" />
        ) : error ? (
          <ErrorState
            message={error}
            variant="inline"
            onRetry={() => window.location.reload()}
          />
        ) : currentAgencies.length === 0 ? (
          <EmptyState
            icon={Store}
            title={t("agencyTable.noAgencies")}
            description={
              searchTerm
                ? t("agencyTable.noSearchResults")
                : t("agencyTable.emptyMessage")
            }
            actionLabel={searchTerm ? t("agencyTable.clearSearch") : undefined}
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
                        selectedAgencies.length === currentAgencies.length &&
                        currentAgencies.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </div>
                </TableHead>
                <TableHead className="w-[77px] text-left text-[#1e2324] font-text-small">
                  ID
                </TableHead>
                <TableHead className="w-[145px] text-left text-[#1e2324] font-text-small">
                  Name
                </TableHead>
                <TableHead className="w-[145px] text-left text-[#1e2324] font-text-small">
                  Phone
                </TableHead>
                <TableHead className="w-[145px] text-left text-[#1e2324] font-text-small">
                  City
                </TableHead>
                <TableHead className="w-[145px] text-left text-[#1e2324] font-text-small">
                  Address
                </TableHead>
                <TableHead className="w-[100px] text-left text-[#1e2324] font-text-small">
                  Status
                </TableHead>
                <TableHead className="w-[120px] text-left text-[#1e2324] font-text-small">
                  Created At
                </TableHead>
                <TableHead className="w-[145px] text-center text-[#1e2324] font-text-small">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentAgencies.length > 0 ? (
                currentAgencies.map((agency) => (
                  <TableRow
                    key={agency.id}
                    className="border-b border-primary-neutal-300 py-[var(--2-tokens-screen-modes-common-spacing-XS)]"
                  >
                    <TableCell className="w-11">
                      <div className="flex justify-start">
                        <Checkbox
                          className="w-5 h-5 bg-color-white rounded border-[1.5px] border-solid border-1-tokens-color-modes-common-neutral-medium"
                          checked={selectedAgencies.includes(agency.id)}
                          onCheckedChange={(
                            checked: boolean | "indeterminate"
                          ) =>
                            handleSelectAgency(agency.id, checked as boolean)
                          }
                        />
                      </div>
                    </TableCell>
                    <TableCell className="w-[77px] text-left font-text-smaller text-coolgray-100">
                      {agency.id}
                    </TableCell>
                    <TableCell className="w-[145px] text-left font-text-bold-smaller text-[color:var(--1-tokens-color-modes-input-primary-default-text)]">
                      {agency.name}
                    </TableCell>
                    <TableCell className="w-[145px] text-left font-text-smaller text-black">
                      {agency.phone_number}
                    </TableCell>
                    <TableCell className="w-[145px] text-left font-text-smaller text-black">
                      {agency.city}
                    </TableCell>
                    <TableCell className="w-[145px] text-left font-text-smaller text-black">
                      {agency.address}
                    </TableCell>
                    <TableCell className="w-[100px] text-left">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          agency.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {agency.is_active ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="w-[120px] text-left font-text-smaller text-black">
                      {formatDate(agency.created_at)}
                    </TableCell>
                    <TableCell className="w-[145px] text-center">
                      <Button
                        variant="link"
                        className="text-[color:var(--1-tokens-color-modes-button-ghost-default-text)] font-text-small underline"
                        onClick={() => handleViewDetails(agency.id)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-4">
                    No agencies found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {!loading && !error && filteredAgencies.length > 0 && (
        <Pagination className="flex items-center justify-between w-full max-w-[1160px]">
          <PaginationPrevious
            href="#"
            className="h-[42px] bg-white rounded-lg shadow-1dp-ambient flex items-center gap-1 pl-2 pr-3 py-2.5 font-medium text-black text-[15px]"
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              if (currentPage > 1) handlePageChange(currentPage - 1);
            }}
          >
            <img
              className="w-6 h-6"
              alt="Arrow left"
              src="/img/arrow-left-sm.svg"
            />
            Previous
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
              <PaginationEllipsis className="w-9 h-9 flex items-center justify-center rounded border border-solid border-primary-neutal-300 font-bold text-[#023337]" />
            )}
            {totalPages > 5 && (
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
            )}
          </PaginationContent>

          <PaginationNext
            href="#"
            className="h-[42px] bg-white rounded-lg shadow-1dp-ambient flex items-center gap-1 pl-2 pr-3 py-2.5 font-medium text-black text-[15px]"
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              if (currentPage < totalPages) handlePageChange(currentPage + 1);
            }}
          >
            Next
            <img
              className="w-6 h-6 rotate-180"
              alt="Arrow right"
              src="/img/arrow-left-sm-1.svg"
            />
          </PaginationNext>
        </Pagination>
      )}
    </section>
  );
};
