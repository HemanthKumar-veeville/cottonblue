import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  placeholder: string;
  showPassword: boolean;
  onTogglePassword: () => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  name,
  value,
  onChange,
  placeholder,
  showPassword,
  onTogglePassword,
}) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(name, e.target.value);
    },
    [onChange, name]
  );

  return (
    <div className="relative w-full">
      <Input
        type={!value ? "text" : showPassword ? "text" : "password"}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="flex w-full h-10 px-3 py-2 bg-white text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent pr-10"
      />
      {value && (
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none"
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      )}
    </div>
  );
};

interface PasswordSectionProps {
  onPasswordUpdate: (passwords: {
    newPassword: string;
    confirmPassword: string;
  }) => Promise<void>;
  title?: string;
  description?: string;
}

const PasswordSection: React.FC<PasswordSectionProps> = ({
  onPasswordUpdate,
  title,
  description,
}) => {
  const { t } = useTranslation();

  const [showPasswordUpdate, setShowPasswordUpdate] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordState, setPasswordState] = useState({
    newPassword: "",
    confirmPassword: "",
    showNewPassword: false,
    showConfirmPassword: false,
  });

  const handlePasswordChange = useCallback((name: string, value: string) => {
    setPasswordState((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null); // Clear error when user types
  }, []);

  const togglePasswordVisibility = useCallback(
    (field: "newPassword" | "confirmPassword") => {
      setPasswordState((prev) => ({
        ...prev,
        [field === "newPassword" ? "showNewPassword" : "showConfirmPassword"]:
          !prev[
            field === "newPassword" ? "showNewPassword" : "showConfirmPassword"
          ],
      }));
    },
    []
  );

  const handlePasswordUpdate = async () => {
    const { newPassword, confirmPassword } = passwordState;
    if (newPassword && confirmPassword && newPassword === confirmPassword) {
      setIsUpdating(true);
      setError(null);
      try {
        await onPasswordUpdate({ newPassword, confirmPassword });
        // Reset form on success
        setPasswordState((prev) => ({
          ...prev,
          newPassword: "",
          confirmPassword: "",
        }));
        setShowPasswordUpdate(false);
      } catch (err) {
        setError(t("settings.passwordUpdateError"));
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const isUpdateDisabled = useCallback(() => {
    const { newPassword, confirmPassword } = passwordState;
    return (
      !newPassword ||
      !confirmPassword ||
      newPassword !== confirmPassword ||
      isUpdating
    );
  }, [passwordState, isUpdating]);

  return (
    <Card className="w-full bg-white shadow-sm hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden border border-gray-100">
      <CardContent className="p-8">
        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">
              {t("settings.changePassword")}
            </h3>
            <p className="text-sm text-gray-500">
              {t("settings.changePasswordDescription")}
            </p>
          </div>
          <Switch
            checked={showPasswordUpdate}
            onCheckedChange={setShowPasswordUpdate}
          />
        </div>

        {showPasswordUpdate && (
          <div className="space-y-4 mt-4">
            <div className="flex items-center gap-2">
              <PasswordInput
                name="newPassword"
                value={passwordState.newPassword}
                onChange={handlePasswordChange}
                placeholder={t("settings.newPassword")}
                showPassword={passwordState.showNewPassword}
                onTogglePassword={() => togglePasswordVisibility("newPassword")}
              />

              <PasswordInput
                name="confirmPassword"
                value={passwordState.confirmPassword}
                onChange={handlePasswordChange}
                placeholder={t("settings.confirmPassword")}
                showPassword={passwordState.showConfirmPassword}
                onTogglePassword={() =>
                  togglePasswordVisibility("confirmPassword")
                }
              />
            </div>
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
            <div className="flex justify-end">
              <Button
                onClick={handlePasswordUpdate}
                disabled={isUpdateDisabled()}
                className="px-4 py-2 text-white font-medium rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: "var(--primary-color)",
                }}
              >
                {isUpdating
                  ? t("common.updating")
                  : t("settings.updatePassword")}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PasswordSection;
