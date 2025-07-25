import { ImageOff, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useTranslation } from "react-i18next";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  addProductQuantity,
  fetchAllProducts,
} from "../../store/features/productSlice";
import { Label } from "../ui/label";
import { cn } from "../../lib/utils";

interface ProductStockPopupProps {
  productId: number;
  onClose: () => void;
  open: boolean;
  product: any;
  isLoading?: boolean;
}

const ProductStockPopupHeader = ({
  productId,
  onClose,
}: {
  productId: number;
  onClose: () => void;
}) => {
  const { t } = useTranslation();
  return (
    <DialogHeader className="flex flex-row items-center justify-between p-0 space-y-0">
      <DialogTitle className="text-2xl font-semibold text-[color:var(--1-tokens-color-modes-common-neutral-hightest)]">
        {t("productStock.popup.productDetails", { productId })}
      </DialogTitle>
    </DialogHeader>
  );
};

const ProductDetailsSection = ({ product }: { product: any }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="text-sm font-medium text-[color:var(--1-tokens-color-modes-input-primary-focused-text)] mb-1">
            {t("productStock.popup.name")}
          </p>
          <p className="text-base font-semibold text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)]">
            {product?.name}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-[color:var(--1-tokens-color-modes-input-primary-focused-text)] mb-1">
            {t("productStock.popup.suitableFor")}
          </p>
          <p className="text-base font-semibold text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)]">
            {product?.suitable_for}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-[color:var(--1-tokens-color-modes-input-primary-focused-text)] mb-1">
            {t("productStock.popup.size")}
          </p>
          <p className="text-base font-semibold text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)]">
            {product?.size}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-[color:var(--1-tokens-color-modes-input-primary-focused-text)] mb-1">
            {t("productStock.popup.packQuantity")}
          </p>
          <p className="text-base font-semibold text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)]">
            {product?.pack_quantity}
          </p>
        </div>
      </div>
    </div>
  );
};

const StockDetailsSection = ({ product }: { product: any }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-semibold text-[color:var(--1-tokens-color-modes-common-neutral-hightest)]">
        {t("productStock.popup.stockDetails")}
      </h3>
      <div className="flex flex-row gap-4 w-full">
        <div className="flex-1 p-4 rounded-lg border border-[color:var(--1-tokens-color-modes-common-neutral-lower)] bg-white hover:shadow-md transition-shadow">
          <p className="text-sm font-medium text-[color:var(--1-tokens-color-modes-input-primary-focused-text)] mb-1">
            {t("productStock.popup.availablePacks")}
          </p>
          <p className="text-lg font-bold text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)]">
            {product?.available_packs}
          </p>
        </div>

        <div className="flex-1 p-4 rounded-lg border border-[color:var(--1-tokens-color-modes-common-neutral-lower)] bg-white hover:shadow-md transition-shadow">
          <p className="text-sm font-medium text-[color:var(--1-tokens-color-modes-input-primary-focused-text)] mb-1">
            {t("productStock.popup.pricePerPack")}
          </p>
          <p className="text-lg font-bold text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)]">
            {product?.price_of_pack}€
          </p>
        </div>
      </div>
    </div>
  );
};

const AddStockSection = ({
  productId,
  loading,
  product,
}: {
  productId: number;
  loading: boolean;
  product: any;
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState("");
  const [operation, setOperation] = useState("add"); // "add" or "remove"
  const { selectedCompany } = useAppSelector((state) => state.client);

  const handleSubmit = async () => {
    if (quantity && selectedCompany?.dns) {
      const quantityValue =
        operation === "add" ? parseInt(quantity) : -parseInt(quantity);
      await dispatch(
        addProductQuantity({
          dnsPrefix: selectedCompany?.dns,
          productId: productId.toString(),
          quantity: quantityValue,
        })
      );
      setQuantity("");
      await dispatch(
        fetchAllProducts({
          dnsPrefix: selectedCompany?.dns,
          page: 1,
          limit: 10,
        })
      );
    }
  };

  const isQuantityValid = () => {
    if (!quantity) return false;
    const numQuantity = parseInt(quantity);
    if (operation === "remove") {
      return numQuantity > 0 && numQuantity <= (product?.available_packs || 0);
    }
    return numQuantity > 0;
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-semibold text-[color:var(--1-tokens-color-modes-common-neutral-hightest)]">
        {t("productStock.popup.addStock")}
      </h3>
      <div className="flex flex-col gap-4 max-w-sm">
        <div className="flex rounded-lg overflow-hidden border border-[color:var(--1-tokens-color-modes-common-neutral-lower)]">
          <button
            onClick={() => setOperation("add")}
            className={cn(
              "flex-1 px-4 py-2 text-sm font-semibold transition-colors",
              operation === "add"
                ? "bg-[#07515f] text-white"
                : "bg-white text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] hover:bg-gray-50"
            )}
          >
            {t("productStock.popup.add")}
          </button>
          <button
            onClick={() => setOperation("remove")}
            className={cn(
              "flex-1 px-4 py-2 text-sm font-semibold transition-colors",
              operation === "remove"
                ? "bg-red-600 text-white"
                : "bg-white text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] hover:bg-gray-50"
            )}
          >
            {t("productStock.popup.remove")}
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <Label
            htmlFor="quantity"
            className="text-sm font-medium text-[color:var(--1-tokens-color-modes-input-primary-focused-text)]"
          >
            {t("productStock.popup.quantity")}
            {operation === "remove" && product?.available_packs && (
              <span className="text-sm text-gray-500 ml-2">
                (Max: {product.available_packs})
              </span>
            )}
          </Label>
          <div className="flex gap-3">
            <Input
              id="quantity"
              type="number"
              min="1"
              max={
                operation === "remove" ? product?.available_packs : undefined
              }
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder={t("productStock.popup.enterQuantity")}
              className="w-32 text-base font-medium"
            />
            <Button
              onClick={handleSubmit}
              disabled={!isQuantityValid() || loading}
              className={cn(
                "font-semibold px-6",
                operation === "add"
                  ? "bg-[#07515f] hover:bg-[#063f4a] text-white"
                  : "bg-red-600 hover:bg-red-700 text-white"
              )}
            >
              {loading
                ? t("common.loading")
                : operation === "add"
                ? t("productStock.popup.add")
                : t("productStock.popup.remove")}
            </Button>
          </div>
          {operation === "remove" &&
            quantity &&
            parseInt(quantity) > (product?.available_packs || 0) && (
              <p className="text-sm text-red-500 mt-1">
                {t("productStock.popup.exceedsAvailable")}
              </p>
            )}
        </div>
      </div>
    </div>
  );
};

export const ProductStockPopup = ({
  productId,
  onClose,
  open,
}: ProductStockPopupProps): JSX.Element => {
  const { products, loading } = useAppSelector((state) => state.product);
  const product =
    products?.products?.product_list.find(
      (product: any) => product.id === productId
    ) || null;
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="flex flex-col gap-6 p-8 bg-white max-w-[800px] rounded-lg shadow-lg border border-[color:var(--1-tokens-color-modes-common-neutral-lower)]">
        <ProductStockPopupHeader productId={productId} onClose={onClose} />
        <div className="flex items-start gap-6">
          <div className="w-[120px] h-[120px] rounded-lg border border-[color:var(--1-tokens-color-modes-common-neutral-lower)] flex-shrink-0 flex items-center justify-center">
            {product?.product_images &&
            product?.product_images.length > 0 &&
            product?.product_images[0] ? (
              <img
                src={product?.product_images[0]}
                alt={product?.name}
                width={100}
                height={100}
              />
            ) : (
              <ImageOff className="w-10 h-10 text-gray-400" />
            )}
          </div>
          <ProductDetailsSection product={product} />
        </div>
        <div className="h-px bg-[color:var(--1-tokens-color-modes-common-neutral-lower)]" />
        <StockDetailsSection product={product} />
        <div className="h-px bg-[color:var(--1-tokens-color-modes-common-neutral-lower)]" />
        <AddStockSection
          productId={productId}
          loading={loading}
          product={product}
        />
      </DialogContent>
    </Dialog>
  );
};
