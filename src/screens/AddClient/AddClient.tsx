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
import React from "react";

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
}: {
  label: string;
  defaultValue: string;
  type?: string;
  disabled?: boolean;
}) => (
  <div className="relative w-full pt-2">
    <Input
      type={type}
      className="w-full font-text-medium text-[16px] leading-[24px]"
      defaultValue={defaultValue}
      disabled={disabled}
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
}: {
  label: string;
  icon: React.ElementType;
  checked?: boolean;
}) => (
  <Button
    variant="outline"
    className="w-full justify-start pl-10 py-2 font-text-medium text-[16px] leading-[24px] relative"
  >
    {checked !== undefined && (
      <Checkbox
        className="absolute left-3 top-1/2 transform -translate-y-1/2"
        checked={checked}
      />
    )}
    <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
    {label}
  </Button>
);

const ClientForm = () => (
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
                defaultValue={clientData.name}
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
              <span className="absolute -top-2 left-4 px-1 text-xs font-label-small text-[#475569] bg-white">
                Client
              </span>
            </div>
            <p className="text-xs font-text-smaller text-[#475569]">
              The link will be: {clientData.url}
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
              <div className="flex items-start gap-6">
                <div className="flex flex-col items-center gap-1.5">
                  <p className="text-xs font-label-small text-[#475569]">
                    Background
                  </p>
                  <div className="w-[50px] h-[50px] bg-[#324b6b] rounded-md border" />
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <p className="text-xs font-label-small text-[#475569]">
                    Text
                  </p>
                  <div className="w-[50px] h-[50px] bg-white rounded-md border" />
                </div>
              </div>
              <div className="w-[88px] h-0.5 bg-gray-300 rounded-full" />
              <div className="flex gap-2">
                <div className="flex-1 p-4 text-center border">
                  <p className="text-xs font-label-small text-[#475569]">
                    Minimum contrast
                  </p>
                  <p className="text-xs font-label-small text-[#475569]">✅</p>
                </div>
                <div className="flex-1 p-4 text-center border">
                  <p className="text-xs font-label-small text-[#475569]">
                    Optimal contrast
                  </p>
                  <p className="text-xs font-label-small text-[#475569]">❌</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-0.5 bg-gray-300 rounded-full" />

        <div className="flex flex-col gap-4">
          <SectionHeader title="Colour preview" />
          <div className="border p-6 flex flex-col gap-4">
            <Button className="w-[352px] bg-[#324b6b] text-white border font-text-medium text-[16px] leading-[24px]">
              Login
            </Button>
            <Button
              variant="secondary"
              className="w-fit bg-[#a5bbd4] text-[#1c2635] rounded-md font-text-medium text-[16px] leading-[24px]"
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
                  To create the client, you must provide at least one location.
                </p>
              </div>

              <div className="relative w-full">
                <Select defaultValue={clientData.location.category}>
                  <SelectTrigger className="w-full font-text-medium text-[16px] leading-[24px]">
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
                    defaultValue={clientData.location.postalCode}
                  />
                  <LabeledInput
                    label="City"
                    defaultValue={clientData.location.city}
                  />
                </div>

                <LabeledInput
                  label="Address"
                  defaultValue={clientData.location.address}
                />

                <div className="relative w-full">
                  <Textarea
                    className="min-h-[100px] font-text-medium text-[16px] leading-[24px]"
                    placeholder="Example: Building number 2"
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
                  checked={clientData.limits.order.enabled}
                />
                <LabeledButton
                  label="Budget limit"
                  icon={Checkbox}
                  checked={clientData.limits.budget.enabled}
                />
              </div>

              <div className="flex gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <LabeledInput
                    label="Limit"
                    defaultValue={clientData.limits.order.value}
                  />
                  <span className="text-xs font-text-smaller text-[#475569]">
                    Per
                  </span>
                  <div className="relative flex-1">
                    <Select defaultValue={clientData.limits.order.period}>
                      <SelectTrigger className="font-text-medium text-[16px] leading-[24px]">
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
                    defaultValue={clientData.limits.budget.value}
                    disabled={!clientData.limits.budget.enabled}
                  />
                  <span className="text-xs font-text-smaller text-[#475569]">
                    Per
                  </span>
                  <div className="relative flex-1">
                    <Select
                      defaultValue={clientData.limits.budget.period}
                      disabled={!clientData.limits.budget.enabled}
                    >
                      <SelectTrigger className="bg-gray-200 text-gray-500 border-gray-300 font-text-medium text-[16px] leading-[24px]">
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
                  defaultValue={clientData.passwords.admin}
                  type="password"
                />
                <LabeledInput
                  label="CLIENT password"
                  defaultValue={clientData.passwords.client}
                  type="password"
                />
              </div>

              <LabeledInput
                label="N+1 validation email"
                defaultValue={clientData.validation.email}
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button className="bg-[#07515f] text-white h-12 font-text-medium text-[16px] leading-[24px]">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ClientForm;
