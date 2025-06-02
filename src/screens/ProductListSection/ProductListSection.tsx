import { DownloadIcon, PlusIcon, SearchIcon, UploadIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import ImportCSVModal from "../../components/ImportCSVModal/ImportCSVModal";
import { ExportCSV } from "../../components/ExportCSV/ExportCSV";
import { RootState, useAppDispatch, useAppSelector } from "../../store/store";
import {
  createProduct,
  fetchAllProducts,
} from "../../store/features/productSlice";
import { useNavigate } from "react-router-dom";
import type { Product } from "../../store/features/productSlice";
import { toast } from "sonner";
import { useSelector } from "react-redux";

export const ProductListSection = ({
  isWarehouse,
  searchQuery,
  setSearchQuery,
}: {
  isWarehouse: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Get products from Redux store
  const { products, loading, error } = useAppSelector((state) => state.product);
  const { selectedCompany } = useAppSelector((state) => state.client);
  const { adminMode } = useSelector((state: RootState) => state.auth);

  const productList = products?.products || [];
  const dnsPrefix = adminMode ? "admin" : selectedCompany?.dns || "admin";
  // Fetch products on component mount
  useEffect(() => {
    if (dnsPrefix) {
      dispatch(fetchAllProducts(dnsPrefix));
    }
  }, [dispatch, dnsPrefix]);

  const handleImport = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("csv_file", file);
      formData.append("company_id", selectedCompany!.id);
      // Dispatch create product action
      const resultAction = await dispatch(
        createProduct({
          dnsPrefix: dnsPrefix,
          data: formData as any,
        }) as any
      );

      if (createProduct.fulfilled.match(resultAction)) {
        toast.success(t("productSidebar.messages.published"));
      } else {
        throw new Error(
          resultAction.error?.message ||
            t("productSidebar.messages.publishError")
        );
      }

      // Refresh products list after successful import
      dispatch(fetchAllProducts(dnsPrefix));
    } catch (error) {
      console.error("Error importing CSV:", error);
      throw error;
    }
  };

  const handleCreateProduct = () => {
    navigate("/products/add");
  };

  return (
    <section className="flex flex-col gap-[var(--2-tokens-screen-modes-common-spacing-m)] w-full">
      <header>
        <h3 className="font-heading-h3 text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] text-[length:var(--heading-h3-font-size)] tracking-[var(--heading-h3-letter-spacing)] leading-[var(--heading-h3-line-height)] font-[number:var(--heading-h3-font-weight)] [font-style:var(--heading-h3-font-style)]">
          {t("productList.title")}
        </h3>
      </header>

      <div className="flex items-center justify-between w-full">
        <div className="relative w-[400px]">
          <Input
            className="pl-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-h)] pr-12 py-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-v)] bg-[color:var(--1-tokens-color-modes-input-primary-default-background)] border-[color:var(--1-tokens-color-modes-input-primary-default-border)] rounded-[var(--2-tokens-screen-modes-input-border-radius)]"
            placeholder={t("productList.search.placeholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-line-height)] h-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-line-height)]">
            <SearchIcon className="w-5 h-5 text-[color:var(--1-tokens-color-modes-input-primary-default-icon)]" />
          </div>
        </div>

        {!isWarehouse && (
          <div className="flex items-center gap-[var(--2-tokens-screen-modes-common-spacing-m)]">
            <Button
              className="flex items-center gap-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-gap)] py-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-h)] px-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-v)] min-w-[92px] bg-[#07515f] rounded-[var(--2-tokens-screen-modes-nav-tab-border-radius)]"
              onClick={handleCreateProduct}
            >
              <PlusIcon className="w-6 h-6" />
              <span className="font-label-smaller text-[length:var(--label-smaller-font-size)] leading-[var(--label-smaller-line-height)] tracking-[var(--label-smaller-letter-spacing)] font-[number:var(--label-smaller-font-weight)] text-[color:var(--1-tokens-color-modes-button-primary-default-text)] [font-style:var(--label-smaller-font-style)]">
                {t("productList.actions.create")}
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

            <Button
              variant="outline"
              className="flex items-center gap-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-gap)] py-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-h)] px-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-v)] min-w-[92px] bg-[color:var(--1-tokens-color-modes-button-secondary-default-background)] border-[color:var(--1-tokens-color-modes-button-secondary-default-border)] rounded-[var(--2-tokens-screen-modes-button-border-radius)]"
              onClick={() => setIsExportModalOpen(true)}
            >
              <UploadIcon className="w-6 h-6 text-[color:var(--1-tokens-color-modes-button-secondary-default-icon)]" />
              <span className="font-label-smaller text-[length:var(--label-smaller-font-size)] leading-[var(--label-smaller-line-height)] tracking-[var(--label-smaller-letter-spacing)] font-[number:var(--label-smaller-font-weight)] text-[color:var(--1-tokens-color-modes-button-secondary-default-text)] [font-style:var(--label-smaller-font-style)]">
                {t("productList.actions.exportCsv")}
              </span>
            </Button>
          </div>
        )}
      </div>

      <ImportCSVModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImport}
        templateColumns={[
          "Product Name",
          "SKU Reference",
          "Pack of",
          "Pack Price",
          "Total Packs",
          "Suitable For",
          "Size",
          "Product Description",
        ]}
        sheetName="Products"
      />
      <ExportCSV
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        products={productList}
        sheetName="Products"
        templateColumns={[
          "Product Name",
          "SKU Reference",
          "Pack of",
          "Pack Price",
          "Total Packs",
          "Suitable For",
          "Size",
          "Product Description",
        ]}
      />
    </section>
  );
};
