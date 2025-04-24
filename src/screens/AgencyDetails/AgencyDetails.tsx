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
import { CheckCircle, Clock, FileText, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../store/store";
import { useAppDispatch } from "../../store/store";
import { getStoreDetails } from "../../store/features/agencySlice";
import { useTranslation } from "react-i18next";
import { Skeleton } from "../../components/Skeleton";
import Loader from "../../components/Loader";

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

interface OrderStatus {
  text: string;
  type: "success" | "warning" | "danger";
}

interface Order {
  id: string;
  date: string;
  price: string;
  status: OrderStatus;
  hasInvoice: boolean;
}

// Static data
const agencyDetails: AgencyDetails = {
  id: "1021",
  name: "Chronodrive",
  city: "Lyon",
  address: "123 Rue de la République",
  phone_number: "+33 4 78 34 56 78",
  longitude: "4.8357",
  latitude: "45.7640",
  created_at: "22/03/2025",
  updated_at: "22/03/2025",
  company_id: 1,
  postal_code: "69001",
  is_active: true,
  statistics: {
    totalOrders: "342",
    monthlyRevenue: "8 500 €",
    topProducts: "T-shirt blanc, Mug Chrono",
  },
};

const orders: Order[] = [
  {
    id: "KCJRTAEIJ",
    date: "15/02/2024",
    price: "499.90€",
    status: { text: "Livrée", type: "success" },
    hasInvoice: true,
  },
  {
    id: "KCJRTAEIJ",
    date: "22/03/2025",
    price: "149.90€",
    status: { text: "En cours", type: "warning" },
    hasInvoice: true,
  },
  {
    id: "KCJRTAEIJ",
    date: "30/04/2024",
    price: "499.90€",
    status: { text: "Annulée", type: "danger" },
    hasInvoice: false,
  },
];

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

const AgencyDetailsCard = ({ store }: { store: Agency }) => {
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
            <StatisticsBox />
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

const StatisticsBox = () => {
  const { t } = useTranslation();

  return (
    <Card className="w-full bg-[color:var(--1-tokens-color-modes-background-secondary)] border-[color:var(--1-tokens-color-modes-border-primary)]">
      <CardContent className="p-4 space-y-2">
        <h3 className="font-text-medium text-black">
          {t("agencyDetails.statistics.title")}
        </h3>
        <div className="font-text-medium text-black space-y-1">
          <p>
            {t("agencyDetails.statistics.totalOrders")}:{" "}
            {t("agencyDetails.fields.notAvailable")}
          </p>
          <p>
            {t("agencyDetails.statistics.monthlyRevenue")}:{" "}
            {t("agencyDetails.fields.notAvailable")}
          </p>
          <p>
            {t("agencyDetails.statistics.topProducts")}:{" "}
            {t("agencyDetails.fields.notAvailable")}
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

  const handleModify = () => {
    // Prepare the data to be passed to the AddClient component
    const prefillData = {
      name: storeDetails?.name || "",
      city: storeDetails?.city || "",
      address: storeDetails?.address || "",
      postal_code: storeDetails?.postal_code || "",
      company_id: storeDetails?.company_id || "",
      is_edit_mode: true,
    };

    navigate("/agencies/edit", { state: prefillData });
  };

  const handleToggleAgencyStatus = async () => {
    if (!storeDetails) return;

    setIsLoading(true);
    try {
      await dispatch(
        getStoreDetails({
          dnsPrefix: company_name!,
          storeId: storeDetails.id.toString(),
        })
      ).unwrap();

      // Refresh store details after status change
      dispatch(
        getStoreDetails({
          dnsPrefix: company_name!,
          storeId: storeDetails.id.toString(),
        })
      );
    } catch (error) {
      console.error("Failed to toggle store status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full bg-[color:var(--1-tokens-color-modes-background-secondary)] border-[color:var(--1-tokens-color-modes-border-primary)]">
      <CardContent className="p-4 space-y-4">
        <h3 className="font-text-medium text-black">
          {t("agencyDetails.actions.title")}
        </h3>
        <Button
          className="w-full bg-[#07515f] text-[color:var(--1-tokens-color-modes-button-primary-default-text)]"
          onClick={handleModify}
        >
          {t("agencyDetails.actions.modify")}
        </Button>
        <Button
          className="w-full bg-1-tokens-color-modes-common-danger-medium text-[color:var(--1-tokens-color-modes-button-primary-default-text)]"
          onClick={handleToggleAgencyStatus}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Loader size="sm" className="mr-2" />
              {t("common.loading")}
            </div>
          ) : storeDetails?.is_active ? (
            t("agencyDetails.actions.deactivate")
          ) : (
            t("agencyDetails.actions.activate")
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

const OrdersTableCard = () => {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(orders.map((order) => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders([...selectedOrders, orderId]);
    } else {
      setSelectedOrders(selectedOrders.filter((id) => id !== orderId));
    }
  };

  const handleViewDetails = (orderId: string) => {
    alert(`Voir les détails de la commande ${orderId}`);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-heading-h3 text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)]">
          Commande de l&apos;agence
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader className="bg-1-tokens-color-modes-common-primary-brand-lower rounded-md">
            <TableRow>
              <TableHead className="w-11">
                <Checkbox
                  checked={selectedOrders.length === orders.length}
                  onCheckedChange={(checked: boolean) =>
                    handleSelectAll(checked)
                  }
                />
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
                  className="w-[145px] font-text-small text-[#1e2324]"
                >
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order, index) => (
              <TableRow
                key={index}
                className="border-b border-primary-neutal-300"
              >
                <TableCell className="w-11">
                  <Checkbox
                    checked={selectedOrders.includes(order.id)}
                    onCheckedChange={(checked: boolean) =>
                      handleSelectOrder(order.id, checked)
                    }
                  />
                </TableCell>
                <TableCell className="w-[145px] font-normal text-black text-[15px]">
                  {order.id}
                </TableCell>
                <TableCell className="w-[145px] font-normal text-black text-[15px]">
                  {order.date}
                </TableCell>
                <TableCell className="w-[145px] font-normal text-black text-[15px]">
                  {order.price}
                </TableCell>
                <TableCell className="w-[145px]">
                  <div className="flex items-center gap-2">
                    {order.status.type === "success" && (
                      <CheckCircle className="w-6 h-6 text-1-tokens-color-modes-common-success-medium" />
                    )}
                    {order.status.type === "warning" && (
                      <Clock className="w-6 h-6 text-1-tokens-color-modes-common-warning-medium" />
                    )}
                    {order.status.type === "danger" && (
                      <XCircle className="w-6 h-6 text-1-tokens-color-modes-common-danger-medium" />
                    )}
                    <span
                      className={`text-1-tokens-color-modes-common-${order.status.type}-medium`}
                    >
                      {order.status.text}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="w-[69px] text-center">
                  {order.hasInvoice ? (
                    <FileText
                      className="w-4 h-4 mx-auto cursor-pointer"
                      onClick={() =>
                        alert(`Télécharger la facture pour ${order.id}`)
                      }
                    />
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell className="w-[145px] text-center">
                  <Button
                    variant="link"
                    className="font-label-medium text-[color:var(--1-tokens-color-modes-button-ghost-default-text)] underline"
                    onClick={() => handleViewDetails(order.id)}
                  >
                    Détails
                  </Button>
                </TableCell>
              </TableRow>
            ))}
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

  useEffect(() => {
    if (company_name && agency_id) {
      dispatch(
        getStoreDetails({ dnsPrefix: company_name, storeId: agency_id })
      );
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
      <AgencyDetailsCard store={store} />
      <OrdersTableCard />
    </div>
  );
};

export default AgencyDetails;
