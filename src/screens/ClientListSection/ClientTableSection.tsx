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
import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Skeleton } from "../../components/Skeleton";
import EmptyState from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";
import {
  Users,
  MoreVertical,
  Eye,
  Edit,
  Power,
  ExternalLink,
} from "lucide-react";
import { Dialog, DialogContent } from "../../components/ui/dialog";
import {
  getCompanyByDnsPrefix,
  getAllCompanies,
  modifyCompany,
} from "../../store/features/clientSlice";
import { useAppDispatch } from "../../store/store";
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
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});

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
  const dispatch = useAppDispatch();
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

  // Replace the pagination generation code with this simpler version
  const paginationItems = useMemo(() => {
    const items = [];
    for (let i = 1; i <= totalPages; i++) {
      items.push(i);
    }
    return items;
  }, [totalPages]);

  // Handle actions
  const handleViewDetails = (dnsPrefix: string) => {
    navigate(`/customers/${dnsPrefix}`);
    setActiveDropdown(null);
  };

  const handleEdit = async (company_name: string) => {
    await dispatch(getCompanyByDnsPrefix(company_name));

    navigate("/customers/edit");
    setActiveDropdown(null);
  };

  const handleToggleStatus = async (company: any) => {
    if (!company) return;

    try {
      await dispatch(
        modifyCompany({
          dns_prefix: company.dns_prefix,
          company_id: company.id,
          data: {
            is_active: !company.is_active,
          },
        })
      ).unwrap();
      await dispatch(getAllCompanies());
      setActiveDropdown(null);
    } catch (error) {
      console.error("Failed to toggle company status:", error);
    }
  };

  // Calculate dropdown position
  const getDropdownPosition = (buttonElement: HTMLButtonElement | null) => {
    if (!buttonElement) return {};
    const rect = buttonElement.getBoundingClientRect();
    return {
      top: `${rect.bottom + 8}px`,
      right: `${window.innerWidth - rect.right}px`,
    };
  };

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, clientId: number) => {
    if (e.key === "Escape") {
      setActiveDropdown(null);
    }
  };

  return (
    <section className="flex flex-col h-full">
      <div className="flex-grow overflow-auto pb-24">
        <div className="w-full">
          {loading ? (
            <Skeleton variant="table" />
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
                  <TableHead className="w-[60px] text-left text-[#1e2324] font-text-small">
                    {t("clientTable.columns.id")}
                  </TableHead>
                  <TableHead className="w-[200px] text-left text-[#1e2324] font-text-small">
                    {t("clientTable.columns.name")}
                  </TableHead>
                  <TableHead className="w-[200px] text-left text-[#1e2324] font-text-small">
                    {t("clientTable.columns.adminEmail")}
                  </TableHead>
                  <TableHead className="w-[130px] text-left text-[#1e2324] font-text-small">
                    {t("clientTable.columns.phone")}
                  </TableHead>
                  <TableHead className="w-[120px] text-left text-[#1e2324] font-text-small">
                    {t("clientTable.columns.city")}
                  </TableHead>
                  <TableHead className="w-[150px] text-left text-[#1e2324] font-text-small">
                    {t("clientTable.columns.dnsPrefix")}
                  </TableHead>
                  <TableHead className="w-[100px] text-center text-[#1e2324] font-text-small">
                    {t("clientTable.columns.branding")}
                  </TableHead>
                  <TableHead className="w-[100px] text-center text-[#1e2324] font-text-small">
                    {t("clientTable.columns.status")}
                  </TableHead>
                  <TableHead className="w-[100px] text-center text-[#1e2324] font-text-small">
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
                      <TableCell className="w-[60px] text-left font-text-smaller text-coolgray-100">
                        {client.id}
                      </TableCell>
                      <TableCell className="w-[200px] text-left">
                        <button
                          onClick={() => handleViewDetails(client.dns_prefix)}
                          className="font-medium text-primary-600 hover:text-primary-800 transition-colors duration-200 text-left cursor-pointer hover:underline"
                        >
                          {client.name}
                        </button>
                      </TableCell>
                      <TableCell className="w-[200px] text-left font-text-smaller text-black">
                        {client.admin_email || "-"}
                      </TableCell>
                      <TableCell className="w-[130px] text-left font-text-smaller text-black">
                        {client.phone_number}
                      </TableCell>
                      <TableCell className="w-[120px] text-left font-text-smaller text-black">
                        {client.city}
                      </TableCell>
                      <TableCell className="w-[150px] text-left font-text-smaller text-black">
                        <Link
                          to={`https://${client.dns_prefix}.${
                            import.meta.env.VITE_DOMAIN
                          }`}
                          target="_blank"
                          className="font-semibold text-blue-800 hover:text-blue-600 transition-colors duration-200 flex items-start"
                        >
                          {client.dns_prefix}
                          <ExternalLink className="w-4 h-4 ml-[2px]" />
                        </Link>
                      </TableCell>
                      <TableCell className="w-[100px] text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div
                            className="w-6 h-6 rounded-sm border"
                            style={{ backgroundColor: client.bg_color_code }}
                            title={`${t("clientTable.branding.background")}: ${
                              client.bg_color_code
                            }`}
                          />
                          <div
                            className="w-6 h-6 rounded-sm border"
                            style={{ backgroundColor: client.text_color_code }}
                            title={`${t("clientTable.branding.text")}: ${
                              client.text_color_code
                            }`}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="w-[100px] text-center">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-sm ${
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
                      <TableCell className="w-[100px] text-center">
                        <div
                          className="relative inline-flex items-center"
                          ref={dropdownRef}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            ref={(el) => (buttonRefs.current[client.id] = el)}
                            className={`h-8 w-8 hover:bg-gray-100 rounded-full transition-colors duration-200 ${
                              activeDropdown === client.id ? "bg-gray-100" : ""
                            }`}
                            onClick={() =>
                              setActiveDropdown(
                                activeDropdown === client.id ? null : client.id
                              )
                            }
                            aria-expanded={activeDropdown === client.id}
                            aria-haspopup="true"
                            aria-label="Open actions menu"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>

                          {activeDropdown === client.id && (
                            <div
                              ref={menuRef}
                              className="fixed w-44 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-[9999] transform opacity-100 scale-100 transition-all duration-200 ease-out origin-top-right"
                              role="menu"
                              aria-orientation="vertical"
                              aria-labelledby="actions-menu"
                              style={{
                                position: "fixed",
                                zIndex: 9999,
                                ...getDropdownPosition(
                                  buttonRefs.current[client.id]
                                ),
                              }}
                            >
                              <div className="py-1 divide-y divide-gray-100">
                                <button
                                  className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 group"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewDetails(client.dns_prefix);
                                  }}
                                  role="menuitem"
                                >
                                  <Eye className="mr-3 h-4 w-4 text-gray-400 group-hover:text-primary-600" />
                                  <span className="font-medium">
                                    {t("clientTable.actions.viewDetails")}
                                  </span>
                                </button>
                                <button
                                  className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 group"
                                  onClick={() => handleEdit(client.dns_prefix)}
                                  role="menuitem"
                                >
                                  <Edit className="mr-3 h-4 w-4 text-gray-400 group-hover:text-primary-600" />
                                  <span className="font-medium">
                                    {t("clientTable.actions.edit")}
                                  </span>
                                </button>
                                <button
                                  className={`flex items-center w-full px-4 py-3 text-sm transition-colors duration-150 group ${
                                    client.is_active
                                      ? "text-red-600 hover:bg-red-50"
                                      : "text-green-600 hover:bg-green-50"
                                  }`}
                                  onClick={() => handleToggleStatus(client)}
                                  role="menuitem"
                                >
                                  <Power
                                    className={`mr-3 h-4 w-4 ${
                                      client.is_active
                                        ? "text-red-400 group-hover:text-red-600"
                                        : "text-green-400 group-hover:text-green-600"
                                    }`}
                                  />
                                  <span className="font-medium">
                                    {client.is_active
                                      ? t("clientTable.actions.deactivate")
                                      : t("clientTable.actions.activate")}
                                  </span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
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
                className={`h-[42px] bg-white rounded-lg shadow-1dp-ambient flex items-center gap-1 pl-2 pr-3 py-2.5 font-medium ${
                  currentPage === 1 || totalPages === 1
                    ? "text-gray-400 cursor-not-allowed hover:text-gray-400"
                    : "text-black hover:text-black"
                }`}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1 || totalPages === 1}
              >
                <img
                  className={`w-6 h-6 ${
                    currentPage === 1 || totalPages === 1 ? "opacity-50" : ""
                  }`}
                  alt="Arrow left"
                  src="/img/arrow-left-sm.svg"
                />
                {t("clientTable.pagination.previous")}
              </PaginationPrevious>

              <PaginationContent className="flex items-center gap-3">
                {paginationItems.map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      className={`flex items-center justify-center w-9 h-9 rounded ${
                        page === currentPage
                          ? "bg-cyan-100 font-bold text-[#1e2324]"
                          : "border border-solid border-primary-neutal-300 font-medium text-[#023337]"
                      }`}
                      onClick={() => setCurrentPage(page)}
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
                        onClick={() => setCurrentPage(totalPages)}
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}
              </PaginationContent>

              <PaginationNext
                href="#"
                className={`h-[42px] bg-white rounded-lg shadow-1dp-ambient flex items-center gap-1 pl-3 pr-2 py-2.5 font-medium ${
                  currentPage === totalPages || totalPages === 1
                    ? "text-gray-400 cursor-not-allowed hover:text-gray-400"
                    : "text-black hover:text-black"
                }`}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages || totalPages === 1}
              >
                {t("clientTable.pagination.next")}
                <img
                  className={`w-6 h-6 rotate-180 ${
                    currentPage === totalPages || totalPages === 1
                      ? "opacity-50"
                      : ""
                  }`}
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
