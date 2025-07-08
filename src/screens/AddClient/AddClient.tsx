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
import {
  PlusCircle,
  Upload,
  User,
  Palette,
  MapPin,
  Mail,
  Phone,
  ArrowLeft,
  Hash,
} from "lucide-react";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { HexColorPicker } from "react-colorful";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import { cn } from "../../lib/utils";
import { useDispatch, useSelector } from "react-redux";
import {
  registerClient,
  modifyCompany,
  resetState,
} from "../../store/features/clientSlice";
import { RootState, AppDispatch, useAppSelector } from "../../store/store";
import Loader from "../../components/Loader";
import { useTranslation } from "react-i18next";

// Initial empty form data
const initialFormData = {
  name: "",
  url: "",
  brandColors: {
    background: "#324b6b",
    text: "#ffffff",
  },
  location: {
    postalCode: "",
    city: "",
    address: "",
    addressComment: "",
  },
  passwords: {
    client: "",
  },
  validation: {
    email: "",
    adminMobile: "",
  },
  vat_number: "",
};

const SectionHeader = ({ title }: { title: string }) => (
  <h2 className="font-heading-h3 text-[20px] font-bold leading-[28px] text-[#475569] mb-2">
    {title}
  </h2>
);

const LabeledInput = ({
  label,
  defaultValue,
  type = "text",
  disabled = false,
  onChange,
  required = false,
}: {
  label: string;
  defaultValue: string;
  type?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  required?: boolean;
}) => (
  <div className="relative w-full pt-2">
    <Input
      type={type}
      className="w-full font-text-medium text-[16px] leading-[24px]"
      defaultValue={defaultValue}
      disabled={disabled}
      onChange={(e) => onChange?.(e.target.value)}
      required={required}
      data-testid={label.toLowerCase().replace(/\s+/g, "-")}
    />
    <span className="absolute -top-2 left-4 px-1 text-xs font-label-small text-[#475569] bg-white">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </span>
  </div>
);

const LabeledButton = ({
  label,
  icon: Icon,
  checked,
  onChange,
  onClick,
}: {
  label: string;
  icon: React.ElementType;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  onClick?: () => void;
}) => (
  <Button
    variant="outline"
    className="w-full justify-start pl-10 py-2 font-text-medium text-[16px] leading-[24px] relative"
    onClick={onClick || (() => onChange?.(!checked))}
    data-testid={`button-${label.toLowerCase().replace(/\s+/g, "-")}`}
  >
    {checked !== undefined && (
      <Checkbox
        className="absolute left-3 top-1/2 transform -translate-y-1/2"
        checked={checked}
        onCheckedChange={onChange}
      />
    )}
    <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
    {label}
  </Button>
);

const ColorPicker = ({
  color,
  onChange,
  label,
  required = false,
}: {
  color: string;
  onChange: (color: string) => void;
  label: string;
  required?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(color);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Update input value when color prop changes
  useEffect(() => {
    setInputValue(color);
  }, [color]);

  // Add validation for hex color code
  const validateHexColor = (value: string) => {
    const hexRegex = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexRegex.test(value);
  };

  // Handle manual color code input
  const handleColorInput = (value: string) => {
    // Update the input value immediately for responsive UI
    setInputValue(value);

    // Clean up the input value
    let newValue = value.trim();

    // Add # if missing
    if (newValue && !newValue.startsWith("#")) {
      newValue = `#${newValue}`;
    }

    // Handle 3-digit hex codes by converting to 6-digit
    if (validateHexColor(newValue) && newValue.length === 4) {
      newValue = `#${newValue[1]}${newValue[1]}${newValue[2]}${newValue[2]}${newValue[3]}${newValue[3]}`;
    }

    // Only update if it's a valid hex color
    if (validateHexColor(newValue)) {
      onChange(newValue.toLowerCase());
    }
  };

  // Handle blur event to reformat invalid input
  const handleBlur = () => {
    if (!validateHexColor(inputValue)) {
      setInputValue(color); // Reset to last valid color
    } else if (!inputValue.startsWith("#")) {
      handleColorInput(inputValue); // Add # if missing
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="flex flex-col items-center gap-1.5 relative"
      ref={pickerRef}
    >
      <p className="text-xs font-label-small text-[#475569]">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </p>
      <div className="flex flex-col items-center gap-2">
        <div
          className="w-[50px] h-[50px] rounded-md border cursor-pointer relative"
          style={{ backgroundColor: color }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border">
            <Palette className="w-4 h-4 text-gray-600" />
          </div>
        </div>
        <Input
          value={inputValue}
          onChange={(e) => handleColorInput(e.target.value)}
          onBlur={handleBlur}
          className="w-[80px] h-7 px-2 py-1 text-xs font-mono text-center uppercase"
          maxLength={7}
          data-testid={`color-input-${label
            .toLowerCase()
            .replace(/\s+/g, "-")}`}
        />
      </div>
      {isOpen && (
        <div className="absolute top-[85px] left-0 z-50">
          <HexColorPicker color={color} onChange={onChange} />
        </div>
      )}
    </div>
  );
};

// Add contrast calculation utility
const calculateContrastRatio = (color1: string, color2: string) => {
  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  // Calculate relative luminance
  const getLuminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map((c) => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return 1;

  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
};

// Add ContrastIndicator component
const ContrastIndicator = ({
  label,
  isValid,
  ratio,
}: {
  label: string;
  isValid: boolean;
  ratio: number;
}) => (
  <div className="w-[155px] h-[80px] border rounded-md flex flex-col">
    <div className="h-[28px] flex items-center justify-center border-b">
      <p className="text-xs font-label-small text-[#475569]">{label}</p>
    </div>
    <div className="flex-1 flex items-center justify-center">
      <p
        className={cn(
          "text-lg font-bold",
          isValid ? "text-green-600" : "text-red-500"
        )}
      >
        {isValid ? "✓" : "✗"}
      </p>
    </div>
    <div className="h-[28px] flex items-center justify-center border-t">
      <p className="text-xs font-label-small text-[#475569]">
        {ratio.toFixed(2)}:1
      </p>
    </div>
  </div>
);

const ColorPaletteRecommendation = ({
  onSelect,
}: {
  onSelect: (background: string, text: string) => void;
}) => {
  const palettes = [
    // Dark backgrounds with white text (highest contrast ratios)
    {
      background: "#0F172A",
      text: "#FFFFFF",
    },
    {
      background: "#1E3A8A",
      text: "#FFFFFF",
    },
    {
      background: "#064E3B",
      text: "#FFFFFF",
    },
    {
      background: "#4C1D95",
      text: "#FFFFFF",
    },
    {
      background: "#111827",
      text: "#FFFFFF",
    },
    {
      background: "#991B1B",
      text: "#FFFFFF",
    },
    {
      background: "#312E81",
      text: "#FFFFFF",
    },
    // Light backgrounds with dark text (highest contrast ratios)
    {
      background: "#F8FAFC",
      text: "#0F172A",
    },
    {
      background: "#F1F5F9",
      text: "#1E293B",
    },
    {
      background: "#E2E8F0",
      text: "#334155",
    },
    {
      background: "#F0FDF4",
      text: "#166534",
    },
    {
      background: "#F5F3FF",
      text: "#5B21B6",
    },
    {
      background: "#FEF2F2",
      text: "#B91C1C",
    },
    {
      background: "#EEF2FF",
      text: "#3730A3",
    },
  ];

  return (
    <div className="mt-4">
      <div className="flex flex-wrap gap-3">
        {palettes.map((palette, index) => (
          <div
            key={index}
            className="cursor-pointer hover:scale-110 transition-transform"
            onClick={() => onSelect(palette.background, palette.text)}
            data-testid={`color-palette-${index}`}
          >
            <div className="w-6 h-6 rounded-full border shadow-sm overflow-hidden">
              <div
                className="w-1/2 h-full"
                style={{ backgroundColor: palette.background }}
              />
              <div
                className="w-1/2 h-full"
                style={{ backgroundColor: palette.text }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Add this function before the ClientForm component
const getModifiedFields = (currentData: any, initialData: any) => {
  const modifiedFields: any = {};

  // Helper function to check if a value has changed
  const hasValueChanged = (current: any, initial: any) => {
    // Special handling for postal code
    if (typeof current === "string" && current.includes("postal_code")) {
      const currentValue = String(current || "").trim();
      const initialValue = String(initial || "").trim();
      return currentValue !== initialValue;
    }

    if (current instanceof File) return true;
    if (typeof current === "object" && current !== null) {
      return JSON.stringify(current) !== JSON.stringify(initial);
    }

    // Convert to string for comparison if either is a number
    if (typeof current === "number" || typeof initial === "number") {
      return String(current).trim() !== String(initial).trim();
    }

    return current !== initial;
  };

  // Compare and collect modified fields
  Object.entries(currentData).forEach(([key, value]) => {
    if (hasValueChanged(value, initialData[key])) {
      modifiedFields[key] = value;
    }
  });

  return modifiedFields;
};

const ClientForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, success } = useSelector(
    (state: RootState) => state.client
  );
  const { t } = useTranslation();
  const { companyDetails } = useAppSelector((state) => state.client);
  const company = companyDetails?.company;
  const isEditMode = company?.id ? true : false;

  // Store initial form data for comparison
  const initialFormState = {
    name: company?.name || "",
    url: company?.dns_prefix || "",
    logo: company?.logo || "",
    brandColors: {
      background: company?.bg_color_code || "#324b6b",
      text: company?.text_color_code || "#ffffff",
    },
    location: {
      postalCode: company?.postal_code || "",
      city: company?.city || "",
      address: company?.address || "",
      addressComment: company?.address || "",
    },
    validation: {
      email: company?.email || "",
      adminMobile: company?.phone_number || "",
      clientEmail: company?.email || "",
    },
    vat_number: company?.vat_number || "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [vatNumberError, setVatNumberError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to check if form data has changed
  const hasFormDataChanged = useCallback(() => {
    if (!isEditMode) return true;

    // Check if logo has changed
    if (logoFile !== null) return true;

    // Compare each field with initial state
    const isChanged = (current: any, initial: any): boolean => {
      // Handle null/undefined cases
      if (current === null || initial === null) {
        return current !== initial;
      }

      // Handle different types
      if (typeof current !== typeof initial) {
        // Special case for number/string comparison (for postal code)
        if (
          (typeof current === "number" && typeof initial === "string") ||
          (typeof current === "string" && typeof initial === "number")
        ) {
          return String(current) !== String(initial);
        }
        return true;
      }

      // Handle primitive types
      if (typeof current !== "object") {
        // Convert to string for comparison if either is a number (for postal code)
        if (typeof current === "number" || typeof initial === "number") {
          return String(current).trim() !== String(initial).trim();
        }
        return current !== initial;
      }

      // Handle arrays
      if (Array.isArray(current)) {
        if (!Array.isArray(initial) || current.length !== initial.length) {
          return true;
        }
        return current.some((item, index) => isChanged(item, initial[index]));
      }

      const currentKeys = Object.keys(current);
      const initialKeys = Object.keys(initial);

      if (currentKeys.length !== initialKeys.length) {
        return true;
      }

      return currentKeys.some((key) => {
        // Skip empty string to undefined/null comparison
        if (
          (current[key] === "" &&
            (initial[key] === undefined || initial[key] === null)) ||
          ((current[key] === undefined || current[key] === null) &&
            initial[key] === "")
        ) {
          return false;
        }

        // Special handling for postal code
        if (key === "postalCode") {
          const currentValue = String(current[key] || "").trim();
          const initialValue = String(initial[key] || "").trim();
          return currentValue !== initialValue;
        }

        return isChanged(current[key], initial[key]);
      });
    };

    return isChanged(formData, initialFormState);
  }, [formData, logoFile, isEditMode, initialFormState]);

  // Set logo preview in edit mode
  useEffect(() => {
    if (isEditMode && company?.logo) {
      setLogoPreview(company?.logo);
    }
  }, [isEditMode, company?.logo]);

  // Reset state when component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!isEditMode) {
      dispatch(resetState());
    }
  }, [isEditMode]);

  // Handle success state
  useEffect(() => {
    if (success) {
      navigate("/customers");
    }
  }, [success, navigate, isEditMode, t]);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorChange = (type: "background" | "text", color: string) => {
    setFormData((prev) => ({
      ...prev,
      brandColors: {
        ...prev.brandColors,
        [type]: color,
      },
    }));
  };

  // Update phone input styles
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

  // Add VAT number validation function
  const validateVatNumber = (vatNumber: string): boolean => {
    if (!vatNumber) return true; // Allow empty VAT number

    // Check length
    if (vatNumber.length !== 13) return false;

    // Check first two characters are letters
    const firstTwoChars = vatNumber.slice(0, 2);
    if (!/^[A-Z]{2}$/.test(firstTwoChars)) return false;

    // Check remaining characters are numbers
    const remainingChars = vatNumber.slice(2);
    if (!/^\d{11}$/.test(remainingChars)) return false;

    return true;
  };

  const handleNext = async () => {
    // Validate VAT number if provided
    if (formData.vat_number && !validateVatNumber(formData.vat_number)) {
      toast.error(
        t("addClient.messages.invalidVatNumber") || "Invalid VAT number format",
        {
          duration: 6000,
          position: "top-right",
          style: {
            background: "#EF4444",
            color: "#fff",
          },
        }
      );
      return;
    }

    // Validate required fields
    const requiredFields = [
      { value: formData.name, name: t("addClient.fields.client") },
      { value: formData.location.city, name: t("addClient.fields.city") },
      { value: formData.location.address, name: t("addClient.fields.address") },
      {
        value: formData.location.postalCode,
        name: t("addClient.fields.postalCode"),
      },
      ...(!isEditMode
        ? [
            {
              value: formData.validation.email,
              name: t("addClient.fields.validationEmail"),
            },
          ]
        : []),
      {
        value: formData.validation.adminMobile,
        name: t("addClient.fields.adminMobile"),
      },
      {
        value: formData.validation.clientEmail,
        name: t("addClient.fields.clientEmail"),
      },
      {
        value: formData.brandColors.background || "#324b6b",
        name: t("addClient.fields.background"),
      },
      {
        value: formData.brandColors.text || "#ffffff",
        name: t("addClient.fields.text"),
      },
    ];

    const missingFields = requiredFields?.filter(
      (field) =>
        !field?.value ||
        (typeof field.value === "string" && !field.value.trim())
    );

    // Check for logo separately since it's not a string value
    if (!logoFile && !isEditMode && !formData.logo) {
      toast.error(t("addClient.messages.requiredFields"), {
        duration: 6000,
        position: "top-right",
        style: {
          background: "#EF4444",
          color: "#fff",
        },
      });
      return;
    }

    if (missingFields.length > 0) {
      toast.error(t("addClient.messages.requiredFields"), {
        duration: 6000,
        position: "top-right",
        style: {
          background: "#EF4444",
          color: "#fff",
        },
      });
      return;
    }

    // Prepare data for API call
    const clientData = {
      company_name: formData.name,
      company_address: formData.location.address,
      city: formData.location.city,
      postal_code: formData.location.postalCode,
      phone_number: formData.validation.adminMobile,
      logo: isEditMode
        ? formData.logo || undefined
        : logoFile || new File([], "empty.png"),
      bg_color_code: formData.brandColors.background || "#324b6b",
      text_color_code: formData.brandColors.text || "#ffffff",
      dns_prefix: formData.name.toLowerCase().replace(/\s+/g, "-"),
      Admin_email: formData.validation.email,
      Admin_mobile: formData.validation.adminMobile,
      email: formData.validation.clientEmail,
      color_code: formData.brandColors.background || "#324b6b",
      vat_number: formData.vat_number,
    };

    if (isEditMode) {
      // Only proceed if there are actual changes
      if (!hasFormDataChanged()) {
        // Show a message to user using toast.error instead of toast.info
        toast.error(t("addClient.messages.noChanges") || "No changes to save", {
          duration: 3000,
          position: "top-right",
          style: {
            background: "#64748B", // Using a neutral color for this message
            color: "#fff",
          },
        });
        return;
      }

      // Create initial data object in the same structure as clientData
      const initialClientData = {
        company_name: company?.name || "",
        company_address: company?.address || "",
        city: company?.city || "",
        postal_code: company?.postal_code || "",
        phone_number: company?.phone_number || "",
        logo: company?.logo || undefined,
        bg_color_code: company?.bg_color_code || "",
        text_color_code: company?.text_color_code || "",
        dns_prefix: company?.dns_prefix || "",
        Admin_email: company?.email || "",
        Admin_mobile: company?.phone_number || "",
        color_code: company?.bg_color_code || "",
        email: company?.email || "",
        vat_number: company?.vat_number || "",
      };

      // Get only modified fields
      const modifiedData = getModifiedFields(clientData, initialClientData);

      // Add logo only if a new file was selected
      if (logoFile) {
        modifiedData.logo = logoFile;
      }

      // Double check if there are actually modified fields
      if (Object.keys(modifiedData).length === 0) {
        return;
      }

      // Dispatch only if we have modifications
      dispatch(
        modifyCompany({
          dns_prefix: company?.dns_prefix,
          company_id: company?.id,
          data: modifiedData,
        })
      );
    } else {
      // For create mode, dispatch registerClient action
      dispatch(
        registerClient({
          ...clientData,
          // Add required fields for ClientRegistrationData type
          Admin_first_name: formData.name,
          Admin_last_name: "Admin",
        })
      );
    }
  };

  return (
    <div className="flex flex-col min-h-[854px] gap-8 p-6 bg-white rounded-lg overflow-hidden relative">
      <header className="inline-flex items-center gap-2">
        {isEditMode && (
          <ArrowLeft
            onClick={() => navigate(-1)}
            className="w-5 h-5 text-[#07515f] cursor-pointer hover:text-[#064a56] transition-colors duration-200"
          />
        )}
        <h1 className="font-heading-h3 text-[20px] font-bold leading-[28px] text-[#475569]">
          {isEditMode ? t("addClient.title.edit") : t("addClient.title.add")}
        </h1>
      </header>

      <div className="flex items-start justify-around gap-6 flex-1 w-full overflow-hidden pb-20">
        <div className="flex flex-col gap-6 flex-1 overflow-hidden">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 pt-2">
              <div className="relative w-full">
                <Input
                  className="pl-10 py-2 font-text-medium text-[16px] leading-[24px]"
                  defaultValue={formData.name}
                  placeholder={t("addClient.fields.clientPlaceholder")}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                  data-testid="input-client-name"
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
                <span className="absolute -top-2 left-4 px-1 text-xs font-label-small text-[#475569] bg-white">
                  {t("addClient.fields.client")}
                  <span className="text-red-500 ml-1">*</span>
                </span>
              </div>
              <p className="text-xs font-text-smaller text-[#475569]">
                {t("addClient.messages.urlPreview")}{" "}
                {formData.url ||
                  `https://${formData.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}.cotton-blue.com/`}
              </p>
            </div>

            <div className="flex flex-col gap-2 relative">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleLogoUpload}
                required
                data-testid="input-brand-logo"
              />
              <LabeledButton
                label={t("addClient.fields.brandLogo")}
                icon={Upload}
                onClick={() => fileInputRef.current?.click()}
              />
              <span className="absolute -top-2 left-4 px-1 text-xs font-label-small text-[#475569] bg-white">
                {t("addClient.fields.brandLogo")}
                <span className="text-red-500 ml-1">*</span>
              </span>
              {logoPreview && (
                <div className="mt-2 flex items-center gap-2">
                  <img
                    src={logoPreview}
                    alt="Brand logo preview"
                    className="w-12 h-12 object-contain"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setLogoFile(null);
                      setLogoPreview(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    data-testid="button-remove-logo"
                  >
                    {t("common.remove")}
                  </Button>
                </div>
              )}
            </div>

            <div className="relative w-full">
              <div className="border p-6 flex flex-col gap-6">
                <span className="absolute -top-2 left-4 px-1 text-xs font-label-small text-[#475569] bg-white">
                  {t("addClient.fields.brandColor")}
                  <span className="text-red-500 ml-1">*</span>
                </span>
                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <ColorPicker
                      color={formData.brandColors.background || "#324b6b"}
                      onChange={(color) =>
                        handleColorChange("background", color)
                      }
                      label={t("addClient.fields.background")}
                      required
                    />
                    <ColorPicker
                      color={formData.brandColors.text || "#ffffff"}
                      onChange={(color) => handleColorChange("text", color)}
                      label={t("addClient.fields.text")}
                      required
                    />
                  </div>
                  <div className="h-12 w-px bg-gray-300 rounded-full" />
                  <div className="flex items-center gap-4">
                    {(() => {
                      const contrastRatio = calculateContrastRatio(
                        formData.brandColors.background || "#324b6b",
                        formData.brandColors.text || "#ffffff"
                      );
                      return (
                        <>
                          <ContrastIndicator
                            label={t("addClient.fields.minimumContrast")}
                            isValid={contrastRatio >= 4.5}
                            ratio={contrastRatio}
                          />
                          <ContrastIndicator
                            label={t("addClient.fields.optimalContrast")}
                            isValid={contrastRatio >= 7}
                            ratio={contrastRatio}
                          />
                        </>
                      );
                    })()}
                  </div>
                </div>
                <ColorPaletteRecommendation
                  onSelect={(background, text) => {
                    handleColorChange("background", background);
                    handleColorChange("text", text);
                  }}
                />
              </div>
            </div>
          </div>

          <div className="h-0.5 bg-gray-300 rounded-full" />

          <div className="flex flex-col gap-4">
            <SectionHeader title={t("addClient.fields.colorPreview")} />
            <div className="border p-6 flex flex-col gap-4">
              <Button
                className="w-[352px] border font-text-medium text-[16px] leading-[24px]"
                style={{
                  backgroundColor: formData.brandColors.background || "#324b6b",
                  color: formData.brandColors.text || "#ffffff",
                  borderColor: "transparent",
                }}
              >
                {t("addClient.buttons.login")}
              </Button>
              <Button
                variant="secondary"
                className="w-fit rounded-md font-text-medium text-[16px] leading-[24px]"
                style={{
                  backgroundColor: formData.brandColors.background || "#324b6b",
                  color: formData.brandColors.text || "#ffffff",
                  borderColor: "transparent",
                }}
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                {t("addClient.buttons.addClient")}
              </Button>
            </div>
          </div>
        </div>

        <div className="h-auto w-px bg-gray-300 rounded-full" />

        <div className="flex flex-col gap-6 flex-1 overflow-hidden">
          <div className="flex flex-col justify-between flex-1">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <SectionHeader title={t("addClient.fields.clientLocation")} />
                  <p className="font-text-medium text-[16px] leading-[24px] text-[#475569]">
                    {t("addClient.fields.locationDescription")}
                  </p>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="flex gap-4">
                    <div className="relative w-full">
                      <Input
                        className="pl-10 py-2 font-text-medium text-[16px] leading-[24px]"
                        defaultValue={formData.location.postalCode}
                        placeholder={t(
                          "addClient.fields.postalCodePlaceholder"
                        )}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            location: {
                              ...prev.location,
                              postalCode: e.target.value,
                            },
                          }))
                        }
                        required
                        data-testid="input-postal-code"
                      />
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
                      <span className="absolute -top-2 left-4 px-1 text-xs font-label-small text-[#475569] bg-white">
                        {t("addClient.fields.postalCode")}
                        <span className="text-red-500 ml-1">*</span>
                      </span>
                    </div>
                    <div className="relative w-full">
                      <Input
                        className="pl-10 py-2 font-text-medium text-[16px] leading-[24px]"
                        defaultValue={formData.location.city}
                        placeholder={t("addClient.fields.cityPlaceholder")}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            location: {
                              ...prev.location,
                              city: e.target.value,
                            },
                          }))
                        }
                        required
                        data-testid="input-city"
                      />
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
                      <span className="absolute -top-2 left-4 px-1 text-xs font-label-small text-[#475569] bg-white">
                        {t("addClient.fields.city")}
                        <span className="text-red-500 ml-1">*</span>
                      </span>
                    </div>
                  </div>

                  <div className="relative w-full">
                    <Input
                      className="pl-10 py-2 font-text-medium text-[16px] leading-[24px]"
                      defaultValue={formData.location.address}
                      placeholder={t("addClient.fields.addressPlaceholder")}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          location: {
                            ...prev.location,
                            address: e.target.value,
                          },
                        }))
                      }
                      required
                      data-testid="input-address"
                    />
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
                    <span className="absolute -top-2 left-4 px-1 text-xs font-label-small text-[#475569] bg-white">
                      {t("addClient.fields.address")}
                      <span className="text-red-500 ml-1">*</span>
                    </span>
                  </div>

                  <div className="relative w-full">
                    <Textarea
                      className="min-h-[100px] pl-10 py-2 font-text-medium text-[16px] leading-[24px]"
                      placeholder={t(
                        "addClient.fields.addressCommentPlaceholder"
                      )}
                      defaultValue={formData.location.addressComment}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          location: {
                            ...prev.location,
                            addressComment: e.target.value,
                          },
                        }))
                      }
                      data-testid="input-address-comment"
                    />
                    <MapPin className="absolute left-3 top-6 w-4 h-4" />
                    <span className="absolute -top-2 left-4 px-1 text-xs font-label-small text-[#475569] bg-white">
                      {t("addClient.fields.addressComment")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                {!isEditMode && (
                  <div className="relative w-full">
                    <Input
                      type="email"
                      className="pl-10 py-2 font-text-medium text-[16px] leading-[24px]"
                      defaultValue={formData.validation.email}
                      placeholder={t("addClient.fields.emailPlaceholder")}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          validation: {
                            ...prev.validation,
                            email: e.target.value,
                          },
                        }))
                      }
                      required
                      data-testid="input-validation-email"
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
                    <span className="absolute -top-2 left-4 px-1 text-xs font-label-small text-[#475569] bg-white">
                      {t("addClient.fields.validationEmail")}
                      <span className="text-red-500 ml-1">*</span>
                    </span>
                  </div>
                )}
                <div className="relative w-full">
                  <span className="absolute -top-2 left-4 px-1 text-xs font-label-small text-[#475569] bg-white">
                    {t("addClient.fields.adminMobile")}
                    <span className="text-red-500 ml-1">*</span>
                  </span>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 z-10" />
                    <PhoneInput
                      country={"fr"}
                      preferredCountries={["fr", "de", "gb", "it", "es"]}
                      value={formData.validation.adminMobile}
                      placeholder={t("addClient.fields.phonePlaceholder")}
                      onChange={(phone) =>
                        setFormData((prev) => ({
                          ...prev,
                          validation: {
                            ...prev.validation,
                            adminMobile: phone,
                          },
                        }))
                      }
                      containerStyle={phoneInputStyles.container}
                      inputStyle={{
                        ...phoneInputStyles.inputStyle,
                        paddingLeft: "48px",
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
                        "data-testid": "input-admin-mobile",
                      }}
                    />
                  </div>
                </div>
                <div className="relative w-full">
                  <Input
                    type="email"
                    className="pl-10 py-2 font-text-medium text-[16px] leading-[24px]"
                    defaultValue={formData.validation.clientEmail}
                    placeholder={t("addClient.fields.clientEmailPlaceholder")}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        validation: {
                          ...prev.validation,
                          clientEmail: e.target.value,
                        },
                      }))
                    }
                    required
                    data-testid="input-client-email"
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
                  <span className="absolute -top-2 left-4 px-1 text-xs font-label-small text-[#475569] bg-white">
                    {t("addClient.fields.adminEmail")}
                    <span className="text-red-500 ml-1">*</span>
                  </span>
                </div>
                <div className="relative w-full">
                  <Input
                    type="text"
                    className={cn(
                      "pl-10 py-2 font-text-medium text-[16px] leading-[24px]",
                      vatNumberError && "border-red-500"
                    )}
                    defaultValue={formData.vat_number}
                    placeholder={t("addClient.fields.vatNumberPlaceholder")}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        vat_number: value,
                      }));

                      // Clear error if empty or validate
                      if (!value) {
                        setVatNumberError(null);
                      } else if (!validateVatNumber(value)) {
                        setVatNumberError(
                          t("addClient.messages.invalidVatNumber") ||
                            "VAT number must be 13 characters: 2 letters followed by 11 numbers"
                        );
                      } else {
                        setVatNumberError(null);
                      }
                    }}
                    data-testid="input-vat-number"
                  />
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
                  <span className="absolute -top-2 left-4 px-1 text-xs font-label-small text-[#475569] bg-white">
                    {t("addClient.fields.vatNumber")}
                  </span>
                  {vatNumberError && (
                    <p className="text-red-500 text-xs mt-1">
                      {vatNumberError}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-primary-neutal-300 py-4">
        <div className="px-6 max-w-[calc(100%-2rem)]">
          <div className="flex items-center justify-end w-full mx-auto">
            <Button
              className={cn(
                "gap-4 py-4 px-4 self-stretch bg-[#07515f] border-gray-300",
                "hover:bg-[#064a56] transition-colors duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                loading && "animate-pulse"
              )}
              onClick={handleNext}
              disabled={loading || (isEditMode && !hasFormDataChanged())}
              data-testid="button-submit"
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
};

export default ClientForm;
