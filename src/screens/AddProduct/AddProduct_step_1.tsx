import React, { useState, useCallback } from "react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import { Check, ChevronLeft, Info, Search, Store, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { cn } from "../../lib/utils";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../store/features/productSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { CreateProductData } from "../../services/productService";
// Types
interface Store {
  id: string;
  name: string;
  location: string;
  isSelected: boolean;
}

interface ProductDetails {
  product_name: string;
  product_description: string;
  product_price: number;
  total_stock: number;
  product_image: File | null;
}

// Constants
const storeLocations = [
  "Marseille",
  "Nice",
  "Strasbourg",
  "Bordeaux",
  "Grenoble",
  "Dijon",
  "Nîmes",
  "Le Havre",
  "Limoges",
  "Besançon",
  "Nantes",
  "Lille",
  "Saint-Étienne",
  "Tours",
  "Annecy",
  "Metz",
  "La Rochelle",
  "Mulhouse",
  "Boulogne-Billancourt",
  "Nancy",
  "Lyon",
  "Toulouse",
  "Montpellier",
  "Rennes",
  "Aix-en-Provence",
  "Clermont-Ferrand",
  "Amiens",
  "Perpignan",
  "Caen",
  "Saint-Denis",
];

// Reusable Components
const FormField = ({
  label,
  children,
  className,
}: {
  label?: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("relative w-full", className)}>
    <div className="relative">
      {children}
      {label && (
        <span className="absolute -top-[10px] left-[10px] px-1 bg-white text-sm font-medium text-gray-600">
          {label}
        </span>
      )}
    </div>
  </div>
);

const ProgressIndicator = () => (
  <div className="flex items-center justify-center w-full mb-8">
    <div className="flex items-center justify-center gap-2">
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium bg-[#07515f] text-white">
          1
        </div>
        <div className="w-12 h-0.5 mx-2 bg-[#07515f]" />
      </div>
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium bg-[#07515f] text-white">
          2
        </div>
        <div className="w-12 h-0.5 mx-2 bg-gray-200" />
      </div>
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium bg-gray-100 text-gray-400">
          3
        </div>
      </div>
    </div>
  </div>
);

const Header = ({ onBack }: { onBack: () => void }) => (
  <div className="inline-flex items-center gap-2 relative">
    <Button variant="ghost" size="icon" className="w-6 h-6" onClick={onBack}>
      <ChevronLeft className="w-5 h-5" />
    </Button>
    <h3 className="text-[#475569] font-inter text-xl font-bold leading-7">
      In which stores?
    </h3>
  </div>
);

const ProductCard = ({ product }: { product: ProductDetails }) => (
  <Card className="bg-[color:var(--1-tokens-color-modes-background-secondary)] p-0 border-0">
    <CardContent className="flex items-center p-4">
      <div
        className="w-[50px] h-[50px] rounded-lg bg-cover bg-center mr-4"
        style={{
          backgroundImage: `url(${
            product.product_image
              ? URL.createObjectURL(product.product_image)
              : ""
          })`,
        }}
      />
      <div className="flex flex-col items-start gap-1">
        <h4 className="[font-family:'Inter-Bold',Helvetica] font-bold text-[color:var(--1-tokens-color-modes-input-primary-default-text)] text-xl leading-7">
          {product.product_name}
        </h4>
        <p className="font-text-medium text-[color:var(--1-tokens-color-modes-input-primary-default-text)] text-[length:var(--text-medium-font-size)] leading-[var(--text-medium-line-height)]">
          {product.product_description}
        </p>
      </div>
    </CardContent>
  </Card>
);

const StoreSelectionControls = ({
  onSelectAll,
  onSearch,
  isAllSelected,
}: {
  onSelectAll: (checked: boolean) => void;
  onSearch: (query: string) => void;
  isAllSelected: boolean;
}) => (
  <div className="w-full gap-6 flex items-start">
    <div className="inline-flex gap-6 flex-col items-start">
      <Button variant="outline" className="flex items-center gap-2 h-auto py-2">
        <Checkbox
          id="all-stores"
          checked={isAllSelected}
          onCheckedChange={onSelectAll}
          className="w-4 h-4"
        />
        <label
          htmlFor="all-stores"
          className="text-[color:var(--1-tokens-color-modes-input-primary-default-text)] text-[length:var(--label-small-font-size)] leading-[var(--label-small-line-height)]"
        >
          All stores
        </label>
      </Button>
    </div>
    <div className="flex-1 relative">
      <div className="relative">
        <FormField label="Available stores">
          <Input
            placeholder="Search"
            className="pl-4 pr-10 py-2 h-auto"
            onChange={(e) => onSearch(e.target.value)}
          />
        </FormField>
        <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[color:var(--1-tokens-color-modes-input-primary-default-icon)]" />
      </div>
    </div>
  </div>
);

const StoreBadgesGrid = ({
  stores,
  onRemoveStore,
}: {
  stores: Store[];
  onRemoveStore: (storeId: string) => void;
}) => (
  <div className="grid grid-cols-3 gap-2">
    {stores.map((store) => (
      <Badge
        key={store.id}
        variant="outline"
        className="flex items-center justify-between px-3 py-1 h-auto bg-[color:var(--1-tokens-color-modes-input-primary-default-background)] rounded-md"
      >
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 ml-1"
            onClick={() => onRemoveStore(store.id)}
          >
            <X className="w-3.5 h-3.5" />
          </Button>
          <span className="text-[color:var(--1-tokens-color-modes-input-primary-default-text)] text-[length:var(--label-smaller-font-size)] leading-[var(--label-smaller-line-height)] truncate">
            Chronodrive - {store.location}
          </span>
        </div>
        <Info className="w-3.5 h-3.5" />
      </Badge>
    ))}
  </div>
);

const StoreList = ({
  stores,
  onToggleStore,
}: {
  stores: Store[];
  onToggleStore: (storeId: string) => void;
}) => (
  <div className="mt-4 grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto">
    {stores.map((store) => (
      <div
        key={store.id}
        className="flex items-center justify-between p-2 border rounded-md hover:bg-gray-50"
      >
        <div className="flex items-center gap-2">
          <Checkbox
            checked={store.isSelected}
            onCheckedChange={() => onToggleStore(store.id)}
          />
          <span>{store.name}</span>
        </div>
        <Info className="w-4 h-4 text-gray-400" />
      </div>
    ))}
  </div>
);

const FooterButtons = ({
  onSaveDraft,
  onPublish,
  isSubmitting,
}: {
  onSaveDraft: () => void;
  onPublish: () => void;
  isSubmitting: boolean;
}) => (
  <div className="flex items-center justify-end self-stretch w-full gap-4 mt-8">
    <Button
      variant="outline"
      className="text-[color:var(--1-tokens-color-modes-button-secondary-default-text)]"
      onClick={onSaveDraft}
      disabled={isSubmitting}
    >
      Save as draft
    </Button>
    <Button
      className="bg-[#07515f] text-[color:var(--1-tokens-color-modes-button-primary-default-text)]"
      onClick={onPublish}
      disabled={isSubmitting}
    >
      Publish the product
    </Button>
  </div>
);

const ProductDetails = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedCompany } = useAppSelector((state) => state.client);

  const [stores, setStores] = useState<Store[]>(
    storeLocations.map((location, index) => ({
      id: `store-${index}`,
      name: `Chronodrive - ${location}`,
      location,
      isSelected: false,
    }))
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productData, setProductData] = useState<ProductDetails>({
    product_name: "",
    product_description: "",
    product_price: 0,
    total_stock: 0,
    product_image: null,
  });

  const handleSelectAll = useCallback((checked: boolean) => {
    setStores((prev) =>
      prev.map((store) => ({ ...store, isSelected: checked }))
    );
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleToggleStore = useCallback((storeId: string) => {
    setStores((prev) =>
      prev.map((store) =>
        store.id === storeId
          ? { ...store, isSelected: !store.isSelected }
          : store
      )
    );
  }, []);

  const handleRemoveStore = useCallback((storeId: string) => {
    setStores((prev) =>
      prev.map((store) =>
        store.id === storeId ? { ...store, isSelected: false } : store
      )
    );
  }, []);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const validateForm = () => {
    const selectedStores = stores.filter((store) => store.isSelected);
    if (selectedStores.length === 0) {
      throw new Error("Please select at least one store");
    }

    if (!selectedCompany?.id) {
      throw new Error("No company selected");
    }

    if (!productData.product_name) {
      throw new Error("Product name is required");
    }

    if (!productData.product_description) {
      throw new Error("Product description is required");
    }

    if (!productData.product_price || productData.product_price <= 0) {
      throw new Error("Valid product price is required");
    }

    if (!productData.total_stock || productData.total_stock <= 0) {
      throw new Error("Valid total stock is required");
    }

    if (!productData.product_image) {
      throw new Error("Product image is required");
    }
  };

  const handleSaveDraft = useCallback(async () => {
    setIsSubmitting(true);
    try {
      // Log form data
      console.log("Product Data:", {
        ...productData,
        selectedStores: stores.filter((store) => store.isSelected),
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(t("productDetails.messages.draftSaved"));
    } catch (error) {
      toast.error(t("productDetails.messages.saveError"));
    } finally {
      setIsSubmitting(false);
    }
  }, [t, productData, stores]);

  const handlePublish = useCallback(async () => {
    setIsSubmitting(true);
    try {
      // Validate form
      validateForm();

      // Get selected stores
      const selectedStores = stores.filter((store) => store.isSelected);

      // Log form data before submission
      console.log("Publishing Product Data:", {
        ...productData,
        selectedStores,
        company_id: selectedCompany?.id,
      });

      // Ensure product_image is not null (validateForm already checks this)
      if (!productData.product_image) {
        throw new Error("Product image is required");
      }

      // Create the product data
      const createProductData: CreateProductData = {
        company_id: selectedCompany!.id,
        product_name: productData.product_name,
        product_description: productData.product_description,
        product_price: productData.product_price,
        available_region: selectedStores
          .map((store) => store.location)
          .join(","),
        total_stock: productData.total_stock,
        product_image: productData.product_image,
      };

      // Dispatch the create product action
      const resultAction = await dispatch(
        createProduct({
          dnsPrefix: selectedCompany!.dns,
          data: createProductData,
        }) as any
      );

      if (createProduct.fulfilled.match(resultAction)) {
        toast.success(t("productDetails.messages.published"));
        navigate("/products");
      } else {
        throw new Error(
          resultAction.error?.message || "Failed to create product"
        );
      }
    } catch (error: any) {
      toast.error(error.message || t("productDetails.messages.publishError"));
    } finally {
      setIsSubmitting(false);
    }
  }, [t, navigate, dispatch, productData, stores, selectedCompany]);

  const filteredStores = stores.filter((store) =>
    store.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedStores = stores.filter((store) => store.isSelected);
  const isAllSelected = stores.every((store) => store.isSelected);

  return (
    <div className="flex flex-col items-start gap-8 p-6 relative bg-white rounded-lg overflow-hidden">
      <ProgressIndicator />
      <Header onBack={handleBack} />
      <div className="flex flex-col w-full justify-between flex-1 items-start">
        <div className="inline-flex gap-8 flex-col items-start w-full">
          <ProductCard product={productData} />
          <div className="flex flex-col gap-8 w-full">
            <StoreSelectionControls
              onSelectAll={handleSelectAll}
              onSearch={handleSearch}
              isAllSelected={isAllSelected}
            />
            <StoreList
              stores={filteredStores}
              onToggleStore={handleToggleStore}
            />
            {selectedStores.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Selected Stores</h4>
                <StoreBadgesGrid
                  stores={selectedStores}
                  onRemoveStore={handleRemoveStore}
                />
              </div>
            )}
          </div>
        </div>
        <FooterButtons
          onSaveDraft={handleSaveDraft}
          onPublish={handlePublish}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default ProductDetails;
