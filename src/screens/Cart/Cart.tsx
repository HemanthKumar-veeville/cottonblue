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
import { Minus, Package2, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  updateQuantity,
  removeFromCart,
  fetchCart,
  addToCart,
  addToCartAsync,
  convertCartToOrder,
  CartItem,
} from "../../store/features/cartSlice";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import EmptyState from "../../components/EmptyState";
import { useNavigate } from "react-router-dom";
import { getHost } from "../../utils/hostUtils";
import {
  fetchAllProducts,
  getProductsByStoreId,
} from "../../store/features/productSlice";
import { useCompanyColors } from "../../hooks/useCompanyColors";

interface StoreDetails {
  store_id: number;
  store_name: string;
  store_address: string;
  store_city: string;
  store_postal_code: number;
  admin_name: string;
  admin_email: string;
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  zipCode: string;
}

interface BillingAddress {
  name: string;
  street: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  zipCode: string;
}

const ProductRow = ({ product }: { product: CartItem }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const dnsPrefix = getHost();
  const { selectedStore } = useAppSelector((state) => state.agency);
  const products = useAppSelector((state) => state.product.products.products);

  const productDetails =
    products?.find((p) => p.id === product.product_id) || null;

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (dnsPrefix && selectedStore) {
      try {
        // Optimistic update
        dispatch(removeFromCart(product.product_id));

        await dispatch(
          addToCartAsync({
            dns_prefix: dnsPrefix,
            store_id: selectedStore,
            product_id: product.product_id.toString(),
            quantity: -product.quantity,
          })
        ).unwrap();
      } catch (error) {
        // Revert optimistic update
        dispatch(
          addToCart({ product: productDetails!, quantity: product.quantity })
        );
      }
    }
  };

  const handleQuantityChange = async (amount: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newQuantity = product.quantity + amount;

    if (amount > 0 && newQuantity <= (productDetails?.available_packs ?? 0)) {
      if (dnsPrefix && selectedStore) {
        try {
          // Optimistic update
          dispatch(addToCart({ product: productDetails!, quantity: 1 }));

          await dispatch(
            addToCartAsync({
              dns_prefix: dnsPrefix,
              store_id: selectedStore,
              product_id: product.product_id.toString(),
              quantity: 1,
            })
          ).unwrap();
        } catch (error) {
          // Revert optimistic update
          dispatch(addToCart({ product: productDetails!, quantity: -1 }));
        }
      }
    } else if (amount < 0 && newQuantity >= 0) {
      if (dnsPrefix && selectedStore) {
        try {
          // Optimistic update
          dispatch(addToCart({ product: productDetails!, quantity: -1 }));

          await dispatch(
            addToCartAsync({
              dns_prefix: dnsPrefix,
              store_id: selectedStore,
              product_id: product.product_id.toString(),
              quantity: -1,
            })
          ).unwrap();
        } catch (error) {
          // Revert optimistic update
          dispatch(addToCart({ product: productDetails!, quantity: 1 }));
        }
      }
    } else if (newQuantity > (productDetails?.available_packs ?? 0)) {
      toast.error(t("cart.error.notEnoughStock"));
    }
  };

  return (
    <TableRow
      key={product.product_id}
      className="border-b border-primary-neutal-300 hover:bg-transparent"
    >
      <TableCell className="w-11 p-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
      <TableCell className="w-[203px] p-3">
        <div className="flex items-center gap-3">
          <div className="w-[150px] h-[150px] rounded overflow-hidden border border-primary-neutal-200 flex items-center justify-center">
            {product?.product_images &&
            product?.product_images?.length > 0 &&
            product?.product_images[0] ? (
              <img
                className="w-full h-auto min-h-[150px] max-h-[150px] object-contain"
                alt={product?.product_name}
                src={product?.product_images[0]}
              />
            ) : (
              <div className="w-[150px] h-[150px] rounded overflow-hidden border border-primary-neutal-200 flex items-center justify-center">
                <Package2 className="w-5 h-5 text-gray-400" />
              </div>
            )}
          </div>
          <span className="font-text-medium text-black">
            {`${product?.product_name} - ${product?.suitable_for} - ${product?.size}`}
          </span>
        </div>
      </TableCell>
      <TableCell className="w-[129px] text-center text-coolgray-100 text-sm">
        {product.product_id}
      </TableCell>
      <TableCell className="w-[145px] text-center text-black text-[15px]">
        {product.price_of_pack.toFixed(2)}€
      </TableCell>
      <TableCell className="w-[145px] p-2.5">
        <div className="flex items-center justify-center gap-2 bg-[color:var(--1-tokens-color-modes-button-secondary-default-background)] rounded-[var(--2-tokens-screen-modes-button-border-radius)] border border-solid border-[color:var(--1-tokens-color-modes-button-secondary-default-border)] p-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 p-0"
            onClick={(e) => handleQuantityChange(-1, e)}
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
            onClick={(e) => handleQuantityChange(1, e)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
      <TableCell className="w-[145px] text-center text-[color:var(--1-tokens-color-modes-input-primary-default-text)] text-[15px]">
        {(product.price_of_pack * product.quantity).toFixed(2)}€
      </TableCell>
    </TableRow>
  );
};

const AddressSection = ({
  title,
  address,
}: {
  title: string;
  address: ShippingAddress | BillingAddress;
}) => {
  const { t } = useTranslation();
  return (
    <section className="flex flex-col items-start gap-2 w-full">
      {title && (
        <h2 className="font-heading-h5 font-bold text-[#1e2324] text-lg tracking-wide leading-tight">
          {t(title)}
        </h2>
      )}
      <div className="flex flex-col items-start gap-2 w-full">
        <p className="font-text-small font-medium text-gray-700 text-sm tracking-wide leading-tight">
          {title && "name" in address && address.name && (
            <>
              {address.name}
              <br />
            </>
          )}
          {title &&
            "firstName" in address &&
            address.firstName &&
            address.lastName && (
              <>
                {`${address.firstName} ${address.lastName}`}
                <br />
              </>
            )}
          {address.street}
          <br />
          {address.city}
          <br />
          {address.country}
          <br />
          {address.phone}
        </p>
      </div>
    </section>
  );
};

const OrderSummary = () => {
  const { t } = useTranslation();
  const { items } = useAppSelector((state) => state.cart);

  const totalHT = items.reduce(
    (acc, item) => acc + item.price_of_pack * item.quantity,
    0
  );
  const shippingCost = 0;
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
  const { items, loading, cartId, store_details } = useAppSelector(
    (state) => state.cart
  ) as {
    items: CartItem[];
    loading: boolean;
    cartId: string | null;
    store_details: StoreDetails | null;
  };
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const userEmail = user?.user_email;
  const dnsPrefix = getHost();
  const { selectedStore } = useAppSelector((state) => state.agency);
  const { buttonStyles } = useCompanyColors();
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    country: "France",
    phone: "",
    email: "",
    zipCode: "",
  });

  const [billingAddress, setBillingAddress] = useState<BillingAddress>({
    name: "",
    street: "",
    city: "",
    country: "France",
    phone: "",
    email: "",
    zipCode: "",
  });

  const [comments, setComments] = useState("");

  useEffect(() => {
    if (store_details) {
      // Update shipping address
      setShippingAddress((prev) => ({
        ...prev,
        firstName: store_details.admin_name?.split(" ")[0] || "",
        lastName: store_details.admin_name?.split(" ")[1] || "",
        street: store_details.store_address || "",
        city: store_details.store_city || "",
        zipCode: store_details.store_postal_code.toString() || "",
        email: store_details.admin_email || "",
      }));

      // Update billing address
      setBillingAddress((prev) => ({
        ...prev,
        name: store_details.admin_name || "",
        street: store_details.store_address || "",
        city: store_details.store_city || "",
        zipCode: store_details.store_postal_code.toString() || "",
        email: store_details.admin_email || "",
      }));
    }
  }, [store_details]);

  const handleShippingUpdate = (field: string, value: string) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleBillingUpdate = (field: string, value: string) => {
    setBillingAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleValidateOrder = async () => {
    try {
      if (!dnsPrefix || !selectedStore) {
        toast.error(t("cart.error.missingStoreInfo"));
        return;
      }

      // Get the first cart item's cart_id - assuming all items are from same cart
      if (!cartId) {
        toast.error(t("cart.error.invalidCart"));
        return;
      }

      await dispatch(
        convertCartToOrder({
          dns_prefix: dnsPrefix,
          store_id: selectedStore,
          cart_id: cartId,
          comments: comments,
        })
      ).unwrap();

      navigate("/history");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (dnsPrefix && selectedStore && selectedStore !== "all") {
      // Fetch cart data when component mounts and when store changes
      dispatch(fetchCart({ dns_prefix: dnsPrefix, store_id: selectedStore }));
      dispatch(getProductsByStoreId({ dnsPrefix, storeId: selectedStore }));
    }
  }, [dispatch, dnsPrefix, selectedStore]);

  if (items.length === 0) {
    return (
      <div className="flex flex-col h-full p-6 gap-8">
        <div className="flex flex-col gap-2.5">
          <h1 className="text-[length:var(--heading-h3-font-size)] font-heading-h3 font-[number:var(--heading-h3-font-weight)] text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] tracking-[var(--heading-h3-letter-spacing)] leading-[var(--heading-h3-line-height)] [font-style:var(--heading-h3-font-style)]">
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
        <h1 className="text-[length:var(--heading-h3-font-size)] font-heading-h3 font-[number:var(--heading-h3-font-weight)] text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] tracking-[var(--heading-h3-letter-spacing)] leading-[var(--heading-h3-line-height)] [font-style:var(--heading-h3-font-style)]">
          {t("cart.title")}
        </h1>
      </div>

      <div className="flex gap-6 flex-1">
        <Card
          className="flex-[2] p-0 border-0 rounded-lg overflow-hidden"
          style={buttonStyles}
        >
          <CardContent className="p-0 h-full flex flex-col">
            <div className="h-full flex flex-col">
              <div className="bg-[var(--primary-light-color)] rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-11 h-10 p-2">
                        {/* Action column */}
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
                      <ProductRow key={product.product_id} product={product} />
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <OrderSummary />
          </CardContent>
        </Card>

        <Card
          className="w-[400px] bg-[color:var(--1-tokens-color-modes-background-primary)] rounded-lg"
          style={buttonStyles}
        >
          <CardContent className="flex flex-col gap-8 pt-6 h-full">
            <div className="flex flex-col items-start gap-4 w-full">
              <div className="flex flex-col items-start w-full gap-4">
                <section className="flex flex-col items-start gap-4 w-full">
                  <h2 className="font-heading-h5 font-bold text-[#1e2324] text-lg tracking-wide leading-tight">
                    {t("cart.shipping.title")}
                  </h2>
                  <div className="flex items-start gap-2 w-full">
                    <Input
                      className="flex-1 bg-gray-100 border-gray-300 text-gray-500"
                      placeholder={t("cart.shipping.firstName")}
                      value={shippingAddress.firstName}
                      onChange={(e) =>
                        handleShippingUpdate("firstName", e.target.value)
                      }
                    />
                    <Input
                      className="flex-1 bg-gray-100 border-gray-300 text-gray-500"
                      placeholder={t("cart.shipping.lastName")}
                      value={shippingAddress.lastName}
                      onChange={(e) =>
                        handleShippingUpdate("lastName", e.target.value)
                      }
                    />
                  </div>
                </section>
                <AddressSection
                  title="cart.shipping.title"
                  address={shippingAddress}
                />
                <AddressSection
                  title="cart.billing.title"
                  address={billingAddress}
                />
              </div>

              <section className="flex flex-col items-start gap-2 w-full">
                <h2 className="font-heading-h5 font-bold text-[#1e2324] text-lg tracking-wide leading-tight">
                  {t("cart.validation.title")}
                </h2>
                <div className="flex items-start gap-2 w-full">
                  <Input
                    className="flex-1 bg-gray-200 border-gray-300 text-gray-500"
                    value={billingAddress.email}
                    disabled
                  />
                </div>
              </section>

              <section className="flex flex-col items-start gap-4 w-full flex-1">
                <div className="flex flex-col items-start gap-1 w-full">
                  <h2 className="font-heading-h5 font-bold text-[#1e2324] text-lg tracking-wide leading-tight">
                    {t("cart.comments.title")}
                  </h2>
                </div>
                <Textarea
                  className="w-full bg-gray-100 border-gray-300 text-gray-600 text-xs"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                />
              </section>
            </div>

            <Button
              className="w-full py-2 px-4 bg-[#00b85b] text-white rounded-[var(--2-tokens-screen-modes-button-border-radius)] hover:bg-[#00b85b]/90 disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={items.length === 0 || loading}
              onClick={handleValidateOrder}
              style={{
                backgroundColor: "var(--primary-color)",
                color: "var(--primary-text-color)",
              }}
            >
              {loading
                ? t("cart.buttons.processing")
                : t("cart.buttons.validateOrder")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
