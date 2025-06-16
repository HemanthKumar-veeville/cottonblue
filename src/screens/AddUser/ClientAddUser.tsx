import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { toast } from "sonner";
import { RootState, useAppSelector } from "../../store/store";
import {
  registerStore,
  modifyStore,
  getStoreDetails,
  fetchAllStores,
} from "../../store/features/agencySlice";
import { useAppDispatch } from "../../store/store";
import Loader from "../../components/Loader";
import { useTranslation } from "react-i18next";
import { Skeleton } from "../../components/Skeleton";
import { useSelector } from "react-redux";
import {
  registerUser,
  getUserDetails,
  modifyUser,
} from "../../store/features/userSlice";
import { getHost } from "../../utils/hostUtils";
import { cn } from "../../lib/utils";
import { useCompanyColors } from "../../hooks/useCompanyColors";

interface FormData {
  firstname: string;
  lastname: string;
  email: string;
  store_ids: number[];
}

interface Store {
  id: number;
  name: string;
  address: string;
  city: string;
  company_id: number;
  created_at: string;
  is_active: boolean;
  latitude: number | null;
  longitude: number | null;
  phone_number: string;
  postal_code: number;
  region: string;
  updated_at: string;
}

const LabeledInput = ({
  label,
  id,
  value,
  type = "text",
  disabled = false,
  required = false,
  onChange,
}: {
  label: string;
  id: string;
  value: string;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  onChange?: (value: string) => void;
}) => (
  <div className="relative w-full">
    <div className="relative">
      <Input
        id={id}
        type={type}
        className={cn(
          "w-full pt-4 pr-3 pb-2 pl-3 bg-white rounded-lg border border-[#d1d5db] focus:border-[#00b85b] focus:ring-[#00b85b]",
          type === "number"
            ? "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            : ""
        )}
        value={value}
        disabled={disabled}
        required={required}
        onChange={(e) => onChange?.(e.target.value)}
      />
      <span className="absolute -top-[10px] left-4 px-2 text-xs font-medium text-[#475569] bg-white">
        {label} {required && <span className="text-[#ef4444]">*</span>}
      </span>
    </div>
  </div>
);

const LabeledSelect = ({
  label,
  id,
  values,
  options,
  onChange,
}: {
  label: string;
  id: string;
  values: number[];
  options: Store[];
  onChange?: (values: number[]) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedStores = options?.filter((store) => values?.includes(store.id));

  const toggleStore = (storeId: number) => {
    const newValues = values?.includes(storeId)
      ? values?.filter((id) => id !== storeId)
      : [...values, storeId];
    onChange?.(newValues);
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <div
          className="flex w-full items-center justify-between gap-3 py-4 px-3 bg-white rounded-lg border border-[#d1d5db] cursor-pointer hover:border-[#00b85b] transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex-1 font-medium text-[#1e2324] text-base leading-4 tracking-normal truncate">
            {selectedStores?.length > 0
              ? selectedStores.map((store) => store.name).join(", ")
              : "Select Stores"}
          </div>
          <div className="flex w-6 h-6 items-center justify-center shrink-0">
            <img
              className="w-4 h-4"
              alt="Chevron down"
              src="/img/icon-13.svg"
            />
          </div>
        </div>
        {isOpen && (
          <div className="absolute top-full left-0 w-full mt-1 bg-white border border-[#d1d5db] rounded-lg shadow-lg z-50 max-h-[250px] overflow-y-auto">
            {options?.map((store) => (
              <div
                key={store.id}
                className="flex items-center px-4 py-3 hover:bg-[#f9fafb] cursor-pointer border-b border-[#e5e7eb] last:border-b-0"
                onClick={() => toggleStore(store.id)}
              >
                <div className="flex items-center w-full">
                  <Checkbox
                    id={`store-${store.id}`}
                    checked={values?.includes(store.id)}
                    onCheckedChange={() => {}}
                    className="w-6 h-6 border-[#d1d5db] data-[state=checked]:bg-[#00b85b] data-[state=checked]:border-[#00b85b] mr-3"
                  />
                  <div className="flex flex-col flex-1">
                    <span className="font-medium text-[#1e2324]">
                      {store.name}
                    </span>
                    <span className="text-sm text-[#6b7280]">
                      {store.address}, {store.city}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {!options?.length && (
              <div className="px-4 py-3 text-[#6b7280] text-center">
                No stores available
              </div>
            )}
          </div>
        )}
      </div>
      <span className="absolute -top-[10px] left-4 px-2 text-xs font-medium text-[#475569] bg-white">
        {label} <span className="text-[#ef4444]">*</span>
      </span>
    </div>
  );
};

const CheckboxField = ({
  label,
  id,
  checked,
  onChange,
}: {
  label: string;
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) => (
  <div className="flex items-center gap-2 pt-2 pr-2 pb-2 pl-2 relative flex-1 grow bg-white rounded-lg border border-solid border-gray-300">
    <Checkbox
      id={id}
      checked={checked}
      onCheckedChange={onChange}
      className="w-6 h-6 border-gray-300 data-[state=checked]:bg-[#07515f] data-[state=checked]:border-[#07515f]"
    />
    <label
      htmlFor={id}
      className="flex-1 font-label-small font-bold text-gray-700 text-sm tracking-wide leading-5"
    >
      {label}
    </label>
  </div>
);

export default function ClientAddUser() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { selectedCompany } = useSelector((state: RootState) => state.client);
  const { stores } = useSelector((state: RootState) => state.agency);
  const { selectedUser } = useSelector((state: RootState) => state.user);
  const storeList = stores?.stores;
  const user = selectedUser?.user;
  const host = getHost();
  const dnsPrefix = host || selectedCompany?.dns;
  const { buttonStyles } = useCompanyColors();
  // Check if we're in edit mode
  const isEditMode = location.pathname.includes("/edit");

  const initialFormData: FormData = {
    firstname: "",
    lastname: "",
    email: "",
    store_ids: [],
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);

  // Fetch user details in edit mode
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (isEditMode && id && dnsPrefix) {
        try {
          setLoading(true);
          await dispatch(
            getUserDetails({
              dnsPrefix: dnsPrefix,
              userId: id,
            })
          ).unwrap();
        } catch (error: any) {
          toast.error(error?.message || "Failed to fetch user details");
        } finally {
          setLoading(false);
        }
      }
    };
    const fetchStores = async () => {
      if (dnsPrefix) {
        await dispatch(fetchAllStores(dnsPrefix)).unwrap();
      }
    };
    fetchStores();
    fetchUserDetails();
  }, [isEditMode, id, dnsPrefix, dispatch]);

  // Update form data when selectedUser changes in edit mode
  useEffect(() => {
    if (isEditMode && user) {
      setFormData({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        store_ids: user?.store_ids || [],
      });
    }
  }, [isEditMode, user]);

  const handleSubmit = async () => {
    // Validate required fields
    if (
      !formData.firstname ||
      !formData.lastname ||
      !formData.email ||
      formData.store_ids.length === 0
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);

      if (!dnsPrefix) {
        throw new Error("Company DNS prefix is required");
      }

      if (isEditMode && id) {
        await dispatch(
          modifyUser({
            dnsPrefix: dnsPrefix,
            userId: id,
            data: {
              firstname: formData.firstname,
              lastname: formData.lastname,
              email: formData.email,
              store_ids: formData.store_ids,
            },
          })
        ).unwrap();
      } else {
        await dispatch(
          registerUser({
            dnsPrefix: dnsPrefix,
            data: {
              firstname: formData.firstname,
              lastname: formData.lastname,
              email: formData.email,
              store_ids: formData.store_ids,
            },
          })
        ).unwrap();
      }

      toast.success(
        isEditMode
          ? t("addUser.messages.updateSuccess")
          : t("addUser.messages.addSuccess")
      );
      navigate("/users");
    } catch (error: any) {
      toast.error(
        error?.message ||
          (isEditMode
            ? t("addUser.messages.updateError")
            : t("addUser.messages.addError"))
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Skeleton variant="form" />;
  }

  return (
    <main className="flex flex-col w-full max-w-[1208px] mx-auto gap-8 px-4 py-6 md:px-6 lg:px-8 bg-[#f9fafb]">
      <div className="flex flex-col h-full gap-8 p-6 bg-white rounded-lg overflow-hidden">
        <header className="inline-flex items-center gap-2">
          <h1 className="text-[20px] font-heading-h3 font-bold leading-[28px] text-[#1e2324]">
            {isEditMode ? t("addUser.title.edit") : t("addUser.title.add")}
          </h1>
        </header>

        <div className="flex flex-col justify-between flex-1 h-full min-h-[400px]">
          <div className="flex flex-col gap-6">
            <div className="flex gap-4">
              <LabeledInput
                label={t("addUser.fields.firstName")}
                id="firstname"
                value={formData.firstname}
                required
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    firstname: value,
                  }))
                }
              />
              <LabeledInput
                label={t("addUser.fields.lastName")}
                id="lastname"
                value={formData.lastname}
                required
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    lastname: value,
                  }))
                }
              />
            </div>

            <div className="flex gap-4">
              <div className="w-1/2">
                <LabeledInput
                  label={t("addUser.fields.email")}
                  id="email"
                  type="email"
                  value={formData.email}
                  required
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      email: value,
                    }))
                  }
                />
              </div>
            </div>

            {!(user?.role === "admin") && (
              <div className="flex gap-4">
                <div className="w-1/2">
                  <LabeledSelect
                    label={t("addUser.fields.stores")}
                    id="store"
                    values={formData.store_ids}
                    options={storeList}
                    onChange={(values) =>
                      setFormData((prev) => ({
                        ...prev,
                        store_ids: values,
                      }))
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <div
        className="fixed bottom-0 left-64 right-0 bg-white border-t border-[#e5e7eb] py-4"
        style={buttonStyles}
      >
        <div className="px-6 max-w-[calc(100%-2rem)]">
          <div className="flex items-center justify-end w-full mx-auto gap-4">
            {isEditMode && (
              <Button
                type="button"
                onClick={() => navigate(-1)}
                className="gap-4 py-4 px-4 self-stretch bg-white border-[var(--primary-color)] border text-[var(--primary-color)] hover:bg-gray-50 transition-colors duration-200 font-medium"
              >
                <span className="font-label-medium text-sm tracking-wide leading-5 whitespace-nowrap">
                  {t("common.cancel")}
                </span>
              </Button>
            )}
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className={cn(
                "gap-4 py-4 px-4 self-stretch bg-[var(--primary-color)] text-white",
                "hover:bg-[var(--primary-hover-color)] transition-colors duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                loading && "animate-pulse"
              )}
              style={{
                backgroundColor: "var(--primary-color)",
                color: "var(--primary-text-color)",
              }}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader size="sm" className="mr-2" />
                  <span className="font-label-medium text-sm tracking-wide leading-5 whitespace-nowrap">
                    {t("common.loading")}
                  </span>
                </div>
              ) : (
                <span className="font-label-medium text-sm tracking-wide leading-5 whitespace-nowrap">
                  {isEditMode ? t("common.save") : t("common.next")}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
