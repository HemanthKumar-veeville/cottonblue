import React from "react";
import { Button } from "../../../../components/ui/button";
import { useTranslation } from "react-i18next";
import { cn } from "../../../../lib/utils";

interface ProductImageUploaderProps {
  position: number;
  imageUrl?: string;
  onUpload: (file: File, position: number) => void;
  onRemove: (position: number) => void;
  disabled?: boolean;
  isMain?: boolean;
}

export const ProductImageUploader: React.FC<ProductImageUploaderProps> = ({
  position,
  imageUrl,
  onUpload,
  onRemove,
  disabled,
  isMain = false,
}) => {
  const { t } = useTranslation();
  const containerClass = cn(
    isMain ? "w-[250px] h-[250px]" : "w-[113px] h-[113px]",
    "flex flex-col items-center justify-center gap-2.5 p-2 relative rounded-lg overflow-hidden border border-dashed border-gray-300 hover:border-blue-500 transition-colors cursor-pointer",
    disabled && "opacity-50 cursor-not-allowed"
  );

  return (
    <div
      className={containerClass}
      onClick={() =>
        !disabled &&
        !imageUrl &&
        document.getElementById(`file-upload-${position}`)?.click()
      }
    >
      <input
        id={`file-upload-${position}`}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload(file, position);
        }}
      />
      {imageUrl ? (
        <div className="relative w-full h-full group">
          <img
            src={imageUrl}
            alt="Uploaded"
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="outline"
              size="icon"
              className="gap-2 p-2 bg-red-500 border-red-500 hover:bg-red-600 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(position);
              }}
            >
              <img
                className="w-3.5 h-3.5"
                alt="Delete"
                src="/img/icon-16.svg"
              />
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex w-6 h-6 items-center justify-center gap-2.5 p-px">
            <img className="w-3.5 h-3.5" alt="Icon" src="/img/icon-20.svg" />
          </div>
          <div className="self-stretch font-label-smallest font-bold text-gray-700 text-xs text-center tracking-wide leading-4">
            {t("productSidebar.imageUpload.dropImages")}
          </div>
          <div className="self-stretch font-label-smallest font-bold text-blue-500 text-xs text-center tracking-wide leading-4 underline">
            {t("productSidebar.imageUpload.orClickToSearch")}
          </div>
        </>
      )}
    </div>
  );
};
