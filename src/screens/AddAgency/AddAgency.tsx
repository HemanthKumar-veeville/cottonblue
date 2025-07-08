import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { cn } from "../../lib/utils";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Phone } from "lucide-react";

import { store, useAppSelector } from "../../store/store";
import {
  registerStore,
  modifyStore,
  getStoreDetails,
  setPreviousPath,
} from "../../store/features/agencySlice";
import type { Agency } from "../../store/features/agencySlice";
import { useAppDispatch } from "../../store/store";
import Loader from "../../components/Loader";
import { useTranslation } from "react-i18next";
import { Skeleton } from "../../components/Skeleton";

interface FormData {
  company_id: string;
  store_name: string;
  store_address: string;
  city: string;
  postal_code: string;
  phone_number: string;
  limits: {
    order: {
      enabled: boolean;
      value: string;
    };
    budget: {
      enabled: boolean;
      value: string;
    };
  };
}

// Add interface for initial data
interface InitialAgencyData {
  company_id: string;
  store_name: string;
  store_address: string;
  city: string;
  postal_code: string;
  phone_number: string;
  limits: {
    order: {
      enabled: boolean;
      value: string;
    };
    budget: {
      enabled: boolean;
      value: string;
    };
  };
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
          "w-full pt-4 pr-3 pb-2 pl-3 bg-white rounded-lg border border-gray-300",
          type === "number"
            ? "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            : ""
        )}
        value={value}
        disabled={disabled}
        required={required}
        onChange={(e) => onChange?.(e.target.value)}
      />
      <span className="absolute -top-[10px] left-4 px-2 text-xs font-medium text-gray-600 bg-white">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
    </div>
  </div>
);

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

export default function AddAgency() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { selectedCompany } = useAppSelector((state) => state.client);
  const { storeDetails, loading, error, previousPath } = useAppSelector(
    (state) => state.agency
  );
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const store = storeDetails?.store;

  // Check if we're in edit mode
  const isEditMode = location.pathname.includes("/edit");

  const initialFormData: FormData = {
    company_id: selectedCompany?.id || "",
    store_name: "",
    store_address: "",
    city: "",
    postal_code: "",
    phone_number: "",
    limits: {
      order: {
        enabled: false,
        value: "",
      },
      budget: {
        enabled: false,
        value: "",
      },
    },
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [initialData, setInitialData] = useState<InitialAgencyData | null>(
    null
  );
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch store details if in edit mode
  useEffect(() => {
    if (isEditMode && id && selectedCompany?.dns) {
      dispatch(
        getStoreDetails({ dnsPrefix: selectedCompany.dns, storeId: id })
      );
    }
  }, [isEditMode, id, selectedCompany?.dns, dispatch]);

  // Update form data when store details are loaded
  useEffect(() => {
    if (isEditMode && store) {
      setFormData({
        company_id: store.company_id?.toString() ?? "",
        store_name: store.name ?? "",
        store_address: store.address ?? "",
        city: store.city ?? "",
        postal_code: store.postal_code ?? "",
        phone_number: store.phone_number ?? "",
        limits: {
          order: {
            enabled: !!store.order_limit,
            value: store.order_limit ? store.order_limit.toString() : "",
          },
          budget: {
            enabled: !!store.budget_limit,
            value: store.budget_limit ? store.budget_limit.toString() : "",
          },
        },
      });
    }
  }, [isEditMode, store]);

  // Update useEffect for edit mode to set initial data
  useEffect(() => {
    if (isEditMode && store) {
      const initialFormData = {
        company_id: store.company_id?.toString() ?? "",
        store_name: store.name ?? "",
        store_address: store.address ?? "",
        city: store.city ?? "",
        postal_code: store.postal_code ?? "",
        phone_number: store.phone_number ?? "",
        limits: {
          order: {
            enabled: !!store.order_limit,
            value: store.order_limit ? store.order_limit.toString() : "",
          },
          budget: {
            enabled: !!store.budget_limit,
            value: store.budget_limit ? store.budget_limit.toString() : "",
          },
        },
      };

      setInitialData(initialFormData);
      setFormData(initialFormData);
    }
  }, [isEditMode, store]);

  // Add effect to check for changes
  useEffect(() => {
    if (!initialData) {
      setHasChanges(!isEditMode); // In add mode, always allow submission
      return;
    }

    const hasDataChanged =
      formData.store_name !== initialData.store_name ||
      formData.store_address !== initialData.store_address ||
      formData.city !== initialData.city ||
      formData.postal_code !== initialData.postal_code ||
      formData.phone_number !== initialData.phone_number ||
      formData.limits.order.enabled !== initialData.limits.order.enabled ||
      formData.limits.budget.enabled !== initialData.limits.budget.enabled ||
      (formData.limits.order.enabled &&
        formData.limits.order.value !== initialData.limits.order.value) ||
      (formData.limits.budget.enabled &&
        formData.limits.budget.value !== initialData.limits.budget.value);

    setHasChanges(hasDataChanged);
  }, [formData, initialData, isEditMode]);

  // Function to get changed fields
  const getChangedFields = () => {
    if (!initialData || !isEditMode) return null;

    const changes: any = {};

    if (formData.store_name !== initialData.store_name) {
      changes.store_name = formData.store_name;
    }
    if (formData.store_address !== initialData.store_address) {
      changes.store_address = formData.store_address;
    }
    if (formData.city !== initialData.city) {
      changes.city = formData.city;
    }
    if (formData.postal_code !== initialData.postal_code) {
      changes.postal_code = formData.postal_code;
    }
    if (formData.phone_number !== initialData.phone_number) {
      changes.phone_number = formData.phone_number;
    }
    if (
      formData.limits.order.enabled !== initialData.limits.order.enabled ||
      (formData.limits.order.enabled &&
        formData.limits.order.value !== initialData.limits.order.value)
    ) {
      changes.order_limit = formData.limits.order.enabled
        ? parseInt(formData.limits.order.value)
        : null;
    }
    if (
      formData.limits.budget.enabled !== initialData.limits.budget.enabled ||
      (formData.limits.budget.enabled &&
        formData.limits.budget.value !== initialData.limits.budget.value)
    ) {
      changes.budget_limit = formData.limits.budget.enabled
        ? parseInt(formData.limits.budget.value)
        : null;
    }

    return Object.keys(changes).length > 0 ? changes : null;
  };

  const handleSubmit = async () => {
    // Validate all required fields
    if (
      !formData.store_name ||
      !formData.city ||
      !formData.store_address ||
      !formData.postal_code ||
      !formData.phone_number ||
      !selectedCompany?.id
    ) {
      toast.error("Please fill in all required fields", {
        duration: 6000,
        position: "top-right",
        style: {
          background: "#EF4444",
          color: "#fff",
        },
      });
      return;
    }

    try {
      // Prepare the base data

      const baseData = {
        company_id: selectedCompany?.id,
        store_name: formData?.store_name?.trim(),
        store_address: formData?.store_address?.trim(),
        city: formData?.city?.trim(),
        postal_code: formData?.postal_code,
        phone_number: formData?.phone_number,
        order_limit: formData.limits.order.enabled
          ? parseInt(formData.limits.order.value) || null
          : null,
        budget_limit: formData.limits.budget.enabled
          ? parseInt(formData.limits.budget.value) || null
          : null,
      };

      if (isEditMode && id) {
        // Get only changed fields
        const changedFields = getChangedFields();

        // If no fields have changed, just navigate away
        if (!changedFields) {
          navigate("/agencies");
          return;
        }

        await dispatch(
          modifyStore({
            dnsPrefix: selectedCompany?.dns || "",
            storeId: id,
            data: changedFields,
          })
        ).unwrap();
      } else {
        await dispatch(
          registerStore({
            dnsPrefix: selectedCompany?.dns || "",
            data: baseData,
          })
        ).unwrap();
      }
      if (previousPath) {
        navigate(previousPath);
        dispatch(setPreviousPath(null));
      } else {
        navigate("/agencies");
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  // Add phone input styles
  const phoneInputStyles = {
    container: {
      width: "100%",
      marginTop: "8px",
    },
    inputStyle: {
      width: "100%",
      height: "40px",
      fontSize: "16px",
      paddingLeft: "48px",
      borderRadius: "6px",
      border: "1px solid #e2e8f0",
      backgroundColor: "white",
      fontFamily: "inherit",
    },
    buttonStyle: {
      border: "1px solid #e2e8f0",
      borderRadius: "6px 0 0 6px",
      backgroundColor: "white",
    },
    dropdownStyle: {
      width: "300px",
      maxHeight: "300px",
      borderRadius: "6px",
      border: "1px solid #e2e8f0",
    },
  };

  if (loading) {
    return <Skeleton variant="form" />;
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-6rem)] relative">
      <div className="flex flex-col items-start gap-8 p-8 bg-white rounded-lg overflow-hidden">
        <header className="inline-flex items-center gap-2">
          <h1 className="font-heading-h3 text-[20px] font-bold leading-[28px] text-[#475569]">
            {isEditMode ? t("addAgency.title.edit") : t("addAgency.title.add")}
          </h1>
        </header>

        <div className="flex items-start justify-around pt-4 gap-8 flex-1 w-full overflow-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Left Column - Address Fields */}
          <div className="flex flex-col gap-8 flex-1 p-1">
            <div className="flex gap-6">
              <LabeledInput
                label={t("addAgency.fields.storeName")}
                id="store_name"
                value={formData.store_name}
                required={true}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    store_name: value,
                  }))
                }
              />
              <div className="relative w-full mt-[-10px]">
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 z-10" />
                  <PhoneInput
                    country={"fr"}
                    preferredCountries={["fr", "de", "gb", "it", "es"]}
                    value={formData.phone_number}
                    placeholder={t("addAgency.fields.phonePlaceholder")}
                    onChange={(phone) =>
                      setFormData((prev) => ({
                        ...prev,
                        phone_number: phone,
                      }))
                    }
                    containerStyle={phoneInputStyles.container}
                    inputStyle={{
                      ...phoneInputStyles.inputStyle,
                      paddingLeft: "48px",
                      paddingTop: "16px",
                      paddingBottom: "8px",
                    }}
                    buttonStyle={{
                      ...phoneInputStyles.buttonStyle,
                      display: "none",
                    }}
                    dropdownStyle={phoneInputStyles.dropdownStyle}
                    enableSearch={true}
                    searchPlaceholder="Search country..."
                    searchStyle={{
                      width: "100%",
                      height: "36px",
                      borderRadius: "4px",
                      border: "1px solid #e2e8f0",
                      padding: "0 10px",
                      marginTop: "5px",
                    }}
                    inputProps={{
                      required: true,
                      name: "phone",
                      "data-testid": "input-phone",
                    }}
                  />
                  <span className="absolute -top-[10px] left-4 px-2 text-xs font-medium text-gray-600 bg-white">
                    {t("addAgency.fields.phone")}{" "}
                    <span className="text-red-500">*</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-6">
              <LabeledInput
                label={t("addAgency.fields.postalCode")}
                id="postal_code"
                value={formData.postal_code}
                required={true}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    postal_code: value,
                  }))
                }
              />
              <LabeledInput
                label={t("addAgency.fields.city")}
                id="city"
                value={formData.city}
                required={true}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    city: value,
                  }))
                }
              />
            </div>

            <div className="relative w-full">
              <div className="relative">
                <Textarea
                  className="min-h-[100px] pt-6 pr-3 pb-2 pl-3 font-text-medium text-[16px] leading-[24px] bg-white rounded-lg border border-gray-300"
                  value={formData.store_address}
                  required={true}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      store_address: e.target.value,
                    }))
                  }
                />
                <span className="absolute -top-[10px] left-4 px-2 text-xs font-medium text-gray-600 bg-white">
                  {t("addAgency.fields.address")}{" "}
                  <span className="text-red-500">*</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Limits */}
          <div className="flex flex-col gap-8 flex-1 p-1">
            <div className="flex gap-6">
              <CheckboxField
                label={t("addAgency.limits.orderLimit")}
                id="orderLimit"
                checked={formData.limits.order.enabled}
                onChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    limits: {
                      ...prev.limits,
                      order: { ...prev.limits.order, enabled: checked },
                    },
                  }))
                }
              />
              <CheckboxField
                label={t("addAgency.limits.budgetLimit")}
                id="budgetLimit"
                checked={formData.limits.budget.enabled}
                onChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    limits: {
                      ...prev.limits,
                      budget: { ...prev.limits.budget, enabled: checked },
                    },
                  }))
                }
              />
            </div>

            <div className="flex gap-6">
              <LabeledInput
                label={t("addAgency.limits.orderLimitValue")}
                id="orderLimitValue"
                type="text"
                value={formData.limits.order.value}
                disabled={!formData.limits.order.enabled}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    limits: {
                      ...prev.limits,
                      order: { ...prev.limits.order, value },
                    },
                  }))
                }
              />
              <LabeledInput
                label={t("addAgency.limits.budgetLimitValue")}
                id="budgetLimitValue"
                type="text"
                value={formData.limits.budget.value}
                disabled={!formData.limits.budget.enabled}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    limits: {
                      ...prev.limits,
                      budget: { ...prev.limits.budget, value },
                    },
                  }))
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-primary-neutal-300 py-4">
        <div className="px-6 max-w-[calc(100%-2rem)]">
          <div className="flex items-center justify-end gap-4 w-full mx-auto">
            <Button
              type="button"
              onClick={handleSubmit}
              className={cn(
                "gap-4 py-4 px-4 self-stretch bg-[#07515f] border-gray-300",
                "hover:bg-[#064a56] transition-colors duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              disabled={loading || !hasChanges}
            >
              <span className="font-label-medium font-bold text-white text-sm tracking-wide leading-5 whitespace-nowrap">
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
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
