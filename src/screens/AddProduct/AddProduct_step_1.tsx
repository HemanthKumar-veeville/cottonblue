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

// Types
interface Store {
  id: string;
  name: string;
  location: string;
  isSelected: boolean;
}

interface ProductDetails {
  name: string;
  category: string;
  imageUrl: string;
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
        style={{ backgroundImage: `url(${product.imageUrl})` }}
      />
      <div className="flex flex-col items-start gap-1">
        <h4 className="[font-family:'Inter-Bold',Helvetica] font-bold text-[color:var(--1-tokens-color-modes-input-primary-default-text)] text-xl leading-7">
          {product.name}
        </h4>
        <p className="font-text-medium text-[color:var(--1-tokens-color-modes-input-primary-default-text)] text-[length:var(--text-medium-font-size)] leading-[var(--text-medium-line-height)]">
          {product.category}
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
  const [product] = useState<ProductDetails>({
    name: "Fleece jacket",
    category: "Workwear",
    imageUrl: "/img/frame-4347.png",
  });

  const handleSelectAll = useCallback((checked: boolean) => {
    setStores((prev) =>
      prev.map((store) => ({ ...store, isSelected: checked }))
    );
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleRemoveStore = useCallback((storeId: string) => {
    setStores((prev) =>
      prev.map((store) =>
        store.id === storeId ? { ...store, isSelected: false } : store
      )
    );
  }, []);

  const handleSaveDraft = useCallback(async () => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(t("productDetails.messages.draftSaved"));
    } catch (error) {
      toast.error(t("productDetails.messages.saveError"));
    } finally {
      setIsSubmitting(false);
    }
  }, [t]);

  const handlePublish = useCallback(async () => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(t("productDetails.messages.published"));
      navigate("/products");
    } catch (error) {
      toast.error(t("productDetails.messages.publishError"));
    } finally {
      setIsSubmitting(false);
    }
  }, [t, navigate]);

  const handleBack = useCallback(() => {
    // Handle back navigation
  }, []);

  const filteredStores = stores.filter((store) =>
    store.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isAllSelected = stores.every((store) => store.isSelected);

  return (
    <div className="flex flex-col items-start gap-8 p-6 relative bg-white rounded-lg overflow-hidden">
      <ProgressIndicator />
      <Header onBack={handleBack} />
      <div className="flex flex-col w-full justify-between flex-1 items-start">
        <div className="inline-flex gap-8 flex-col items-start">
          <ProductCard product={product} />
          <div className="flex flex-col gap-8">
            <StoreSelectionControls
              onSelectAll={handleSelectAll}
              onSearch={handleSearch}
              isAllSelected={isAllSelected}
            />
            <StoreBadgesGrid
              stores={filteredStores}
              onRemoveStore={handleRemoveStore}
            />
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
