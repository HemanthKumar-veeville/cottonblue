import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  login,
  loginPage,
  resetPassword,
} from "../../store/features/authSlice";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle } from "lucide-react";
import { Skeleton } from "../../components/ui/skeleton";
import { getHost } from "../../utils/hostUtils";

const LogoSection = ({ companyLogo }: { companyLogo: string | null }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <img
        className="h-12 sm:h-16 md:h-20 object-contain mb-2"
        alt="Company Logo"
        src={companyLogo || "/img/chronodrive_logo.png"}
      />
      <div className="text-sm text-gray-500">{t("clientLogin.poweredBy")}</div>
    </div>
  );
};

const GreetingSection = () => {
  const { t } = useTranslation();
  return (
    <div className="text-center w-full">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
        {t("createPassword.welcome")}
      </h1>
      <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
        {t("createPassword.instruction")}
      </p>
    </div>
  );
};

interface PasswordRequirement {
  key: string;
  met: boolean;
}

const PasswordRequirements = ({
  requirements,
}: {
  requirements: PasswordRequirement[];
}) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-2 mt-4">
      <div className="text-sm font-medium text-gray-700 mb-2">
        {t("createPassword.requirements.title")}
      </div>
      <div className="grid grid-cols-1 gap-2">
        {requirements.map((req, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            {req.met ? (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : (
              <XCircle className="w-4 h-4 text-gray-300" />
            )}
            <span className={req.met ? "text-green-700" : "text-gray-500"}>
              {t(`createPassword.requirements.${req.key}`)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const InputSection = ({
  email,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  onSubmit,
  isLoading,
  passwordRequirements,
}: {
  email: string;
  password: string;
  setPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  passwordRequirements: PasswordRequirement[];
}) => {
  const { t } = useTranslation();

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col items-start gap-6 w-full"
    >
      <div className="w-full">
        <div className="text-sm font-medium text-gray-700 mb-1">
          {t("common.email")}
        </div>
        <div className="flex items-center gap-2 py-3 px-4 w-full bg-gray-50 rounded-lg border border-gray-100">
          <div className="font-medium text-gray-900 break-all">{email}</div>
        </div>
      </div>

      <div className="w-full">
        <div className="text-sm font-medium text-gray-700 mb-1">
          {t("createPassword.newPassword")}
        </div>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t("createPassword.enterPassword")}
          className="w-full bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
        />
        <PasswordRequirements requirements={passwordRequirements} />
      </div>

      <div className="w-full">
        <div className="text-sm font-medium text-gray-700 mb-1">
          {t("createPassword.confirmPassword")}
        </div>
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder={t("createPassword.reenterPassword")}
          className="w-full bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading || !passwordRequirements.every((req) => req.met)}
        className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Skeleton className="h-5 w-32 bg-white/20" />
          </div>
        ) : (
          t("createPassword.createAccount")
        )}
      </Button>
    </form>
  );
};

export default function CreatePassword() {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  const id = searchParams.get("id");
  const company_logo = searchParams.get("company_logo");
  const company_name = searchParams.get("company_name");
  const role = searchParams.get("role");

  const navigate = useNavigate();
  const { isLoading, error, companyLogo } = useAppSelector(
    (state) => state.auth
  );

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dnsPrefix = getHost();

  const passwordRequirements = [
    {
      key: "length",
      met: password.length >= 8,
    },
    {
      key: "uppercase",
      met: /[A-Z]/.test(password),
    },
    {
      key: "lowercase",
      met: /[a-z]/.test(password),
    },
    {
      key: "number",
      met: /\d/.test(password),
    },
    {
      key: "special",
      met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
    {
      key: "match",
      met: password === confirmPassword && password.length > 0,
    },
  ];

  useEffect(() => {
    dispatch(loginPage(dnsPrefix));
  }, [dispatch, dnsPrefix]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (!dnsPrefix || !email) return;
    if (password !== confirmPassword) return;
    if (!passwordRequirements.every((req) => req.met)) return;

    try {
      await dispatch(
        resetPassword({
          dnsPrefix,
          userId: id || "",
          token: token || "",
          newPassword: password,
        })
      ).unwrap();
      navigate("/");
    } catch (error) {
      console.error("Password creation failed:", error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-xl mx-auto">
          <div className="mb-12">
            <LogoSection companyLogo={company_logo || companyLogo} />
          </div>

          <div className="space-y-8">
            <GreetingSection />

            <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm border border-gray-100">
              <InputSection
                email={email || ""}
                password={password}
                setPassword={setPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                passwordRequirements={passwordRequirements}
              />

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm text-center">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
