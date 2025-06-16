import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Separator } from "../../components/ui/separator";
import { ArrowLeft, Save } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { getUserDetails, modifyUser } from "../../store/features/userSlice";
import { getHost } from "../../utils/hostUtils";
import { Switch } from "../../components/ui/switch";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useCompanyColors } from "../../hooks/useCompanyColors";

interface UserModificationData {
  firstname: string;
  lastname: string;
  email: string;
  store_ids: number[];
  gdpr_consent: boolean;
  marketing_consent: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  language: string;
}

interface UserData extends UserModificationData {
  password: string;
  role: string;
  is_active: boolean;
  id?: number;
}

type CurrentUser = Partial<UserData>;

const ClientSettings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const dnsPrefix = getHost();
  const { buttonStyles } = useCompanyColors();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { currentUser, isLoading, error } = useSelector(
    (state: RootState) => state.user
  );

  const [formData, setFormData] = useState<UserData>({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    store_ids: [],
    role: "",
    is_active: true,
    gdpr_consent: false,
    marketing_consent: false,
    email_notifications: false,
    push_notifications: false,
    language: "en",
  });

  useEffect(() => {
    if (currentUser) {
      const user = currentUser as CurrentUser;
      setFormData({
        ...formData,
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        email: user.email || "",
        store_ids: user.store_ids || [],
        gdpr_consent: user.gdpr_consent || false,
        marketing_consent: user.marketing_consent || false,
        email_notifications: user.email_notifications || false,
        push_notifications: user.push_notifications || false,
        language: user.language || "en",
        id: user.id,
      });
    }
  }, [currentUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleToggleChange = (id: keyof UserData) => {
    setFormData((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleLanguageChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      language: value,
    }));
    i18n.changeLanguage(value);
  };

  const handleSubmit = async () => {
    if (!currentUser) return;

    try {
      setIsSubmitting(true);
      await dispatch(
        modifyUser({
          dnsPrefix: dnsPrefix || "",
          userId: formData.id || 0,
          data: {
            firstname: formData.firstname,
            lastname: formData.lastname,
            email: formData.email,
            store_ids: formData.store_ids,
            gdpr_consent: formData.gdpr_consent,
            marketing_consent: formData.marketing_consent,
            email_notifications: formData.email_notifications,
            push_notifications: formData.push_notifications,
            language: formData.language,
          },
        })
      );
    } catch (error) {
      console.error("Failed to update settings:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex flex-col items-start gap-[var(--2-tokens-screen-modes-common-spacing-XL)] pt-[var(--2-tokens-screen-modes-common-spacing-l)] pr-[var(--2-tokens-screen-modes-common-spacing-l)] pb-[var(--2-tokens-screen-modes-common-spacing-l)] pl-[var(--2-tokens-screen-modes-common-spacing-l)] bg-white rounded-[var(--2-tokens-screen-modes-button-border-radius)]">
      <header className="flex items-center gap-[var(--2-tokens-screen-modes-common-spacing-XS)]">
        <Button
          variant="ghost"
          size="icon"
          className="w-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-line-height)] h-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-line-height)]"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h3 className="text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] text-[length:var(--heading-h3-font-size)] leading-[var(--heading-h3-line-height)] font-heading-h3 font-[number:var(--heading-h3-font-weight)] tracking-[var(--heading-h3-letter-spacing)] [font-style:var(--heading-h3-font-style)]">
          {t("clientSettings.title", "User Settings")}
        </h3>
      </header>

      <div className="flex w-full gap-4">
        {/* Left Side - Personal Information */}
        <div className="flex-1 pr-6">
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold mb-4">
                {t("clientSettings.personalInfo", "Personal Information")}
              </h4>
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    className="w-full pt-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-v)] pr-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-h)] pb-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-v)] pl-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-h)] bg-[color:var(--1-tokens-color-modes-input-primary-default-background)] rounded-[var(--2-tokens-screen-modes-input-border-radius)] border-[color:var(--1-tokens-color-modes-input-primary-default-border)]"
                    id="firstname"
                    value={formData.firstname}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                  <label
                    htmlFor="firstname"
                    className="absolute top-[-9px] left-4 px-1 bg-white text-[color:var(--1-tokens-color-modes-input-primary-default-placeholder-label)] text-[length:var(--label-smaller-font-size)] font-label-smaller font-[number:var(--label-smaller-font-weight)] tracking-[var(--label-smaller-letter-spacing)] leading-[var(--label-smaller-line-height)] [font-style:var(--label-smaller-font-style)]"
                  >
                    {t("clientSettings.firstname", "First Name")}
                  </label>
                </div>

                <div className="relative">
                  <Input
                    className="w-full pt-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-v)] pr-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-h)] pb-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-v)] pl-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-h)] bg-[color:var(--1-tokens-color-modes-input-primary-default-background)] rounded-[var(--2-tokens-screen-modes-input-border-radius)] border-[color:var(--1-tokens-color-modes-input-primary-default-border)]"
                    id="lastname"
                    value={formData.lastname}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                  <label
                    htmlFor="lastname"
                    className="absolute top-[-9px] left-4 px-1 bg-white text-[color:var(--1-tokens-color-modes-input-primary-default-placeholder-label)] text-[length:var(--label-smaller-font-size)] font-label-smaller font-[number:var(--label-smaller-font-weight)] tracking-[var(--label-smaller-letter-spacing)] leading-[var(--label-smaller-line-height)] [font-style:var(--label-smaller-font-style)]"
                  >
                    {t("clientSettings.lastname", "Last Name")}
                  </label>
                </div>

                <div className="relative">
                  <Input
                    className="w-full pt-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-v)] pr-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-h)] pb-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-v)] pl-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-h)] bg-[color:var(--1-tokens-color-modes-input-primary-default-background)] rounded-[var(--2-tokens-screen-modes-input-border-radius)] border-[color:var(--1-tokens-color-modes-input-primary-default-border)]"
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                  <label
                    htmlFor="email"
                    className="absolute top-[-9px] left-4 px-1 bg-white text-[color:var(--1-tokens-color-modes-input-primary-default-placeholder-label)] text-[length:var(--label-smaller-font-size)] font-label-smaller font-[number:var(--label-smaller-font-weight)] tracking-[var(--label-smaller-letter-spacing)] leading-[var(--label-smaller-line-height)] [font-style:var(--label-smaller-font-style)]"
                  >
                    {t("clientSettings.email", "Email")}
                  </label>
                </div>
              </div>
            </div>

            <div className="relative">
              <Input
                className="w-full pt-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-v)] pr-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-h)] pb-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-v)] pl-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-h)] bg-[color:var(--1-tokens-color-modes-input-primary-default-background)] rounded-[var(--2-tokens-screen-modes-input-border-radius)] border-[color:var(--1-tokens-color-modes-input-primary-default-border)]"
                id="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isSubmitting}
                placeholder="Leave blank to keep current password"
              />
              <label
                htmlFor="password"
                className="absolute top-[-9px] left-4 px-1 bg-white text-[color:var(--1-tokens-color-modes-input-primary-default-placeholder-label)] text-[length:var(--label-smaller-font-size)] font-label-smaller font-[number:var(--label-smaller-font-weight)] tracking-[var(--label-smaller-letter-spacing)] leading-[var(--label-smaller-line-height)] [font-style:var(--label-smaller-font-style)]"
              >
                {t("clientSettings.password", "Password")}
              </label>
            </div>

            <div className="space-y-2">
              <Label>{t("clientSettings.language", "Language")}</Label>
              <Select
                value={formData.language}
                onValueChange={handleLanguageChange}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t(
                      "clientSettings.selectLanguage",
                      "Select Language"
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Vertical Separator */}
        <div className="flex items-stretch py-4">
          <Separator orientation="vertical" className="mx-2" />
        </div>

        {/* Right Side - Privacy & Notifications */}
        <div className="flex-1 pl-6">
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">
                {t("clientSettings.privacySettings", "Privacy Settings")}
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>
                      {t("clientSettings.gdprConsent", "GDPR Consent")}
                    </Label>
                    <p className="text-sm text-gray-500">
                      {t(
                        "clientSettings.gdprDescription",
                        "Allow us to process your personal data"
                      )}
                    </p>
                  </div>
                  <Switch
                    checked={formData.gdpr_consent}
                    onCheckedChange={() => handleToggleChange("gdpr_consent")}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>
                      {t(
                        "clientSettings.marketingConsent",
                        "Marketing Communications"
                      )}
                    </Label>
                    <p className="text-sm text-gray-500">
                      {t(
                        "clientSettings.marketingDescription",
                        "Receive marketing communications from us"
                      )}
                    </p>
                  </div>
                  <Switch
                    checked={formData.marketing_consent}
                    onCheckedChange={() =>
                      handleToggleChange("marketing_consent")
                    }
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="text-lg font-semibold">
                {t(
                  "clientSettings.notificationSettings",
                  "Notification Settings"
                )}
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>
                      {t(
                        "clientSettings.emailNotifications",
                        "Email Notifications"
                      )}
                    </Label>
                    <p className="text-sm text-gray-500">
                      {t(
                        "clientSettings.emailNotificationsDescription",
                        "Receive important updates via email"
                      )}
                    </p>
                  </div>
                  <Switch
                    checked={formData.email_notifications}
                    onCheckedChange={() =>
                      handleToggleChange("email_notifications")
                    }
                    disabled={isSubmitting}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>
                      {t(
                        "clientSettings.pushNotifications",
                        "Push Notifications"
                      )}
                    </Label>
                    <p className="text-sm text-gray-500">
                      {t(
                        "clientSettings.pushNotificationsDescription",
                        "Receive real-time notifications in your browser"
                      )}
                    </p>
                  </div>
                  <Switch
                    checked={formData.push_notifications}
                    onCheckedChange={() =>
                      handleToggleChange("push_notifications")
                    }
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          </div>
        </div>
      </div>

      {/* Save Button Section */}
      <div className="w-full mt-auto pt-12">
        <Separator className="mb-6" />
        <div className="flex justify-end" style={buttonStyles}>
          <Button
            className={`w-fit flex items-center justify-center gap-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-gap)] py-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-v)] px-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-h)] bg-[#00b85b] text-white rounded-[var(--2-tokens-screen-modes-button-border-radius)] border border-solid border-[#1a8563] ${
              isSubmitting || isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            onClick={handleSubmit}
            disabled={isSubmitting || isLoading}
            style={{
              backgroundColor: "var(--primary-color)",
              color: "var(--primary-text-color)",
              borderColor: "var(--primary-color)",
            }}
          >
            <Save
              className={`w-4 h-4 ${
                isSubmitting || isLoading ? "animate-pulse" : ""
              }`}
            />
            <span className="font-label-medium font-[number:var(--label-medium-font-weight)] text-[color:var(--1-tokens-color-modes-button-primary-default-text)] text-[length:var(--label-medium-font-size)] tracking-[var(--label-medium-letter-spacing)] leading-[var(--label-medium-line-height)] [font-style:var(--label-medium-font-style)]">
              {isSubmitting || isLoading
                ? t("clientSettings.saving", "Saving...")
                : t("clientSettings.save", "Save")}
            </span>
          </Button>
        </div>
      </div>
    </main>
  );
};

export default ClientSettings;
