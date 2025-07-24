import React from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector, useAppDispatch } from "../../store/store";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import PasswordSection from "../../components/PasswordSection/PasswordSection";
import { modifyUserSettings } from "../../store/features/authSlice";
import { cn } from "../../lib/utils";
import {
  User,
  Mail,
  Building2,
  Settings2,
  Shield,
  Crown,
  Lock,
} from "lucide-react";

const SuperAdminSettings: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handlePasswordUpdate = async ({
    newPassword,
    confirmPassword,
  }: {
    newPassword: string;
    confirmPassword: string;
  }) => {
    if (newPassword === confirmPassword) {
      try {
        await dispatch(
          modifyUserSettings({
            dnsPrefix: "admin",
            newPassword,
          })
        ).unwrap();
        // load the page again
        window.location.reload();
      } catch (error) {
        // Propagate error to PasswordSection component
        throw error;
      }
    }
  };

  const ProfileSection = () => {
    const profileDetails = [
      {
        icon: <User className="w-5 h-5" />,
        label: t("settings.userName"),
        value: user?.user_name || t("clientProduct.notAvailable"),
      },
      {
        icon: <Mail className="w-5 h-5" />,
        label: t("settings.email"),
        value: user?.user_email || t("clientProduct.notAvailable"),
      },
      {
        icon: <Crown className="w-5 h-5" />,
        label: t("settings.role"),
        value: user?.user_role || t("clientProduct.notAvailable"),
      },
      {
        icon: <Shield className="w-5 h-5" />,
        label: t("settings.permissions"),
        value: "Super Admin",
      },
    ];

    return (
      <Card className="w-full bg-white shadow-sm hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden border border-gray-100">
        <CardContent className="p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#e9fffd]">
                <User className="w-6 h-6 text-[#07515f]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {t("settings.profile")}
                </h2>
                <p className="text-sm text-gray-500">
                  {t("settings.profileDescription")}
                </p>
              </div>
            </div>
            <Badge
              variant="active"
              className={cn(
                "ml-auto",
                user?.active
                  ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                  : "bg-red-50 text-red-600 border-red-200",
                "border px-3 py-1.5 font-medium"
              )}
            >
              {user?.active ? "Active" : "Inactive"}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {profileDetails.map((detail, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 hover:bg-[#e9fffd] group transition-all duration-200"
              >
                <div className="text-gray-400 group-hover:text-[#07515f] transition-colors duration-200 mt-1">
                  {detail.icon}
                </div>
                <div className="flex-1">
                  <span className="font-medium text-gray-900 text-sm block font-label-medium mb-1">
                    {detail.label}
                  </span>
                  <span className="text-gray-600 font-label-small text-sm tracking-wide leading-5 break-all">
                    {detail.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const SecuritySection: React.FC = () => {
    return (
      <Card className="w-full bg-white shadow-sm hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden border border-gray-100">
        <CardContent className="p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-[#e9fffd]">
              <Lock className="w-6 h-6 text-[#07515f]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {t("settings.security")}
              </h2>
              <p className="text-sm text-gray-500">
                {t("settings.securityDescription")}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <PasswordSection onPasswordUpdate={handlePasswordUpdate} />
          </div>
        </CardContent>
      </Card>
    );
  };

  const AdminSection = () => {
    const adminDetails = [
      {
        icon: <Building2 className="w-5 h-5" />,
        label: t("superAdminSettings.adminRole"),
        value: "Super Administrator",
      },
      {
        icon: <Settings2 className="w-5 h-5" />,
        label: t("superAdminSettings.accessLevel"),
        value: "Full System Access",
      },
    ];

    return (
      <Card className="w-full bg-white shadow-sm hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden border border-gray-100">
        <CardContent className="p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-[#e9fffd]">
              <Settings2 className="w-6 h-6 text-[#07515f]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {t("superAdminSettings.adminSettings")}
              </h2>
              <p className="text-sm text-gray-500">
                {t("superAdminSettings.adminDescription")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {adminDetails.map((detail, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 hover:bg-[#e9fffd] group transition-all duration-200"
              >
                <div className="text-gray-400 group-hover:text-[#07515f] transition-colors duration-200 mt-1">
                  {detail.icon}
                </div>
                <div className="flex-1">
                  <span className="font-medium text-gray-900 text-sm block font-label-medium mb-1">
                    {detail.label}
                  </span>
                  <span className="text-gray-600 font-label-small text-sm tracking-wide leading-5">
                    {detail.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 lg:p-12">
            <div className="space-y-8 max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="font-bold text-3xl text-gray-900 mb-3 tracking-tight font-heading-h1">
                  {t("settings.title")}
                </h1>
                <p className="text-gray-500 max-w-2xl mx-auto">
                  {t("settings.description")}
                </p>
              </div>

              <ProfileSection />
              <SecuritySection />
              <AdminSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminSettings;
