import { DownloadIcon, PlusIcon, SearchIcon, UploadIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useMemo } from "react";
import ImportCSVModal from "../../components/ImportCSVModal/ImportCSVModal";
import { ExportCSV } from "../../components/ExportCSV/ExportCSV";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { registerUser, fetchUsers } from "../../store/features/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ClientUserTableSection } from "./CientlUserTableSection";
import { getHost } from "../../utils/hostUtils";
import { useCompanyColors } from "../../hooks/useCompanyColors";

const Heading = ({ text }: { text: string }) => (
  <h3 className="text-[length:var(--heading-h3-font-size)] font-heading-h3 font-[number:var(--heading-h3-font-weight)] text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] tracking-[var(--heading-h3-letter-spacing)] leading-[var(--heading-h3-line-height)] [font-style:var(--heading-h3-font-style)]">
    {text}
  </h3>
);

interface ClientUserListSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
}

export const ClientUserListSection = ({
  searchQuery,
  setSearchQuery,
  currentPage,
  setCurrentPage,
  itemsPerPage,
}: ClientUserListSectionProps): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Get users from Redux store
  const usersData = useAppSelector((state) => state.user);
  const { selectedCompany } = useAppSelector((state) => state.client);
  const userList = usersData?.users?.users || [];
  const total = usersData?.users?.total_users || 0;
  const page = usersData?.users?.page || 1;
  const host = getHost();
  const dnsPrefix = host;

  // Filter users based on search query
  const filteredUsers = userList;

  const handleImport = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("csv_file", file);
      formData.append("company_id", selectedCompany!.id);

      const resultAction = await dispatch(
        registerUser({
          dnsPrefix: dnsPrefix,
          data: formData as any,
        }) as any
      );

      if (registerUser.fulfilled.match(resultAction)) {
        console.log("User created successfully");
      } else {
        throw new Error(
          resultAction.error?.message || t("userSidebar.messages.publishError")
        );
      }

      // Refresh users list after successful import
      dispatch(
        fetchUsers({
          dnsPrefix: dnsPrefix || "",
          params: {
            page: currentPage,
            limit: itemsPerPage,
            search: searchQuery?.trim() || "",
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

  const { buttonStyles } = useCompanyColors();

  return (
    <section
      className="flex flex-col gap-[var(--2-tokens-screen-modes-common-spacing-m)] w-full"
      style={buttonStyles}
    >
      <header className="flex items-center justify-between w-full">
        <Heading text={t("userList.title")} />
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
            className="flex items-center gap-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-gap)] py-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-h)] px-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-v)]"
            onClick={handleCreateUser}
            style={{
              backgroundColor: "var(--primary-color)",
              color: "var(--primary-text-color)",
              borderColor: "var(--primary-color)",
            }}
          >
            <PlusIcon className="w-4 h-4" />
            <span className="font-label-smaller text-[length:var(--label-smaller-font-size)] leading-[var(--label-smaller-line-height)] tracking-[var(--label-smaller-letter-spacing)] font-[number:var(--label-smaller-font-weight)] text-white [font-style:var(--label-smaller-font-style)]">
              {t("userList.actions.create")}
            </span>
          </Button>
        </div>
      </div>

      <ClientUserTableSection
        filteredUsers={filteredUsers}
        currentPage={currentPage}
        totalItems={total}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />

      <ImportCSVModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImport}
        templateColumns={[
          "User Name",
          "User Email",
          "User Role",
          "Department",
          "Phone Number",
        ]}
        sheetName="Users"
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
