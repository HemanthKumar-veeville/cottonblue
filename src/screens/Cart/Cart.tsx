import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Textarea } from "../../components/ui/textarea";
import { Minus, Package2, Plus, ShoppingCart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { updateQuantity, removeFromCart } from "../../store/features/cartSlice";
import { useState } from "react";
import { toast } from "sonner";
import EmptyState from "../../components/EmptyState";
import { useNavigate } from "react-router-dom";

interface ShippingAddress {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  country: string;
  phone: string;
}

interface BillingAddress {
  name: string;
  street: string;
  city: string;
  country: string;
  phone: string;
}

const ProductRow = ({ product }: { product: any }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const handleQuantityChange = (amount: number) => {
    const newQuantity = product.quantity + amount;
    if (newQuantity === 0) {
      dispatch(removeFromCart(product.id));
    } else if (newQuantity > 0 && newQuantity <= product.stock) {
      dispatch(
        updateQuantity({ productId: product.id, quantity: newQuantity })
      );
    } else if (newQuantity > product.stock) {
      toast.error(t("cart.error.notEnoughStock"));
    }
  };

  return (
    <TableRow
      key={product.id}
      className="border-b border-primary-neutal-300 hover:bg-transparent"
    >
      <TableCell className="w-11 p-2">
        <Checkbox onChange={() => dispatch(removeFromCart(product.id))} />
      </TableCell>
      <TableCell className="w-[203px] p-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded overflow-hidden border border-primary-neutal-200 flex items-center justify-center">
            {product.product_image ? (
              <img
                className="w-[30px] h-[29px] object-cover"
                alt={product.name}
                src={product.product_image}
              />
            ) : (
              <Package2 className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <span className="font-text-medium text-black">{product.name}</span>
        </div>
      </TableCell>
      <TableCell className="w-[129px] text-center text-coolgray-100 text-sm">
        {product.ref}
      </TableCell>
      <TableCell className="w-[145px] text-center text-black text-[15px]">
        {product.price.toFixed(2)}€
      </TableCell>
      <TableCell className="w-[145px] p-2.5">
        <div className="flex items-center justify-center gap-2 bg-[color:var(--1-tokens-color-modes-button-secondary-default-background)] rounded-[var(--2-tokens-screen-modes-button-border-radius)] border border-solid border-[color:var(--1-tokens-color-modes-button-secondary-default-border)] p-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 p-0"
            onClick={() => handleQuantityChange(-1)}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="font-label-small text-[color:var(--1-tokens-color-modes-button-secondary-default-text)]">
            {product.quantity}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 p-0"
            onClick={() => handleQuantityChange(1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
      <TableCell className="w-[145px] text-center text-[color:var(--1-tokens-color-modes-input-primary-default-text)] text-[15px]">
        {(product.price * product.quantity).toFixed(2)}€
      </TableCell>
    </TableRow>
  );
};

const AddressSection = ({
  title,
  address,
  onUpdate,
}: {
  title: string;
  address: ShippingAddress | BillingAddress;
  onUpdate: (field: string, value: string) => void;
}) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-heading-h5 text-[#1e2324] text-[length:var(--heading-h5-font-size)] tracking-[var(--heading-h5-letter-spacing)] leading-[var(--heading-h5-line-height)]">
        {t(title)}
      </h2>
      <div className="flex flex-col gap-4">
        {"firstName" in address && (
          <div className="flex gap-2">
            <Input
              className="flex-1"
              placeholder={t("cart.shipping.firstName")}
              value={address.firstName}
              onChange={(e) => onUpdate("firstName", e.target.value)}
            />
            <Input
              className="flex-1"
              placeholder={t("cart.shipping.lastName")}
              value={address.lastName}
              onChange={(e) => onUpdate("lastName", e.target.value)}
            />
          </div>
        )}
        <Input
          placeholder={t("cart.address.street")}
          value={address.street}
          onChange={(e) => onUpdate("street", e.target.value)}
        />
        <Input
          placeholder={t("cart.address.city")}
          value={address.city}
          onChange={(e) => onUpdate("city", e.target.value)}
        />
        <Input
          placeholder={t("cart.address.country")}
          value={address.country}
          onChange={(e) => onUpdate("country", e.target.value)}
        />
        <Input
          placeholder={t("cart.address.phone")}
          value={address.phone}
          onChange={(e) => onUpdate("phone", e.target.value)}
        />
      </div>
    </div>
  );
};

const OrderSummary = () => {
  const { t } = useTranslation();
  const { items, total } = useAppSelector((state) => state.cart);

  const shippingCost = items.length > 0 ? 38.94 : 0;
  const totalHT = total;
  const totalTTC = totalHT + shippingCost;

  return (
    <div className="mt-auto">
      <div className="flex justify-end items-center gap-4 px-2 py-3">
        <div className="flex w-[200px] items-center justify-between">
          <span className="text-black text-base font-normal">
            {t("cart.summary.totalHT")}
          </span>
          <span className="font-bold text-[color:var(--1-tokens-color-modes-button-secondary-default-text)] text-base p-2.5">
            {totalHT.toFixed(2)}€
          </span>
        </div>
      </div>
      <div className="flex justify-end items-center gap-4 px-2 py-3">
        <div className="flex w-[200px] items-center justify-between">
          <span className="text-black text-base font-normal">
            {t("cart.summary.shippingCost")}
          </span>
          <span className="font-bold text-[color:var(--1-tokens-color-modes-button-secondary-default-text)] text-base p-2.5">
            {shippingCost.toFixed(2)}€
          </span>
        </div>
      </div>
      <div className="flex justify-end items-center gap-4 px-2 py-3">
        <div className="flex w-[200px] items-center justify-between">
          <span className="text-black text-base font-normal">
            {t("cart.summary.totalTTC")}
          </span>
          <span className="font-bold text-[color:var(--1-tokens-color-modes-button-secondary-default-text)] text-base p-2.5">
            {totalTTC.toFixed(2)}€
          </span>
        </div>
      </div>
    </div>
  );
};

export default function CartContainer(): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    country: "",
    phone: "",
  });

  const [billingAddress, setBillingAddress] = useState<BillingAddress>({
    name: "",
    street: "",
    city: "",
    country: "",
    phone: "",
  });

  const [comments, setComments] = useState("");

  const handleShippingUpdate = (field: string, value: string) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleBillingUpdate = (field: string, value: string) => {
    setBillingAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleValidateOrder = () => {
    // TODO: Implement order validation
    toast.success(t("cart.success.orderValidated"));
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col h-full p-6 gap-8">
        <div className="flex flex-col gap-2.5">
          <h1 className="font-heading-h3 text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] text-[length:var(--heading-h3-font-size)] tracking-[var(--heading-h3-letter-spacing)] leading-[var(--heading-h3-line-height)]">
            {t("cart.title")}
          </h1>
        </div>
        <Card className="flex-1">
          <CardContent className="flex flex-col items-center justify-center h-full gap-6">
            <EmptyState
              icon={ShoppingCart}
              title={t("cart.empty.title")}
              description={t("cart.empty.description")}
            />
            <Button
              onClick={() => navigate("/")}
              className="bg-[#00b85b] border-[#1a8563] text-[color:var(--1-tokens-color-modes-button-primary-default-text)] font-label-medium"
            >
              {t("cart.empty.browseProducts")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-6 gap-8">
      <div className="flex flex-col gap-2.5">
        <h1 className="font-heading-h3 text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] text-[length:var(--heading-h3-font-size)] tracking-[var(--heading-h3-letter-spacing)] leading-[var(--heading-h3-line-height)]">
          {t("cart.title")}
        </h1>
      </div>

      <div className="flex gap-6 flex-1">
        <Card className="flex-1 p-0 border-0 rounded-lg overflow-hidden">
          <CardContent className="p-0 h-full flex flex-col">
            <div className="h-full flex flex-col">
              <div className="bg-[#eaf8e7] rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-11 h-10 p-2">
                        <Checkbox />
                      </TableHead>
                      <TableHead className="w-[203px] h-10 p-2.5 text-[#1e2324] font-text-small">
                        {t("cart.table.product")}
                      </TableHead>
                      <TableHead className="w-[129px] h-10 p-2.5 text-[#1e2324] font-text-small text-center">
                        {t("cart.table.ref")}
                      </TableHead>
                      <TableHead className="w-[145px] h-10 p-2.5 text-[#1e2324] font-text-small text-center">
                        {t("cart.table.unitPrice")}
                      </TableHead>
                      <TableHead className="w-[145px] h-10 p-2.5 text-[#1e2324] font-text-small text-center">
                        {t("cart.table.quantity")}
                      </TableHead>
                      <TableHead className="w-[145px] h-10 p-2.5 text-[#1e2324] font-text-small text-center">
                        {t("cart.table.total")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                </Table>
              </div>

              <div className="flex-1 overflow-y-auto">
                <Table>
                  <TableBody>
                    {items.map((product) => (
                      <ProductRow key={product.id} product={product} />
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <OrderSummary />
          </CardContent>
        </Card>

        <Card className="flex-1 bg-[color:var(--1-tokens-color-modes-background-primary)] rounded-lg">
          <CardContent className="flex flex-col gap-8 p-6 h-full">
            <div className="flex flex-col gap-4 flex-1">
              <div className="flex flex-col gap-8">
                <AddressSection
                  title="cart.shipping.title"
                  address={shippingAddress}
                  onUpdate={handleShippingUpdate}
                />
                <AddressSection
                  title="cart.billing.title"
                  address={billingAddress}
                  onUpdate={handleBillingUpdate}
                />
              </div>

              <div className="flex flex-col gap-2">
                <h2 className="font-heading-h5 text-[#1e2324] text-[length:var(--heading-h5-font-size)] tracking-[var(--heading-h5-letter-spacing)] leading-[var(--heading-h5-line-height)]">
                  {t("cart.validation.title")}
                </h2>
                <Input
                  className="bg-[color:var(--1-tokens-color-modes-input-primary-disable-background)] border-[color:var(--1-tokens-color-modes-input-primary-disable-border)] text-[color:var(--1-tokens-color-modes-input-primary-disable-placeholder-label)]"
                  value={user?.email}
                  disabled
                />
              </div>

              <div className="flex flex-col gap-4 flex-1">
                <h2 className="font-heading-h5 text-[#1e2324] text-[length:var(--heading-h5-font-size)] tracking-[var(--heading-h5-letter-spacing)] leading-[var(--heading-h5-line-height)]">
                  {t("cart.comments.title")}
                </h2>
                <Textarea
                  className="flex-1 bg-[color:var(--1-tokens-color-modes-input-primary-default-background)] border-[color:var(--1-tokens-color-modes-input-primary-default-border)]"
                  placeholder={t("cart.comments.placeholder")}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                />
              </div>
            </div>

            <Button
              className="w-full bg-[#00b85b] border-[#1a8563] text-[color:var(--1-tokens-color-modes-button-primary-default-text)] font-label-medium"
              onClick={handleValidateOrder}
              disabled={items.length === 0}
            >
              {t("cart.buttons.validateOrder")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
