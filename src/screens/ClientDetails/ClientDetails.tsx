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
  ArrowLeft,
  Building2,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Hash,
  Palette,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../store/store";
import {
  getCompanyByDnsPrefix,
  modifyCompany,
} from "../../store/features/clientSlice";
import { useTranslation } from "react-i18next";
import { Skeleton } from "../../components/Skeleton";
import Loader from "../../components/Loader";
import { format } from "date-fns";

// Define proper types for our data
interface Company {
  id: number;
  name: string;
  city: string;
  address: string;
  phone_number: string | null;
  created_at: string;
  updated_at: string;
  postal_code: string;
  is_active: boolean;
  dns_prefix: string;
  logo: string;
  color_code: string;
  bg_color_code: string;
  text_color_code: string;
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
  type: "success" | "warning" | "danger";
  text: string;
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

// Helper function to get company detail by key
const getCompanyDetail = (company: Company, key: keyof Company): string => {
  if (!company) return "Not Available";
  if (key === "is_active") {
    return company.is_active ? "Active" : "Inactive";
  }
  const value = company[key];
  return value !== null && value !== undefined
    ? String(value)
    : "Not Available";
};

const CompanyHeader = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between w-full">
      <div className="inline-flex items-center gap-2">
        <ArrowLeft
          onClick={() => navigate("/customers")}
          className="w-5 h-5 text-[#07515f] cursor-pointer hover:text-[#064a56] transition-colors duration-200"
        />
        <h1 className="font-heading-h3 font-bold text-gray-700 text-lg tracking-wide leading-6">
          {t("companyDetails.header")}
        </h1>
      </div>
    </div>
  );
};

const CompanyLogo = ({ logoUrl }: { logoUrl: string | null }) => {
  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border border-solid border-gray-300 bg-white flex items-center justify-center">
      {logoUrl ? (
        <div className="w-full h-full flex items-center justify-center p-4">
          <img
            src={logoUrl}
            alt="Company Logo"
            className="max-w-full max-h-full w-auto h-auto object-contain"
          />
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Building2 className="w-12 h-12 text-gray-400" />
        </div>
      )}
    </div>
  );
};

const CompanyInfo = ({ company }: { company: Company }) => {
  const { t } = useTranslation();

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm");
    } catch {
      return "Not Available";
    }
  };

  const companyDetails = [
    {
      icon: <Hash className="w-4 h-4" />,
      label: t("companyDetails.info.id"),
      value: company?.id?.toString() ?? "Not Available",
    },
    {
      icon: <Building2 className="w-4 h-4" />,
      label: t("companyDetails.info.name"),
      value: company?.name ?? "Not Available",
    },
    {
      icon: <MapPin className="w-4 h-4" />,
      label: t("companyDetails.info.city"),
      value: company?.city ?? "Not Available",
    },
    {
      icon: <MapPin className="w-4 h-4" />,
      label: t("companyDetails.info.address"),
      value: company?.address ?? "Not Available",
    },
    {
      icon: <Phone className="w-4 h-4" />,
      label: t("companyDetails.info.phoneNumber"),
      value: company?.phone_number ?? "Not Available",
    },
    {
      icon: <Mail className="w-4 h-4" />,
      label: t("companyDetails.info.dnsPrefix"),
      value: company?.dns_prefix ?? "Not Available",
    },
    {
      icon: <MapPin className="w-4 h-4" />,
      label: t("companyDetails.info.postalCode"),
      value: company?.postal_code?.toString() ?? "Not Available",
    },
    {
      icon: <Calendar className="w-4 h-4" />,
      label: t("companyDetails.info.createdAt"),
      value: formatDate(company?.created_at),
    },
    {
      icon: <Calendar className="w-4 h-4" />,
      label: t("companyDetails.info.updatedAt"),
      value: formatDate(company?.updated_at),
    },
  ];

  return (
    <div className="flex flex-col w-full h-full">
      <div className="mb-4">
        <h2 className="font-heading-h3 font-bold text-gray-700 text-xl tracking-wide leading-6 mb-1">
          {company?.name ?? "Not Available"}
        </h2>
        <p className="font-label-small text-gray-500 text-xs tracking-wide leading-4">
          ID: {company?.id ?? "Not Available"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-2 flex-1">
        {companyDetails.map((detail, index) => (
          <div key={index} className="flex items-center py-2">
            <div className="flex items-center min-w-[200px]">
              <div className="flex items-center gap-2 w-[24px]">
                {detail.icon}
              </div>
              <div className="flex items-center justify-between w-[176px]">
                <span className="font-label-small font-bold text-gray-700 text-sm tracking-wide leading-5">
                  {detail.label}
                </span>
                <span className="font-label-small font-bold text-gray-700 text-sm tracking-wide leading-5">
                  :
                </span>
              </div>
            </div>
            <div className="flex-1 pl-4">
              <span className="font-label-small text-gray-700 text-sm tracking-wide leading-5">
                {detail.value}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t pt-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center min-w-[200px]">
            <div className="flex items-center gap-2 w-[24px]">
              <Palette className="w-4 h-4" />
            </div>
            <div className="flex items-center justify-between w-[176px]">
              <span className="font-label-small font-bold text-gray-700 text-sm">
                {t("companyDetails.info.colors")}
              </span>
              <span className="font-label-small font-bold text-gray-700 text-sm">
                :
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded border"
                style={{ backgroundColor: company?.bg_color_code }}
                title={t("companyDetails.info.background")}
              />
              <span className="text-sm text-gray-500">
                {company?.bg_color_code?.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded border"
                style={{ backgroundColor: company?.text_color_code }}
                title={t("companyDetails.info.text")}
              />
              <span className="text-sm text-gray-500">
                {company?.text_color_code?.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CompanyActions = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { companyDetails, loading } = useAppSelector((state) => state.client);
  const company = companyDetails?.company;

  const handleEdit = () => {
    const prefillData = {
      name: company?.name || "",
      city: company?.city || "",
      address: company?.address || "",
      postal_code: company?.postal_code || "",
      bg_color_code: company?.bg_color_code || "",
      text_color_code: company?.text_color_code || "",
      dns_prefix: company?.dns_prefix || "",
      company_id: company?.id || "",
      is_edit_mode: true,
      is_active: company?.is_active || false,
      logo: company?.logo || "",
      phone_number: company?.phone_number || "",
    };

    navigate("/customers/edit", { state: prefillData });
  };

  const handleToggleStatus = async () => {
    if (!company) return;

    try {
      await dispatch(
        modifyCompany({
          dns_prefix: company.dns_prefix,
          company_id: company.id,
          data: {
            is_active: !company.is_active,
          },
        })
      ).unwrap();

      dispatch(getCompanyByDnsPrefix(company.dns_prefix));
    } catch (error) {
      console.error("Failed to toggle company status:", error);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Button
        className="flex-1 bg-[#07515f] text-white hover:bg-[#064a56] h-9 text-sm border-gray-300"
        onClick={handleEdit}
      >
        <span className="font-label-medium font-bold text-white text-sm tracking-wide leading-5">
          {t("companyDetails.actions.modify")}
        </span>
      </Button>
      <Button
        variant={company?.is_active ? "destructive" : "default"}
        className={`flex-1 h-9 text-sm ${
          company?.is_active
            ? "bg-red-600 hover:bg-red-700"
            : "bg-emerald-600 hover:bg-emerald-700 text-white"
        }`}
        onClick={handleToggleStatus}
        disabled={loading}
      >
        <span className="font-label-medium font-bold text-white text-sm tracking-wide leading-5">
          {loading ? (
            <div className="flex items-center justify-center">
              <Loader size="sm" className="mr-2" />
              {t("common.loading")}
            </div>
          ) : (
            t(
              company?.is_active
                ? "companyDetails.actions.deactivate"
                : "companyDetails.actions.activate"
            )
          )}
        </span>
      </Button>
    </div>
  );
};

const ClientDetails = (): JSX.Element => {
  const { company_name } = useParams();
  const dispatch = useAppDispatch();
  const { companyDetails, loading, error } = useAppSelector(
    (state) => state.client
  );
  const company = companyDetails?.company;

  useEffect(() => {
    if (company_name) {
      dispatch(getCompanyByDnsPrefix(company_name));
    }
  }, [company_name, dispatch]);

  if (loading) {
    return <Skeleton variant="details" />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-8 p-6">
        <div className="text-center py-4 text-red-600 font-label-small text-sm tracking-wide leading-5">
          {error}
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex flex-col items-center gap-8 p-6">
        <div className="text-center py-4 font-label-small text-sm tracking-wide leading-5">
          Company not found
        </div>
      </div>
    );
  }

  return (
    <main className="flex flex-col w-full gap-8 p-6 bg-white rounded-lg">
      <CompanyHeader />
      <div className="mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <CompanyLogo logoUrl={company.logo} />
          </div>
          <div className="lg:col-span-2">
            <div className="flex flex-col h-[400px]">
              <div className="flex-none">
                <CompanyInfo company={company} />
              </div>
              <div className="flex-none mt-6">
                <CompanyActions />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ClientDetails;
