import { Button } from "../../components/ui/button";
import {
  ArrowLeft,
  BoxIcon,
  ImageOff,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Power,
  Edit,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  getProductById,
  type Product,
  updateProduct,
  deleteProduct,
} from "../../store/features/productSlice";
import { useTranslation } from "react-i18next";
import { Skeleton } from "../../components/Skeleton";
import { cn } from "../../lib/utils";
import { isWarehouseHostname } from "../../utils/hostUtils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";

const ProductHeader = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between w-full">
      <div className="inline-flex items-center gap-2">
        <ArrowLeft
          onClick={() => navigate("/products")}
          className="w-5 h-5 text-[#07515f] cursor-pointer hover:text-[#064a56] transition-colors duration-200"
        />
        <h1 className="font-heading-h3 font-bold text-gray-700 text-lg tracking-wide leading-6">
          {t("productDetails.header")}
        </h1>
      </div>
    </div>
  );
};

const ProductImage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { currentProduct } = useAppSelector((state) => state.product);
  const productImages = currentProduct?.product?.product_images;
  const images = productImages ? productImages : [];
  const SLIDE_INTERVAL = 1500; // 3 seconds per slide

  useEffect(() => {
    if (!images.length || images.length === 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, SLIDE_INTERVAL);

    return () => clearInterval(timer);
  }, [images.length, isPaused]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-[400px] rounded-lg overflow-hidden border border-solid border-gray-300 bg-white flex items-center justify-center">
        <div className="w-full h-full flex items-center justify-center">
          <ImageOff className="w-24 h-24 text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-[400px] rounded-lg border border-solid border-gray-300 bg-white group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 bg-white hover:bg-gray-50 rounded-full p-2.5 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 border border-gray-200 z-10"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={handleNextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 bg-white hover:bg-gray-50 rounded-full p-2.5 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 border border-gray-200 z-10"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </>
      )}

      <div className="relative w-full h-full overflow-hidden rounded-lg">
        {images.map((image: string, index: number) => (
          <div
            key={index}
            className={`absolute w-full h-full transition-all duration-500 ease-in-out ${
              currentSlide === index
                ? "opacity-100 translate-x-0"
                : index > currentSlide
                ? "opacity-0 translate-x-full"
                : "opacity-0 -translate-x-full"
            }`}
          >
            <div className="w-full h-full flex items-center justify-center p-4">
              <img
                src={image}
                alt={`Product ${index + 1}`}
                className="max-w-full max-h-full w-full h-auto object-contain"
              />
            </div>
          </div>
        ))}

        {/* Dots Navigation */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-white/80 px-3 py-1.5 rounded-full shadow-sm">
            {images.map((_: string, index: number) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  currentSlide === index
                    ? "bg-[#07515f] w-4"
                    : "bg-gray-400 hover:bg-gray-600"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ProductInfo = ({ product }: { product: Product }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { selectedCompany } = useAppSelector((state) => state.client);
  const isWarehouse = isWarehouseHostname();

  // Define standard size order
  const standardSizeOrder: { [key: string]: number } = {
    XS: 1,
    S: 2,
    M: 3,
    L: 4,
    XL: 5,
    XXL: 6,
    XXXL: 7,
    XXXXL: 8,
    XXXXXL: 9,
  };

  // If the size is "Unique", only show that size
  const availableSizes =
    product?.size?.toUpperCase() === "UNIQUE"
      ? [{ size: product.size }]
      : [...(product?.linked_products || []), { size: product?.size || "" }]
          .filter((item) => item.size) // Remove empty sizes
          .sort((a, b) => {
            const sizeA = a.size.toUpperCase();
            const sizeB = b.size.toUpperCase();

            // Try to parse as numbers first (for sizes like "38", "40", etc.)
            const numA = parseFloat(sizeA);
            const numB = parseFloat(sizeB);
            if (!isNaN(numA) && !isNaN(numB)) {
              return numA - numB;
            }

            // Check if both sizes are standard sizes
            const isStandardA = standardSizeOrder.hasOwnProperty(sizeA);
            const isStandardB = standardSizeOrder.hasOwnProperty(sizeB);

            // If both are standard sizes, use the predefined order
            if (isStandardA && isStandardB) {
              return standardSizeOrder[sizeA] - standardSizeOrder[sizeB];
            }

            // If only one is a standard size, non-standard comes first
            if (isStandardA) return 1;
            if (isStandardB) return -1;

            // For non-standard sizes, use alphabetical order
            return sizeA.localeCompare(sizeB);
          });

  const productDetails = [
    {
      label: t("productDetails.info.sizes"),
      value: availableSizes ?? t("productDetails.notAvailable"),
      isSize: true,
    },
    {
      label: t("productDetails.info.suitableFor"),
      value: product?.suitable_for ?? t("productDetails.notAvailable"),
    },
    ...(isWarehouse
      ? []
      : [
          {
            label: t("productDetails.info.price"),
            value: product?.price_of_pack
              ? `${product.price_of_pack}€`
              : t("productDetails.notAvailable"),
            isPrice: true,
          },
        ]),
    {
      label: t("productDetails.info.availableStock"),
      value:
        product?.available_packs?.toString() ??
        t("productDetails.notAvailable"),
    },
    {
      label: t("productDetails.info.totalStock"),
      value:
        product?.total_packs?.toString() ?? t("productDetails.notAvailable"),
    },
    {
      label: t("productDetails.info.packQuantity"),
      value:
        product?.pack_quantity?.toString() ?? t("productDetails.notAvailable"),
    },
  ];

  return (
    <div className="flex flex-col w-full h-full">
      <div className="mb-4">
        <h2 className="font-heading-h3 font-bold text-gray-700 text-xl tracking-wide leading-6 mb-1">
          {product?.name ?? t("productDetails.notAvailable")}
        </h2>
        <p className="font-label-small text-gray-500 text-xs tracking-wide leading-4">
          Ref.: {product?.id ?? t("productDetails.notAvailable")}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-2 flex-1">
        {productDetails.map((detail, index) => (
          <div key={index} className="flex items-center py-2">
            <div className="flex items-center gap-2 w-[180px]">
              <span className="font-label-small font-bold text-gray-700 text-sm tracking-wide leading-5 w-[160px]">
                {detail.label}
              </span>
              <span className="font-label-small font-bold text-gray-700 text-sm tracking-wide leading-5 w-[20px]">
                :
              </span>
            </div>
            <div className="flex-1 pl-4">
              {detail.isSize && Array.isArray(detail.value) ? (
                <div className="flex flex-wrap gap-2">
                  {detail.value.map((item, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      className={cn(
                        "h-7 px-3 py-1 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50",
                        item.size === product?.size &&
                          "bg-[#07515f] text-white hover:bg-[#07515f]/90 hover:border-[#07515f]/90 hover:text-white"
                      )}
                      onClick={() => {
                        item.linked_product_id &&
                          dispatch(
                            getProductById({
                              dnsPrefix: selectedCompany.dns,
                              productId: item.linked_product_id,
                            })
                          );
                      }}
                    >
                      {item.size}
                    </Button>
                  ))}
                </div>
              ) : (
                <span
                  className={`${
                    detail.isPrice
                      ? "text-[#07515f] font-semibold"
                      : "text-gray-700"
                  } font-label-small text-sm tracking-wide leading-5`}
                >
                  {Array.isArray(detail.value)
                    ? detail.value.map((item) => item.size).join(", ")
                    : detail.value}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProductActions = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const { selectedCompany } = useAppSelector((state) => state.client);
  const { currentProduct } = useAppSelector((state) => state.product);
  const isActive = currentProduct?.product?.is_active;
  const isWarehouse = isWarehouseHostname();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);

  if (isWarehouse) {
    return null;
  }

  const handleEdit = () => {
    navigate(`/products/edit/${id}`);
  };

  const handleToggleActivation = async () => {
    if (id && selectedCompany?.dns) {
      const resultAction = await dispatch(
        updateProduct({
          dnsPrefix: selectedCompany.dns,
          productId: id,
          data: {
            is_active: !isActive,
          },
        })
      ).unwrap();

      if (resultAction?.product_id) {
        // Refresh the product details
        dispatch(
          getProductById({ dnsPrefix: selectedCompany.dns, productId: id })
        );
        setShowDeactivateDialog(false);
      }
    }
  };

  const handleDelete = async () => {
    if (id && selectedCompany?.dns) {
      setIsDeleting(true);
      try {
        await dispatch(
          deleteProduct({
            dnsPrefix: selectedCompany.dns,
            productId: id,
          })
        ).unwrap();
        // Navigate back to products list after successful deletion
        navigate("/products");
      } catch (error) {
        console.error("Failed to delete product:", error);
      } finally {
        setIsDeleting(false);
        setShowDeleteDialog(false);
      }
    }
  };

  return (
    <>
      <div className="flex items-center gap-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="flex-1 bg-[#07515f] text-white hover:bg-[#064a56] h-9 text-sm border-gray-300"
                onClick={handleEdit}
              >
                <Edit className="w-4 h-4 mr-2" />
                <span className="font-label-medium font-bold text-white text-sm tracking-wide leading-5">
                  {t("productDetails.actions.modify")}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("productDetails.actions.tooltips.modify")}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isActive ? "destructive" : "default"}
                className={`flex-1 h-9 text-sm ${
                  isActive
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white"
                }`}
                onClick={() => setShowDeactivateDialog(true)}
              >
                <Power className="w-4 h-4 mr-2" />
                <span className="font-label-medium font-bold text-white text-sm tracking-wide leading-5">
                  {t(
                    isActive
                      ? "productDetails.actions.deactivate"
                      : "productDetails.actions.activate"
                  )}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {t(
                  isActive
                    ? "productDetails.actions.tooltips.deactivate"
                    : "productDetails.actions.tooltips.activate"
                )}
              </p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="destructive"
                className="flex-1 h-9 text-sm bg-red-600 hover:bg-red-700"
                onClick={() => setShowDeleteDialog(true)}
                disabled={isDeleting}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                <span className="font-label-medium font-bold text-white text-sm tracking-wide leading-5">
                  {isDeleting
                    ? t("common.deleting")
                    : t("productDetails.actions.delete")}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("productDetails.actions.tooltips.delete")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Deactivate Confirmation Dialog */}
      <Dialog
        open={showDeactivateDialog}
        onOpenChange={setShowDeactivateDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isActive
                ? t("productDetails.dialogs.deactivate.title")
                : t("productDetails.dialogs.activate.title")}
            </DialogTitle>
            <DialogDescription>
              {isActive
                ? t("productDetails.dialogs.deactivate.description")
                : t("productDetails.dialogs.activate.description")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowDeactivateDialog(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button
              variant={isActive ? "destructive" : "default"}
              className={
                isActive
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }
              onClick={handleToggleActivation}
            >
              {isActive
                ? t("productDetails.actions.deactivate")
                : t("productDetails.actions.activate")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("productDetails.dialogs.delete.title")}
            </DialogTitle>
            <DialogDescription>
              {t("productDetails.dialogs.delete.description")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting
                ? t("common.deleting")
                : t("productDetails.actions.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

const ProductDescription = ({
  description,
}: {
  description: string | null;
}) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const text = description ?? t("productDetails.notAvailable");
  const maxLength = 300;
  const shouldTruncate = text.length > maxLength;

  return (
    <div>
      <h3 className="font-heading-h3 font-bold text-gray-700 text-sm tracking-wide leading-5 mb-2">
        {t("productDetails.description.title")}
      </h3>
      <div className="relative">
        <p className="font-label-small text-gray-700 text-sm tracking-wide leading-5 whitespace-pre-wrap">
          {shouldTruncate && !isExpanded
            ? `${text.slice(0, maxLength)}... `
            : text}
          {shouldTruncate && !isExpanded && (
            <button
              onClick={toggleExpand}
              className="text-[#07515f] hover:text-[#064a56] font-medium text-sm inline-block focus:outline-none"
            >
              {t("productDetails.description.readMore")}
            </button>
          )}
        </p>
        {shouldTruncate && isExpanded && (
          <button
            onClick={toggleExpand}
            className="text-[#07515f] hover:text-[#064a56] font-medium text-sm mt-1 focus:outline-none"
          >
            {t("productDetails.description.showLess")}
          </button>
        )}
      </div>
    </div>
  );
};

export default function ProductDetails() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentProduct, loading, error } = useAppSelector(
    (state) => state.product
  );
  const product = currentProduct?.product ?? ({} as Product);

  const { selectedCompany } = useAppSelector((state) => state.client);

  useEffect(() => {
    if (id && selectedCompany?.dns) {
      dispatch(
        getProductById({ dnsPrefix: selectedCompany.dns, productId: id })
      );
    }
  }, [dispatch, id, selectedCompany?.dns]);

  if (loading) {
    return <Skeleton variant="details" />;
  }

  if (!currentProduct) {
    return (
      <div className="flex flex-col items-center gap-8 p-6">
        <div className="text-center py-4 font-label-small text-sm tracking-wide leading-5">
          {t("productDetails.notFound")}
        </div>
      </div>
    );
  }

  return (
    <main className="flex flex-col w-full gap-8 p-6 bg-white rounded-lg">
      <ProductHeader />
      <div className="mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ProductImage />
          </div>
          <div className="lg:col-span-2">
            <div className="flex flex-col h-[400px]">
              <div className="flex-none">
                <ProductInfo product={product} />
              </div>
              <div className="flex-none mt-6">
                <ProductActions />
              </div>
              <div className="flex-none mt-6">
                <ProductDescription description={product.description} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
