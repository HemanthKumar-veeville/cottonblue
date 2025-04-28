import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Switch } from "../../components/ui/switch";
import { ImageIcon } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { createCarousel, getCarousel } from "../../store/features/clientSlice";
import { toast } from "sonner";
import { getHost } from "../../utils/hostUtils";
import { Skeleton } from "../../components/Skeleton";

interface CarouselData {
  company_id?: number;
  image_urls?: Record<string, string>;
  id?: number;
  auto_play?: boolean;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface ImageUploadAreaProps {
  onFileSelect: (file: File) => void;
  imageUrl: string | null;
  onRemove: () => void;
  disabled?: boolean;
}

const ImageUploadArea = ({
  onFileSelect,
  imageUrl,
  onRemove,
  disabled,
}: ImageUploadAreaProps) => {
  const { t } = useTranslation();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error(t("carousel.images.fileTooLarge"));
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error(t("carousel.images.invalidFileType"));
        return;
      }
      onFileSelect(file);
    }
  };

  return (
    <div
      className={`flex flex-col h-[113px] items-center justify-center gap-2.5 px-2 flex-1 rounded-lg overflow-hidden border border-dashed border-[color:var(--1-tokens-color-modes-border-primary)] ${
        imageUrl ? "bg-[#f2ede5]" : ""
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      onClick={() => !disabled && !imageUrl && fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
        disabled={disabled}
      />
      {imageUrl ? (
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            className="max-w-full max-h-full object-contain"
            alt={t("carousel.images.uploadedImage")}
            src={imageUrl}
          />
          <button
            className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <span className="leading-none text-sm font-medium">×</span>
          </button>
        </div>
      ) : (
        <>
          <div className="flex w-4 h-4 items-center justify-center">
            <ImageIcon className="w-3.5 h-3.5" />
          </div>
          <p className="text-center font-label-smallest text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] text-[length:var(--label-smallest-font-size)] tracking-[var(--label-smallest-letter-spacing)] leading-[var(--label-smallest-line-height)]">
            {t("carousel.images.dropImages")}
          </p>
          <p className="text-center font-label-smallest text-1-tokens-color-modes-common-primary-brand-medium text-[length:var(--label-smallest-font-size)] tracking-[var(--label-smallest-letter-spacing)] leading-[var(--label-smallest-line-height)] underline">
            {t("carousel.images.orClickToSearch")}
          </p>
        </>
      )}
    </div>
  );
};

const SectionLabel = ({ text }: { text: string }) => (
  <div className="inline-flex flex-col items-center justify-center absolute top-[-11px] left-6">
    <div className="absolute w-[183px] h-px top-[11px] -left-0.5 bg-white"></div>
    <div className="relative w-fit px-2 bg-white font-label-small text-1-tokens-color-modes-common-neutral-hight text-[length:var(--label-small-font-size)] tracking-[var(--label-small-letter-spacing)] leading-[var(--label-small-line-height)] whitespace-nowrap">
      {text}
    </div>
  </div>
);

const CarouselSkeleton = () => {
  return (
    <div className="flex flex-col items-start gap-8 p-6">
      <div className="flex flex-col gap-8 relative w-full rounded-lg">
        <div className="flex h-64 items-center justify-center rounded-lg bg-[#f2ede3] overflow-hidden">
          <div className="w-full h-full flex items-center justify-center animate-pulse">
            <div className="w-48 h-48 bg-gray-200 rounded-lg"></div>
          </div>
        </div>

        <Card className="w-full bg-white overflow-hidden mb-[-56px]">
          <CardContent className="p-6 flex flex-col gap-8">
            <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>

            <Card className="border border-solid border-[color:var(--1-tokens-color-modes-input-primary-default-border)] rounded-lg bg-[color:var(--1-tokens-color-modes-input-primary-default-background)]">
              <CardContent className="p-4 flex flex-col gap-4 relative">
                <div className="flex-col items-start gap-4 inline-flex">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-10 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-10 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
                <SectionLabel text="Carousel Configuration" />
              </CardContent>
            </Card>

            <Card className="border border-solid border-[color:var(--1-tokens-color-modes-input-primary-default-border)] rounded-lg bg-[color:var(--1-tokens-color-modes-input-primary-default-background)]">
              <CardContent className="p-4 flex flex-col gap-4 relative">
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                <SectionLabel text="Add Images" />
                <div className="flex items-start gap-2 w-full">
                  {[0, 1].map((index) => (
                    <div
                      key={`skeleton-upload-area-${index}`}
                      className="flex-1 h-[113px] bg-gray-200 rounded-lg animate-pulse"
                    ></div>
                  ))}
                </div>
                <div className="flex items-start gap-2 w-full">
                  {[2, 3].map((index) => (
                    <div
                      key={`skeleton-upload-area-${index}`}
                      className="flex-1 h-[113px] bg-gray-200 rounded-lg animate-pulse"
                    ></div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="h-12 w-24 bg-gray-200 rounded self-end animate-pulse"></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default function Container(): JSX.Element {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [isActive, setIsActive] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dns_prefix = getHost();
  const { selectedCompany, loading } = useAppSelector((state) => state.client);
  const carousel = useAppSelector(
    (state) => state.client.carousel
  ) as CarouselData | null;

  // Initialize state with carousel data
  useEffect(() => {
    if (carousel) {
      setIsActive(carousel.is_active ?? false);
      setAutoPlay(carousel.auto_play ?? false);

      // Transform image URLs into the format expected by our component
      const imageUrls = carousel.image_urls ?? {};
      const initialImages = Object.values(imageUrls)
        .filter((url): url is string => typeof url === "string") // Type guard to ensure string
        .map((url) => ({
          file: new File([], ""), // Empty file since we're loading from URL
          preview: url,
        }));
      setImages(initialImages);
    }
  }, [carousel]);

  useEffect(() => {
    if (selectedCompany?.dns) {
      dispatch(getCarousel(selectedCompany.dns)).unwrap();
    }
  }, [dispatch, selectedCompany?.dns]);

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      images.forEach((image) => URL.revokeObjectURL(image.preview));
    };
  }, [images]);

  const handleFileSelect = useCallback((file: File, index: number) => {
    setImages((prev) => {
      const newImages = [...prev];
      const preview = URL.createObjectURL(file);
      newImages[index] = { file, preview };
      return newImages;
    });
  }, []);

  const handleRemoveImage = useCallback((index: number) => {
    setImages((prev) => {
      const newImages = [...prev];
      if (newImages[index]) {
        URL.revokeObjectURL(newImages[index].preview);
        newImages.splice(index, 1);
      }
      return [...newImages];
    });
  }, []);

  const handleSave = async () => {
    if (!selectedCompany?.dns) {
      toast.error(t("carousel.errors.noCompanySelected"));
      return;
    }

    if (images.length === 0) {
      toast.error(t("carousel.errors.noImages"));
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(
        createCarousel({
          dns_prefix: selectedCompany.dns,
          data: {
            carousel_images: images.map((img) => img.file),
            is_active: isActive,
            auto_play: autoPlay,
          },
        })
      ).unwrap();

      toast.success(t("carousel.messages.saveSuccess"));
    } catch (error) {
      toast.error(t("carousel.messages.saveError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <CarouselSkeleton />;
  }

  return (
    <div className="flex flex-col items-start gap-8 p-6">
      <div className="flex flex-col gap-8 relative w-full rounded-lg">
        <div className="flex h-64 items-center justify-center rounded-lg bg-[#f2ede3] overflow-hidden">
          {images[0]?.preview ? (
            <div className="w-full h-full flex items-center justify-center">
              <img
                className="max-h-full max-w-full object-contain"
                alt={t("carousel.images.preview")}
                src={images[0].preview}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center text-gray-400">
              <ImageIcon size={48} />
            </div>
          )}
        </div>

        <Card className="w-full bg-white overflow-hidden mb-[-56px]">
          <CardContent className="p-6 flex flex-col gap-8">
            <h3 className="font-heading-h3 text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] text-[length:var(--heading-h3-font-size)] tracking-[var(--heading-h3-letter-spacing)] leading-[var(--heading-h3-line-height)] [font-style:var(--heading-h3-font-style)]">
              {t("carousel.title")}
            </h3>

            <Card className="border border-solid border-[color:var(--1-tokens-color-modes-input-primary-default-border)] rounded-lg bg-[color:var(--1-tokens-color-modes-input-primary-default-background)]">
              <CardContent className="p-4 flex flex-col gap-4 relative">
                <div className="flex-col items-start gap-4 inline-flex">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="show-carousel"
                      checked={isActive}
                      onCheckedChange={setIsActive}
                    />
                    <label
                      htmlFor="show-carousel"
                      className="font-label-medium text-[color:var(--1-tokens-color-modes-input-primary-default-text)] text-[length:var(--label-medium-font-size)] tracking-[var(--label-medium-letter-spacing)] leading-[var(--label-medium-line-height)] whitespace-nowrap"
                    >
                      {t("carousel.configuration.showOnHome")}
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="auto-loop"
                      checked={autoPlay}
                      onCheckedChange={setAutoPlay}
                    />
                    <label
                      htmlFor="auto-loop"
                      className="font-label-medium text-[color:var(--1-tokens-color-modes-input-primary-default-text)] text-[length:var(--label-medium-font-size)] tracking-[var(--label-medium-letter-spacing)] leading-[var(--label-medium-line-height)] whitespace-nowrap"
                    >
                      {t("carousel.configuration.autoLoop")}
                    </label>
                  </div>
                </div>
                <SectionLabel text={t("carousel.configuration.title")} />
              </CardContent>
            </Card>

            <Card className="border border-solid border-[color:var(--1-tokens-color-modes-input-primary-default-border)] rounded-lg bg-[color:var(--1-tokens-color-modes-input-primary-default-background)]">
              <CardContent className="p-4 flex flex-col gap-4 relative">
                <p className="font-text-small text-[color:var(--1-tokens-color-modes-button-ghost-default-text)] text-[length:var(--text-small-font-size)] tracking-[var(--text-small-letter-spacing)] leading-[var(--text-small-line-height)]">
                  {t("carousel.images.recommendation")}
                </p>
                <SectionLabel text={t("carousel.images.title")} />
                <div className="flex items-start gap-2 w-full">
                  {[0, 1].map((index) => (
                    <ImageUploadArea
                      key={`upload-area-${index}`}
                      imageUrl={images[index]?.preview || null}
                      onFileSelect={(file) => handleFileSelect(file, index)}
                      onRemove={() => handleRemoveImage(index)}
                      disabled={isSubmitting}
                    />
                  ))}
                </div>
                <div className="flex items-start gap-2 w-full">
                  {[2, 3].map((index) => (
                    <ImageUploadArea
                      key={`upload-area-${index}`}
                      imageUrl={images[index]?.preview || null}
                      onFileSelect={(file) => handleFileSelect(file, index)}
                      onRemove={() => handleRemoveImage(index)}
                      disabled={isSubmitting}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Button
              className="h-12 self-end bg-[#07515f] text-[color:var(--1-tokens-color-modes-button-primary-default-text)]"
              onClick={handleSave}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? t("carousel.actions.saving")
                : t("carousel.actions.save")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
