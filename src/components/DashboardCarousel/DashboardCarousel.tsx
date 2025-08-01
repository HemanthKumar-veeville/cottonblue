import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCarousel } from "../../store/features/clientSlice";
import { getHost } from "../../utils/hostUtils";
import { useCompanyColors } from "../../hooks/useCompanyColors";

// Carousel skeleton loader component
const CarouselSkeleton = () => {
  return (
    <div className="flex flex-col items-center gap-2.5 w-full">
      <div className="flex h-[50vh] w-full items-center justify-center rounded-[var(--2-tokens-screen-modes-button-border-radius)] [background:linear-gradient(0deg,rgba(242,237,227,1)_0%,rgba(242,237,227,1)_100%)] overflow-hidden">
        <div className="h-full w-[600px] animate-pulse bg-gray-200 rounded-lg" />
      </div>
      <div className="inline-flex items-start gap-[var(--2-tokens-screen-modes-common-spacing-m)] relative flex-[0_0_auto]">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className="w-4 h-4 rounded-lg bg-gray-200 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
};

export const DashboardCarousel = (): JSX.Element => {
  const dispatch = useDispatch();
  const [currentSlide, setCurrentSlide] = useState(0);
  const carousel = useSelector((state: any) => state.client.carousel);
  const loading = useSelector((state: any) => state.client.loading);
  const dnsPrefix = getHost();
  const { primaryColor } = useCompanyColors();

  useEffect(() => {
    dispatch(getCarousel(dnsPrefix) as any);
  }, [dispatch, dnsPrefix]);

  useEffect(() => {
    if (!carousel?.is_active || !carousel?.image_urls) return;

    const imageCount = Object.keys(carousel.image_urls).length;
    if (!imageCount) return;

    if (carousel.auto_play) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % imageCount);
      }, 5000);

      return () => clearInterval(timer);
    }
  }, [carousel?.is_active, carousel?.auto_play, carousel?.image_urls]);

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  // Show skeleton loader while loading
  if (loading) {
    return <CarouselSkeleton />;
  }

  // Return empty fragment if carousel is not active or no images
  if (!carousel?.is_active || !carousel?.image_urls) {
    return <></>;
  }

  const imageUrls = Object.values(carousel.image_urls ?? {}) as string[];
  if (!imageUrls.length) {
    return <></>;
  }

  return (
    <div className="flex flex-col items-center gap-2.5 w-full">
      {imageUrls.map((imageUrl, index) => (
        <div
          key={index}
          className={`relative border-none flex h-[50vh] w-full items-center justify-center transition-all duration-500 ease-in-out ${
            currentSlide === index ? "block" : "hidden"
          }`}
        >
          <div
            className="absolute inset-0 border-none overflow-hidden"
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: "cover",
              filter: "blur(2px)",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              margin: 0,
              padding: 0,
              border: "none",
            }}
          />
          <img
            className="relative h-[50vh] w-auto object-contain z-10"
            alt={`Banner image ${index + 1}`}
            src={imageUrl}
          />
        </div>
      ))}
      <div className="inline-flex items-start gap-[var(--2-tokens-screen-modes-common-spacing-m)] relative flex-[0_0_auto]">
        {imageUrls.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-4 h-4 rounded-lg ${
              currentSlide === index ? "" : "border border-solid"
            }`}
            style={{
              backgroundColor: currentSlide === index ? primaryColor : "",
              borderColor: currentSlide === index ? "" : primaryColor,
            }}
          />
        ))}
      </div>
    </div>
  );
};
