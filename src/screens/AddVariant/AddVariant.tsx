import React, { useState, useCallback, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { ArrowLeft, Store, Loader2, Plus, Trash2, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "../../lib/utils";
import { useNavigate, useParams } from "react-router-dom";
import {
  getProductById,
  Product,
  getAllocatedStores,
  addProductVariants,
} from "../../store/features/productSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

interface Variant {
  id: string;
  size: string;
  sku: string;
  price: string;
  stock: string;
  isExisting?: boolean;
}

const ProgressIndicator = () => (
  <div className="flex items-center justify-center w-full mt-8">
    <div className="flex items-center justify-center gap-2">
      {[1, 2, 3].map((step, index) => (
        <React.Fragment key={step}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center"
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-200",
                step <= 2
                  ? "bg-[#07515f] text-white"
                  : "bg-gray-100 text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)]"
              )}
            >
              {step === 1 ? (
                <Check className="w-4 h-4 stroke-[2.5]" />
              ) : (
                <span className="font-label-medium">{step}</span>
              )}
            </div>
            {step < 3 && (
              <div
                className={cn(
                  "w-12 h-0.5 mx-2 transition-colors duration-200",
                  step === 1 ? "bg-[#07515f]" : "bg-gray-200"
                )}
              />
            )}
          </motion.div>
        </React.Fragment>
      ))}
    </div>
  </div>
);

const VariantTable = ({
  variants,
  setVariants,
}: {
  variants: Variant[];
  setVariants: React.Dispatch<React.SetStateAction<Variant[]>>;
}) => {
  const { t } = useTranslation();

  const addVariant = () => {
    const newVariant: Variant = {
      id: (variants.length + 1).toString(),
      size: "",
      sku: "",
      price: "",
      stock: "",
    };
    setVariants([...variants, newVariant]);
  };

  const handleVariantChange = (
    id: string,
    field: keyof Variant,
    value: string
  ) => {
    setVariants((prevVariants) =>
      prevVariants.map((variant) =>
        variant.id === id ? { ...variant, [field]: value } : variant
      )
    );
  };

  return (
    <div className="w-full">
      <div className="bg-[#E6F4F6] rounded-t-lg p-4">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-2 flex items-center">
            <h3 className="text-sm font-medium">
              {t("addProduct.variants.size")}
            </h3>
          </div>
          <div className="col-span-3 flex items-center">
            <h3 className="text-sm font-medium">
              {t("addProduct.variants.sku")}
            </h3>
          </div>
          <div className="col-span-2 flex items-center">
            <h3 className="text-sm font-medium">
              {t("addProduct.variants.price", { currency: "€" })}
            </h3>
          </div>
          <div className="col-span-2 flex items-center">
            <h3 className="text-sm font-medium">
              {t("addProduct.variants.stock")}
            </h3>
          </div>
          <div className="col-span-2 flex items-center justify-center">
            <h3 className="text-sm font-medium">
              {t("addProduct.variants.delete")}
            </h3>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-b-lg">
        {variants.map((variant) => (
          <div
            key={variant.id}
            className="grid grid-cols-12 gap-4 p-4 border-b last:border-b-0"
          >
            <div className="col-span-2 flex items-center justify-center">
              <Select
                value={variant.size}
                onValueChange={(value) =>
                  handleVariantChange(variant.id, "size", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={t("addProduct.variants.sizePlaceholder")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="XS">XS</SelectItem>
                  <SelectItem value="S">S</SelectItem>
                  <SelectItem value="M">M</SelectItem>
                  <SelectItem value="L">L</SelectItem>
                  <SelectItem value="XL">XL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-3 flex items-center justify-center">
              <Input
                type="text"
                value={variant.sku}
                onChange={(e) =>
                  handleVariantChange(variant.id, "sku", e.target.value)
                }
                className="w-full"
                placeholder={t("addProduct.variants.skuPlaceholder")}
              />
            </div>
            <div className="col-span-2 flex items-center justify-center">
              <Input
                type="number"
                value={variant.price}
                onChange={(e) =>
                  handleVariantChange(variant.id, "price", e.target.value)
                }
                className="w-full"
                placeholder={t("addProduct.variants.pricePlaceholder")}
              />
            </div>
            <div className="col-span-2 flex items-center justify-center">
              <Input
                type="number"
                value={variant.stock}
                onChange={(e) =>
                  handleVariantChange(variant.id, "stock", e.target.value)
                }
                className="w-full"
                placeholder={t("addProduct.variants.stockPlaceholder")}
              />
            </div>
            <div className="col-span-2 flex items-center justify-center">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "p-2 transition-colors duration-200",
                  variant.isExisting
                    ? "opacity-50 cursor-not-allowed text-gray-400 hover:bg-transparent"
                    : "hover:bg-red-50 hover:text-red-600"
                )}
                onClick={() => {
                  if (!variant.isExisting) {
                    setVariants(variants.filter((v) => v.id !== variant.id));
                  }
                }}
                disabled={variant.isExisting}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}

        <div className="p-4">
          <Button
            onClick={addVariant}
            className={cn(
              "bg-[#07515f] text-white flex items-center justify-center gap-2",
              "hover:bg-[#064a56] active:bg-[#053942]",
              "transition-all duration-200",
              "rounded-md px-4 py-2",
              "shadow-sm hover:shadow",
              "transform hover:-translate-y-[1px] active:translate-y-0"
            )}
          >
            <Plus className="w-4 h-4" />
            <span className="font-medium">
              {t("addProduct.variants.addVariant")}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

const ProductDetails = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedCompany } = useAppSelector((state) => state.client);
  const { id } = useParams<{ id: string }>();
  const { currentProduct } = useAppSelector((state) => state.product);
  const product = currentProduct?.product as Product;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [variants, setVariants] = useState<Variant[]>([]);

  useEffect(() => {
    if (id && selectedCompany?.dns) {
      dispatch(
        getProductById({ dnsPrefix: selectedCompany.dns, productId: id })
      );
      dispatch(
        getAllocatedStores({ dnsPrefix: selectedCompany.dns, productId: id })
      );
    }
  }, [dispatch, id, selectedCompany?.dns]);

  useEffect(() => {
    if (product?.linked_products && product.linked_products.length > 0) {
      const linkedVariants: Variant[] = product.linked_products.map(
        (linkedProduct, index) => ({
          id: (index + 1).toString(),
          size: linkedProduct.size,
          sku: linkedProduct.linked_product_id?.toString() || "",
          price: linkedProduct.price_of_pack,
          stock: linkedProduct.total_packs,
          isExisting: true,
        })
      );
      setVariants(linkedVariants);
    } else {
      setVariants([
        {
          id: "1",
          size: "",
          sku: "",
          price: "",
          stock: "",
          isExisting: false,
        },
      ]);
    }
  }, [product]);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handlePublish = async () => {
    if (!selectedCompany?.dns || !id) return;

    setIsSubmitting(true);
    try {
      // Check if any variants were updated or added
      const hasChanges = variants.some((variant) => !variant.isExisting);

      // If no changes, skip API call and navigate directly
      if (!hasChanges) {
        navigate(`/products/allot-store-edit/${id}`);
        return;
      }

      const formattedVariants = variants
        ?.filter(
          (variant) =>
            variant.sku !== "" &&
            variant.size !== "" &&
            variant.price !== "" &&
            variant.stock !== ""
        )
        ?.map((variant) => ({
          product_id: parseInt(variant.sku),
          size: variant.size,
          price_of_pack: parseFloat(variant.price),
          total_packs: parseInt(variant.stock),
        }));

      // If no changes, skip API call and navigate directly
      if (formattedVariants?.length === 0) {
        navigate(`/products/allot-store-edit/${id}`);
        return;
      }

      const variantData = {
        product_variants: formattedVariants,
      };

      await dispatch(
        addProductVariants({
          dnsPrefix: selectedCompany.dns,
          productId: id,
          variants: variantData,
        })
      ).unwrap();

      navigate(`/products/allot-store-edit/${id}`);

      toast.success(t("addProduct.variants.success"));
    } catch (error: any) {
      toast.error(error.message || t("addProduct.variants.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col w-full gap-8 pb-24"
    >
      <ProgressIndicator />

      <div className="flex items-center justify-between w-full">
        <div className="inline-flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="hover:bg-gray-100 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 text-[#07515f]" />
          </Button>
          <h1 className="font-heading-h3 text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] text-[length:var(--heading-h3-font-size)] tracking-[var(--heading-h3-letter-spacing)] leading-[var(--heading-h3-line-height)] font-[number:var(--heading-h3-font-weight)] [font-style:var(--heading-h3-font-style)]">
            {t("addProduct.variants.heading")}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col md:flex-row gap-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden border border-solid border-gray-200 bg-white flex items-center justify-center group hover:border-[#07515f] transition-all duration-200 flex-shrink-0"
                >
                  {product?.product_image ? (
                    <div className="w-full h-full flex items-center justify-center p-2 relative">
                      <img
                        src={product.product_image}
                        alt={product.name}
                        className="max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-200 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Store className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </motion.div>

                <div className="flex-1">
                  <div className="flex flex-col gap-3">
                    <h2 className="font-heading-h4 text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] text-lg font-semibold">
                      {product?.name}
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                      <div className="flex flex-col p-2 bg-gray-50 rounded-md">
                        <span className="text-xs font-medium text-gray-500">
                          Size
                        </span>
                        <span className="text-sm font-semibold text-[#07515f]">
                          {product?.size}
                        </span>
                      </div>

                      <div className="flex flex-col p-2 bg-gray-50 rounded-md">
                        <span className="text-xs font-medium text-gray-500">
                          Suitable For
                        </span>
                        <span className="text-sm font-semibold text-[#07515f]">
                          {product?.suitable_for}
                        </span>
                      </div>

                      <div className="flex flex-col p-2 bg-gray-50 rounded-md">
                        <span className="text-xs font-medium text-gray-500">
                          Pack Qty
                        </span>
                        <span className="text-sm font-semibold text-[#07515f]">
                          {product?.pack_quantity} units
                        </span>
                      </div>

                      <div className="flex flex-col p-2 bg-gray-50 rounded-md">
                        <span className="text-xs font-medium text-gray-500">
                          Price/Pack
                        </span>
                        <span className="text-sm font-semibold text-[#07515f]">
                          ${product?.price_of_pack?.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex flex-col p-2 bg-gray-50 rounded-md">
                        <span className="text-xs font-medium text-gray-500">
                          Total Packs
                        </span>
                        <span className="text-sm font-semibold text-[#07515f]">
                          {product?.total_packs}
                        </span>
                      </div>

                      <div className="flex flex-col p-2 bg-gray-50 rounded-md">
                        <span className="text-xs font-medium text-gray-500">
                          Available
                        </span>
                        <span className="text-sm font-semibold text-[#07515f]">
                          {product?.available_packs}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h2 className="font-heading-h4 text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] text-lg font-semibold mb-4">
                  {t("addProduct.variants.title")}
                </h2>
                <VariantTable variants={variants} setVariants={setVariants} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-primary-neutal-300 py-4">
        <div className="px-6 max-w-[calc(100%-2rem)]">
          <div className="flex items-center justify-end w-full mx-auto">
            <Button
              onClick={handlePublish}
              disabled={isSubmitting}
              className={cn(
                "gap-4 py-4 px-4 self-stretch bg-[#07515f] border-gray-300",
                "hover:bg-[#064a56] transition-colors duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                isSubmitting && "animate-pulse"
              )}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="font-label-medium font-bold text-white text-sm tracking-wide leading-5 whitespace-nowrap">
                    Publishing...
                  </span>
                </div>
              ) : (
                <span className="font-label-medium font-bold text-white text-sm tracking-wide leading-5 whitespace-nowrap">
                  {t("productDetails.actions.next")}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </motion.main>
  );
};

export default ProductDetails;
