import React, { useState, useCallback, useEffect } from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Checkbox } from "../../../../components/ui/checkbox";
import { Input } from "../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { Textarea } from "../../../../components/ui/textarea";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { cn } from "../../../../lib/utils";
import { ProductImageUploader } from "./ProductImageUploader";
import AddProduct_step_1 from "../../../../screens/AddProduct/AddProduct_step_1";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import { createProduct } from "../../../../store/features/productSlice";
import { CreateProductData } from "../../../../services/productService";
import { useNavigate } from "react-router-dom";

// Types
interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator = ({ currentStep, totalSteps }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: totalSteps }, (_, index) => (
        <div key={index} className="flex items-center">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
              index + 1 === currentStep
                ? "bg-[#07515f] text-white"
                : index + 1 < currentStep
                ? "bg-[#e9fffd] text-[#07515f]"
                : "bg-gray-100 text-gray-400"
            )}
          >
            {index + 1}
          </div>
          {index < totalSteps - 1 && (
            <div
              className={cn(
                "w-12 h-0.5 mx-2",
                index + 1 < currentStep ? "bg-[#07515f]" : "bg-gray-200"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
};

interface ProductFormData {
  name: string;
  region: string;
  gender: string;
  size: string;
  soldByCarton: boolean;
  soldByUnit: boolean;
  pricePerCarton: string;
  pricePerUnit: string;
  piecesPerCarton: string;
  reference: string;
  description: string;
  images: Record<number, File>;
  imageUrls: Record<number, string>;
}

interface ProductFormErrors {
  [key: string]: string;
}

// Constants
const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const FORM_FIELDS = {
  region: { options: ["North", "South"] },
  gender: { options: ["Unisexe"] },
  size: { options: ["S, M, L"] },
};

// Define form field configurations
const FORM_FIELD_CONFIGS = [
  {
    id: "name",
    type: "input",
    placeholder: "productSidebar.form.productName",
    label: "productSidebar.form.productName",
    errorKey: "name",
  },
  {
    id: "region",
    type: "select",
    placeholder: "productSidebar.form.region",
    label: "productSidebar.form.region",
    errorKey: "region",
    options: FORM_FIELDS.region.options,
  },
];

const GENDER_SIZE_CONFIGS = [
  {
    id: "gender",
    type: "select",
    placeholder: "productSidebar.form.gender",
    label: "productSidebar.form.gender",
    errorKey: "gender",
    options: FORM_FIELDS.gender.options,
  },
  {
    id: "size",
    type: "select",
    placeholder: "productSidebar.form.size",
    label: "productSidebar.form.size",
    errorKey: "size",
    options: FORM_FIELDS.size.options,
  },
];

const PRICE_FIELD_CONFIGS = [
  {
    id: "pricePerCarton",
    type: "input",
    placeholder: "productSidebar.form.price.perCarton",
    label: "productSidebar.form.price.perCarton",
    errorKey: "pricePerCarton",
    disabled: (formData: ProductFormData) => !formData.soldByCarton,
  },
  {
    id: "pricePerUnit",
    type: "input",
    placeholder: "productSidebar.form.price.perUnit",
    label: "productSidebar.form.price.perUnit",
    errorKey: "pricePerUnit",
    disabled: (formData: ProductFormData) => !formData.soldByUnit,
  },
];

const ADDITIONAL_FIELD_CONFIGS = [
  {
    id: "piecesPerCarton",
    type: "input",
    placeholder: "productSidebar.form.piecesPerCarton",
    label: "productSidebar.form.piecesPerCarton",
    errorKey: "piecesPerCarton",
    disabled: (formData: ProductFormData) => !formData.soldByCarton,
  },
  {
    id: "reference",
    type: "input",
    placeholder: "productSidebar.form.reference",
    label: "productSidebar.form.reference",
    errorKey: "reference",
  },
];

// Custom Hook for Form Logic
const useProductForm = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    region: "",
    gender: "",
    size: "",
    soldByCarton: true,
    soldByUnit: false,
    pricePerCarton: "",
    pricePerUnit: "",
    piecesPerCarton: "",
    reference: "",
    description: "",
    images: {},
    imageUrls: {},
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = useCallback(
    (field: keyof ProductFormData, value: string | boolean) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  return {
    formData,
    setFormData,
    isSubmitting,
    setIsSubmitting,
    handleInputChange,
  };
};

// Reusable Components
const FormField = ({
  label,
  error,
  children,
  className,
}: {
  label?: string;
  error?: string;
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
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const SelectField = ({
  value,
  onChange,
  options,
  placeholder,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  error?: string;
}) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger
      className={cn(
        "w-full pt-4 pr-3 pb-2 pl-3 border-gray-300 min-h-[3.25rem]",
        error && "border-red-500"
      )}
    >
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent className="max-h-[200px]">
      {options.map((option) => (
        <SelectItem key={option} value={option} className="cursor-pointer">
          {option}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

export const ProductSidebarSection = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { selectedCompany } = useAppSelector((state) => state.client);
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showStep1, setShowStep1] = useState(false);
  const totalSteps = 3;
  const {
    formData,
    setFormData,
    isSubmitting,
    setIsSubmitting,
    handleInputChange,
  } = useProductForm();

  useEffect(() => {
    return () => {
      Object.values(formData.imageUrls).forEach((url) =>
        URL.revokeObjectURL(url)
      );
    };
  }, [formData.imageUrls]);

  const handleFileUpload = useCallback(
    (file: File, position: number) => {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(t("productSidebar.validation.fileTooLarge"));
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error(t("productSidebar.validation.invalidFileType"));
        return;
      }

      if (Object.keys(formData.images).length >= MAX_IMAGES) {
        toast.error(t("productSidebar.validation.maxImages"));
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        images: { ...prev.images, [position]: file },
        imageUrls: { ...prev.imageUrls, [position]: imageUrl },
      }));
    },
    [t, formData.images, setFormData]
  );

  const handleRemoveImage = useCallback(
    (position: number) => {
      setFormData((prev) => {
        if (prev.imageUrls[position]) {
          URL.revokeObjectURL(prev.imageUrls[position]);
        }
        const newImages = { ...prev.images };
        const newImageUrls = { ...prev.imageUrls };
        delete newImages[position];
        delete newImageUrls[position];
        return {
          ...prev,
          images: newImages,
          imageUrls: newImageUrls,
        };
      });
    },
    [setFormData]
  );

  const validateForm = () => {
    if (!selectedCompany?.id) {
      throw new Error(t("productSidebar.validation.noCompany"));
    }

    if (!formData.name) {
      throw new Error(t("productSidebar.validation.nameRequired"));
    }

    if (!formData.description) {
      throw new Error(t("productSidebar.validation.descriptionRequired"));
    }

    if (!formData.images[0]) {
      throw new Error(t("productSidebar.validation.mainImageRequired"));
    }

    const price = formData.soldByCarton
      ? parseFloat(formData.pricePerCarton)
      : parseFloat(formData.pricePerUnit);

    if (isNaN(price) || price <= 0) {
      throw new Error(t("productSidebar.validation.validPriceRequired"));
    }

    const stock = formData.soldByCarton
      ? parseInt(formData.piecesPerCarton)
      : 1;

    if (isNaN(stock) || stock <= 0) {
      throw new Error(t("productSidebar.validation.validStockRequired"));
    }
  };

  const handleAction = useCallback(
    async (action: "draft" | "next") => {
      setIsSubmitting(true);
      try {
        if (action === "next") {
          // Validate form
          // validateForm();

          // Prepare product data
          const createProductData: CreateProductData = {
            company_id: selectedCompany!.id,
            product_name: formData.name,
            product_description: formData.description,
            product_price: formData.soldByCarton
              ? parseFloat(formData.pricePerCarton)
              : parseFloat(formData.pricePerUnit),
            available_region: formData.region, // Using category as region for now
            total_stock: formData.soldByCarton
              ? parseInt(formData.piecesPerCarton)
              : 1,
            product_image: formData.images[0], // Using the main image
          };

          // Console log the data before API call
          console.log("Next Button - Form Data:", {
            ...formData,
            timestamp: new Date().toISOString(),
            processedData: createProductData,
          });

          // Dispatch create product action
          const resultAction = await dispatch(
            createProduct({
              dnsPrefix: selectedCompany!.name,
              data: createProductData,
            }) as any
          );

          if (createProduct.fulfilled.match(resultAction)) {
            console.log("API Response:", resultAction.payload);
            toast.success(t("productSidebar.messages.published"));
            setShowStep1(true);
          } else {
            throw new Error(
              resultAction.error?.message ||
                t("productSidebar.messages.publishError")
            );
          }
        } else {
          // Handle draft save
          console.log("Draft Data:", {
            ...formData,
            timestamp: new Date().toISOString(),
            isDraft: true,
          });
          await new Promise((resolve) => setTimeout(resolve, 1000));
          toast.success(t("productSidebar.messages.draftSaved"));
        }
      } catch (error: any) {
        console.error("Error:", error);
        toast.error(error.message || t("productSidebar.messages.error"));
      } finally {
        setIsSubmitting(false);
      }
    },
    [t, dispatch, formData, selectedCompany, setShowStep1]
  );

  if (showStep1) {
    return <AddProduct_step_1 />;
  }

  return (
    <div className="flex items-start justify-around gap-24 relative flex-1 self-stretch grow">
      <header className="flex flex-col items-start relative flex-1 self-stretch grow bg-transparent">
        <div className="h-[calc(100vh-4rem)] w-full overflow-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <Card className="flex flex-col items-start gap-8 p-6 relative flex-1 self-stretch w-full grow rounded-lg overflow-hidden">
            <CardContent className="p-0 w-full">
              <StepIndicator
                currentStep={currentStep}
                totalSteps={totalSteps}
              />

              <div className="flex items-start justify-center gap-6 relative flex-1 self-stretch w-full grow">
                <div className="flex flex-col items-start gap-6 relative flex-1 self-stretch grow">
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <h3 className="font-heading-h3 font-bold text-gray-700 text-lg tracking-wide leading-6 whitespace-nowrap">
                      {t("productSidebar.title")}
                    </h3>
                  </div>

                  {FORM_FIELD_CONFIGS.map((field) => (
                    <FormField key={field.id} label={t(field.label)}>
                      {field.type === "input" ? (
                        <Input
                          className="pt-4 pr-3 pb-2 pl-3 border-gray-300"
                          value={String(
                            formData[field.id as keyof ProductFormData] || ""
                          )}
                          onChange={(e) =>
                            handleInputChange(
                              field.id as keyof ProductFormData,
                              e.target.value
                            )
                          }
                          placeholder=""
                        />
                      ) : (
                        <SelectField
                          value={
                            formData[
                              field.id as keyof ProductFormData
                            ] as string
                          }
                          onChange={(value) =>
                            handleInputChange(
                              field.id as keyof ProductFormData,
                              value
                            )
                          }
                          options={field.options || []}
                          placeholder=""
                        />
                      )}
                    </FormField>
                  ))}

                  <div className="flex items-start gap-2 relative self-stretch w-full">
                    {GENDER_SIZE_CONFIGS.map((field) => (
                      <FormField
                        key={field.id}
                        className="flex-1"
                        label={t(field.label)}
                      >
                        <SelectField
                          value={
                            formData[
                              field.id as keyof ProductFormData
                            ] as string
                          }
                          onChange={(value) =>
                            handleInputChange(
                              field.id as keyof ProductFormData,
                              value
                            )
                          }
                          options={field.options || []}
                          placeholder=""
                        />
                      </FormField>
                    ))}
                  </div>

                  <div className="flex items-start gap-2 relative self-stretch w-full">
                    {["carton", "unit"].map((type) => (
                      <div
                        key={type}
                        className="flex items-center gap-2 pt-2 pr-2 pb-2 pl-2 relative flex-1 grow bg-gray-100 rounded-lg border border-solid border-gray-300"
                      >
                        <Checkbox
                          id={type}
                          className="w-6 h-6"
                          checked={
                            type === "carton"
                              ? formData.soldByCarton
                              : formData.soldByUnit
                          }
                          onCheckedChange={(checked: boolean) =>
                            handleInputChange(
                              type === "carton" ? "soldByCarton" : "soldByUnit",
                              checked
                            )
                          }
                        />
                        <label
                          htmlFor={type}
                          className="flex-1 font-label-small font-bold text-gray-700 text-sm tracking-wide leading-5"
                        >
                          {t(`productSidebar.form.soldBy.${type}`)}
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-start gap-2 relative self-stretch w-full">
                    {PRICE_FIELD_CONFIGS.map((field) => (
                      <FormField key={field.id} label={t(field.label)}>
                        <Input
                          className="pt-4 pr-3 pb-2 pl-3 border-gray-300"
                          type="number"
                          value={formData[field.id as keyof ProductFormData]}
                          onChange={(e) =>
                            handleInputChange(
                              field.id as keyof ProductFormData,
                              e.target.value
                            )
                          }
                          placeholder=""
                          disabled={field.disabled?.(formData)}
                        />
                      </FormField>
                    ))}
                  </div>

                  <div className="flex items-start gap-2 relative self-stretch w-full">
                    {ADDITIONAL_FIELD_CONFIGS.map((field) => (
                      <FormField key={field.id} label={t(field.label)}>
                        <Input
                          className="pt-4 pr-3 pb-2 pl-3 border-gray-300"
                          type={field.id === "reference" ? "text" : "number"}
                          value={formData[field.id as keyof ProductFormData]}
                          onChange={(e) =>
                            handleInputChange(
                              field.id as keyof ProductFormData,
                              e.target.value
                            )
                          }
                          placeholder=""
                          disabled={field.disabled?.(formData)}
                        />
                      </FormField>
                    ))}
                  </div>

                  <FormField label={t("productSidebar.form.description")}>
                    <Textarea
                      className="h-[175px] pt-6 pr-3 pb-2 pl-3 border-gray-300"
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      placeholder=""
                    />
                  </FormField>
                </div>

                <div className="flex flex-col items-end justify-between relative self-stretch mt-20">
                  <div className="flex flex-col items-start gap-6">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center gap-4">
                        <ProductImageUploader
                          position={0}
                          imageUrl={formData.imageUrls[0]}
                          onUpload={handleFileUpload}
                          onRemove={handleRemoveImage}
                          isMain
                        />
                        <div className="flex flex-col h-[250px] items-start justify-center gap-6">
                          <div className="grid grid-cols-2 gap-6">
                            {[1, 2, 3, 4].map((position) => (
                              <ProductImageUploader
                                key={position}
                                position={position}
                                imageUrl={formData.imageUrls[position]}
                                onUpload={handleFileUpload}
                                onRemove={handleRemoveImage}
                                disabled={
                                  Object.keys(formData.images).length >=
                                  MAX_IMAGES
                                }
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 mt-6">
                    <Button
                      variant="outline"
                      className={cn(
                        "gap-4 py-4 px-4 self-stretch bg-gray-200 border-gray-300",
                        "hover:bg-gray-300 transition-colors duration-200",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        isSubmitting && "animate-pulse"
                      )}
                      onClick={() => handleAction("draft")}
                      disabled={isSubmitting}
                    >
                      <span className="font-label-medium font-bold text-gray-700 text-sm tracking-wide leading-5 whitespace-nowrap">
                        {t("productSidebar.actions.saveDraft")}
                      </span>
                    </Button>
                    <Button
                      className={cn(
                        "gap-4 py-4 px-4 self-stretch bg-[#07515f] border-gray-300",
                        "hover:bg-[#064a56] transition-colors duration-200",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        isSubmitting && "animate-pulse"
                      )}
                      onClick={() => handleAction("next")}
                      disabled={isSubmitting}
                    >
                      <span className="font-label-medium font-bold text-white text-sm tracking-wide leading-5 whitespace-nowrap">
                        {t("productSidebar.actions.next")}
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </header>
    </div>
  );
};
