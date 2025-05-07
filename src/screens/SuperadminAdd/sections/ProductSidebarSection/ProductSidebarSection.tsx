import React, { useCallback, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import {
  createProduct,
  getProductById,
  updateProduct,
} from "../../../../store/features/productSlice";
import {
  CreateProductData,
  UpdateProductData,
} from "../../../../services/productService";
import { useNavigate, useParams } from "react-router-dom";

// Constants
const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const FORM_FIELDS = {
  suitable_for: { options: ["General", "Men", "Women", "Kids", "Unisex"] },
  size: {
    options: ["Free", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"],
  },
};

// Form field configurations
const FORM_CONFIG = {
  basic: [
    {
      name: "name",
      label: "productSidebar.form.productName",
      type: "text",
      required: true,
    },
    {
      name: "productId",
      label: "productSidebar.form.productId",
      type: "text",
    },
  ],
  attributes: [
    {
      name: "suitable_for",
      label: "productSidebar.form.suitableFor",
      type: "select",
      options: FORM_FIELDS.suitable_for.options,
      required: true,
    },
    {
      name: "size",
      label: "productSidebar.form.size",
      type: "select",
      options: FORM_FIELDS.size.options,
      required: true,
    },
  ],
  pricing: [
    {
      name: "pack_price",
      label: "productSidebar.form.price.packPrice",
      type: "number",
      required: true,
    },
    {
      name: "pack_of",
      label: "productSidebar.form.packOf",
      type: "number",
      required: true,
    },
    {
      name: "total_packs",
      label: "productSidebar.form.totalPacks",
      type: "number",
      required: true,
    },
  ],
};

interface FormData {
  name: string;
  productId: string;
  suitable_for: string;
  size: string;
  soldByCarton: boolean;
  soldByUnit: boolean;
  pack_price: string;
  pack_of: string;
  total_packs: string;
  reference: string;
  description: string;
  images: { [key: number]: File | undefined };
  imageUrls: { [key: number]: string | undefined };
}

// Extend CreateProductData type to include our custom fields
interface ExtendedCreateProductData
  extends Omit<CreateProductData, "product_image"> {
  suitable_for: string;
  size: string;
  product_image?: File;
}

interface BaseProductData {
  company_id: string;
  product_name: string;
  product_id: string;
  pack_of: number;
  pack_price: number;
  total_packs: number;
  suitable_for: string;
  size: string;
  product_description?: string;
  reference?: string;
}

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

const FormInput = ({
  name,
  control,
  label,
  type = "text",
  required = false,
  disabled = false,
  error,
  className,
}: {
  name: string;
  control: any;
  label: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
}) => (
  <FormField
    label={label}
    error={error}
    isRequired={required}
    className={className}
  >
    <Controller
      name={name}
      control={control}
      rules={{ required: required ? `${label} is required` : false }}
      render={({ field }) => (
        <Input
          {...field}
          type={type}
          className="pt-4 pr-3 pb-2 pl-3 border-gray-300"
          disabled={disabled}
        />
      )}
    />
  </FormField>
);

const FormSelect = ({
  name,
  control,
  label,
  options,
  required = false,
  error,
  className,
}: {
  name: string;
  control: any;
  label: string;
  options: string[];
  required?: boolean;
  error?: string;
  className?: string;
}) => {
  const { t } = useTranslation();

  return (
    <FormField
      label={label}
      error={error}
      isRequired={required}
      className={className}
    >
      <Controller
        name={name}
        control={control}
        rules={{ required: required ? `${label} is required` : false }}
        render={({ field: { onChange, value } }) => (
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={t("productSidebar.form.selectPlaceholder")}
              />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </FormField>
  );
};

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

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      productId: "",
      suitable_for: "",
      size: "",
      soldByCarton: true,
      soldByUnit: false,
      pack_price: "0",
      pack_of: "1",
      total_packs: "0",
      reference: "",
      description: "",
      images: {},
      imageUrls: {},
    },
  });

  const formData = watch();

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
            const product = resultAction.payload?.product;
            console.log("Product data received:", product); // Debug log

            // Determine if product is sold by unit or carton
            const isSoldByUnit = product.pack_quantity === 1;
            const isSoldByCarton = !isSoldByUnit;

            // Map the fields with proper fallbacks
            const formData = {
              name: product.name || "",
              productId: product.id?.toString() || "",
              suitable_for: product.suitable_for || "",
              size: product.size || "",
              soldByCarton: isSoldByCarton,
              soldByUnit: isSoldByUnit,
              pack_price: product.price_of_pack?.toString() || "0",
              pack_of: product.pack_quantity?.toString() || "1",
              total_packs: product.total_packs?.toString() || "0",
              reference: product.id?.toString() || "",
              description: product.description || "",
              images: {},
              imageUrls: { 0: product.product_image || "" },
            };

            console.log("Mapped form data:", formData); // Debug log
            reset(formData);
          }
        } catch (error) {
          console.error("Error loading product:", error);
          toast.error(t("productSidebar.messages.loadError"));
        }
      }
    };

    loadProductData();
  }, [mode, id, selectedCompany, dispatch, reset, t]);

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

      const currentImages = watch("images");
      if (Object.keys(currentImages || {}).length >= MAX_IMAGES) {
        toast.error(t("productSidebar.validation.maxImages"));
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      setValue("images", { ...currentImages, [position]: file });
      setValue("imageUrls", { ...watch("imageUrls"), [position]: imageUrl });
    },
    [t, watch, setValue]
  );

  const handleRemoveImage = useCallback(
    (position: number) => {
      const currentImageUrls = watch("imageUrls");
      if (currentImageUrls?.[position]) {
        URL.revokeObjectURL(currentImageUrls[position]!);
      }

      setValue("images", {
        ...watch("images"),
        [position]: undefined,
      });
      setValue("imageUrls", {
        ...watch("imageUrls"),
        [position]: undefined,
      });
    },
    [watch, setValue]
  );

  const onSubmit = async (data: FormData) => {
    try {
      if (!selectedCompany?.id) {
        throw new Error("Please select a company first");
      }

      // Only check for main image in add mode
      if (mode === "add") {
        const mainImage = data.images[0];
        if (!mainImage) {
          throw new Error("Main image is required");
        }
      }

      const baseData: BaseProductData = {
        company_id: selectedCompany.id,
        product_name: data.name.trim(),
        product_id: data.productId.trim(),
        pack_of: parseInt(data.pack_of) || 1,
        pack_price: parseFloat(data.pack_price) || 0,
        total_packs: parseInt(data.total_packs) || 0,
        suitable_for: data.suitable_for,
        size: data.size,
        product_description: data.description?.trim(),
        reference: data.reference?.trim(),
      };

      if (mode === "edit" && id) {
        const updateData: UpdateProductData = {
          ...baseData,
          product_image: data.images[0],
        };

        const resultAction = await dispatch(
          updateProduct({
            dnsPrefix: selectedCompany.dns,
            productId: id,
            data: updateData,
          }) as any
        );

        if (updateProduct.fulfilled.match(resultAction)) {
          toast.success("Product updated successfully");
          navigate(`/products/${id}`);
        }
      } else {
        const createData: CreateProductData = {
          ...baseData,
          product_image: data.images[0]!, // We know this exists because of the validation above
        };

        const resultAction = await dispatch(
          createProduct({
            dnsPrefix: selectedCompany.dns,
            data: createData,
          }) as any
        );

        if (createProduct.fulfilled.match(resultAction)) {
          toast.success("Product created successfully");
          navigate("/products");
        }
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "An unexpected error occurred");
    }
  };

  return (
    <div className="flex items-start justify-around gap-24 relative flex-1 self-stretch grow">
      <header className="flex flex-col items-start relative flex-1 self-stretch grow bg-transparent">
        <div className="h-[calc(100vh-4rem)] w-full overflow-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <Card className="flex flex-col items-start gap-8 p-6 relative flex-1 self-stretch w-full grow rounded-lg overflow-hidden">
            <CardContent className="p-0 w-full">
              <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                <div className="flex items-start justify-center gap-6 relative flex-1 self-stretch w-full grow">
                  <div className="flex flex-col items-start gap-6 relative flex-1 self-stretch grow">
                    <div className="flex items-center justify-center gap-2 mt-8">
                      <h3 className="font-heading-h3 font-bold text-gray-700 text-lg tracking-wide leading-6 whitespace-nowrap">
                        {t("productSidebar.title")}
                      </h3>
                    </div>

                    {/* Basic Information */}
                    <div className="flex items-start gap-2 relative self-stretch w-full">
                      {FORM_CONFIG.basic.map((field) => (
                        <FormInput
                          key={field.name}
                          name={field.name}
                          control={control}
                          label={t(field.label)}
                          type={field.type}
                          required={field.required}
                          error={
                            errors[field.name as keyof typeof errors]?.message
                          }
                          className="flex-1"
                        />
                      ))}
                    </div>

                    {/* Attributes */}
                    <div className="flex items-start gap-2 relative self-stretch w-full">
                      {FORM_CONFIG.attributes.map((field) => (
                        <FormSelect
                          key={field.name}
                          name={field.name}
                          control={control}
                          label={t(field.label)}
                          options={field.options}
                          required={field.required}
                          error={
                            errors[field.name as keyof typeof errors]?.message
                          }
                          className="flex-1"
                        />
                      ))}
                    </div>

                    {/* Sold By Options */}
                    <div className="flex items-start gap-2 relative self-stretch w-full">
                      <div className="flex items-center gap-2 pt-2 pr-2 pb-2 pl-2 relative flex-1 grow bg-white rounded-lg border border-solid border-gray-300">
                        <Controller
                          name="soldByCarton"
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              id="carton"
                              className="w-6 h-6 border-gray-300 data-[state=checked]:bg-[#07515f] data-[state=checked]:border-[#07515f]"
                              checked={field.value}
                              onCheckedChange={(checked: boolean) => {
                                field.onChange(checked);
                                if (checked) {
                                  setValue("soldByUnit", false);
                                }
                              }}
                            />
                          )}
                        />
                        <label
                          htmlFor="carton"
                          className="flex-1 font-label-small font-bold text-gray-700 text-sm tracking-wide leading-5"
                        >
                          {t("productSidebar.form.soldBy.carton")}
                        </label>
                      </div>

                      <div className="flex items-center gap-2 pt-2 pr-2 pb-2 pl-2 relative flex-1 grow bg-white rounded-lg border border-solid border-gray-300">
                        <Controller
                          name="soldByUnit"
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              id="unit"
                              className="w-6 h-6 border-gray-300 data-[state=checked]:bg-[#07515f] data-[state=checked]:border-[#07515f]"
                              checked={field.value}
                              onCheckedChange={(checked: boolean) => {
                                field.onChange(checked);
                                if (checked) {
                                  setValue("soldByCarton", false);
                                  setValue("pack_of", "1");
                                }
                              }}
                            />
                          )}
                        />
                        <label
                          htmlFor="unit"
                          className="flex-1 font-label-small font-bold text-gray-700 text-sm tracking-wide leading-5"
                        >
                          {t("productSidebar.form.soldBy.unit")}
                        </label>
                      </div>
                    </div>

                    {/* Pricing Information */}
                    <div className="flex items-start gap-2 relative self-stretch w-full">
                      {FORM_CONFIG.pricing.map((field) => (
                        <FormInput
                          key={field.name}
                          name={field.name}
                          control={control}
                          label={t(field.label)}
                          type={field.type}
                          required={field.required}
                          error={
                            errors[field.name as keyof typeof errors]?.message
                          }
                          className="flex-1"
                          disabled={
                            field.name === "pack_of"
                              ? formData.soldByUnit
                              : !formData.soldByCarton && !formData.soldByUnit
                          }
                        />
                      ))}
                    </div>

                    {/* Description */}
                    <FormField
                      label={t("productSidebar.form.description")}
                      error={errors.description?.message}
                    >
                      <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                          <Textarea
                            {...field}
                            className="h-[175px] pt-6 pr-3 pb-2 pl-3 border-gray-300"
                          />
                        )}
                      />
                    </FormField>
                  </div>

                  {/* Image Upload Section */}
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
                                    Object.keys(formData.images || {}).length >=
                                    MAX_IMAGES
                                  }
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-start gap-4 mt-6">
                      <Button
                        type="submit"
                        className={cn(
                          "gap-4 py-4 px-4 self-stretch bg-[#07515f] border-gray-300",
                          "hover:bg-[#064a56] transition-colors duration-200",
                          "disabled:opacity-50 disabled:cursor-not-allowed",
                          isSubmitting && "animate-pulse"
                        )}
                        disabled={isSubmitting}
                      >
                        <span className="font-label-medium font-bold text-white text-sm tracking-wide leading-5 whitespace-nowrap">
                          {t("productSidebar.actions.save")}
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </header>
    </div>
  );
};
