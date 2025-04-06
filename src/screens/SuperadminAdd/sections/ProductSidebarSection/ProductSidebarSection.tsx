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
  category: string;
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
  category: { options: ["Vêtements de travail"] },
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
    id: "category",
    type: "select",
    placeholder: "productSidebar.form.category",
    label: "productSidebar.form.category",
    errorKey: "category",
    options: FORM_FIELDS.category.options,
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
    category: "",
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

  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = useCallback((): boolean => {
    const newErrors: ProductFormErrors = {};
    const requiredFields = [
      "name",
      "category",
      "gender",
      "size",
      "reference",
    ] as const;

    requiredFields.forEach((field) => {
      if (!formData[field]?.trim()) {
        newErrors[field] = t(`productSidebar.validation.${field}Required`);
      }
    });

    if (formData.soldByCarton) {
      ["pricePerCarton", "piecesPerCarton"].forEach((field) => {
        if (!formData[field as keyof ProductFormData]) {
          newErrors[field] = t(`productSidebar.validation.${field}Required`);
        }
      });
    }

    if (formData.soldByUnit && !formData.pricePerUnit) {
      newErrors.pricePerUnit = t(
        "productSidebar.validation.pricePerUnitRequired"
      );
    }

    if (Object.keys(formData.images).length === 0) {
      newErrors.images = t("productSidebar.validation.mainImageRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, t]);

  const handleInputChange = useCallback(
    (field: keyof ProductFormData, value: string | boolean) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    },
    [errors]
  );

  return {
    formData,
    setFormData,
    errors,
    isSubmitting,
    setIsSubmitting,
    validateForm,
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
    <SelectContent>
      {options.map((option) => (
        <SelectItem key={option} value={option}>
          {option}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

export const ProductSidebarSection = (): JSX.Element => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const {
    formData,
    setFormData,
    errors,
    isSubmitting,
    setIsSubmitting,
    validateForm,
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

  const handleAction = useCallback(
    async (action: "draft" | "next") => {
      if (!validateForm()) {
        toast.error(t("productSidebar.validation.fixErrors"));
        return;
      }

      setIsSubmitting(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast.success(
          t(
            action === "draft"
              ? "productSidebar.messages.draftSaved"
              : "productSidebar.messages.proceedingToNext"
          )
        );
      } catch (error) {
        toast.error(
          t(
            action === "draft"
              ? "productSidebar.messages.saveError"
              : "productSidebar.messages.nextError"
          )
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [validateForm, t, setIsSubmitting]
  );

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
                    <FormField
                      key={field.id}
                      error={errors[field.errorKey]}
                      label={t(field.label)}
                    >
                      {field.type === "input" ? (
                        <Input
                          className={cn(
                            "pt-4 pr-3 pb-2 pl-3 border-gray-300",
                            errors[field.errorKey] && "border-red-500"
                          )}
                          value={formData[field.id as keyof ProductFormData]}
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
                          error={errors[field.errorKey]}
                        />
                      )}
                    </FormField>
                  ))}

                  <div className="flex items-start gap-2 relative self-stretch w-full">
                    {GENDER_SIZE_CONFIGS.map((field) => (
                      <FormField
                        key={field.id}
                        error={errors[field.errorKey]}
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
                          error={errors[field.errorKey]}
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
                      <FormField
                        key={field.id}
                        error={errors[field.errorKey]}
                        label={t(field.label)}
                      >
                        <Input
                          className={cn(
                            "pt-4 pr-3 pb-2 pl-3 border-gray-300",
                            errors[field.errorKey] && "border-red-500"
                          )}
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
                      <FormField
                        key={field.id}
                        error={errors[field.errorKey]}
                        label={t(field.label)}
                      >
                        <Input
                          className={cn(
                            "pt-4 pr-3 pb-2 pl-3 border-gray-300",
                            errors[field.errorKey] && "border-red-500"
                          )}
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
