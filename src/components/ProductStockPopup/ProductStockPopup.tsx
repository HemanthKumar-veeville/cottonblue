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
      <DialogTitle className="text-2xl font-semibold font-['Montserrat'] text-[color:var(--1-tokens-color-modes-common-neutral-hightest)]">
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
      <h3 className="text-xl font-semibold font-['Montserrat'] text-[color:var(--1-tokens-color-modes-common-neutral-hightest)]">
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
            {t("productStock.popup.totalPacks")}
          </p>
          <p className="text-lg font-bold text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)]">
            {product?.total_packs}
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
}: {
  productId: number;
  loading: boolean;
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState("");
  const { selectedCompany } = useAppSelector((state) => state.client);

  const handleSubmit = async () => {
    if (quantity && selectedCompany?.dns) {
      await dispatch(
        addProductQuantity({
          dnsPrefix: selectedCompany.dns,
          productId: productId.toString(),
          quantity: parseInt(quantity),
        })
      );
      setQuantity("");
      await dispatch(fetchAllProducts(selectedCompany.dns));
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-semibold font-['Montserrat'] text-[color:var(--1-tokens-color-modes-common-neutral-hightest)]">
        {t("productStock.popup.addStock")}
      </h3>
      <div className="flex flex-col gap-2 max-w-sm">
        <Label
          htmlFor="quantity"
          className="text-sm font-medium text-[color:var(--1-tokens-color-modes-input-primary-focused-text)]"
        >
          {t("productStock.popup.quantity")}
        </Label>
        <div className="flex gap-3">
          <Input
            id="quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder={t("productStock.popup.enterQuantity")}
            className="w-32 text-base font-medium"
          />
          <Button
            onClick={handleSubmit}
            disabled={!quantity || loading}
            className="bg-[#07515f] hover:bg-[#063f4a] text-white font-['Montserrat'] font-semibold px-6"
          >
            {loading ? t("common.loading") : t("productStock.popup.add")}
          </Button>
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
    products?.products.find((product: any) => product.id === productId) || null;
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
        <AddStockSection productId={productId} loading={loading} />
      </DialogContent>
    </Dialog>
  );
};
