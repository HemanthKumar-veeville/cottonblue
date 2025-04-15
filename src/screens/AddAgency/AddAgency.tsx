import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Separator } from "../../components/ui/separator";
import { Textarea } from "../../components/ui/textarea";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface FormData {
  category: string;
  location: {
    postalCode: string;
    city: string;
    address: string;
    addressComment: string;
  };
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
  passwords: {
    admin: string;
    client: string;
  };
  validation: {
    email: string;
  };
}

const initialFormData: FormData = {
  category: "Agence",
  location: {
    postalCode: "",
    city: "",
    address: "",
    addressComment: "",
  },
  limits: {
    order: {
      enabled: true,
      value: "",
    },
    budget: {
      enabled: false,
      value: "",
    },
  },
  passwords: {
    admin: "",
    client: "",
  },
  validation: {
    email: "",
  },
};

const SectionHeader = ({ title }: { title: string }) => (
  <h2 className="font-heading-h3 text-[20px] font-bold leading-[28px] text-[#475569] mb-2">
    {title}
  </h2>
);

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
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Validate required fields
    if (
      !formData.location.city ||
      !formData.location.address ||
      !formData.passwords.admin ||
      !formData.passwords.client ||
      !formData.validation.email
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      // Add your API call here
      // await addAgency(formData);
      toast.success("Agency added successfully!");
      navigate("/agencies");
    } catch (error) {
      toast.error("Failed to add agency");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[854px] gap-8 p-6 bg-white rounded-lg overflow-hidden">
      <header className="inline-flex items-center gap-2">
        <h1 className="font-heading-h3 text-[20px] font-bold leading-[28px] text-[#475569]">
          Add an Agency
        </h1>
      </header>

      <div className="flex flex-col w-[820px] items-start gap-6">
        <div className="flex flex-col items-start gap-6 w-full">
          <div className="relative w-full">
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger className="w-full bg-gray-100 rounded-lg border">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {["Agence", "Client", "Fournisseur"].map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="absolute -top-2 left-4 px-1 text-xs font-label-small text-[#475569] bg-white">
              Client Category
            </span>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex gap-4">
              <LabeledInput
                label="Postal code"
                id="postalCode"
                value={formData.location.postalCode}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    location: { ...prev.location, postalCode: value },
                  }))
                }
              />
              <LabeledInput
                label="City"
                id="city"
                value={formData.location.city}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    location: { ...prev.location, city: value },
                  }))
                }
              />
            </div>

            <LabeledInput
              label="Address"
              id="address"
              value={formData.location.address}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  location: { ...prev.location, address: value },
                }))
              }
            />

            <div className="relative w-full">
              <Textarea
                className="min-h-[100px] bg-gray-100 rounded-lg border font-text-medium text-[16px] leading-[24px]"
                placeholder="Example: Building number 2"
                value={formData.location.addressComment}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    location: {
                      ...prev.location,
                      addressComment: e.target.value,
                    },
                  }))
                }
              />
              <span className="absolute -top-2 left-4 px-1 text-xs font-label-small text-[#475569] bg-white">
                Address comment
              </span>
            </div>
          </div>

          <div className="w-full h-0.5 bg-gray-200 rounded-full" />

          <div className="flex flex-col gap-6 w-full">
            <div className="flex gap-4">
              <CheckboxField
                label="Order limit"
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
                label="Budget limit"
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

            <div className="flex gap-4">
              <LabeledInput
                label="Order Limit"
                id="orderLimitValue"
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
                label="Budget Limit"
                id="budgetLimitValue"
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

          <div className="flex flex-col gap-6 w-full">
            <div className="flex gap-4">
              <LabeledInput
                label="ADMIN password"
                id="adminPassword"
                type="password"
                value={formData.passwords.admin}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    passwords: { ...prev.passwords, admin: value },
                  }))
                }
              />
              <LabeledInput
                label="CLIENT password"
                id="clientPassword"
                type="password"
                value={formData.passwords.client}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    passwords: { ...prev.passwords, client: value },
                  }))
                }
              />
            </div>

            <LabeledInput
              label="N+1 validation email"
              id="validationEmail"
              type="email"
              value={formData.validation.email}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  validation: { ...prev.validation, email: value },
                }))
              }
            />
          </div>
        </div>

        <div className="flex justify-end w-full mt-6">
          <Button
            className="bg-[#07515f] text-white h-12 font-text-medium text-[16px] leading-[24px]"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
