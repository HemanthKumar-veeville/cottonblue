import React, { useCallback, useState } from "react";
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
  const [isDragging, setIsDragging] = useState(false);

  const containerClass = cn(
    isMain ? "w-[250px] h-[250px]" : "w-[113px] h-[113px]",
    "flex flex-col items-center justify-center gap-2.5 p-2 relative rounded-lg overflow-hidden border border-dashed",
    isDragging
      ? "border-blue-500 bg-blue-50"
      : "border-gray-300 hover:border-blue-500",
    "transition-colors cursor-pointer",
    disabled && "opacity-50 cursor-not-allowed"
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled && !imageUrl) {
        setIsDragging(true);
      }
    },
    [disabled, imageUrl]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled || imageUrl) return;

      const file = e.dataTransfer.files?.[0];
      if (file) {
        onUpload(file, position);
      }
    },
    [disabled, imageUrl, onUpload, position]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onUpload(file, position);
      }
    },
    [onUpload, position]
  );

  return (
    <div
      className={containerClass}
      onClick={() =>
        !disabled &&
        !imageUrl &&
        document.getElementById(`file-upload-${position}`)?.click()
      }
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        id={`file-upload-${position}`}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />

      {imageUrl ? (
        <div className="relative w-full h-full flex items-center justify-center bg-gray-50">
          <div className="w-full h-full flex items-center justify-center">
            <img
              src={imageUrl}
              alt="Uploaded"
              className="max-w-full max-h-full w-auto h-auto object-contain"
            />
          </div>
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
                className="w-3.5 h-3.5 brightness-0 invert"
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
