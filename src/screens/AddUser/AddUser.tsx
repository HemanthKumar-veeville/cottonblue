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
} from "../../store/features/agencySlice";
import { useAppDispatch } from "../../store/store";
import Loader from "../../components/Loader";
import { useTranslation } from "react-i18next";
import { Skeleton } from "../../components/Skeleton";
import { useSelector } from "react-redux";
import { registerUser } from "../../store/features/userSlice";
import { getHost } from "../../utils/hostUtils";

interface FormData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
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
  onChange,
}: {
  label: string;
  id: string;
  value: string;
  type?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
}) => (
  <div className="relative w-full pt-2">
    <Input
      id={id}
      type={type}
      className="w-full font-text-medium text-[16px] leading-[24px] bg-gray-100 rounded-lg border"
      value={value}
      disabled={disabled}
      onChange={(e) => onChange?.(e.target.value)}
    />
    <span className="absolute -top-2 left-4 px-1 text-xs font-label-small text-[#475569] bg-white">
      {label}
    </span>
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
  const selectedStores = options?.filter((store) => values.includes(store.id));

  const toggleStore = (storeId: number) => {
    const newValues = values.includes(storeId)
      ? values.filter((id) => id !== storeId)
      : [...values, storeId];
    onChange?.(newValues);
  };

  return (
    <div className="relative w-full pt-2">
      <div className="relative">
        <div
          className="flex w-full items-center justify-between gap-3 py-3 px-3 self-stretch bg-gray-100 rounded-lg border border-solid border-gray-300 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex-1 font-medium text-gray-700 text-base leading-4 tracking-normal truncate">
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
          <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-[300px] overflow-y-auto">
            {options?.map((store) => (
              <div
                key={store.id}
                className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                onClick={() => toggleStore(store.id)}
              >
                <div className="flex items-center w-full">
                  <Checkbox
                    id={`store-${store.id}`}
                    checked={values.includes(store.id)}
                    onCheckedChange={() => {}}
                    className="mr-3"
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
                No stores available
              </div>
            )}
          </div>
        )}
      </div>
      <span className="absolute -top-2 left-4 px-1 text-xs font-label-small text-[#475569] bg-white">
        {label}
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
  <div className="flex items-center gap-2 w-full">
    <Checkbox
      id={id}
      checked={checked}
      onCheckedChange={onChange}
      className="h-5 w-5"
    />
    <label htmlFor={id} className="text-gray-600 text-sm font-medium">
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
  const storeList = stores?.stores;
  console.log({ storeList });
  // Check if we're in edit mode
  const isEditMode = location.pathname.includes("/edit");

  const initialFormData: FormData = {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    store_ids: [],
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);

  // TODO: Add useEffect for fetching user details in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      // Fetch user details
    }
  }, [isEditMode, id]);

  const handleSubmit = async () => {
    // Validate required fields
    if (
      !formData.firstname ||
      !formData.lastname ||
      !formData.email ||
      !formData.password ||
      formData.store_ids.length === 0
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const dnsPrefix = selectedCompany?.dns;

      await dispatch(
        registerUser({
          dnsPrefix,
          data: {
            firstname: formData.firstname,
            lastname: formData.lastname,
            email: formData.email,
            password: formData.password,
            store_ids: formData.store_ids,
          },
        })
      ).unwrap();

      toast.success(
        isEditMode ? "User updated successfully!" : "User added successfully!"
      );
      navigate("/users");
    } catch (error: any) {
      toast.error(
        error?.message ||
          (isEditMode ? "Failed to update user" : "Failed to add user")
      );
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
          {isEditMode ? "Edit User" : "Add User"}
        </h1>
      </header>

      <div className="flex flex-col justify-between flex-1 h-full">
        <div className="flex flex-col gap-6">
          <div className="flex gap-4 mt-2">
            <LabeledInput
              label="First Name"
              id="firstname"
              value={formData.firstname}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  firstname: value,
                }))
              }
            />
            <LabeledInput
              label="Last Name"
              id="lastname"
              value={formData.lastname}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  lastname: value,
                }))
              }
            />
          </div>

          <div className="flex gap-4">
            <LabeledInput
              label="Email"
              id="email"
              type="email"
              value={formData.email}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  email: value,
                }))
              }
            />
            <LabeledInput
              label="Password"
              id="password"
              type="password"
              value={formData.password}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  password: value,
                }))
              }
            />
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <LabeledSelect
                label="Select Stores"
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
        </div>

        <div className="flex justify-end mt-auto pt-6">
          <Button
            className="bg-[#07515f] text-white h-12 font-text-medium text-[16px] leading-[24px]"
            onClick={handleSubmit}
            disabled={loading}
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
