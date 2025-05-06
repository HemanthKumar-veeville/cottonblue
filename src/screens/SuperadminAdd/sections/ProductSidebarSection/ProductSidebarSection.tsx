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
import toast from "react-hot-toast";

import { cn } from "../../../../lib/utils";
import { ProductImageUploader } from "./ProductImageUploader";
import AddProduct_step_1 from "../../../../screens/AddProduct/AddProduct_step_1";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import {
  createProduct,
  getProductById,
  updateProduct,
} from "../../../../store/features/productSlice";
import { CreateProductData } from "../../../../services/productService";
import { useNavigate, useParams, useLocation } from "react-router-dom";

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
  productId: string;
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
  region: { options: ["North", "South", "All"] },
  gender: { options: ["Male", "Female", "Unisex"] },
  size: {
    options: ["Free Size", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"],
  },
};

// Define form field configurations
const FORM_FIELD_CONFIGS = [
  {
    id: "name",
    type: "input",
    placeholder: "productSidebar.form.productName",
    label: "productSidebar.form.productName",
    errorKey: "name",
    isRequired: true,
  },
  {
    id: "productId",
    type: "input",
    placeholder: "productSidebar.form.productId",
    label: "productSidebar.form.productId",
    errorKey: "productId",
    isRequired: false,
  },
  {
    id: "region",
    type: "select",
    placeholder: "productSidebar.form.region",
    label: "productSidebar.form.region",
    errorKey: "region",
    options: FORM_FIELDS.region.options,
    isRequired: true,
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
    isRequired: true,
  },
  {
    id: "size",
    type: "select",
    placeholder: "productSidebar.form.size",
    label: "productSidebar.form.size",
    errorKey: "size",
    options: FORM_FIELDS.size.options,
    isRequired: true,
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
    isRequired: false,
  },
  {
    id: "pricePerUnit",
    type: "input",
    placeholder: "productSidebar.form.price.perUnit",
    label: "productSidebar.form.price.perUnit",
    errorKey: "pricePerUnit",
    disabled: (formData: ProductFormData) => !formData.soldByUnit,
    isRequired: false,
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
    isRequired: false,
  },
  {
    id: "reference",
    type: "input",
    placeholder: "productSidebar.form.reference",
    label: "productSidebar.form.reference",
    errorKey: "reference",
    isRequired: false,
  },
];

// Custom Hook for Form Logic
const useProductForm = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    productId: "",
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
  const [originalData, setOriginalData] = useState<ProductFormData | null>(
    null
  );
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
    originalData,
    setOriginalData,
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
  isRequired = false,
}: {
  label?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
  isRequired?: boolean;
}) => (
  <div className={cn("relative w-full", className)}>
    <div className="relative">
      {children}
      {label && (
        <span className="absolute -top-[10px] left-[10px] px-1 bg-white text-sm font-medium text-gray-600">
          {label} {isRequired && <span className="text-red-500">*</span>}
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

interface ProductSidebarSectionProps {
  mode?: "add" | "edit";
}

export const ProductSidebarSection = ({
  mode = "add",
}: ProductSidebarSectionProps): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { selectedCompany } = useAppSelector((state) => state.client);
  const [currentStep, setCurrentStep] = useState(1);
  const [showStep1, setShowStep1] = useState(false);
  const totalSteps = 3;
  const {
    formData,
    setFormData,
    originalData,
    setOriginalData,
    isSubmitting,
    setIsSubmitting,
    handleInputChange,
  } = useProductForm();

  // Load product data in edit mode
  useEffect(() => {
    const loadProductData = async () => {
      if (mode === "edit" && id && selectedCompany?.dns) {
        try {
          const resultAction = await dispatch(
            getProductById({
              dnsPrefix: selectedCompany.dns,
              productId: id,
            }) as any
          );

          if (getProductById.fulfilled.match(resultAction)) {
            const {
              available_region,
              description,
              name,
              price,
              product_image,
              stock,
            } = resultAction.payload?.product;

            const initialData = {
              name: name || "",
              productId: "",
              region: available_region || "",
              gender: "",
              size: "",
              soldByCarton: true,
              soldByUnit: false,
              pricePerCarton: price?.toString() || "",
              pricePerUnit: "",
              piecesPerCarton: stock?.toString() || "",
              reference: "",
              description: description || "",
              images: {},
              imageUrls: { 0: product_image || "" },
            };

            setFormData(initialData);
            setOriginalData(initialData);
          }
        } catch (error) {
          console.error("Error loading product:", error);
          toast.error(t("productSidebar.messages.loadError"));
        }
      }
    };

    loadProductData();
  }, [mode, id, selectedCompany, dispatch, setFormData, setOriginalData, t]);

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
    const missingRequiredFields: string[] = [];

    // Validate company (required)
    if (!selectedCompany?.id) {
      throw new Error("Please select a company first");
    }

    // Collect all missing required fields
    if (!formData.name.trim()) {
      missingRequiredFields.push("Product Name");
    }

    if (!formData.region) {
      missingRequiredFields.push("Region");
    }

    if (!formData.gender) {
      missingRequiredFields.push("Gender");
    }

    if (!formData.size) {
      missingRequiredFields.push("Size");
    }

    if (!formData.images[0]) {
      missingRequiredFields.push("Main Image");
    }

    // If any required fields are missing, throw a single error
    if (missingRequiredFields.length > 0) {
      throw new Error("Please fill in all required fields with *");
    }

    // Validate selling method and prices separately as they have different logic
    if (!formData.soldByCarton && !formData.soldByUnit) {
      throw new Error(
        "Please select at least one selling method (Carton or Unit)"
      );
    }

    // Validate price based on selected selling method
    if (formData.soldByCarton) {
      const pricePerCarton = parseFloat(formData.pricePerCarton);
      if (pricePerCarton <= 0) {
        throw new Error("Please enter a valid price per carton");
      }
    }

    if (formData.soldByUnit) {
      const pricePerUnit = parseFloat(formData.pricePerUnit);
      if (pricePerUnit <= 0) {
        throw new Error("Please enter a valid price per unit");
      }
    }
  };

  const handleAction = useCallback(
    async (action: "draft" | "next") => {
      setIsSubmitting(true);
      try {
        if (action === "next") {
          // Validate form
          validateForm();

          // Prepare base product data with required fields
          const baseProductData: CreateProductData = {
            company_id: selectedCompany!.id,
            product_name: formData.name.trim(),
            product_id: formData.productId.trim(),
            available_region: formData.region,
            product_image: formData.images[0] || formData.imageUrls[0],
          };

          // Add optional fields only if they have values
          if (formData.description?.trim()) {
            baseProductData.product_description = formData.description.trim();
          }

          // Handle price and stock based on selling method
          if (formData.soldByCarton) {
            const pricePerCarton = parseFloat(formData.pricePerCarton);
            if (!isNaN(pricePerCarton) && pricePerCarton > 0) {
              baseProductData.product_price = pricePerCarton;
            }

            const piecesPerCarton = parseInt(formData.piecesPerCarton);
            if (!isNaN(piecesPerCarton) && piecesPerCarton > 0) {
              baseProductData.total_stock = piecesPerCarton;
            }
          } else if (formData.soldByUnit) {
            const pricePerUnit = parseFloat(formData.pricePerUnit);
            if (!isNaN(pricePerUnit) && pricePerUnit > 0) {
              baseProductData.product_price = pricePerUnit;
              baseProductData.total_stock = 1; // Default for unit sales
            }
          }

          // Add reference (SKU) if provided
          if (formData.reference?.trim()) {
            baseProductData.reference = formData.reference.trim();
          }

          if (mode === "edit" && id && originalData) {
            // Create an object with only the changed fields
            const updatedFields: Partial<typeof baseProductData> = {};

            // Compare and add only changed fields
            Object.entries(baseProductData).forEach(([key, value]) => {
              const originalValue =
                originalData[key as keyof typeof originalData];
              if (value !== originalValue) {
                updatedFields[key as keyof typeof baseProductData] = value;
              }
            });

            // Only proceed if there are actual changes
            if (Object.keys(updatedFields).length === 0) {
              toast.error("No changes detected to update", {
                duration: 6000,
                position: "top-right",
                style: {
                  background: "#EF4444",
                  color: "#fff",
                },
              });
              return;
            }

            const resultAction = await dispatch(
              updateProduct({
                dnsPrefix: selectedCompany!.dns,
                productId: id,
                data: updatedFields,
              }) as any
            );

            if (updateProduct.fulfilled.match(resultAction)) {
              toast.success("Product updated successfully", {
                duration: 5000,
                position: "top-right",
                style: {
                  background: "#10B981",
                  color: "#fff",
                },
              });
              navigate(`/products/${id}`);
            } else {
              throw new Error(
                resultAction.error?.message || "Failed to update product"
              );
            }
          } else {
            // Handle add mode
            const resultAction = await dispatch(
              createProduct({
                dnsPrefix: selectedCompany!.dns,
                data: baseProductData,
              }) as any
            );

            if (createProduct.fulfilled.match(resultAction)) {
              toast.success("Product created successfully", {
                duration: 5000,
                position: "top-right",
                style: {
                  background: "#10B981",
                  color: "#fff",
                },
              });
              navigate(`/products`);
            } else {
              throw new Error(
                resultAction.error?.message || "Failed to create product"
              );
            }
          }
        } else {
          // Handle draft save
          console.log("Draft Data:", {
            ...formData,
            timestamp: new Date().toISOString(),
            isDraft: true,
          });
          toast.success("Draft saved successfully", {
            duration: 5000,
            position: "top-right",
            style: {
              background: "#10B981",
              color: "#fff",
            },
          });
        }
      } catch (error: any) {
        console.error("Error:", error);
        toast.error(error.message || "An unexpected error occurred", {
          duration: 6000,
          position: "top-right",
          style: {
            background: "#EF4444",
            color: "#fff",
          },
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [t, dispatch, formData, originalData, selectedCompany, mode, id, navigate]
  );

  // if (showStep1) {
  //   return <AddProduct_step_1 />;
  // }

  return (
    <div className="flex items-start justify-around gap-24 relative flex-1 self-stretch grow">
      <header className="flex flex-col items-start relative flex-1 self-stretch grow bg-transparent">
        <div className="h-[calc(100vh-4rem)] w-full overflow-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <Card className="flex flex-col items-start gap-8 p-6 relative flex-1 self-stretch w-full grow rounded-lg overflow-hidden">
            <CardContent className="p-0 w-full">
              {/* {mode === "add" && (
                <StepIndicator
                  currentStep={currentStep}
                  totalSteps={totalSteps}
                />
              )} */}

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
                      label={t(field.label)}
                      isRequired={field.isRequired}
                    >
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
                        isRequired={field.isRequired}
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
                      <FormField
                        key={field.id}
                        label={t(field.label)}
                        isRequired={field.isRequired}
                      >
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
                      <FormField
                        key={field.id}
                        label={t(field.label)}
                        isRequired={field.isRequired}
                      >
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

                  <FormField
                    label={t("productSidebar.form.description")}
                    isRequired={false}
                  >
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
                        {t("productSidebar.actions.save")}
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
