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
import { PlusCircle, Upload, User } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "../../lib/utils";

const clientData = {
  name: "Dassault Aviation",
  url: "https://dassaultaviation.cotton-blue.com/",
  brandColors: {
    background: "#324b6b",
    text: "#ffffff",
  },
  location: {
    category: "Agency",
    postalCode: "59472",
    city: "Seclin",
    address: "Marcel Dassault Street",
    addressComment: "",
  },
  limits: {
    order: {
      enabled: true,
      value: "3",
      period: "Month",
    },
    budget: {
      enabled: false,
      value: "€4500",
      period: "Month",
    },
  },
  passwords: {
    admin: "password",
    client: "password",
  },
  validation: {
    email: "pierre.doe@gmail.com",
  },
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
}: {
  label: string;
  defaultValue: string;
  type?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
}) => (
  <div className="relative w-full pt-2">
    <Input
      type={type}
      className="w-full font-text-medium text-[16px] leading-[24px]"
      defaultValue={defaultValue}
      disabled={disabled}
      onChange={(e) => onChange?.(e.target.value)}
    />
    <span className="absolute -top-2 left-4 px-1 text-xs font-label-small text-[#475569] bg-white">
      {label}
    </span>
  </div>
);

const LabeledButton = ({
  label,
  icon: Icon,
  checked,
  onChange,
}: {
  label: string;
  icon: React.ElementType;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}) => (
  <Button
    variant="outline"
    className="w-full justify-start pl-10 py-2 font-text-medium text-[16px] leading-[24px] relative"
    onClick={() => onChange?.(!checked)}
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
}: {
  color: string;
  onChange: (color: string) => void;
  label: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

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
      <p className="text-xs font-label-small text-[#475569]">{label}</p>
      <div
        className="w-[50px] h-[50px] rounded-md border cursor-pointer"
        style={{ backgroundColor: color }}
        onClick={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="absolute top-[60px] left-0 z-50">
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
  <div className="w-[160px] h-[80px] border rounded-md flex flex-col">
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
          >
            <div className="w-6 h-6 rounded-full border shadow-sm overflow-hidden">
              <div
                className="w-full h-1/2"
                style={{ backgroundColor: palette.background }}
              />
              <div
                className="w-full h-1/2"
                style={{ backgroundColor: palette.text }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ClientForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(clientData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleColorChange = (type: "background" | "text", color: string) => {
    setFormData((prev) => ({
      ...prev,
      brandColors: {
        ...prev.brandColors,
        [type]: color,
      },
    }));
  };

  const handleNext = async () => {
    setIsSubmitting(true);
    try {
      // Here you would typically make an API call to save the client data
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated API call
      toast.success("Client added successfully!");
      navigate("/customers");
    } catch (error) {
      toast.error("Failed to add client. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[854px] gap-8 p-6 bg-white rounded-lg overflow-hidden">
      <header className="inline-flex items-center gap-2">
        <h1 className="font-heading-h3 text-[20px] font-bold leading-[28px] text-[#475569]">
          Add a Client
        </h1>
      </header>

      <div className="flex items-start justify-around gap-6 flex-1 w-full overflow-hidden">
        <div className="flex flex-col gap-6 flex-1 overflow-hidden">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 pt-2">
              <div className="relative w-full">
                <Input
                  className="pl-10 py-2 font-text-medium text-[16px] leading-[24px]"
                  defaultValue={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
                <span className="absolute -top-2 left-4 px-1 text-xs font-label-small text-[#475569] bg-white">
                  Client
                </span>
              </div>
              <p className="text-xs font-text-smaller text-[#475569]">
                The link will be: {formData.url}
              </p>
            </div>

            <div className="flex flex-col gap-2 relative">
              <LabeledButton label="Add a logo" icon={Upload} />
              <span className="absolute -top-2 left-4 px-1 text-xs font-label-small text-[#475569] bg-white">
                Brand logo
              </span>
            </div>

            <div className="relative w-full">
              <div className="border p-6 flex flex-col gap-6">
                <span className="absolute -top-2 left-4 px-1 text-xs font-label-small text-[#475569] bg-white">
                  Brand colour
                </span>
                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <ColorPicker
                      color={formData.brandColors.background}
                      onChange={(color) =>
                        handleColorChange("background", color)
                      }
                      label="Background"
                    />
                    <ColorPicker
                      color={formData.brandColors.text}
                      onChange={(color) => handleColorChange("text", color)}
                      label="Text"
                    />
                  </div>
                  <div className="h-12 w-px bg-gray-300 rounded-full" />
                  <div className="flex items-center gap-4">
                    {(() => {
                      const contrastRatio = calculateContrastRatio(
                        formData.brandColors.background,
                        formData.brandColors.text
                      );
                      return (
                        <>
                          <ContrastIndicator
                            label="Minimum contrast (4.5:1)"
                            isValid={contrastRatio >= 4.5}
                            ratio={contrastRatio}
                          />
                          <ContrastIndicator
                            label="Optimal contrast (7:1)"
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
            <SectionHeader title="Colour preview" />
            <div className="border p-6 flex flex-col gap-4">
              <Button
                className="w-[352px] border font-text-medium text-[16px] leading-[24px]"
                style={{
                  backgroundColor: formData.brandColors.background,
                  color: formData.brandColors.text,
                  borderColor: "transparent",
                }}
              >
                Login
              </Button>
              <Button
                variant="secondary"
                className="w-fit rounded-md font-text-medium text-[16px] leading-[24px]"
                style={{
                  backgroundColor: formData.brandColors.background,
                  color: formData.brandColors.text,
                  borderColor: "transparent",
                }}
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Ajouter un client
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
                  <SectionHeader title="Client location" />
                  <p className="font-text-medium text-[16px] leading-[24px] text-[#475569]">
                    To create the client, you must provide at least one
                    location.
                  </p>
                </div>

                <div className="relative w-full">
                  <Select
                    value={formData.location.category}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        location: { ...prev.location, category: value },
                      }))
                    }
                  >
                    <SelectTrigger
                      className={cn(
                        "w-full font-label-medium",
                        "pt-4 pr-3 pb-2 pl-3 border-gray-300 min-h-[3.25rem]"
                      )}
                    >
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Agency">Agency</SelectItem>
                      <SelectItem value="Corporate">Corporate</SelectItem>
                      <SelectItem value="Individual">Individual</SelectItem>
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
                      defaultValue={formData.location.postalCode}
                      onChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          location: { ...prev.location, postalCode: value },
                        }))
                      }
                    />
                    <LabeledInput
                      label="City"
                      defaultValue={formData.location.city}
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
                    defaultValue={formData.location.address}
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        location: { ...prev.location, address: value },
                      }))
                    }
                  />

                  <div className="relative w-full">
                    <Textarea
                      className="min-h-[100px] font-text-medium text-[16px] leading-[24px]"
                      placeholder="Example: Building number 2"
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
                    />
                    <span className="absolute -top-2 left-4 px-1 text-xs font-label-small text-[#475569] bg-white">
                      Address comment
                    </span>
                  </div>
                </div>
              </div>

              <div className="h-0.5 bg-gray-300 rounded-full" />

              <div className="flex flex-col gap-6">
                <div className="flex gap-4">
                  <LabeledButton
                    label="Order limit"
                    icon={Checkbox}
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
                  <LabeledButton
                    label="Budget limit"
                    icon={Checkbox}
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
                  <div className="flex items-center gap-3 flex-1">
                    <LabeledInput
                      label="Limit"
                      defaultValue={formData.limits.order.value}
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
                    <span className="text-xs font-text-smaller text-[#475569]">
                      Per
                    </span>
                    <div className="relative flex-1">
                      <Select
                        value={formData.limits.order.period}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            limits: {
                              ...prev.limits,
                              order: { ...prev.limits.order, period: value },
                            },
                          }))
                        }
                      >
                        <SelectTrigger
                          className={cn(
                            "w-full font-label-medium",
                            "pt-4 pr-3 pb-2 pl-3 border-gray-300 min-h-[3.25rem]"
                          )}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Day">Day</SelectItem>
                          <SelectItem value="Week">Week</SelectItem>
                          <SelectItem value="Month">Month</SelectItem>
                          <SelectItem value="Year">Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-1">
                    <LabeledInput
                      label="Limit"
                      defaultValue={formData.limits.budget.value}
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
                    <span className="text-xs font-text-smaller text-[#475569]">
                      Per
                    </span>
                    <div className="relative flex-1">
                      <Select
                        value={formData.limits.budget.period}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            limits: {
                              ...prev.limits,
                              budget: { ...prev.limits.budget, period: value },
                            },
                          }))
                        }
                        disabled={!formData.limits.budget.enabled}
                      >
                        <SelectTrigger
                          className={cn(
                            "w-full font-label-medium",
                            "pt-4 pr-3 pb-2 pl-3 border-gray-300 min-h-[3.25rem]"
                          )}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Day">Day</SelectItem>
                          <SelectItem value="Week">Week</SelectItem>
                          <SelectItem value="Month">Month</SelectItem>
                          <SelectItem value="Year">Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex gap-4">
                  <LabeledInput
                    label="ADMIN password"
                    defaultValue={formData.passwords.admin}
                    type="password"
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        passwords: { ...prev.passwords, admin: value },
                      }))
                    }
                  />
                  <LabeledInput
                    label="CLIENT password"
                    defaultValue={formData.passwords.client}
                    type="password"
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
                  defaultValue={formData.validation.email}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      validation: { ...prev.validation, email: value },
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button
                className="bg-[#07515f] text-white h-12 font-text-medium text-[16px] leading-[24px]"
                onClick={handleNext}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Next"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientForm;
