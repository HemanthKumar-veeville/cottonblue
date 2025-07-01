import React from "react";
import { cn } from "../../../../lib/utils";
import { Button } from "../../../../components/ui/button";
import { Star, StarOff } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ProductImageUploaderProps {
  position: number;
  imageUrl?: string;
  onUpload: (file: File, position: number) => void;
  onRemove: (position: number) => void;
  onSetMainImage: (position: number) => void;
  disabled?: boolean;
  isMain?: boolean;
}

export const ProductImageUploader = ({
  position,
  imageUrl,
  onUpload,
  onRemove,
  onSetMainImage,
  disabled = false,
  isMain = false,
}: ProductImageUploaderProps): JSX.Element => {
  const { t } = useTranslation();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!disabled && !imageUrl) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file, position);
    }
  };

  return (
    <div
      className={cn(
        "relative",
        position === 0 ? "w-[250px] h-[250px]" : "w-[113px] h-[113px]",
        !imageUrl && !disabled && "cursor-pointer hover:bg-gray-50",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      onClick={handleClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
        disabled={disabled}
      />

      {imageUrl ? (
        <div className="relative w-full h-full flex items-center justify-center bg-gray-50 group">
          <div className="w-full h-full flex items-center justify-center">
            <img
              src={imageUrl}
              alt="Uploaded"
              className="max-w-full max-h-full w-auto h-auto object-contain"
            />
          </div>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />

          {/* Star Toggle Button */}
          <div className="absolute top-2 right-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className={cn(
                "gap-2 p-2 transition-colors",
                isMain
                  ? "bg-yellow-400 border-yellow-400 hover:bg-yellow-500 hover:border-yellow-500"
                  : "bg-white border-gray-300 hover:bg-gray-50"
              )}
              onClick={(e) => {
                e.stopPropagation();
                onSetMainImage(position);
              }}
            >
              {isMain ? (
                <Star className="w-3.5 h-3.5 text-white" />
              ) : (
                <StarOff className="w-3.5 h-3.5 text-gray-600" />
              )}
            </Button>
          </div>

          {/* Original Delete Button */}
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
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span className="text-white text-sm font-medium bg-black/50 px-3 py-1.5 rounded-full whitespace-nowrap">
              {t("productSidebar.imageUpload.clickToReplace")}
            </span>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center justify-center gap-2.5 p-2 relative h-full rounded-lg overflow-hidden border border-dashed border-gray-300 hover:border-blue-500 transition-colors">
            <div className="flex w-6 h-6 items-center justify-center gap-2.5 p-px">
              <img className="w-3.5 h-3.5" alt="Icon" src="/img/icon-20.svg" />
            </div>
            <div className="self-stretch font-label-smallest font-bold text-gray-700 text-xs text-center tracking-wide leading-4">
              {t("productSidebar.imageUpload.dropImages")}
            </div>
            <div className="self-stretch font-label-smallest font-bold text-blue-500 text-xs text-center tracking-wide leading-4 underline">
              {t("productSidebar.imageUpload.orClickToSearch")}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
