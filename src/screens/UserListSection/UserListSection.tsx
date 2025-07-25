import { DownloadIcon, PlusIcon, SearchIcon, UploadIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { registerUser, fetchUsers } from "../../store/features/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { UserTableSection } from "./UserTableSection";
import {
  withCSVModals,
  CSVModalProps,
} from "../../components/CSVModals/withCSVModals";
import { ExportCSV } from "../../components/ExportCSV/ExportCSV";

interface UserListSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
}

const UserListSectionBase = ({
  searchQuery,
  setSearchQuery,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setIsImportModalOpen,
}: UserListSectionProps & CSVModalProps): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Get users from Redux store
  const usersData = useAppSelector((state) => state.user);
  const { selectedCompany } = useAppSelector((state) => state.client);
  const userList = usersData?.users?.users || [];
  const total = usersData?.users?.total_users || 0;
  const page = usersData?.users?.page || 1;

  // Filter users based on search query
  const filteredUsers = userList;

  const handleImport = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("csv_file", file);
      formData.append("company_id", selectedCompany!.id);

      const resultAction = await dispatch(
        registerUser({
          dnsPrefix: selectedCompany!.dns,
          data: formData as any,
        }) as any
      );

      if (registerUser.fulfilled.match(resultAction)) {
        toast.success(t("userSidebar.messages.published"));
      } else {
        throw new Error(
          resultAction.error?.message || t("userSidebar.messages.publishError")
        );
      }

      // Refresh users list after successful import
      dispatch(
        fetchUsers({
          dnsPrefix: selectedCompany?.dns || "",
          params: {
            page: currentPage,
            limit: itemsPerPage,
            search: searchQuery.trim(),
          },
        })
      );
    } catch (error) {
      console.error("Error importing CSV:", error);
      throw error;
    }
  };

  const handleCreateUser = () => {
    navigate("/users/add");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <section className="flex flex-col gap-[var(--2-tokens-screen-modes-common-spacing-m)] w-full">
      <header>
        <h3 className="font-heading-h3 text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] text-[length:var(--heading-h3-font-size)] tracking-[var(--heading-h3-letter-spacing)] leading-[var(--heading-h3-line-height)] font-[number:var(--heading-h3-font-weight)] [font-style:var(--heading-h3-font-style)]">
          {t("userList.title")}
        </h3>
      </header>

      <div className="flex items-center justify-between w-full">
        <div className="relative w-[400px]">
          <Input
            className="pl-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-h)] pr-12 py-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-v)] bg-[color:var(--1-tokens-color-modes-input-primary-default-background)] border-[color:var(--1-tokens-color-modes-input-primary-default-border)] rounded-[var(--2-tokens-screen-modes-input-border-radius)]"
            placeholder={t("userList.search.placeholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-line-height)] h-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-line-height)]">
            <SearchIcon className="w-5 h-5 text-[color:var(--1-tokens-color-modes-input-primary-default-icon)]" />
          </div>
        </div>

        <div className="flex items-center gap-[var(--2-tokens-screen-modes-common-spacing-m)]">
          <Button
            className="flex items-center gap-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-gap)] py-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-h)] px-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-v)] min-w-[92px] bg-[#07515f] rounded-[var(--2-tokens-screen-modes-nav-tab-border-radius)]"
            onClick={handleCreateUser}
          >
            <PlusIcon className="w-6 h-6" />
            <span className="font-label-smaller text-[length:var(--label-smaller-font-size)] leading-[var(--label-smaller-line-height)] tracking-[var(--label-smaller-letter-spacing)] font-[number:var(--label-smaller-font-weight)] text-[color:var(--1-tokens-color-modes-button-primary-default-text)] [font-style:var(--label-smaller-font-style)]">
              {t("userList.actions.create")}
            </span>
          </Button>

          <Button
            variant="outline"
            className="flex items-center gap-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-gap)] py-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-h)] px-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-v)] min-w-[92px] bg-[color:var(--1-tokens-color-modes-button-secondary-default-background)] border-[color:var(--1-tokens-color-modes-button-secondary-default-border)] rounded-[var(--2-tokens-screen-modes-button-border-radius)]"
            onClick={() => setIsImportModalOpen(true)}
          >
            <DownloadIcon className="w-6 h-6 text-[color:var(--1-tokens-color-modes-button-secondary-default-icon)]" />
            <span className="font-label-smaller text-[length:var(--label-smaller-font-size)] leading-[var(--label-smaller-line-height)] tracking-[var(--label-smaller-letter-spacing)] font-[number:var(--label-smaller-font-weight)] text-[color:var(--1-tokens-color-modes-button-secondary-default-text)] [font-style:var(--label-smaller-font-style)]">
              {t("productList.actions.importCsv")}
            </span>
          </Button>

          {/* <Button
            variant="outline"
            className="flex items-center gap-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-gap)] py-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-h)] px-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-v)] min-w-[92px] bg-[color:var(--1-tokens-color-modes-button-secondary-default-background)] border-[color:var(--1-tokens-color-modes-button-secondary-default-border)] rounded-[var(--2-tokens-screen-modes-button-border-radius)]"
            onClick={() => setIsExportModalOpen(true)}
          >
            <UploadIcon className="w-6 h-6 text-[color:var(--1-tokens-color-modes-button-secondary-default-icon)]" />
            <span className="font-label-smaller text-[length:var(--label-smaller-font-size)] leading-[var(--label-smaller-line-height)] tracking-[var(--label-smaller-letter-spacing)] font-[number:var(--label-smaller-font-weight)] text-[color:var(--1-tokens-color-modes-button-secondary-default-text)] [font-style:var(--label-smaller-font-style)]">
              {t("productList.actions.exportCsv")}
            </span>
          </Button> */}
        </div>
      </div>

      <UserTableSection
        filteredUsers={filteredUsers}
        currentPage={currentPage}
        totalItems={total}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />

      <ExportCSV
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        products={filteredUsers}
        sheetName="Users"
      />
    </section>
  );
};

// Configure the CSV functionality for users
const csvConfig = {
  templateColumns: ["Prénom", "Nom de famille", "Email", "Téléphone"],
  sheetName: "Users",
  importEndpoint: "/api/users/import",
  exportEndpoint: "/api/users/export",
};

// Create the enhanced component with CSV functionality
export const UserListSection = withCSVModals(UserListSectionBase, csvConfig);
