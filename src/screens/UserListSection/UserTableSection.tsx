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
import { useState, useMemo, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "../../components/Skeleton";
import EmptyState from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";
import { Users, MoreVertical, Eye, Edit, Power, Trash2 } from "lucide-react";
import { Badge } from "../../components/ui/badge";

import {
  fetchUsers,
  modifyUser,
  deleteUser,
} from "../../store/features/userSlice";

interface UserData {
  firstname: string;
  lastname: string;
  email: string;
  role?: string;
  store_ids: number[];
  user_id: string;
  is_active: boolean;
  department?: string;
  phone_number?: string;
}

interface UserTableSectionProps {
  filteredUsers: UserData[];
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export const UserTableSection = ({
  filteredUsers,
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}: UserTableSectionProps): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isLoading: loading, error } = useAppSelector((state) => state.user);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showToggleDialog, setShowToggleDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserData | null>(null);
  const [userToToggle, setUserToToggle] = useState<UserData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingActive, setIsTogglingActive] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const dispatch = useAppDispatch();
  const { selectedCompany } = useAppSelector((state) => state.client);
  console.log({ totalItems });
  // Calculate dropdown position
  const getDropdownPosition = (buttonElement: HTMLButtonElement | null) => {
    if (!buttonElement) return { top: 0, right: 0 };
    const rect = buttonElement.getBoundingClientRect();
    return {
      top: rect.bottom + 8,
      right: window.innerWidth - rect.right,
    };
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Handle select all checkbox
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.email));
    }
    setSelectAll(!selectAll);
  };

  // Handle individual user selection
  const handleSelectUser = (email: string) => {
    setSelectedUsers((prev) => {
      if (prev.includes(email)) {
        return prev.filter((e) => e !== email);
      } else {
        return [...prev, email];
      }
    });
  };

  // Generate pagination items with a maximum of 5 visible pages
  const paginationItems = useMemo(() => {
    const maxVisiblePages = 5;
    const items = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(i);
    }

    return items;
  }, [currentPage, totalPages]);

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
  const handleViewDetails = (userId: string) => {
    navigate(`/users/${encodeURIComponent(userId)}`);
    setActiveDropdown(null);
  };

  const handleEdit = (userId: string) => {
    navigate(`/users/edit/${userId}`);
    setActiveDropdown(null);
  };

  const handleToggleClick = (user: UserData) => {
    setUserToToggle(user);
    setShowToggleDialog(true);
    setActiveDropdown(null);
  };

  const handleToggleActive = async () => {
    if (userToToggle?.user_id && selectedCompany?.dns) {
      setIsTogglingActive(true);
      try {
        await dispatch(
          modifyUser({
            dnsPrefix: selectedCompany.dns,
            userId: userToToggle.user_id,
            data: {
              is_active: !userToToggle.is_active,
            },
          })
        ).unwrap();
        // Refresh users list after successful toggle
        await dispatch(
          fetchUsers({
            dnsPrefix: selectedCompany.dns,
            params: { page: currentPage, limit: itemsPerPage },
          })
        );
      } catch (error) {
        console.error("Failed to toggle user activation:", error);
      } finally {
        setIsTogglingActive(false);
        setShowToggleDialog(false);
        setUserToToggle(null);
      }
    }
  };

  const handleDeleteClick = (user: UserData) => {
    setUserToDelete(user);
    setShowDeleteDialog(true);
    setActiveDropdown(null);
  };

  const handleDelete = async () => {
    if (userToDelete?.user_id && selectedCompany?.dns) {
      setIsDeleting(true);
      try {
        await dispatch(
          deleteUser({
            dnsPrefix: selectedCompany.dns,
            userId: userToDelete.user_id,
          })
        ).unwrap();
        // Refresh users list after successful deletion
        dispatch(
          fetchUsers({
            dnsPrefix: selectedCompany.dns,
            params: { page: currentPage, limit: itemsPerPage },
          })
        );
      } catch (error) {
        console.error("Failed to delete user:", error);
      } finally {
        setIsDeleting(false);
        setShowDeleteDialog(false);
        setUserToDelete(null);
      }
    }
  };

  return (
    <section className="flex flex-col h-full">
      <div className="flex-grow overflow-auto pb-24">
        <div className="w-full relative">
          {loading ? (
            <Skeleton variant="table" />
          ) : filteredUsers.length === 0 ? (
            <EmptyState
              icon={Users}
              title={t("userTable.noUsers")}
              description={t("userTable.emptyMessage")}
            />
          ) : (
            <Table>
              <TableHeader className="bg-1-tokens-color-modes-common-primary-brand-lower rounded-md">
                <TableRow>
                  <TableHead className="w-[77px] text-center text-[#1e2324] font-text-small">
                    <span className="text-center text-[#1e2324]">#</span>
                  </TableHead>
                  <TableHead className="w-[145px] text-left text-[#1e2324] font-text-small">
                    {t("userList.table.name")}
                  </TableHead>
                  <TableHead className="w-[145px] text-left text-[#1e2324] font-text-small">
                    {t("userList.table.email")}
                  </TableHead>
                  <TableHead className="w-[145px] text-left text-[#1e2324] font-text-small">
                    {t("userList.table.status")}
                  </TableHead>
                  <TableHead className="w-[145px] text-left text-[#1e2324] font-text-small">
                    {t("userList.table.role")}
                  </TableHead>
                  <TableHead className="w-[145px] text-left text-[#1e2324] font-text-small">
                    {t("userList.table.stores")}
                  </TableHead>
                  <TableHead className="w-[145px] text-left text-[#1e2324] font-text-small">
                    {t("userList.table.details")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user: UserData, index: number) => (
                  <TableRow
                    key={user.email}
                    className="border-b border-primary-neutal-300 py-[var(--2-tokens-screen-modes-common-spacing-XS)]"
                  >
                    <TableCell className="w-[77px] text-center font-text-smaller text-coolgray-100 align-middle">
                      <span className="font-text-smaller text-coolgray-100">
                        {index + 1}
                      </span>
                    </TableCell>
                    <TableCell className="w-[145px] text-left font-text-bold-smaller text-[color:var(--1-tokens-color-modes-input-primary-default-text)]">
                      {`${user.firstname} ${user.lastname}`}
                    </TableCell>
                    <TableCell className="w-[145px] text-left font-text-smaller text-black">
                      {user.email}
                    </TableCell>
                    <TableCell className="w-[145px] text-left font-text-smaller text-black align-middle">
                      <Badge variant={user.is_active ? "active" : "inactive"}>
                        {user.is_active
                          ? t("productList.table.active")
                          : t("productList.table.inactive")}
                      </Badge>
                    </TableCell>
                    <TableCell className="w-[145px] text-left font-text-smaller text-black">
                      {user.role || "User"}
                    </TableCell>
                    <TableCell className="w-[145px] text-left font-text-smaller text-black">
                      {user.store_ids?.length ||
                        (user?.role === "admin" ? "tout" : "0")}
                    </TableCell>
                    <TableCell className="w-[145px] text-left">
                      <div className="relative inline-flex items-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          ref={(el) => (buttonRefs.current[user.email] = el)}
                          className={`h-8 w-8 hover:bg-gray-100 rounded-full transition-colors duration-200 ${
                            activeDropdown === user.user_id ? "bg-gray-100" : ""
                          }`}
                          onClick={() =>
                            setActiveDropdown(
                              activeDropdown === user.user_id
                                ? null
                                : user.user_id
                            )
                          }
                          aria-expanded={activeDropdown === user.user_id}
                          aria-haspopup="true"
                          aria-label="Open actions menu"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>

                        {activeDropdown === user.user_id && (
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
                                buttonRefs.current[user.email]
                              ),
                            }}
                          >
                            <div className="py-1 divide-y divide-gray-100">
                              <button
                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 group"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewDetails(user.user_id);
                                }}
                                role="menuitem"
                              >
                                <Eye className="mr-3 h-4 w-4 text-gray-400 group-hover:text-primary-600" />
                                <span className="font-medium">
                                  {t("userList.table.details")}
                                </span>
                              </button>
                              <button
                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 group"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(user.user_id);
                                }}
                                role="menuitem"
                              >
                                <Edit className="mr-3 h-4 w-4 text-gray-400 group-hover:text-primary-600" />
                                <span className="font-medium">
                                  {t("userList.actions.edit")}
                                </span>
                              </button>
                              <button
                                className={`flex items-center w-full px-4 py-3 text-sm transition-colors duration-150 group ${
                                  user.is_active
                                    ? "text-red-600 hover:bg-red-50"
                                    : "text-green-600 hover:bg-green-50"
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleClick(user);
                                }}
                                role="menuitem"
                              >
                                <Power
                                  className={`mr-3 h-4 w-4 ${
                                    user.is_active
                                      ? "text-red-400 group-hover:text-red-600"
                                      : "text-green-400 group-hover:text-green-600"
                                  }`}
                                />
                                <span className="font-medium">
                                  {user.is_active
                                    ? t("userList.actions.deactivate")
                                    : t("userList.actions.activate")}
                                </span>
                              </button>
                              <button
                                className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 group"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteClick(user);
                                }}
                                role="menuitem"
                              >
                                <Trash2 className="mr-3 h-4 w-4 text-red-400 group-hover:text-red-600" />
                                <span className="font-medium">
                                  {t("userList.actions.delete")}
                                </span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {!loading && !error && filteredUsers.length > 0 && (
        <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-primary-neutal-300 py-4">
          <div className="px-6 max-w-[calc(100%-2rem)]">
            <Pagination className="flex items-center justify-between w-full mx-auto">
              <PaginationPrevious
                href="#"
                className={`h-[42px] bg-white rounded-lg shadow-1dp-ambient flex items-center gap-1 pl-2 pr-3 py-2.5 font-medium text-[15px] ${
                  currentPage === 1
                    ? "opacity-50 cursor-not-allowed text-gray-400"
                    : "text-black hover:bg-gray-50"
                }`}
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <img
                  className={`w-6 h-6 ${currentPage === 1 ? "opacity-50" : ""}`}
                  alt="Arrow left"
                  src="/img/arrow-left-sm.svg"
                />
                {t("userList.pagination.previous")}
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
                      onClick={() => onPageChange(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    <PaginationEllipsis className="w-9 h-9 flex items-center justify-center rounded border border-solid border-primary-neutal-300 font-bold text-[#023337]" />
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        className="flex items-center justify-center w-9 h-9 rounded border border-solid border-primary-neutal-300 font-medium text-[#023337]"
                        onClick={() => onPageChange(totalPages)}
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}
              </PaginationContent>

              <PaginationNext
                href="#"
                className={`h-[42px] bg-white rounded-lg shadow-1dp-ambient flex items-center gap-1 pl-3 pr-2 py-2.5 font-medium text-[15px] ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed text-gray-400"
                    : "text-black hover:bg-gray-50"
                }`}
                onClick={() =>
                  onPageChange(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
              >
                {t("userList.pagination.next")}
                <img
                  className={`w-6 h-6 rotate-180 ${
                    currentPage === totalPages ? "opacity-50" : ""
                  }`}
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
            <DialogTitle>{t("userList.dialogs.delete.title")}</DialogTitle>
            <DialogDescription>
              {t("userList.dialogs.delete.description")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setUserToDelete(null);
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
              {isDeleting ? t("common.deleting") : t("userList.actions.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toggle Confirmation Dialog */}
      <Dialog open={showToggleDialog} onOpenChange={setShowToggleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {userToToggle?.is_active
                ? t("userList.dialogs.deactivate.title")
                : t("userList.dialogs.activate.title")}
            </DialogTitle>
            <DialogDescription>
              {userToToggle?.is_active
                ? t("userList.dialogs.deactivate.description")
                : t("userList.dialogs.activate.description")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowToggleDialog(false);
                setUserToToggle(null);
              }}
            >
              {t("common.cancel")}
            </Button>
            <Button
              variant={userToToggle?.is_active ? "destructive" : "default"}
              className={
                userToToggle?.is_active
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }
              onClick={handleToggleActive}
              disabled={isTogglingActive}
            >
              {isTogglingActive
                ? t("common.processing")
                : userToToggle?.is_active
                ? t("userList.actions.deactivate")
                : t("userList.actions.activate")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};
