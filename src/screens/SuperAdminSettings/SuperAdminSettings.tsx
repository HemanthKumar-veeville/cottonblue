import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Save, Mail, Settings2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Checkbox } from "../../components/ui/checkbox";
import { Label } from "../../components/ui/label";
import { Separator } from "../../components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

interface SuperAdminSettingsData {
  smtpHost: string;
  smtpPort: string;
  smtpUsername: string;
  smtpPassword: string;
  senderEmail: string;
  maintenanceMode: boolean;
  enableRegistration: boolean;
  enableNotifications: boolean;
  emailNotifications: boolean;
  autoBackup: boolean;
  debugMode: boolean;
}

function SuperAdminSettings() {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<SuperAdminSettingsData>({
    smtpHost: "",
    smtpPort: "",
    smtpUsername: "",
    smtpPassword: "",
    senderEmail: "",
    maintenanceMode: false,
    enableRegistration: false,
    enableNotifications: true,
    emailNotifications: true,
    autoBackup: true,
    debugMode: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleToggleChange = (id: keyof SuperAdminSettingsData) => {
    setFormData((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // TODO: Implement API call to save settings
      console.log("Saving settings:", formData);
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex flex-col w-full gap-8 p-6 bg-white rounded-lg">
      <section className="flex flex-col gap-[var(--2-tokens-screen-modes-common-spacing-m)] w-full">
        <header>
          <h3 className="font-heading-h3 text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] text-[length:var(--heading-h3-font-size)] tracking-[var(--heading-h3-letter-spacing)] leading-[var(--heading-h3-line-height)] font-[number:var(--heading-h3-font-weight)] [font-style:var(--heading-h3-font-style)]">
            {t("superAdminSettings.title", "Super Admin Settings")}
          </h3>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email Configuration */}
          <Card className="border-[color:var(--1-tokens-color-modes-button-secondary-default-border)] rounded-[var(--2-tokens-screen-modes-button-border-radius)]">
            <CardHeader className="flex flex-row items-center gap-4">
              <Mail className="w-6 h-6 text-[color:var(--1-tokens-color-modes-button-secondary-default-icon)] mt-1" />
              <CardTitle className="font-heading-h3 text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] text-[length:var(--heading-h3-font-size)]">
                {t("superAdminSettings.emailConfig", "Email Configuration")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Input
                  id="smtpHost"
                  value={formData.smtpHost}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  placeholder="smtp.example.com"
                  className="pl-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-h)] pr-12 py-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-v)] bg-[color:var(--1-tokens-color-modes-input-primary-default-background)] border-[color:var(--1-tokens-color-modes-input-primary-default-border)] rounded-[var(--2-tokens-screen-modes-input-border-radius)]"
                />
                <label
                  htmlFor="smtpHost"
                  className="absolute top-[-9px] left-4 px-1 bg-white text-[color:var(--1-tokens-color-modes-input-primary-default-placeholder-label)] text-[length:var(--label-smaller-font-size)] font-label-smaller font-[number:var(--label-smaller-font-weight)] tracking-[var(--label-smaller-letter-spacing)] leading-[var(--label-smaller-line-height)] [font-style:var(--label-smaller-font-style)]"
                >
                  {t("superAdminSettings.smtpHost", "SMTP Host")}
                </label>
              </div>

              <div className="relative">
                <Input
                  id="smtpPort"
                  value={formData.smtpPort}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  placeholder="587"
                  className="pl-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-h)] pr-12 py-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-v)] bg-[color:var(--1-tokens-color-modes-input-primary-default-background)] border-[color:var(--1-tokens-color-modes-input-primary-default-border)] rounded-[var(--2-tokens-screen-modes-input-border-radius)]"
                />
                <label
                  htmlFor="smtpPort"
                  className="absolute top-[-9px] left-4 px-1 bg-white text-[color:var(--1-tokens-color-modes-input-primary-default-placeholder-label)] text-[length:var(--label-smaller-font-size)] font-label-smaller font-[number:var(--label-smaller-font-weight)] tracking-[var(--label-smaller-letter-spacing)] leading-[var(--label-smaller-line-height)] [font-style:var(--label-smaller-font-style)]"
                >
                  {t("superAdminSettings.smtpPort", "SMTP Port")}
                </label>
              </div>

              <div className="relative">
                <Input
                  id="smtpUsername"
                  value={formData.smtpUsername}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  placeholder="username@example.com"
                  className="pl-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-h)] pr-12 py-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-v)] bg-[color:var(--1-tokens-color-modes-input-primary-default-background)] border-[color:var(--1-tokens-color-modes-input-primary-default-border)] rounded-[var(--2-tokens-screen-modes-input-border-radius)]"
                />
                <label
                  htmlFor="smtpUsername"
                  className="absolute top-[-9px] left-4 px-1 bg-white text-[color:var(--1-tokens-color-modes-input-primary-default-placeholder-label)] text-[length:var(--label-smaller-font-size)] font-label-smaller font-[number:var(--label-smaller-font-weight)] tracking-[var(--label-smaller-letter-spacing)] leading-[var(--label-smaller-line-height)] [font-style:var(--label-smaller-font-style)]"
                >
                  {t("superAdminSettings.smtpUsername", "SMTP Username")}
                </label>
              </div>

              <div className="relative">
                <Input
                  id="smtpPassword"
                  type="password"
                  value={formData.smtpPassword}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  placeholder="••••••••"
                  className="pl-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-h)] pr-12 py-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-v)] bg-[color:var(--1-tokens-color-modes-input-primary-default-background)] border-[color:var(--1-tokens-color-modes-input-primary-default-border)] rounded-[var(--2-tokens-screen-modes-input-border-radius)]"
                />
                <label
                  htmlFor="smtpPassword"
                  className="absolute top-[-9px] left-4 px-1 bg-white text-[color:var(--1-tokens-color-modes-input-primary-default-placeholder-label)] text-[length:var(--label-smaller-font-size)] font-label-smaller font-[number:var(--label-smaller-font-weight)] tracking-[var(--label-smaller-letter-spacing)] leading-[var(--label-smaller-line-height)] [font-style:var(--label-smaller-font-style)]"
                >
                  {t("superAdminSettings.smtpPassword", "SMTP Password")}
                </label>
              </div>

              <div className="relative">
                <Input
                  id="senderEmail"
                  type="email"
                  value={formData.senderEmail}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  placeholder="noreply@example.com"
                  className="pl-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-h)] pr-12 py-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-v)] bg-[color:var(--1-tokens-color-modes-input-primary-default-background)] border-[color:var(--1-tokens-color-modes-input-primary-default-border)] rounded-[var(--2-tokens-screen-modes-input-border-radius)]"
                />
                <label
                  htmlFor="senderEmail"
                  className="absolute top-[-9px] left-4 px-1 bg-white text-[color:var(--1-tokens-color-modes-input-primary-default-placeholder-label)] text-[length:var(--label-smaller-font-size)] font-label-smaller font-[number:var(--label-smaller-font-weight)] tracking-[var(--label-smaller-letter-spacing)] leading-[var(--label-smaller-line-height)] [font-style:var(--label-smaller-font-style)]"
                >
                  {t("superAdminSettings.senderEmail", "Sender Email")}
                </label>
              </div>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card className="border-[color:var(--1-tokens-color-modes-button-secondary-default-border)] rounded-[var(--2-tokens-screen-modes-button-border-radius)]">
            <CardHeader className="flex flex-row items-center gap-4">
              <Settings2 className="w-6 h-6 text-[color:var(--1-tokens-color-modes-button-secondary-default-icon)] mt-1" />
              <CardTitle className="font-heading-h3 text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] text-[length:var(--heading-h3-font-size)]">
                {t("superAdminSettings.systemSettings", "System Settings")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Checkbox
                  id="maintenanceMode"
                  checked={formData.maintenanceMode}
                  onCheckedChange={() => handleToggleChange("maintenanceMode")}
                  disabled={isSubmitting}
                  className="h-5 w-5 border-gray-300 data-[state=checked]:bg-[#07515f] data-[state=checked]:border-[#07515f]"
                />
                <div className="space-y-0.5">
                  <Label
                    htmlFor="maintenanceMode"
                    className="font-label-medium text-[color:var(--1-tokens-color-modes-input-primary-default-text)] text-[length:var(--label-medium-font-size)] tracking-[var(--label-medium-letter-spacing)] leading-[var(--label-medium-line-height)] whitespace-nowrap"
                  >
                    {t(
                      "superAdminSettings.maintenanceMode",
                      "Maintenance Mode"
                    )}
                  </Label>
                  <p className="text-[color:var(--1-tokens-color-modes-input-primary-default-placeholder-label)] text-[length:var(--label-smaller-font-size)] font-label-smaller">
                    {t(
                      "superAdminSettings.maintenanceModeDesc",
                      "Put the site in maintenance mode"
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Checkbox
                  id="enableRegistration"
                  checked={formData.enableRegistration}
                  onCheckedChange={() =>
                    handleToggleChange("enableRegistration")
                  }
                  disabled={isSubmitting}
                  className="h-5 w-5 border-gray-300 data-[state=checked]:bg-[#07515f] data-[state=checked]:border-[#07515f]"
                />
                <div className="space-y-0.5">
                  <Label
                    htmlFor="enableRegistration"
                    className="font-label-medium text-[color:var(--1-tokens-color-modes-input-primary-default-text)] text-[length:var(--label-medium-font-size)] tracking-[var(--label-medium-letter-spacing)] leading-[var(--label-medium-line-height)] whitespace-nowrap"
                  >
                    {t("superAdminSettings.registration", "User Registration")}
                  </Label>
                  <p className="text-[color:var(--1-tokens-color-modes-input-primary-default-placeholder-label)] text-[length:var(--label-smaller-font-size)] font-label-smaller">
                    {t(
                      "superAdminSettings.registrationDesc",
                      "Allow new user registrations"
                    )}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center space-x-4">
                <Checkbox
                  id="enableNotifications"
                  checked={formData.enableNotifications}
                  onCheckedChange={() =>
                    handleToggleChange("enableNotifications")
                  }
                  disabled={isSubmitting}
                  className="h-5 w-5 border-gray-300 data-[state=checked]:bg-[#07515f] data-[state=checked]:border-[#07515f]"
                />
                <div className="space-y-0.5">
                  <Label
                    htmlFor="enableNotifications"
                    className="font-label-medium text-[color:var(--1-tokens-color-modes-input-primary-default-text)] text-[length:var(--label-medium-font-size)] tracking-[var(--label-medium-letter-spacing)] leading-[var(--label-medium-line-height)] whitespace-nowrap"
                  >
                    {t("superAdminSettings.notifications", "Notifications")}
                  </Label>
                  <p className="text-[color:var(--1-tokens-color-modes-input-primary-default-placeholder-label)] text-[length:var(--label-smaller-font-size)] font-label-smaller">
                    {t(
                      "superAdminSettings.notificationsDesc",
                      "Enable system notifications"
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Checkbox
                  id="emailNotifications"
                  checked={formData.emailNotifications}
                  onCheckedChange={() =>
                    handleToggleChange("emailNotifications")
                  }
                  disabled={isSubmitting}
                  className="h-5 w-5 border-gray-300 data-[state=checked]:bg-[#07515f] data-[state=checked]:border-[#07515f]"
                />
                <div className="space-y-0.5">
                  <Label
                    htmlFor="emailNotifications"
                    className="font-label-medium text-[color:var(--1-tokens-color-modes-input-primary-default-text)] text-[length:var(--label-medium-font-size)] tracking-[var(--label-medium-letter-spacing)] leading-[var(--label-medium-line-height)] whitespace-nowrap"
                  >
                    {t("superAdminSettings.emailNotif", "Email Notifications")}
                  </Label>
                  <p className="text-[color:var(--1-tokens-color-modes-input-primary-default-placeholder-label)] text-[length:var(--label-smaller-font-size)] font-label-smaller">
                    {t(
                      "superAdminSettings.emailNotifDesc",
                      "Send notifications via email"
                    )}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center space-x-4">
                <Checkbox
                  id="autoBackup"
                  checked={formData.autoBackup}
                  onCheckedChange={() => handleToggleChange("autoBackup")}
                  disabled={isSubmitting}
                  className="h-5 w-5 border-gray-300 data-[state=checked]:bg-[#07515f] data-[state=checked]:border-[#07515f]"
                />
                <div className="space-y-0.5">
                  <Label
                    htmlFor="autoBackup"
                    className="font-label-medium text-[color:var(--1-tokens-color-modes-input-primary-default-text)] text-[length:var(--label-medium-font-size)] tracking-[var(--label-medium-letter-spacing)] leading-[var(--label-medium-line-height)] whitespace-nowrap"
                  >
                    {t("superAdminSettings.backup", "Auto Backup")}
                  </Label>
                  <p className="text-[color:var(--1-tokens-color-modes-input-primary-default-placeholder-label)] text-[length:var(--label-smaller-font-size)] font-label-smaller">
                    {t(
                      "superAdminSettings.backupDesc",
                      "Enable automatic system backups"
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Checkbox
                  id="debugMode"
                  checked={formData.debugMode}
                  onCheckedChange={() => handleToggleChange("debugMode")}
                  disabled={isSubmitting}
                  className="h-5 w-5 border-gray-300 data-[state=checked]:bg-[#07515f] data-[state=checked]:border-[#07515f]"
                />
                <div className="space-y-0.5">
                  <Label
                    htmlFor="debugMode"
                    className="font-label-medium text-[color:var(--1-tokens-color-modes-input-primary-default-text)] text-[length:var(--label-medium-font-size)] tracking-[var(--label-medium-letter-spacing)] leading-[var(--label-medium-line-height)] whitespace-nowrap"
                  >
                    {t("superAdminSettings.debug", "Debug Mode")}
                  </Label>
                  <p className="text-[color:var(--1-tokens-color-modes-input-primary-default-placeholder-label)] text-[length:var(--label-smaller-font-size)] font-label-smaller">
                    {t(
                      "superAdminSettings.debugDesc",
                      "Enable debug mode for development"
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end mt-6">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-gap)] py-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-h)] px-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-v)] min-w-[92px] bg-[#07515f] rounded-[var(--2-tokens-screen-modes-nav-tab-border-radius)]"
          >
            <Save className="w-6 h-6" />
            <span className="font-label-smaller text-[length:var(--label-smaller-font-size)] leading-[var(--label-smaller-line-height)] tracking-[var(--label-smaller-letter-spacing)] font-[number:var(--label-smaller-font-weight)] text-[color:var(--1-tokens-color-modes-button-primary-default-text)] [font-style:var(--label-smaller-font-style)]">
              {t("superAdminSettings.saveChanges", "Save Changes")}
            </span>
          </Button>
        </div>
      </section>
    </main>
  );
}

export default SuperAdminSettings;
