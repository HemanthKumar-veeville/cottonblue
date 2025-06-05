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
import { useState, useMemo, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "../../components/Skeleton";
import EmptyState from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";
import { Users, MoreVertical, Eye, Edit, Power } from "lucide-react";
import { fetchUsers, modifyUser } from "../../store/features/userSlice";
import { getHost } from "../../utils/hostUtils";

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

export const ClientUserTableSection = ({
  filteredUsers,
}: {
  filteredUsers: UserData[];
}): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isLoading: loading, error } = useAppSelector((state) => state.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const dispatch = useAppDispatch();
  const { selectedCompany } = useAppSelector((state) => state.client);
  const ITEMS_PER_PAGE = 5;
  const host = getHost();
  const dnsPrefix = host || selectedCompany?.dns;
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
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  // Get current page users
  const currentUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  // Handle select all checkbox
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(currentUsers.map((user) => user.email));
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

  // Generate pagination items
  const paginationItems = useMemo(() => {
    const items = [];
    for (let i = 1; i <= totalPages; i++) {
      items.push(i);
    }
    return items;
  }, [totalPages]);

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

  const handleToggleActive = async (user: any) => {
    try {
      if (user?.user_id && dnsPrefix) {
        await dispatch(
          modifyUser({
            dnsPrefix: dnsPrefix,
            userId: user?.user_id,
            data: {
              is_active: !user?.is_active,
            },
          })
        ).unwrap();
        // Refresh users list after successful import
        await dispatch(fetchUsers({ dnsPrefix: dnsPrefix || "" }));
        setActiveDropdown(null);
      }
    } catch (error: any) {
      console.error("Failed to toggle user activation:", error);
      // You might want to show an error toast/notification here
    }
  };

  return (
    <section className="flex flex-col h-full">
      <div className="flex-grow overflow-auto pb-24">
        <div className="w-full relative">
          {loading ? (
            <Skeleton variant="table" />
          ) : error ? (
            <ErrorState
              message={error}
              variant="inline"
              onRetry={() => window.location.reload()}
            />
          ) : currentUsers.length === 0 ? (
            <EmptyState
              icon={Users}
              title={t("userTable.noUsers")}
              description={t("userTable.emptyMessage")}
            />
          ) : (
            <Table className="bg-white rounded-[var(--2-tokens-screen-modes-common-spacing-XS)]">
              <TableHeader className="bg-[#eaf8e7] rounded-md">
                <TableRow>
                  <TableHead className="w-11">
                    <div className="flex justify-center">
                      <Checkbox
                        className="w-5 h-5 bg-white rounded border-[1.5px] border-solid border-[#d1d5db]"
                        checked={selectAll}
                        onCheckedChange={handleSelectAll}
                      />
                    </div>
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
                {currentUsers.map((user: UserData) => (
                  <TableRow
                    key={user.email}
                    className="border-b border-[#e5e7eb] py-[var(--2-tokens-screen-modes-common-spacing-XS)]"
                  >
                    <TableCell className="w-11">
                      <div className="flex justify-center">
                        <Checkbox
                          className="w-5 h-5 bg-white rounded border-[1.5px] border-solid border-[#d1d5db]"
                          checked={selectedUsers.includes(user.email)}
                          onCheckedChange={() => handleSelectUser(user.email)}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="w-[145px] text-left font-text-bold-smaller text-[#1e2324]">
                      {`${user.firstname} ${user.lastname}`}
                    </TableCell>
                    <TableCell className="w-[145px] text-left font-text-smaller text-[#1e2324]">
                      {user.email}
                    </TableCell>
                    <TableCell className="w-[145px] text-left font-text-smaller text-[#1e2324]">
                      {user.is_active
                        ? t("userList.table.active")
                        : t("userList.table.inactive")}
                    </TableCell>
                    <TableCell className="w-[145px] text-left font-text-smaller text-[#1e2324]">
                      {user.role || "User"}
                    </TableCell>
                    <TableCell className="w-[145px] text-left font-text-smaller text-[#1e2324]">
                      {user.store_ids?.length || 0} stores
                    </TableCell>
                    <TableCell className="w-[145px] text-left">
                      <div className="relative inline-flex items-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          ref={(el) => (buttonRefs.current[user.email] = el)}
                          className={`h-8 w-8 hover:bg-[#f3f4f6] rounded-full transition-colors duration-200 ${
                            activeDropdown === user.user_id
                              ? "bg-[#f3f4f6]"
                              : ""
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
                            <div className="py-1 divide-y divide-[#f3f4f6]">
                              <button
                                className="flex items-center w-full px-4 py-3 text-sm text-[#1e2324] hover:bg-[#f9fafb] transition-colors duration-150 group"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewDetails(user.user_id);
                                }}
                                role="menuitem"
                              >
                                <Eye className="mr-3 h-4 w-4 text-[#9ca3af] group-hover:text-[#00b85b]" />
                                <span className="font-medium">
                                  {t("userList.table.details")}
                                </span>
                              </button>
                              <button
                                className="flex items-center w-full px-4 py-3 text-sm text-[#1e2324] hover:bg-[#f9fafb] transition-colors duration-150 group"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(user.user_id);
                                }}
                                role="menuitem"
                              >
                                <Edit className="mr-3 h-4 w-4 text-[#9ca3af] group-hover:text-[#00b85b]" />
                                <span className="font-medium">
                                  {t("userList.actions.edit")}
                                </span>
                              </button>
                              <button
                                className={`flex items-center w-full px-4 py-3 text-sm transition-colors duration-150 group ${
                                  user.is_active
                                    ? "text-[#ef4444] hover:bg-[#fef2f2]"
                                    : "text-[#00b85b] hover:bg-[#f0fdf4]"
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleActive(user);
                                }}
                                role="menuitem"
                              >
                                <Power
                                  className={`mr-3 h-4 w-4 ${
                                    user.is_active
                                      ? "text-[#f87171] group-hover:text-[#ef4444]"
                                      : "text-[#34d399] group-hover:text-[#00b85b]"
                                  }`}
                                />
                                <span className="font-medium">
                                  {user.is_active
                                    ? t("userList.actions.deactivate")
                                    : t("userList.actions.activate")}
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

      {!loading && !error && currentUsers.length > 0 && (
        <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-[#e5e7eb] py-4">
          <div className="px-6 max-w-[calc(100%-2rem)]">
            <Pagination className="flex items-center justify-between w-full mx-auto">
              <PaginationPrevious
                href="#"
                className={`h-[42px] bg-white rounded-lg shadow-1dp-ambient flex items-center gap-1 pl-2 pr-3 py-2.5 font-medium text-black text-[15px] ${
                  currentPage === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <img
                  className="w-6 h-6"
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
                className={`h-[42px] bg-white rounded-lg shadow-1dp-ambient flex items-center gap-1 pl-3 pr-2 py-2.5 font-medium text-black text-[15px] ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
              >
                {t("userList.pagination.next")}
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
