import React, { useState, useCallback, useEffect } from "react";
import { Badge } from "../../../../components/ui/badge";
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
import { ScrollArea } from "../../../../components/ui/scroll-area";
import { toast } from "sonner";
import { cn } from "../../../../lib/utils";

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
  images: File[];
  imageUrls: string[];
}

interface ProductFormErrors {
  [key: string]: string;
}

const navTabs = [
  { id: 1, name: "Gestion Admin", icon: "/img/crown.svg", active: false },
  { id: 2, name: "Gestion par client", icon: "/img/icon-8.svg", active: true },
];

interface NavTabProps {
  tab: {
    id: number;
    name: string;
    icon: string;
    active: boolean;
  };
}

interface DropzoneProps {
  dropzone: {
    text1: string;
    text2: string;
  };
  onUpload?: (file: File) => void;
  disabled?: boolean;
  imageUrl?: string;
  onRemove?: () => void;
}

const Dropzone: React.FC<DropzoneProps> = ({
  dropzone,
  onUpload,
  disabled,
  imageUrl,
  onRemove,
}) => (
  <div
    className={cn(
      "flex flex-col w-[113px] items-center justify-center gap-2.5 p-2 relative self-stretch rounded-lg overflow-hidden border border-dashed border-gray-300 hover:border-blue-500 transition-colors cursor-pointer",
      disabled && "opacity-50 cursor-not-allowed"
    )}
    onClick={() =>
      !disabled && !imageUrl && document.getElementById("file-upload")?.click()
    }
  >
    <input
      id="file-upload"
      type="file"
      className="hidden"
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file && onUpload) onUpload(file);
      }}
    />
    {imageUrl ? (
      <div className="relative w-full h-full group">
        <div
          className="w-full h-full rounded-lg bg-cover bg-center transition-all duration-300"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            variant="outline"
            size="icon"
            className="gap-2 p-2 bg-red-500 border-red-500 hover:bg-red-600 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.();
            }}
          >
            <img className="w-3.5 h-3.5" alt="Delete" src="/img/icon-16.svg" />
          </Button>
        </div>
      </div>
    ) : (
      <>
        <div className="flex w-6 h-6 items-center justify-center gap-2.5 p-px">
          <img className="w-3.5 h-3.5" alt="Icon" src="/img/icon-20.svg" />
        </div>
        <div className="self-stretch font-label-smallest font-bold text-gray-700 text-xs text-center tracking-wide leading-4">
          {dropzone.text1}
        </div>
        <div className="self-stretch font-label-smallest font-bold text-blue-500 text-xs text-center tracking-wide leading-4 underline">
          {dropzone.text2}
        </div>
      </>
    )}
  </div>
);

export const ProductSidebarSection = (): JSX.Element => {
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
    images: [],
    imageUrls: [],
  });

  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  // Cleanup image URLs on unmount
  useEffect(() => {
    return () => {
      formData.imageUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [formData.imageUrls]);

  const validateForm = useCallback((): boolean => {
    const newErrors: ProductFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t("productSidebar.validation.nameRequired");
    }

    if (!formData.category) {
      newErrors.category = t("productSidebar.validation.categoryRequired");
    }

    if (!formData.gender) {
      newErrors.gender = t("productSidebar.validation.genderRequired");
    }

    if (!formData.size) {
      newErrors.size = t("productSidebar.validation.sizeRequired");
    }

    if (formData.soldByCarton && !formData.pricePerCarton) {
      newErrors.pricePerCarton = t(
        "productSidebar.validation.pricePerCartonRequired"
      );
    }

    if (formData.soldByUnit && !formData.pricePerUnit) {
      newErrors.pricePerUnit = t(
        "productSidebar.validation.pricePerUnitRequired"
      );
    }

    if (formData.soldByCarton && !formData.piecesPerCarton) {
      newErrors.piecesPerCarton = t(
        "productSidebar.validation.piecesPerCartonRequired"
      );
    }

    if (!formData.reference.trim()) {
      newErrors.reference = t("productSidebar.validation.referenceRequired");
    }

    if (formData.images.length === 0) {
      newErrors.images = t("productSidebar.validation.mainImageRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, t]);

  const handleInputChange = useCallback(
    (field: keyof ProductFormData, value: string | boolean) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    },
    [errors]
  );

  const handleFileUpload = useCallback(
    (file: File) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t("productSidebar.validation.fileTooLarge"));
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error(t("productSidebar.validation.invalidFileType"));
        return;
      }

      if (formData.images.length >= 5) {
        toast.error(t("productSidebar.validation.maxImages"));
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, file],
        imageUrls: [...prev.imageUrls, imageUrl],
      }));
    },
    [t, formData.images.length]
  );

  const handleRemoveImage = useCallback((index: number) => {
    setFormData((prev) => {
      // Revoke the URL to prevent memory leaks
      URL.revokeObjectURL(prev.imageUrls[index]);
      return {
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
        imageUrls: prev.imageUrls.filter((_, i) => i !== index),
      };
    });
  }, []);

  const handlePreviewImage = useCallback((index: number) => {
    setPreviewIndex(index);
  }, []);

  const handleSaveDraft = useCallback(async () => {
    if (!validateForm()) {
      toast.error(t("productSidebar.validation.fixErrors"));
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Implement save draft functionality
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated API call
      toast.success(t("productSidebar.messages.draftSaved"));
    } catch (error) {
      toast.error(t("productSidebar.messages.saveError"));
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, t]);

  const handleNext = useCallback(async () => {
    if (!validateForm()) {
      toast.error(t("productSidebar.validation.fixErrors"));
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Implement next step functionality
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated API call
      toast.success(t("productSidebar.messages.proceedingToNext"));
    } catch (error) {
      toast.error(t("productSidebar.messages.nextError"));
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, t]);

  return (
    <div className="flex items-start justify-around gap-24 relative flex-1 self-stretch grow">
      <header className="flex flex-col items-start relative flex-1 self-stretch grow bg-transparent">
        <div className="h-[calc(100vh-4rem)] w-full overflow-auto scrollbar-hide">
          <Card className="flex flex-col items-start gap-8 p-6 relative flex-1 self-stretch w-full grow rounded-lg overflow-hidden">
            <CardContent className="p-0 w-full">
              <div className="flex items-center justify-center relative self-stretch w-full">
                <div className="flex w-28 items-center relative">
                  <div className="relative w-8 h-8 rounded-2xl border-2 border-solid border-blue-500">
                    <div className="relative w-2.5 h-2.5 top-[9px] left-[9px] bg-blue-500 rounded-full" />
                  </div>
                  <div className="relative flex-1 grow h-0.5 bg-gray-100" />
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="relative w-8 h-8 rounded-2xl border-2 border-solid border-gray-100" />
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 mt-8">
                <h3 className="font-heading-h3 font-bold text-gray-700 text-lg tracking-wide leading-6 whitespace-nowrap">
                  {t("productSidebar.title")}
                </h3>
              </div>
              <div className="flex items-start justify-center gap-6 mt-8 relative flex-1 self-stretch w-full grow">
                <div className="flex flex-col items-start gap-6 relative flex-1 self-stretch grow">
                  <div className="flex flex-col items-start gap-6 relative self-stretch w-full">
                    <div className="relative w-full">
                      <Input
                        className={cn(
                          "pt-2 pr-2 pb-2 pl-2",
                          errors.name && "border-red-500"
                        )}
                        type="text"
                        value={formData.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleInputChange("name", e.target.value)
                        }
                        placeholder={t("productSidebar.form.productName")}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div className="w-full relative">
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          handleInputChange("category", value)
                        }
                      >
                        <SelectTrigger
                          className={cn(
                            "w-full",
                            errors.category && "border-red-500"
                          )}
                        >
                          <SelectValue
                            placeholder={t("productSidebar.form.category")}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Vêtements de travail">
                            Vêtements de travail
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.category && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.category}
                        </p>
                      )}
                    </div>
                    <div className="flex items-start gap-2 relative self-stretch w-full">
                      <div className="relative flex-1">
                        <Select
                          value={formData.gender}
                          onValueChange={(value) =>
                            handleInputChange("gender", value)
                          }
                        >
                          <SelectTrigger
                            className={cn(
                              "w-full",
                              errors.gender && "border-red-500"
                            )}
                          >
                            <SelectValue
                              placeholder={t("productSidebar.form.gender")}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Unisexe">Unisexe</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.gender && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.gender}
                          </p>
                        )}
                      </div>
                      <div className="relative flex-1">
                        <Select
                          value={formData.size}
                          onValueChange={(value) =>
                            handleInputChange("size", value)
                          }
                        >
                          <SelectTrigger
                            className={cn(
                              "w-full",
                              errors.size && "border-red-500"
                            )}
                          >
                            <SelectValue
                              placeholder={t("productSidebar.form.size")}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="S, M, L">S, M, L</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.size && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.size}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-2 relative self-stretch w-full">
                      <div className="flex items-center gap-2 pt-2 pr-2 pb-2 pl-2 relative flex-1 grow bg-gray-100 rounded-lg border border-solid border-gray-300">
                        <Checkbox
                          id="carton"
                          className="w-6 h-6"
                          checked={formData.soldByCarton}
                          onCheckedChange={(checked: boolean) =>
                            handleInputChange("soldByCarton", checked)
                          }
                        />
                        <label
                          htmlFor="carton"
                          className="flex-1 mt-[-1.00px] font-label-small font-bold text-gray-700 text-sm tracking-wide leading-5"
                        >
                          {t("productSidebar.form.soldBy.carton")}
                        </label>
                      </div>
                      <div className="flex items-center gap-2 pt-2 pr-2 pb-2 pl-2 flex-1 self-stretch grow bg-gray-100 rounded-lg border border-solid border-gray-300">
                        <Checkbox
                          id="unite"
                          className="w-6 h-6"
                          checked={formData.soldByUnit}
                          onCheckedChange={(checked: boolean) =>
                            handleInputChange("soldByUnit", checked)
                          }
                        />
                        <label
                          htmlFor="unite"
                          className="flex-1 font-label-small font-bold text-gray-700 text-sm tracking-wide leading-5"
                        >
                          {t("productSidebar.form.soldBy.unit")}
                        </label>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 relative self-stretch w-full">
                      <div className="relative flex-1">
                        <Input
                          className={cn(
                            "pt-2 pr-2 pb-2 pl-2",
                            errors.pricePerCarton && "border-red-500"
                          )}
                          type="number"
                          value={formData.pricePerCarton}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleInputChange("pricePerCarton", e.target.value)
                          }
                          placeholder={t("productSidebar.form.price.perCarton")}
                          disabled={!formData.soldByCarton}
                        />
                        {errors.pricePerCarton && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.pricePerCarton}
                          </p>
                        )}
                      </div>
                      <div className="relative flex-1">
                        <Input
                          className={cn(
                            "pt-2 pr-2 pb-2 pl-2 bg-gray-200 border-gray-300",
                            errors.pricePerUnit && "border-red-500"
                          )}
                          type="number"
                          value={formData.pricePerUnit}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleInputChange("pricePerUnit", e.target.value)
                          }
                          placeholder={t("productSidebar.form.price.perUnit")}
                          disabled={!formData.soldByUnit}
                        />
                        {errors.pricePerUnit && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.pricePerUnit}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-2 relative self-stretch w-full">
                      <div className="relative flex-1">
                        <Input
                          className={cn(
                            "pt-2 pr-2 pb-2 pl-2",
                            errors.piecesPerCarton && "border-red-500"
                          )}
                          type="number"
                          value={formData.piecesPerCarton}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleInputChange("piecesPerCarton", e.target.value)
                          }
                          placeholder={t("productSidebar.form.piecesPerCarton")}
                          disabled={!formData.soldByCarton}
                        />
                        {errors.piecesPerCarton && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.piecesPerCarton}
                          </p>
                        )}
                      </div>
                      <div className="relative flex-1">
                        <Input
                          className={cn(
                            "pt-2 pr-2 pb-2 pl-2",
                            errors.reference && "border-red-500"
                          )}
                          type="text"
                          value={formData.reference}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleInputChange("reference", e.target.value)
                          }
                          placeholder={t("productSidebar.form.reference")}
                        />
                        {errors.reference && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.reference}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="relative w-full h-[175px]">
                      <Textarea
                        className="h-full pt-4 pr-4 pb-4 pl-4"
                        value={formData.description}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                          handleInputChange("description", e.target.value)
                        }
                        placeholder={t("productSidebar.form.description")}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between relative self-stretch">
                  <div className="flex flex-col items-start gap-6">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "flex flex-col w-[250px] h-[250px] justify-end pt-1 pr-1 pb-1 pl-1 rounded-lg bg-cover bg-center items-start gap-6 transition-all duration-300 group",
                            "hover:shadow-lg hover:scale-[1.02]"
                          )}
                          style={{
                            backgroundImage: formData.imageUrls[0]
                              ? `url(${formData.imageUrls[0]})`
                              : "none",
                          }}
                        >
                          {formData.images.length === 0 ? (
                            <div className="flex flex-col items-center justify-center w-full h-full gap-2.5 p-2 rounded-lg border border-dashed border-gray-300 hover:border-blue-500 transition-colors cursor-pointer">
                              <div className="flex w-6 h-6 items-center justify-center gap-2.5 p-px">
                                <img
                                  className="w-3.5 h-3.5"
                                  alt="Icon"
                                  src="/img/icon-20.svg"
                                />
                              </div>
                              <div className="self-stretch font-label-smallest font-bold text-gray-700 text-xs text-center tracking-wide leading-4">
                                {t("productSidebar.imageUpload.dropMainImage")}
                              </div>
                              <div className="self-stretch font-label-smallest font-bold text-blue-500 text-xs text-center tracking-wide leading-4 underline">
                                {t(
                                  "productSidebar.imageUpload.orClickToSearch"
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <Button
                                variant="outline"
                                size="icon"
                                className="gap-2 p-2 bg-red-500 border-red-500 hover:bg-red-600 transition-colors"
                                onClick={() => handleRemoveImage(0)}
                              >
                                <img
                                  className="w-3.5 h-3.5"
                                  alt="Delete"
                                  src="/img/icon-16.svg"
                                />
                              </Button>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col h-[250px] items-start justify-center gap-6">
                          <div className="flex items-center gap-6 flex-1 self-stretch w-full grow">
                            <Dropzone
                              dropzone={{
                                text1: t(
                                  "productSidebar.imageUpload.dropImages"
                                ),
                                text2: t(
                                  "productSidebar.imageUpload.orClickToSearch"
                                ),
                              }}
                              onUpload={handleFileUpload}
                              disabled={formData.images.length >= 5}
                              imageUrl={formData.imageUrls[1]}
                              onRemove={() => handleRemoveImage(1)}
                            />
                            <Dropzone
                              dropzone={{
                                text1: t(
                                  "productSidebar.imageUpload.dropImages"
                                ),
                                text2: t(
                                  "productSidebar.imageUpload.orClickToSearch"
                                ),
                              }}
                              onUpload={handleFileUpload}
                              disabled={formData.images.length >= 5}
                              imageUrl={formData.imageUrls[2]}
                              onRemove={() => handleRemoveImage(2)}
                            />
                          </div>
                          <div className="flex items-center gap-6 flex-1 grow">
                            <Dropzone
                              dropzone={{
                                text1: t(
                                  "productSidebar.imageUpload.dropImages"
                                ),
                                text2: t(
                                  "productSidebar.imageUpload.orClickToSearch"
                                ),
                              }}
                              onUpload={handleFileUpload}
                              disabled={formData.images.length >= 5}
                              imageUrl={formData.imageUrls[3]}
                              onRemove={() => handleRemoveImage(3)}
                            />
                            <Dropzone
                              dropzone={{
                                text1: t(
                                  "productSidebar.imageUpload.dropImages"
                                ),
                                text2: t(
                                  "productSidebar.imageUpload.orClickToSearch"
                                ),
                              }}
                              onUpload={handleFileUpload}
                              disabled={formData.images.length >= 5}
                              imageUrl={formData.imageUrls[4]}
                              onRemove={() => handleRemoveImage(4)}
                            />
                          </div>
                        </div>
                        {errors.images && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.images}
                          </p>
                        )}
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
                      onClick={handleSaveDraft}
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
                      onClick={handleNext}
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
