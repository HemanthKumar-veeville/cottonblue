import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { store, useAppSelector } from "../../store/store";
import {
  registerStore,
  modifyStore,
  getStoreDetails,
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
  store_region: "North" | "South" | "All";
  city: string;
  postal_code: string;
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
  <div className="relative w-full pt-2">
    <Input
      id={id}
      type={type}
      className={`w-full font-text-medium text-[16px] leading-[24px] bg-gray-100 rounded-lg border ${
        type === "number"
          ? "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          : ""
      }`}
      value={value}
      disabled={disabled}
      required={required}
      onChange={(e) => onChange?.(e.target.value)}
    />
    <span className="absolute -top-2 left-4 px-1 text-xs font-label-small text-[#475569] bg-white">
      {label} {required && <span className="text-red-500">*</span>}
    </span>
  </div>
);

const LabeledSelect = ({
  label,
  id,
  value,
  options,
  required = false,
  onChange,
}: {
  label: string;
  id: string;
  value: string;
  options: { value: string; label: string }[];
  required?: boolean;
  onChange?: (value: string) => void;
}) => {
  const [selectedValue, setSelectedValue] = useState(value);

  return (
    <div className="relative w-full pt-2">
      <div className="relative">
        <div
          className="flex w-full items-center justify-center gap-3 py-3 px-3 self-stretch bg-gray-100 rounded-lg border border-solid border-gray-300 cursor-pointer"
          onClick={() => {
            const dropdown = document.getElementById(`${id}-dropdown`);
            if (dropdown) {
              dropdown.classList.toggle("hidden");
            }
          }}
        >
          <div className="flex-1 font-medium text-gray-700 text-base leading-4 tracking-normal truncate">
            {selectedValue || "Select Region"}
          </div>
          <div className="flex w-6 h-6 items-center justify-center shrink-0">
            <img
              className="w-4 h-4"
              alt="Chevron down"
              src="/img/icon-13.svg"
            />
          </div>
        </div>
        <div
          id={`${id}-dropdown`}
          className="hidden absolute top-full left-0 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50"
        >
          {options.map((option) => (
            <div
              key={option.value}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setSelectedValue(option.label);
                onChange?.(option.value);
                const dropdown = document.getElementById(`${id}-dropdown`);
                if (dropdown) {
                  dropdown.classList.add("hidden");
                }
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      </div>
      <span className="absolute -top-2 left-4 px-1 text-xs font-label-small text-[#475569] bg-white">
        {label} {required && <span className="text-red-500">*</span>}
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

export default function AddAgency() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { selectedCompany } = useAppSelector((state) => state.client);
  const { storeDetails, loading, error } = useAppSelector(
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
    store_region: "North",
    city: "",
    postal_code: "",
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
        store_region: (store.region === "all"
          ? "All"
          : store.region ?? "North") as "North" | "South" | "All",
        city: store.city ?? "",
        postal_code: store.postal_code ?? "",
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

  const handleSubmit = async () => {
    // Validate all required fields
    if (
      !formData.store_name ||
      !formData.city ||
      !formData.store_address ||
      !formData.postal_code ||
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
        company_id: selectedCompany.id,
        store_name: formData.store_name,
        store_address: formData.store_address,
        city: formData.city,
        postal_code: formData.postal_code,
        store_region: formData.store_region.toLowerCase(),
      };

      // Add optional fields only if they are enabled and have values
      const submitData = {
        ...baseData,
        order_limit: formData.limits.order.enabled
          ? parseInt(formData.limits.order.value) || null
          : null,
        budget_limit: formData.limits.budget.enabled
          ? parseInt(formData.limits.budget.value) || null
          : null,
      };

      if (isEditMode && id) {
        await dispatch(
          modifyStore({
            dnsPrefix: selectedCompany.dns || "",
            storeId: id,
            data: submitData,
          })
        ).unwrap();
        toast.success("Agency updated successfully", {
          duration: 5000,
          position: "top-right",
          style: {
            background: "#10B981",
            color: "#fff",
          },
        });
      } else {
        await dispatch(
          registerStore({
            dnsPrefix: selectedCompany.dns || "",
            data: submitData,
          })
        ).unwrap();
        toast.success("Agency added successfully", {
          duration: 5000,
          position: "top-right",
          style: {
            background: "#10B981",
            color: "#fff",
          },
        });
      }
      navigate("/agencies");
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(
        isEditMode ? "Failed to update agency" : "Failed to add agency",
        {
          duration: 6000,
          position: "top-right",
          style: {
            background: "#EF4444",
            color: "#fff",
          },
        }
      );
    }
  };

  if (loading) {
    return <Skeleton variant="form" />;
  }

  return (
    <div className="flex flex-col min-h-[854px] gap-8 p-6 bg-white rounded-lg overflow-hidden">
      <header className="inline-flex items-center gap-2">
        <h1 className="font-heading-h3 text-[20px] font-bold leading-[28px] text-[#475569]">
          {isEditMode ? t("addAgency.title.edit") : t("addAgency.title.add")}
        </h1>
      </header>

      <div className="flex items-start justify-around gap-6 flex-1 w-full overflow-hidden">
        <div className="flex flex-col gap-6 flex-1 overflow-hidden">
          <div className="flex flex-col gap-6">
            <div className="flex gap-4 mt-2">
              <LabeledInput
                label={t("addAgency.fields.companyId")}
                id="company_id"
                value={selectedCompany?.id || ""}
                disabled={true}
                required={true}
              />
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
            </div>

            <div className="flex gap-4">
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

            <div className="flex gap-4">
              <div className="flex-1">
                <LabeledInput
                  label={t("addAgency.fields.address")}
                  id="store_address"
                  value={formData.store_address}
                  required={true}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      store_address: value,
                    }))
                  }
                />
              </div>
              <div className="flex-1">
                <LabeledSelect
                  label={t("addAgency.fields.storeRegion")}
                  id="store_region"
                  value={formData.store_region}
                  required={true}
                  options={[
                    {
                      value: "North",
                      label: t("addAgency.fields.region.north"),
                    },
                    {
                      value: "South",
                      label: t("addAgency.fields.region.south"),
                    },
                    { value: "All", label: t("addAgency.fields.region.all") },
                  ]}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      store_region: value as "North" | "South" | "All",
                    }))
                  }
                />
              </div>
            </div>

            <div className="relative w-full">
              <Textarea
                className="min-h-[100px] font-text-medium text-[16px] leading-[24px] bg-gray-100 rounded-lg border"
                placeholder={t("addAgency.placeholders.addressComment")}
                value={formData.store_address}
                required={true}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    store_address: e.target.value,
                  }))
                }
              />
              <span className="absolute -top-2 left-4 px-1 text-xs font-label-small text-[#475569] bg-white">
                {t("addAgency.fields.addressComment")}{" "}
                <span className="text-red-500">*</span>
              </span>
            </div>
          </div>

          <div className="h-0.5 bg-gray-300 rounded-full" />

          {!isEditMode && (
            <div className="flex flex-col gap-6">
              <div className="flex gap-4">
                <div className="flex-1">
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
                </div>
                <div className="flex-1">
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
              </div>

              <div className="flex gap-4">
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
          )}

          <div className="flex justify-end mt-6">
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
    </div>
  );
}
