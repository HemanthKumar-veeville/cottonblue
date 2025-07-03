import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  CheckCircle,
  Clock,
  FileText,
  XCircle,
  Trash2,
  Edit,
  Power,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../store/store";
import { useAppDispatch } from "../../store/store";
import {
  getStoreDetails,
  modifyStore,
  deleteStore,
} from "../../store/features/agencySlice";
import { useTranslation } from "react-i18next";
import { Skeleton } from "../../components/Skeleton";
import Loader from "../../components/Loader";
import { getAllOrders } from "../../store/features/cartSlice";
import { jsPDF } from "jspdf";
import { StatusIcon } from "../../components/ui/status-icon";
import { TFunction } from "i18next";
import { getOrderStatusText } from "../../utils/statusUtil";
import { StatusText } from "../../components/ui/status-text";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

// Define proper types for our data
interface Agency {
  id: number;
  name: string;
  city: string;
  address: string;
  phone_number: string;
  longitude: string;
  latitude: string;
  created_at: string;
  updated_at: string;
  company_id: number;
  postal_code: string;
  is_active: boolean;
}

interface AgencyStatistics {
  totalOrders: string;
  monthlyRevenue: string;
  topProducts: string;
}

interface AgencyDetails {
  id: string;
  name: string;
  city: string;
  address: string;
  phone_number: string;
  longitude: string;
  latitude: string;
  created_at: string;
  updated_at: string;
  company_id: number;
  postal_code: string;
  is_active: boolean;
  statistics: AgencyStatistics;
}

interface OrderItem {
  product_id: number;
  product_name: string;
  product_image: string;
  price_of_pack: number;
  quantity: number;
}

interface Order {
  created_at: string;
  order_id: number;
  order_items: OrderItem[];
  order_status: string;
  store_address: string;
  store_name: string;
  store_id?: number; // Optional since it's not in the store's interface
}

// Helper function to get store detail by key
const getStoreDetail = (store: Agency, key: keyof Agency): string => {
  if (!store) return "Not Available";
  if (key === "is_active") {
    return store.is_active ? "Active" : "Inactive";
  }
  const value = store[key];
  return value !== null && value !== undefined
    ? String(value)
    : "Not Available";
};

const AgencyDetailsCard = ({
  store,
  orders,
}: {
  store: Agency;
  orders: Order[];
}) => {
  const { t } = useTranslation();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-heading-h3 text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)]">
          {t("agencyDetails.title", {
            name: store?.name || t("agencyDetails.fields.notAvailable"),
            city: store?.city || "",
          })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-8">
          <div className="flex flex-col items-start gap-8 flex-1">
            <div className="flex flex-col gap-4">
              {["id", "name", "city", "address"].map((key) => (
                <div key={key} className="font-text-medium text-black">
                  <span className="font-[number:var(--text-medium-font-weight)]">
                    {t(`agencyDetails.fields.${key}`)} :{" "}
                  </span>
                  <span>{getStoreDetail(store, key as keyof Agency)}</span>
                </div>
              ))}
            </div>
            <StatisticsBox orders={orders} store={store} />
          </div>
          <div className="flex flex-col items-start gap-8 flex-1">
            <div className="flex flex-col gap-4 h-36">
              {[
                { key: "phone_number", label: "phone" },
                { key: "postal_code", label: "postalCode" },
                { key: "is_active", label: "status" },
              ].map(({ key, label }) => (
                <div key={key} className="font-text-medium text-black">
                  <span className="font-[number:var(--text-medium-font-weight)]">
                    {t(`agencyDetails.fields.${label}`)} :{" "}
                  </span>
                  <span
                    className={key === "is_active" ? "text-emerald-500" : ""}
                  >
                    {getStoreDetail(store, key as keyof Agency)}
                  </span>
                </div>
              ))}
            </div>
            <ActionsBox />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const StatisticsBox = ({
  orders,
  store,
}: {
  orders: Order[];
  store: Agency;
}) => {
  const { t } = useTranslation();

  return (
    <Card className="w-full h-full min-h-[14rem] bg-[color:var(--1-tokens-color-modes-background-secondary)] border-[color:var(--1-tokens-color-modes-border-primary)]">
      <CardContent className="p-4 space-y-2">
        <h3 className="font-text-medium text-black">
          {t("agencyDetails.statistics.title")}
        </h3>
        <div className="font-text-medium text-black space-y-1 h-24">
          <p>
            {t("agencyDetails.statistics.totalOrders")}: {orders.length}
          </p>
          <p>
            {t("agencyDetails.statistics.orderLimit")}:{" "}
            {store?.order_limit || t("agencyDetails.fields.notAvailable")}
          </p>
          <p>
            {t("agencyDetails.statistics.budgetLimit")}:{" "}
            {store?.budget_limit || t("agencyDetails.fields.notAvailable")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const ActionsBox = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { company_name } = useParams();
  const { storeDetails, loading } = useAppSelector((state) => state.agency);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isActive = storeDetails?.store?.is_active;

  const handleModify = () => {
    const prefillData = {
      name: storeDetails?.store?.name || "",
      city: storeDetails?.store?.city || "",
      address: storeDetails?.store?.address || "",
      postal_code: storeDetails?.store?.postal_code || "",
      company_id: storeDetails?.store?.company_id || "",
      is_edit_mode: true,
    };

    navigate(`/agencies/edit/${storeDetails?.store?.id}`, {
      state: prefillData,
    });
  };

  const handleDelete = async () => {
    if (!company_name || !storeDetails?.store?.id) return;

    setIsDeleting(true);
    try {
      await dispatch(
        deleteStore({
          dnsPrefix: company_name,
          storeId: storeDetails.store.id.toString(),
        })
      ).unwrap();
      // Navigate back to agencies list after successful deletion
      navigate("/agencies");
    } catch (error) {
      console.error("Failed to delete agency:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleToggleAgencyStatus = async () => {
    if (!storeDetails) return;

    setIsLoading(true);
    try {
      await dispatch(
        modifyStore({
          dnsPrefix: company_name!,
          storeId: storeDetails?.store?.id.toString(),
          data: {
            is_active: !storeDetails?.store?.is_active,
          },
        })
      ).unwrap();

      // Refresh store details after status change
      dispatch(
        getStoreDetails({
          dnsPrefix: company_name!,
          storeId: storeDetails?.store?.id.toString(),
        })
      );
      setShowDeactivateDialog(false);
    } catch (error) {
      console.error("Failed to toggle store status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full min-h-[14rem] h-full bg-[color:var(--1-tokens-color-modes-background-secondary)] border-[color:var(--1-tokens-color-modes-border-primary)]">
      <CardContent className="p-4 space-y-4">
        <h3 className="font-text-medium text-black">
          {t("agencyDetails.actions.title")}
        </h3>
        <Button
          className="w-full bg-[#07515f] text-white hover:bg-[#064a56] h-9 text-sm border-gray-300"
          onClick={handleModify}
        >
          <Edit className="w-4 h-4 mr-2" />
          <span className="font-label-medium font-bold text-white text-sm tracking-wide leading-5">
            {t("agencyDetails.actions.modify")}
          </span>
        </Button>
        <Button
          variant={isActive ? "destructive" : "default"}
          className={`w-full h-9 text-sm ${
            isActive
              ? "bg-orange-500 hover:bg-orange-600"
              : "bg-emerald-600 hover:bg-emerald-700 text-white"
          }`}
          onClick={() => setShowDeactivateDialog(true)}
          disabled={isLoading}
        >
          <Power className="w-4 h-4 mr-2" />
          <span className="font-label-medium font-bold text-white text-sm tracking-wide leading-5">
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader size="sm" className="mr-2" />
                {t("common.loading")}
              </div>
            ) : isActive ? (
              t("agencyDetails.actions.deactivate")
            ) : (
              t("agencyDetails.actions.activate")
            )}
          </span>
        </Button>
        <Button
          variant="destructive"
          className="w-full h-9 text-sm bg-red-600 hover:bg-red-700"
          onClick={() => setShowDeleteDialog(true)}
          disabled={isDeleting}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          <span className="font-label-medium font-bold text-white text-sm tracking-wide leading-5">
            {isDeleting
              ? t("common.deleting")
              : t("agencyDetails.actions.delete")}
          </span>
        </Button>
      </CardContent>

      {/* Deactivate Confirmation Dialog */}
      <Dialog
        open={showDeactivateDialog}
        onOpenChange={setShowDeactivateDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isActive
                ? t("agencyDetails.dialogs.deactivate.title")
                : t("agencyDetails.dialogs.activate.title")}
            </DialogTitle>
            <DialogDescription>
              {isActive
                ? t("agencyDetails.dialogs.deactivate.description")
                : t("agencyDetails.dialogs.activate.description")}
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
              onClick={handleToggleAgencyStatus}
            >
              {isActive
                ? t("agencyDetails.actions.deactivate")
                : t("agencyDetails.actions.activate")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("agencyDetails.dialogs.delete.title")}</DialogTitle>
            <DialogDescription>
              {t("agencyDetails.dialogs.delete.description")}
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
                : t("agencyDetails.actions.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

const OrdersTableCard = ({ orders }: { orders: Order[] }) => {
  const navigate = useNavigate();
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const { t } = useTranslation();
  const { company_name, agency_id } = useParams();

  // Get the 4 most recent orders
  const recentOrders = [...(orders ?? [])]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 4);

  const handleViewAll = () => {
    navigate(`/order-history`);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(recentOrders.map((order) => order.order_id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId: number, checked: boolean) => {
    if (checked) {
      setSelectedOrders([...selectedOrders, orderId]);
    } else {
      setSelectedOrders(selectedOrders.filter((id) => id !== orderId));
    }
  };

  const handleDownloadInvoice = (order: Order) => {
    if (!order?.order_items?.length) {
      console.warn("No order items found");
      return;
    }

    const doc = new jsPDF();

    // Helper function to draw borders
    const drawBorder = () => {
      doc.setDrawColor(7, 81, 95); // #07515f
      doc.setLineWidth(0.5);
      doc.rect(10, 10, 190, 277);
      doc.setLineWidth(0.2);
      doc.rect(15, 15, 180, 267);
    };

    // Helper function to draw horizontal line
    const drawHorizontalLine = (y: number) => {
      doc.setDrawColor(7, 81, 95);
      doc.setLineWidth(0.2);
      doc.line(15, y, 195, y);
    };

    // Helper function to safely convert text
    const safeText = (text: any): string => {
      if (text === null || text === undefined) return "";
      return String(text);
    };

    // Helper function to safely convert number
    const safeNumber = (num: any): number => {
      if (num === null || num === undefined || isNaN(Number(num))) return 0;
      return Number(num);
    };

    // Add borders
    drawBorder();

    // Add header bar
    doc.setFillColor(7, 81, 95);
    doc.rect(10, 10, 190, 25, "F");

    // Add company logo/header
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("Cotton Blue", 20, 27);

    // Add "INVOICE" text
    doc.setFontSize(16);
    doc.text("INVOICE", 160, 27);

    // Add invoice details section
    doc.setTextColor(7, 81, 95);
    doc.setFontSize(12);
    doc.text("BILL TO:", 20, 50);

    // Add subtle divider
    drawHorizontalLine(53);

    // Store information
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(safeText(order.store_name || ""), 20, 60);
    doc.text(safeText(order.store_address || ""), 20, 66);

    // Add invoice info box
    doc.setDrawColor(7, 81, 95);
    doc.setFillColor(247, 250, 252);
    doc.rect(120, 45, 70, 35, "FD");

    doc.setFont("helvetica", "bold");
    doc.text("Invoice Number:", 125, 53);
    doc.text("Date:", 125, 61);
    doc.text("Status:", 125, 69);

    doc.setFont("helvetica", "normal");
    doc.text(`#${safeText(order.order_id || "")}`, 165, 53);
    doc.text(new Date(order.created_at).toLocaleDateString(), 165, 61);

    // Status with color coding
    const statusColors = {
      approval_pending: [255, 170, 0],
      on_hold: [255, 170, 0],
      processing: [255, 170, 0],
      confirmed: [0, 150, 0],
      refused: [200, 0, 0],
      shipped: [0, 150, 0],
      in_transit: [0, 150, 0],
      delivered: [0, 150, 0],
    };
    const [r, g, b] = statusColors[
      order.order_status as keyof typeof statusColors
    ] || [0, 0, 0];
    doc.setTextColor(r, g, b);
    doc.text(
      safeText(order.order_status || "")
        .replace(/_/g, " ")
        .toUpperCase(),
      165,
      69
    );
    doc.setTextColor(0, 0, 0);

    // Add order items table
    drawHorizontalLine(85);

    // Table headers
    doc.setFillColor(247, 250, 252);
    doc.rect(15, 90, 180, 10, "F");
    doc.setFont("helvetica", "bold");
    doc.text("Item", 20, 97);
    doc.text("Quantity", 120, 97);
    doc.text("Price", 150, 97);
    doc.text("Total", 175, 97);

    // Table content
    let yPos = 107;
    doc.setFont("helvetica", "normal");

    order.order_items.forEach((item, index) => {
      if (!item) return; // Skip if item is undefined

      // Alternate row background
      if (index % 2 === 0) {
        doc.setFillColor(252, 252, 252);
        doc.rect(15, yPos - 5, 180, 8, "F");
      }

      const quantity = safeNumber(item.quantity);
      const price = safeNumber(item.price_of_pack);
      const itemTotal = quantity * price;

      // Truncate long product names
      const maxLength = 45;
      const displayName = safeText(item.product_name || "");
      const truncatedName =
        displayName.length > maxLength
          ? displayName.substring(0, maxLength) + "..."
          : displayName;

      doc.text(truncatedName, 20, yPos);
      doc.text(safeText(quantity), 120, yPos);
      doc.text(`€${price.toFixed(2)}`, 150, yPos);
      doc.text(`€${itemTotal.toFixed(2)}`, 175, yPos);
      yPos += 8;
    });

    // Calculate total
    const subtotal = order.order_items.reduce((sum, item) => {
      if (!item) return sum;
      const quantity = safeNumber(item.quantity);
      const price = safeNumber(item.price_of_pack);
      return sum + quantity * price;
    }, 0);

    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    // Add total section
    yPos += 5;
    doc.setFillColor(247, 250, 252);
    doc.rect(120, yPos - 5, 75, 35, "F");

    doc.setFont("helvetica", "normal");
    doc.text("Subtotal:", 125, yPos + 5);
    doc.text(`€${subtotal.toFixed(2)}`, 175, yPos + 5);

    doc.text("Tax (10%):", 125, yPos + 15);
    doc.text(`€${tax.toFixed(2)}`, 175, yPos + 15);

    doc.setFont("helvetica", "bold");
    doc.text("Total:", 125, yPos + 25);
    doc.text(`€${total.toFixed(2)}`, 175, yPos + 25);

    // Add payment terms
    yPos += 45;
    doc.setFont("helvetica", "bold");
    doc.text("Payment Terms", 20, yPos);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Payment is due within 30 days of invoice date.", 20, yPos + 7);
    doc.text("Please include invoice number with your payment.", 20, yPos + 14);

    // Add footer
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(128, 128, 128);

    // Add divider before footer
    drawHorizontalLine(260);

    // Footer text
    const footerText1 = "Thank you for your business with Cotton Blue!";
    const footerText2 =
      "For any questions about this invoice, please contact support@cottonblue.com";
    const footerText3 =
      "Cotton Blue Inc. | 123 Fashion Street, Style City, SC 12345 | +1 (555) 123-4567";

    doc.text(footerText1, doc.internal.pageSize.width / 2, 265, {
      align: "center",
    });
    doc.setFontSize(8);
    doc.text(footerText2, doc.internal.pageSize.width / 2, 270, {
      align: "center",
    });
    doc.text(footerText3, doc.internal.pageSize.width / 2, 275, {
      align: "center",
    });

    // Save the PDF with a clean name
    const timestamp = new Date().toISOString().split("T")[0];
    doc.save(`CottonBlue_Invoice_${order.order_id}_${timestamp}.pdf`);
  };

  const calculateTotalAmount = (items: OrderItem[]): number => {
    return items.reduce(
      (total, item) => total + item.price_of_pack * item.quantity,
      0
    );
  };

  const getOrderStatus = (
    status: string
  ): { text: string; type: "success" | "warning" | "danger" } => {
    switch (status) {
      case "completed":
        return { text: getOrderStatusText(status, t), type: "success" };
      case "approval_pending":
        return { text: getOrderStatusText(status, t), type: "warning" };
      case "cancelled":
        return { text: getOrderStatusText(status, t), type: "danger" };
      default:
        return { text: getOrderStatusText(status, t), type: "warning" };
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-heading-h3 text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)]">
          Commandes récentes
        </CardTitle>
        <Button
          variant="link"
          className="font-label-medium text-[color:var(--1-tokens-color-modes-button-ghost-default-text)] underline"
          onClick={handleViewAll}
        >
          Voir tout
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader className="bg-1-tokens-color-modes-common-primary-brand-lower rounded-md">
            <TableRow>
              <TableHead className="w-11">
                <div className="flex justify-center">
                  <Checkbox
                    className="w-5 h-5 rounded border-[1.5px] border-solid border-1-tokens-color-modes-common-neutral-medium data-[state=checked]:bg-[#07515f] data-[state=checked]:border-[#07515f]"
                    checked={selectedOrders.length === recentOrders?.length}
                    onCheckedChange={(checked: boolean) =>
                      handleSelectAll(checked)
                    }
                  />
                </div>
              </TableHead>
              {[
                "Commande",
                "Date",
                "Prix total",
                "Statut",
                "Facture",
                "Détails",
              ].map((header, index) => (
                <TableHead
                  key={index}
                  className={`${
                    index === 4 ? "w-[69px]" : "w-[145px]"
                  } text-left text-[#1e2324] font-text-small`}
                >
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentOrders?.map((order, index) => {
              const status = getOrderStatus(order?.order_status ?? "");
              const totalAmount = calculateTotalAmount(
                order?.order_items ?? []
              );
              return (
                <TableRow
                  key={index}
                  className="border-b border-primary-neutal-300 py-[var(--2-tokens-screen-modes-common-spacing-XS)]"
                >
                  <TableCell className="w-11">
                    <div className="flex justify-center">
                      <Checkbox
                        className="w-5 h-5 rounded border-[1.5px] border-solid border-1-tokens-color-modes-common-neutral-medium data-[state=checked]:bg-[#07515f] data-[state=checked]:border-[#07515f]"
                        checked={selectedOrders.includes(order?.order_id)}
                        onCheckedChange={(checked: boolean) =>
                          handleSelectOrder(order?.order_id, checked)
                        }
                      />
                    </div>
                  </TableCell>
                  <TableCell className="w-[129px] text-left">
                    <span className="font-text-smaller text-coolgray-100">
                      {order?.order_id ?? t("common.notAvailable")}
                    </span>
                  </TableCell>
                  <TableCell className="w-[145px] text-left">
                    <span className="font-text-smaller text-black">
                      {order?.created_at
                        ? new Date(order.created_at).toLocaleDateString()
                        : t("common.notAvailable")}
                    </span>
                  </TableCell>
                  <TableCell className="w-[145px] text-left">
                    <span className="font-text-smaller text-black">
                      {totalAmount
                        ? `${totalAmount} €`
                        : t("common.notAvailable")}
                    </span>
                  </TableCell>
                  <TableCell className="w-[145px] text-left">
                    <div className="flex items-center gap-2">
                      <StatusIcon status={order?.order_status ?? ""} />
                      <StatusText status={order?.order_status ?? ""} />
                    </div>
                  </TableCell>
                  <TableCell className="w-[69px] text-left">
                    <FileText
                      className="inline-block w-4 h-4 text-[#07515f] cursor-pointer hover:text-[#023337] transition-colors"
                      onClick={() => handleDownloadInvoice(order)}
                    />
                  </TableCell>
                  <TableCell className="w-[145px] text-left">
                    <Button
                      variant="link"
                      onClick={() =>
                        navigate(
                          `/order-details/${agency_id}/${order?.order_id}`
                        )
                      }
                      disabled={!order?.order_id}
                      className="text-[color:var(--1-tokens-color-modes-button-ghost-default-text)] font-text-small underline"
                    >
                      {t("history.superAdmin.orderHistory.table.details")}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

const AgencyDetails = (): JSX.Element => {
  const { company_name, agency_id } = useParams();
  const dispatch = useAppDispatch();
  const { storeDetails, loading, error } = useAppSelector(
    (state) => state.agency
  );
  const store = storeDetails?.store as Agency;
  const { orders } = useAppSelector((state) => state.cart);
  console.log({ orders });
  useEffect(() => {
    if (company_name && agency_id) {
      dispatch(
        getStoreDetails({ dnsPrefix: company_name, storeId: agency_id })
      );
      dispatch(getAllOrders({ dns_prefix: company_name, store_id: agency_id }));
    }
  }, [company_name, agency_id, dispatch]);

  if (loading) {
    return (
      <div className="flex flex-col items-start gap-8 p-6">
        <Skeleton variant="details" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col items-start gap-8 p-6">
      <AgencyDetailsCard store={store} orders={orders} />
      <OrdersTableCard orders={orders} />
    </div>
  );
};

export default AgencyDetails;
