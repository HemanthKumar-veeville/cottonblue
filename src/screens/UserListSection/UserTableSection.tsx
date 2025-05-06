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
import { useState, useMemo } from "react";
import { useAppSelector } from "../../store/store";
import type { User } from "../../store/features/userSlice";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "../../components/Skeleton";
import EmptyState from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";
import { Users } from "lucide-react";

interface UserData {
  firstname: string;
  lastname: string;
  email: string;
  role?: string;
  store_ids: number[];
}

export const UserTableSection = (): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    users,
    isLoading: loading,
    error,
  } = useAppSelector((state) => state.user);
  const userList = users?.users || [];
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const ITEMS_PER_PAGE = 5;

  // Calculate total pages
  const totalPages = Math.ceil(userList.length / ITEMS_PER_PAGE);

  // Get current page users
  const currentUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return userList.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [userList, currentPage]);

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

  return (
    <section className="flex flex-col h-screen">
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
          ) : currentUsers.length === 0 ? (
            <EmptyState
              icon={Users}
              title={t("userTable.noUsers")}
              description={t("userTable.emptyMessage")}
            />
          ) : (
            <Table>
              <TableHeader className="bg-1-tokens-color-modes-common-primary-brand-lower rounded-md">
                <TableRow>
                  <TableHead className="w-11">
                    <div className="flex justify-center">
                      <Checkbox
                        className="w-5 h-5 bg-color-white rounded border-[1.5px] border-solid border-1-tokens-color-modes-common-neutral-medium"
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
                    className="border-b border-primary-neutal-300 py-[var(--2-tokens-screen-modes-common-spacing-XS)]"
                  >
                    <TableCell className="w-11">
                      <div className="flex justify-center">
                        <Checkbox
                          className="w-5 h-5 bg-color-white rounded border-[1.5px] border-solid border-1-tokens-color-modes-common-neutral-medium"
                          checked={selectedUsers.includes(user.email)}
                          onCheckedChange={() => handleSelectUser(user.email)}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="w-[145px] text-left font-text-bold-smaller text-[color:var(--1-tokens-color-modes-input-primary-default-text)]">
                      {`${user.firstname} ${user.lastname}`}
                    </TableCell>
                    <TableCell className="w-[145px] text-left font-text-smaller text-black">
                      {user.email}
                    </TableCell>
                    <TableCell className="w-[145px] text-left font-text-smaller text-black">
                      {user.role || "User"}
                    </TableCell>
                    <TableCell className="w-[145px] text-left font-text-smaller text-black">
                      {user.store_ids?.length || 0} stores
                    </TableCell>
                    <TableCell className="w-[145px] text-left">
                      <Button
                        variant="link"
                        onClick={() =>
                          navigate(`/users/${encodeURIComponent(user.user_id)}`)
                        }
                        className="text-[color:var(--1-tokens-color-modes-button-ghost-default-text)] font-text-small underline"
                      >
                        {t("userList.table.details")}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {!loading && !error && currentUsers.length > 0 && (
        <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-primary-neutal-300 py-4">
          <div className="px-6 max-w-[calc(100%-2rem)]">
            <Pagination className="flex items-center justify-between w-full mx-auto">
              <PaginationPrevious
                href="#"
                className="h-[42px] bg-white rounded-lg shadow-1dp-ambient flex items-center gap-1 pl-2 pr-3 py-2.5 font-medium text-black text-[15px]"
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
                className="h-[42px] bg-white rounded-lg shadow-1dp-ambient flex items-center gap-1 pl-3 pr-2 py-2.5 font-medium text-black text-[15px]"
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
