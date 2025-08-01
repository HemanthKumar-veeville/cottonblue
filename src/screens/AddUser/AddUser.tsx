import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { toast } from "sonner";
import { RootState, useAppSelector } from "../../store/store";
import { Phone, User, Mail, Building, Store } from "lucide-react";
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

interface FormData {
  firstname: string;
  lastname: string;
  email: string;
  store_ids: number[];
  phone: string;
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
  icon: Icon,
  placeholder,
}: {
  label: string;
  id: string;
  value: string;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  onChange?: (value: string) => void;
  icon?: React.ElementType;
  placeholder?: string;
}) => (
  <div className="relative w-full mt-[-10px]">
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 z-10" />
      )}
      <div className="relative">
        <Input
          id={id}
          type={type}
          className={cn(
            "w-full pt-4 pr-3 pb-2 pl-10 bg-white rounded-lg border border-gray-300 font-text-medium text-[16px] leading-[24px]",
            type === "number"
              ? "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              : ""
          )}
          value={value}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
        />
        <span className="absolute -top-2 left-4 px-1 text-xs font-label-small text-[#475569] bg-white">
          {label} {required && <span className="text-red-500">*</span>}
        </span>
      </div>
    </div>
  </div>
);

const LabeledSelect = ({
  label,
  id,
  values,
  options,
  onChange,
  t,
  icon: Icon,
}: {
  label: string;
  id: string;
  values: number[];
  options: Store[];
  onChange?: (values: number[]) => void;
  t: any;
  icon?: React.ElementType;
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
          className="flex w-full items-center justify-between gap-3 py-4 px-3 bg-white rounded-lg border border-gray-300 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex-1 font-medium text-gray-700 text-base leading-4 tracking-normal truncate">
            {selectedStores?.length > 0
              ? selectedStores.map((store) => store.name).join(", ")
              : t("addUser.fields.stores")}
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
          <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-[300px] overflow-y-auto">
            {options?.map((store) => (
              <div
                key={store.id}
                className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                onClick={() => toggleStore(store.id)}
              >
                <div className="flex items-center w-full">
                  <Checkbox
                    id={`store-${store.id}`}
                    checked={values?.includes(store.id)}
                    onCheckedChange={() => {}}
                    className="w-6 h-6 border-gray-300 data-[state=checked]:bg-[#07515f] data-[state=checked]:border-[#07515f] mr-3"
                  />
                  <div className="flex flex-col flex-1">
                    <span className="font-medium text-gray-800">
                      {store.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {store.address}, {store.city}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {!options?.length && (
              <div className="px-4 py-3 text-gray-500 text-center">
                {t("addUser.fields.noStoresAvailable")}
              </div>
            )}
          </div>
        )}
      </div>
      <span className="absolute -top-[10px] left-4 px-2 text-xs font-medium text-gray-600 bg-white">
        {label} <span className="text-red-500">*</span>
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

export default function AddUser() {
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

  // Check if we're in edit mode
  const isEditMode = location.pathname.includes("/edit");

  const initialFormData: FormData = {
    firstname: "",
    lastname: "",
    email: "",
    store_ids: [],
    phone: "",
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [initialData, setInitialData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);

  // Fetch user details in edit mode
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (isEditMode && id && selectedCompany?.dns) {
        try {
          setLoading(true);
          await dispatch(
            getUserDetails({
              dnsPrefix: selectedCompany.dns,
              userId: id,
            })
          ).unwrap();
        } catch (error: any) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    };
    const fetchStores = async () => {
      if (selectedCompany?.dns) {
        await dispatch(fetchAllStores(selectedCompany.dns)).unwrap();
      }
    };
    fetchStores();
    fetchUserDetails();
  }, [isEditMode, id, selectedCompany?.dns, dispatch, t]);

  // Update form data and initial data when selectedUser changes in edit mode
  useEffect(() => {
    if (isEditMode && user) {
      const userData = {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        store_ids: user?.store_ids || [],
        phone: user?.phone_number || "",
      };
      setFormData(userData);
      setInitialData(userData);
    }
  }, [isEditMode, user]);

  // Function to check if form data has changed
  const hasChanges = () => {
    if (!isEditMode) return true;

    return (
      formData.firstname !== initialData.firstname ||
      formData.lastname !== initialData.lastname ||
      formData.email !== initialData.email ||
      formData.phone !== initialData.phone ||
      JSON.stringify(formData.store_ids) !==
        JSON.stringify(initialData.store_ids)
    );
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.firstname || !formData.lastname || !formData.email) {
      toast.error(t("addUser.validation.requiredFields"));
      return;
    }

    try {
      setLoading(true);
      const dnsPrefix = selectedCompany?.dns;

      if (!dnsPrefix) {
        throw new Error("Company DNS prefix is required");
      }

      const userData = {
        firstname: formData.firstname.trim(),
        lastname: formData.lastname.trim(),
        email: formData.email.trim(),
        store_ids: formData.store_ids,
        phone: formData.phone,
      };

      if (isEditMode && id) {
        // For update, only send changed fields
        const changedFields: Record<string, any> = {};
        if (user) {
          if (userData.firstname !== user.firstname)
            changedFields.firstname = userData.firstname;
          if (userData.lastname !== user.lastname)
            changedFields.lastname = userData.lastname;
          if (userData.email !== user.email)
            changedFields.email = userData.email;
          if (userData.phone !== user.phone_number)
            changedFields.phone = userData.phone;
          if (
            JSON.stringify(userData.store_ids) !==
            JSON.stringify(user.store_ids)
          ) {
            changedFields.store_ids = userData.store_ids;
          }
        }

        // Only make the API call if there are changes
        if (Object.keys(changedFields).length > 0) {
          await dispatch(
            modifyUser({
              dnsPrefix,
              userId: id,
              data: changedFields,
            })
          ).unwrap();
          toast.success(t("addUser.success.update"));
          navigate("/users");
        }
      } else {
        await dispatch(
          registerUser({
            dnsPrefix,
            data: userData,
          })
        ).unwrap();
        toast.success(t("addUser.success.create"));
        navigate("/users");
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || t("addUser.error.generic"));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Skeleton variant="form" />;
  }

  return (
    <div className="flex flex-col h-full gap-8 p-6 bg-white rounded-lg overflow-hidden">
      <header className="inline-flex items-center gap-2">
        <h1 className="font-heading-h3 text-[20px] font-bold leading-[28px] text-[#475569]">
          {isEditMode ? t("addUser.title.edit") : t("addUser.title.add")}
        </h1>
      </header>

      <div className="flex flex-col justify-between flex-1 h-full">
        <div className="flex flex-col gap-6">
          <div className="flex gap-4">
            <LabeledInput
              label={t("addUser.fields.firstName")}
              id="firstname"
              value={formData.firstname}
              required
              icon={User}
              placeholder={t("addUser.fields.firstNamePlaceholder")}
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
              icon={User}
              placeholder={t("addUser.fields.lastNamePlaceholder")}
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
                icon={Mail}
                placeholder={t("addUser.fields.emailPlaceholder")}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    email: value,
                  }))
                }
              />
            </div>
            <div className="w-1/2">
              <div className="relative w-full mt-[-10px]">
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 z-10" />
                  <div className="relative">
                    <Input
                      type="tel"
                      className="pl-10 py-2 font-text-medium text-[16px] leading-[24px]"
                      value={formData.phone}
                      placeholder={t("addUser.fields.phonePlaceholder")}
                      onChange={(e) => {
                        // Only allow digits and limit to 10
                        const digitsOnly = e.target.value.replace(/\D/g, "");
                        if (digitsOnly.length <= 10) {
                          // Format with spaces: XX XX XX XX XX
                          const formatted = digitsOnly
                            .replace(/(\d{2})(?=\d)/g, "$1 ")
                            .trim();
                          setFormData((prev) => ({
                            ...prev,
                            phone: formatted,
                          }));
                        }
                      }}
                      maxLength={14} // 10 digits + 4 spaces
                      data-testid="input-phone"
                    />
                    <span className="absolute -top-2 left-4 px-1 text-xs font-label-small text-[#475569] bg-white">
                      {t("addUser.fields.phone")}
                    </span>
                  </div>
                </div>
              </div>
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
                  t={t}
                  icon={Store}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-auto pt-6 border-t border-gray-200">
          <Button
            className="bg-[#07515f] text-white h-12 px-6 font-medium text-base hover:bg-[#064147] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={loading || (isEditMode && !hasChanges())}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader size="sm" className="mr-2" />
                {t("common.loading")}
              </div>
            ) : isEditMode ? (
              t("common.save")
            ) : (
              t("common.next")
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
