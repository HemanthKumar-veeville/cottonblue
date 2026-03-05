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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { Skeleton } from "../../components/Skeleton";
import EmptyState from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";
import { PackagePlus } from "lucide-react";
import {
  Store,
  MoreVertical,
  Eye,
  Edit,
  Power,
  Trash2,
  Plus,
} from "lucide-react";
import {
  fetchAllStores,
  modifyStore,
  deleteStore,
} from "../../store/features/agencySlice";

// Pagination data
const paginationItems = [1, 2, 3, 4, 5];

import { formatDateToParis } from "../../utils/dateUtils";

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
  const dispatch = useAppDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAgencies, setSelectedAgencies] = useState<number[]>([]);
  const { selectedCompany } = useAppSelector((state) => state.client);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [agencyToDelete, setAgencyToDelete] = useState<Agency | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showActivateDialog, setShowActivateDialog] = useState(false);
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [agencyToToggle, setAgencyToToggle] = useState<Agency | null>(null);
  const [isToggling, setIsToggling] = useState(false);

  // Ensure agencies is always an array
  const agenciesArray = Array.isArray(agencies) ? agencies : [];

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Helper function for case-insensitive search that handles undefined values
  const includesIgnoreCase = (text: any, searchTerm: string): boolean => {
    if (text === undefined || text === null) return false;
    return text.toString().toLowerCase().includes(searchTerm.toLowerCase());
  };

  // Filter agencies based on search term
  const filteredAgencies = agenciesArray.filter((agency) => {
    if (!searchTerm) return true;

    const searchTermLower = searchTerm.toLowerCase();

    return (
      includesIgnoreCase(agency.id, searchTermLower) ||
      includesIgnoreCase(agency.name, searchTermLower) ||
      includesIgnoreCase(agency.phone_number, searchTermLower) ||
      includesIgnoreCase(agency.city, searchTermLower) ||
      includesIgnoreCase(agency.address, searchTermLower) ||
      includesIgnoreCase(agency.postal_code, searchTermLower) ||
      includesIgnoreCase(agency.created_at, searchTermLower) ||
      includesIgnoreCase(agency.updated_at, searchTermLower) ||
      includesIgnoreCase(
        agency.is_active ? "active" : "inactive",
        searchTermLower
      )
    );
  });

  // Pagination logic
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredAgencies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAgencies = filteredAgencies.slice(startIndex, endIndex);

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

  // Handle actions
  const handleViewDetails = (agencyId: number) => {
    navigate(`/customers/${selectedCompany?.dns}/agencies/${agencyId}`);
    setActiveDropdown(null);
  };

  const handleEdit = (agency: any) => {
    // Prepare the data to be passed to the AddClient component
    const prefillData = {
      name: agency?.name || "",
      city: agency?.city || "",
      address: agency?.address || "",
      postal_code: agency?.postal_code || "",
      company_id: agency?.company_id || "",
      is_edit_mode: true,
    };

    navigate(`/agencies/edit/${agency?.id}`, {
      state: prefillData,
    });
    setActiveDropdown(null);
  };

  const handleToggleActive = async (agency: any) => {
    if (!agency) return;

    if (agency.is_active) {
      setShowDeactivateDialog(true);
    } else {
      setShowActivateDialog(true);
    }
    setAgencyToToggle(agency);
    setActiveDropdown(null);
  };

  const handleConfirmToggle = async () => {
    if (!agencyToToggle || !selectedCompany?.dns) return;

    setIsToggling(true);
    try {
      await dispatch(
        modifyStore({
          dnsPrefix: selectedCompany.dns,
          storeId: agencyToToggle.id.toString(),
          data: {
            is_active: !agencyToToggle.is_active,
          },
        })
      ).unwrap();
      await dispatch(fetchAllStores(selectedCompany.dns)).unwrap();
    } catch (error) {
      console.error("Failed to toggle store status:", error);
    } finally {
      setIsToggling(false);
      setShowActivateDialog(false);
      setShowDeactivateDialog(false);
      setAgencyToToggle(null);
    }
  };

  const handleDeleteClick = (agency: Agency) => {
    setAgencyToDelete(agency);
    setShowDeleteDialog(true);
    setActiveDropdown(null);
  };

  const handleDelete = async () => {
    if (agencyToDelete?.id && selectedCompany?.dns) {
      setIsDeleting(true);
      try {
        await dispatch(
          deleteStore({
            dnsPrefix: selectedCompany.dns,
            storeId: agencyToDelete.id.toString(),
          })
        ).unwrap();
        // Refresh the agencies list after successful deletion
        dispatch(fetchAllStores(selectedCompany.dns));
      } catch (error) {
        console.error("Failed to delete agency:", error);
      } finally {
        setIsDeleting(false);
        setShowDeleteDialog(false);
        setAgencyToDelete(null);
        setActiveDropdown(null);
      }
    }
  };

  if (loading) {
    return <Skeleton variant="table" />;
  }

  return (
    <section className="flex flex-col h-full">
      <div className="flex-grow overflow-auto pb-24">
        <div className="w-full">
          {loading ? (
            <Skeleton variant="table" />
          ) : currentAgencies.length === 0 ? (
            <EmptyState
              icon={Store}
              title={t("agencyTable.noAgencies")}
              description={
                searchTerm
                  ? t("agencyTable.noSearchResults")
                  : t("agencyTable.emptyMessage")
              }
            />
          ) : (
            <Table>
              <TableHeader className="bg-1-tokens-color-modes-common-primary-brand-lower rounded-md">
                <TableRow>
                  <TableHead className="w-[77px] text-center text-[#1e2324] font-text-small">
                    <span className="text-center text-[#1e2324]">#</span>
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
                  <TableHead className="w-[100px] text-left text-[#1e2324] font-text-small">
                    {t("clientTable.columns.allocatedProducts")}
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
                {currentAgencies.length > 0 ? (
                  currentAgencies.map((agency, index) => (
                    <TableRow
                      key={agency.id}
                      className="border-b border-primary-neutal-300 py-[var(--2-tokens-screen-modes-common-spacing-XS)]"
                    >
                      <TableCell className="w-[77px] text-center font-text-smaller text-coolgray-100 align-middle">
                        <span className="font-text-smaller text-coolgray-100">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </span>
                      </TableCell>
                      <TableCell className="w-[77px] text-left font-text-smaller text-coolgray-100">
                        <span
                          className="text-primary-600 font-medium text-center cursor-pointer hover:underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(agency.id);
                          }}
                        >
                          {agency.id}
                        </span>
                      </TableCell>
                      <TableCell className="w-[145px] text-left font-text-bold-smaller text-[color:var(--1-tokens-color-modes-input-primary-default-text)]">
                        <span
                          className="text-primary-600 font-medium text-center cursor-pointer hover:underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(agency.id);
                          }}
                        >
                          {agency.name}
                        </span>
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
                          {agency.is_active
                            ? t("clientTable.status.active")
                            : t("clientTable.status.inactive")}
                        </span>
                      </TableCell>
                      <TableCell className="w-[100px] text-left">
                        <Button
                          variant="outline"
                          size="icon"
                          aria-label="Add Product"
                          className="bg-primary-600 text-black hover:bg-primary-700"
                          onClick={() => {
                            navigate(`/agencies/allocate/${agency.id}`);
                          }}
                        >
                          <PackagePlus className="h-4 w-4" />
                        </Button>
                      </TableCell>
                      <TableCell className="w-[120px] text-left font-text-smaller text-black">
                        {agency?.created_at
                          ? formatDateToParis(agency?.created_at)
                          : t("common.notAvailable")}
                      </TableCell>
                      <TableCell className="w-[145px] text-center">
                        <div
                          className="relative inline-flex items-center"
                          ref={dropdownRef}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            ref={(el) => (buttonRefs.current[agency.id] = el)}
                            className={`h-8 w-8 hover:bg-gray-100 rounded-full transition-colors duration-200 ${
                              activeDropdown === agency.id ? "bg-gray-100" : ""
                            }`}
                            onClick={() =>
                              setActiveDropdown(
                                activeDropdown === agency.id ? null : agency.id
                              )
                            }
                            aria-expanded={activeDropdown === agency.id}
                            aria-haspopup="true"
                            aria-label="Open actions menu"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>

                          {activeDropdown === agency.id && (
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
                                  buttonRefs.current[agency.id]
                                ),
                              }}
                            >
                              <div className="py-1 divide-y divide-gray-100">
                                <button
                                  className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 group"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewDetails(agency.id);
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
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit(agency);
                                  }}
                                  role="menuitem"
                                >
                                  <Edit className="mr-3 h-4 w-4 text-gray-400 group-hover:text-primary-600" />
                                  <span className="font-medium">
                                    {t("clientTable.actions.edit")}
                                  </span>
                                </button>
                                <button
                                  className={`flex items-center w-full px-4 py-3 text-sm transition-colors duration-150 group ${
                                    agency.is_active
                                      ? "text-red-600 hover:bg-red-50"
                                      : "text-green-600 hover:bg-green-50"
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleActive(agency);
                                  }}
                                  role="menuitem"
                                >
                                  <Power
                                    className={`mr-3 h-4 w-4 ${
                                      agency.is_active
                                        ? "text-red-400 group-hover:text-red-600"
                                        : "text-green-400 group-hover:text-green-600"
                                    }`}
                                  />
                                  <span className="font-medium">
                                    {agency.is_active
                                      ? t("clientTable.actions.deactivate")
                                      : t("clientTable.actions.activate")}
                                  </span>
                                </button>
                                <button
                                  className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 group"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteClick(agency);
                                  }}
                                  role="menuitem"
                                >
                                  <Trash2 className="mr-3 h-4 w-4 text-red-400 group-hover:text-red-600" />
                                  <span className="font-medium">
                                    {t("clientTable.actions.delete")}
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
                      {t("agencyTable.noAgencies")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {!loading && !error && filteredAgencies.length > 0 && (
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
              >
                <img
                  className="w-6 h-6"
                  alt="Arrow left"
                  src="/img/arrow-left-sm.svg"
                />
                {t("common.previous")}
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
                className="h-[42px] bg-white rounded-lg shadow-1dp-ambient flex items-center gap-1 pl-3 pr-2 py-2.5 font-medium text-black text-[15px]"
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  if (currentPage < totalPages)
                    handlePageChange(currentPage + 1);
                }}
              >
                {t("common.next")}
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("agencyTable.dialogs.delete.title")}</DialogTitle>
            <DialogDescription>
              {t("agencyTable.dialogs.delete.description")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setAgencyToDelete(null);
              }}
            >
              {t("common.cancel")}
            </Button>
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting
                ? t("common.deleting")
                : t("clientTable.actions.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Activate Confirmation Dialog */}
      <Dialog open={showActivateDialog} onOpenChange={setShowActivateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("agencyTable.dialogs.activate.title")}</DialogTitle>
            <DialogDescription>
              {t("agencyTable.dialogs.activate.description")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowActivateDialog(false);
                setAgencyToToggle(null);
              }}
            >
              {t("common.cancel")}
            </Button>
            <Button
              variant="default"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={handleConfirmToggle}
              disabled={isToggling}
            >
              {isToggling
                ? t("common.loading")
                : t("clientTable.actions.activate")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deactivate Confirmation Dialog */}
      <Dialog
        open={showDeactivateDialog}
        onOpenChange={setShowDeactivateDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("agencyTable.dialogs.deactivate.title")}
            </DialogTitle>
            <DialogDescription>
              {t("agencyTable.dialogs.deactivate.description")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeactivateDialog(false);
                setAgencyToToggle(null);
              }}
            >
              {t("common.cancel")}
            </Button>
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
              onClick={handleConfirmToggle}
              disabled={isToggling}
            >
              {isToggling
                ? t("common.loading")
                : t("clientTable.actions.deactivate")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};
