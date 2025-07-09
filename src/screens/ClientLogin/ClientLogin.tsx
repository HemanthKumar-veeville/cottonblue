import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  login,
  loginPage,
  forgotPassword,
} from "../../store/features/authSlice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import { getHost } from "../../utils/hostUtils";
import { Eye, EyeOff } from "lucide-react";
import CompanyNotRegistered from "../../components/CompanyNotRegistered";
import { Skeleton } from "../../components/ui/skeleton";

const LogoSection = ({ companyLogo }: { companyLogo: string | null }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <img
        className="w-[300px] h-auto mb-2"
        alt="Company Logo"
        src={companyLogo || "/img/chronodrive_logo.png"}
      />
      <div className="text-[#475569] text-sm">{t("clientLogin.poweredBy")}</div>
    </div>
  );
};

const GreetingSection = ({
  isForgotPassword,
}: {
  isForgotPassword: boolean;
}) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-start gap-[var(--2-tokens-screen-modes-common-spacing-XS)]">
      <h1 className="font-heading-h1 text-[#475569] text-[32px] font-medium leading-[40px] tracking-[-0.4px]">
        {isForgotPassword
          ? t("forgotPassword.title")
          : t("clientLogin.greeting")}
      </h1>
    </div>
  );
};

const LoginInputSection = ({
  email,
  setEmail,
  password,
  setPassword,
  onSubmit,
  isLoading,
  onForgotPasswordClick,
}: {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  onForgotPasswordClick: () => void;
}) => {
  const { companyColor, companyTextColor } = useAppSelector(
    (state) => state.auth
  );
  const [showPassword, setShowPassword] = useState(false);

  const { t } = useTranslation();
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col items-start gap-[var(--2-tokens-screen-modes-common-spacing-m)] w-full"
    >
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t("clientLogin.email")}
        className="flex items-center justify-center gap-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-gap)] py-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-v)] px-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-h)] w-full bg-[color:var(--1-tokens-color-modes-input-primary-default-background)] rounded-[var(--2-tokens-screen-modes-nav-tab-border-radius)] border border-solid border-[color:var(--1-tokens-color-modes-input-primary-default-border)] font-label-medium text-[color:var(--1-tokens-color-modes-input-primary-default-placeholder-label)] text-[length:var(--label-medium-font-size)] tracking-[var(--label-medium-letter-spacing)] leading-[var(--label-medium-line-height)]"
      />

      <div className="relative w-full">
        <Input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t("clientLogin.password")}
          className="flex items-center justify-center gap-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-gap)] py-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-v)] px-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-h)] w-full bg-[color:var(--1-tokens-color-modes-input-primary-default-background)] rounded-[var(--2-tokens-screen-modes-nav-tab-border-radius)] border border-solid border-[color:var(--1-tokens-color-modes-input-primary-default-border)] font-label-medium text-[color:var(--1-tokens-color-modes-input-primary-default-placeholder-label)] text-[length:var(--label-medium-font-size)] tracking-[var(--label-medium-letter-spacing)] leading-[var(--label-medium-line-height)] pr-12"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none"
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5 transition-transform duration-200 ease-in-out" />
          ) : (
            <Eye className="h-5 w-5 transition-transform duration-200 ease-in-out" />
          )}
        </button>
      </div>

      <div className="w-full flex justify-end">
        <button
          type="button"
          onClick={onForgotPasswordClick}
          className="text-[#6B7280] hover:text-[#4B5563] text-sm"
        >
          {t("clientLogin.forgotPassword")}
        </button>
      </div>
      <Button
        type="submit"
        disabled={isLoading}
        style={{
          backgroundColor: companyColor || "#00b85b",
          color: companyTextColor || "#fff",
        }}
        className="w-full py-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-v)] px-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-h)] hover:opacity-90 transition-colors duration-200 rounded-[var(--2-tokens-screen-modes-button-border-radius)] font-label-medium text-[length:var(--label-medium-font-size)] tracking-[var(--label-medium-letter-spacing)] leading-[var(--label-medium-line-height)] disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loader size="sm" className="mr-2" />
            {t("common.loading")}
          </div>
        ) : (
          t("clientLogin.login")
        )}
      </Button>
    </form>
  );
};

const ForgotPasswordInputSection = ({
  email,
  setEmail,
  onSubmit,
  isLoading,
  onBackToLogin,
}: {
  email: string;
  setEmail: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  onBackToLogin: () => void;
}) => {
  const { t } = useTranslation();
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col items-start gap-[var(--2-tokens-screen-modes-common-spacing-m)] w-full"
    >
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t("clientLogin.email")}
        className="flex items-center justify-center gap-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-gap)] py-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-v)] px-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-h)] w-full bg-[color:var(--1-tokens-color-modes-input-primary-default-background)] rounded-[var(--2-tokens-screen-modes-nav-tab-border-radius)] border border-solid border-[color:var(--1-tokens-color-modes-input-primary-default-border)] font-label-medium text-[color:var(--1-tokens-color-modes-input-primary-default-placeholder-label)] text-[length:var(--label-medium-font-size)] tracking-[var(--label-medium-letter-spacing)] leading-[var(--label-medium-line-height)]"
      />
      <div className="w-full flex justify-end">
        <button
          type="button"
          onClick={onBackToLogin}
          className="text-[#6B7280] hover:text-[#4B5563] text-sm"
        >
          {t("forgotPassword.backToLogin")}
        </button>
      </div>
      <Button
        type="submit"
        disabled={isLoading || !email}
        className="w-full py-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-v)] px-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-h)] bg-[#00b85b] hover:bg-[#009e4f] transition-colors duration-200 rounded-[var(--2-tokens-screen-modes-button-border-radius)] font-label-medium text-[color:var(--1-tokens-color-modes-button-primary-default-text)] text-[length:var(--label-medium-font-size)] tracking-[var(--label-medium-letter-spacing)] leading-[var(--label-medium-line-height)] disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loader size="sm" className="mr-2" />
            {t("common.loading")}
          </div>
        ) : (
          t("forgotPassword.sendResetLink")
        )}
      </Button>
    </form>
  );
};

const LoginSkeleton = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-[400px] bg-white rounded-[var(--2-tokens-screen-modes-button-border-radius)]">
        <CardContent className="flex flex-col items-start gap-[var(--2-tokens-screen-modes-common-spacing-XL)] pt-[var(--2-tokens-screen-modes-common-spacing-XL)] pr-[var(--2-tokens-screen-modes-common-spacing-l)] pb-[var(--2-tokens-screen-modes-common-spacing-XL)] pl-[var(--2-tokens-screen-modes-common-spacing-l)]">
          {/* Logo Section */}
          <div className="flex flex-col items-center justify-center w-full">
            <Skeleton className="w-[300px] h-[100px] mb-2" />
            <Skeleton className="w-[150px] h-[20px]" />
          </div>

          <div className="flex flex-col items-start gap-[var(--2-tokens-screen-modes-common-spacing-2xl)] w-full">
            {/* Greeting Section */}
            <div className="flex flex-col items-start gap-[var(--2-tokens-screen-modes-common-spacing-XS)]">
              <Skeleton className="h-[40px] w-[200px]" />
            </div>

            {/* Form Section */}
            <div className="flex flex-col items-start gap-[var(--2-tokens-screen-modes-common-spacing-m)] w-full">
              <Skeleton className="h-[40px] w-full" />
              <Skeleton className="h-[40px] w-full" />
              <div className="w-full flex justify-end">
                <Skeleton className="h-[20px] w-[120px]" />
              </div>
              <Skeleton className="h-[40px] w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function ClientLogin() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    isLoading,
    loginError,
    error,
    company,
    companyLogo,
    forgotPasswordEmailSent,
    companyColor,
    companyTextColor,
  } = useAppSelector((state) => state.auth);
  const { isLoading: userLoading } = useAppSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const dnsPrefix = getHost();

  useEffect(() => {
    dispatch(loginPage(dnsPrefix));
  }, [dispatch, dnsPrefix]);

  const handleLoginSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (!dnsPrefix) return;

    try {
      await dispatch(login({ email, password, company: dnsPrefix })).unwrap();
      navigate("/");
      window.location.reload(); // Refresh the page
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleForgotPasswordSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (!dnsPrefix || !email) return;

    try {
      await dispatch(forgotPassword({ dnsPrefix, email })).unwrap();
    } catch (error) {
      console.error("Forgot password failed:", error);
    }
  };

  if (error) {
    return <CompanyNotRegistered error={error} />;
  }

  if (isLoading || userLoading) {
    return <LoginSkeleton />;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-[400px] bg-white rounded-[var(--2-tokens-screen-modes-button-border-radius)]">
        <CardContent className="flex flex-col items-start gap-[var(--2-tokens-screen-modes-common-spacing-XL)] pt-[var(--2-tokens-screen-modes-common-spacing-XL)] pr-[var(--2-tokens-screen-modes-common-spacing-l)] pb-[var(--2-tokens-screen-modes-common-spacing-XL)] pl-[var(--2-tokens-screen-modes-common-spacing-l)]">
          <LogoSection companyLogo={companyLogo} />
          <div className="flex flex-col items-start gap-[var(--2-tokens-screen-modes-common-spacing-2xl)] w-full">
            <GreetingSection isForgotPassword={isForgotPassword} />
            {isForgotPassword ? (
              <ForgotPasswordInputSection
                email={email}
                setEmail={setEmail}
                onSubmit={handleForgotPasswordSubmit}
                isLoading={isLoading}
                onBackToLogin={() => setIsForgotPassword(false)}
              />
            ) : (
              <LoginInputSection
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                onSubmit={handleLoginSubmit}
                isLoading={isLoading}
                onForgotPasswordClick={() => setIsForgotPassword(true)}
              />
            )}
            {loginError && (
              <div className="text-red-500 text-sm w-full text-center">
                {loginError}
              </div>
            )}
            {error && (
              <div className="text-red-500 text-sm w-full text-center">
                {error}
              </div>
            )}
            {forgotPasswordEmailSent && isForgotPassword && (
              <div className="text-green-500 text-sm w-full text-center">
                {t("forgotPassword.emailSent")}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
