import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import { ArrowLeft, Download } from "lucide-react";
import { useTranslation } from "react-i18next";

const orderDetails = {
  orderNumber: "KCJ7RLEU",
  date: "22/03/2025",
  totalPrice: "148,90€",
  status: "En livraison",
  customer: {
    name: "Marc Leblanc",
    email: "jean.morel@chronodrive.com",
    address: "45 Rue des Lilas, 59000 Lille",
  },
};

const orderedProducts = [
  {
    id: 1,
    name: "Magnet + pen",
    image: "",
    ref: "122043",
    unitPrice: "49.99€",
    quantity: 3,
    total: "149.97€",
  },
  {
    id: 2,
    name: "Men's polo - L",
    image: "",
    ref: "122043",
    unitPrice: "14.99€",
    quantity: 10,
    total: "149.99€",
  },
  {
    id: 3,
    name: "Women's polo - M",
    image: "",
    ref: "122043",
    unitPrice: "12.99€",
    quantity: 8,
    total: "103.92€",
  },
];

const OrderHeader = () => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-10 w-10">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-xl font-bold">{t("orderDetails.title")}</h2>
      </div>
      <Button className="bg-[#00b85b] hover:bg-[#00a050] border border-[#1a8563] text-white">
        <Download className="mr-2 h-4 w-4" />
        {t("orderDetails.downloadInvoice")}
      </Button>
    </div>
  );
};

const OrderInfo = ({
  label,
  value,
  isStatus,
}: {
  label: string;
  value: string;
  isStatus: boolean;
}) => (
  <p className="text-base">
    <span className="font-medium">{label}</span>
    <span> : </span>
    <span className={isStatus ? "text-orange-500" : ""}>{value}</span>
  </p>
);

const OrderDetailsCard = () => {
  const { t } = useTranslation();
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <OrderHeader />
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <OrderInfo
                label={t("orderDetails.fields.order")}
                value={orderDetails.orderNumber}
                isStatus={false}
              />
              <OrderInfo
                label={t("orderDetails.fields.date")}
                value={orderDetails.date}
                isStatus={false}
              />
              <OrderInfo
                label={t("orderDetails.fields.totalPrice")}
                value={orderDetails.totalPrice}
                isStatus={false}
              />
              <OrderInfo
                label={t("orderDetails.fields.status")}
                value={orderDetails.status}
                isStatus
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <OrderInfo
                label={t("orderDetails.fields.customer")}
                value={orderDetails.customer.name}
                isStatus={false}
              />
              <OrderInfo
                label={t("orderDetails.fields.managementEmail")}
                value={orderDetails.customer.email}
                isStatus={false}
              />
              <OrderInfo
                label={t("orderDetails.fields.shippingAddress")}
                value={orderDetails.customer.address}
                isStatus={false}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ProductTableHeader = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-[#eaf8e7] rounded-md mb-2">
      <div className="flex items-center justify-between p-2">
        <div className="w-11 flex items-center justify-center">
          <Checkbox className="h-5 w-5 rounded border-[1.5px]" />
        </div>
        <div className="w-[203px] flex items-center">
          <span className="text-sm text-[#1e2324]">
            {t("orderDetails.products.table.product")}
          </span>
        </div>
        <div className="w-[129px] flex items-center justify-center">
          <span className="text-sm text-[#1e2324]">
            {t("orderDetails.products.table.ref")}
          </span>
        </div>
        <div className="w-[145px] flex items-center justify-center">
          <span className="text-sm text-[#1e2324]">
            {t("orderDetails.products.table.unitPrice")}
          </span>
        </div>
        <div className="w-[145px] flex items-center justify-center">
          <span className="text-sm text-[#1e2324]">
            {t("orderDetails.products.table.quantity")}
          </span>
        </div>
        <div className="w-[145px] flex items-center justify-center">
          <span className="text-sm text-[#1e2324]">
            {t("orderDetails.products.table.total")}
          </span>
        </div>
      </div>
    </div>
  );
};

const ProductRow = ({ product }: { product: any }) => (
  <div className="flex items-center justify-between px-2 py-3 border-b border-primary-neutal-300">
    <div className="w-11 flex items-center justify-center">
      <Checkbox className="h-5 w-5 rounded border-[1.5px]" />
    </div>
    <div className="w-[203px] flex items-center gap-3 px-3">
      <div className="w-10 h-10 rounded overflow-hidden border border-primary-neutal-200 flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="w-[30px] h-[29px] object-cover"
        />
      </div>
      <span className="text-base text-coolgray-100">{product.name}</span>
    </div>
    <div className="w-[129px] flex items-center justify-center">
      <span className="text-sm text-coolgray-100">{product.ref}</span>
    </div>
    <div className="w-[145px] flex items-center justify-center">
      <span className="text-[15px] text-black">{product.unitPrice}</span>
    </div>
    <div className="w-[145px] flex items-center justify-center">
      <Badge variant="secondary" className="w-full flex justify-center">
        {product.quantity}
      </Badge>
    </div>
    <div className="w-[145px] flex items-center justify-center">
      <span className="text-[15px]">{product.total}</span>
    </div>
  </div>
);

const ProductTable = () => {
  const { t } = useTranslation();
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-6">
          {t("orderDetails.products.title")}
        </h2>
        <div className="w-full">
          <ProductTableHeader />
          <div className="overflow-y-auto">
            {orderedProducts.map((product) => (
              <ProductRow key={product.id} product={product} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function OrderDetails() {
  return (
    <div className="flex flex-col items-start gap-2.5 p-2.5">
      <OrderDetailsCard />
      <ProductTable />
    </div>
  );
}
