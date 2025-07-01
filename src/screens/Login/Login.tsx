import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { Eye, EyeOff } from "lucide-react";
import {
  login,
  loginPage,
  forgotPassword,
} from "../../store/features/authSlice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import { useTranslation } from "react-i18next";
import { getHost, isWarehouseHostname } from "../../utils/hostUtils";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    isLoading,
    error,
    company,
    companyColor,
    companyLogo,
    companyTextColor,
    forgotPasswordEmailSent,
  } = useAppSelector((state) => state.auth);
  const { t } = useTranslation();
  const domain = getHost();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  useEffect(() => {
    dispatch(loginPage(domain));
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(login({ email, password, company: domain })).unwrap();
      navigate("/"); // Redirect to dashboard after successful login
      window.location.reload(); // Refresh the page
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain || !email) return;

    try {
      await dispatch(forgotPassword({ dnsPrefix: domain, email })).unwrap();
    } catch (error) {
      console.error("Forgot password failed:", error);
    }
  };

  const defaultColor = "#07515f";
  const defaultTextColor = "#ffffff";
  const warehouse = isWarehouseHostname();
  // Convert hex to rgba for hover effect
  const getHoverColor = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, 0.9)`;
  };

  return (
    <div className="flex h-screen">
      {/* Left Panel */}
      <div
        className="hidden md:flex md:w-2/5 flex-col items-center justify-center relative overflow-hidden"
        style={{
          backgroundColor: warehouse
            ? companyColor || defaultColor
            : defaultColor,
        }}
      >
        <div className="flex flex-col items-center justify-center w-full">
          <div className="inline-flex flex-col items-center">
            <img
              className=""
              alt="Logo"
              src={
                warehouse
                  ? companyLogo || "/img/Logo_cb_svg.svg"
                  : "/img/Logo_cb_svg.svg"
              }
            />
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-3/5 bg-[#f9fafb] flex items-center justify-center p-6">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">
              {isForgotPassword ? t("forgotPassword.title") : "Bonjour !"}
            </h2>
            <p className="text-[#475569]">
              {isForgotPassword
                ? t("forgotPassword.description")
                : "Bienvenue sur votre espace administrateur"}
            </p>
          </div>

          {isForgotPassword ? (
            <form className="space-y-4" onSubmit={handleForgotPasswordSubmit}>
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-[#cbd5e1] rounded-md"
                  required
                />
              </div>
              <div className="w-full flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(false)}
                  className="text-[#6B7280] hover:text-[#4B5563] text-sm"
                >
                  {t("forgotPassword.backToLogin")}
                </button>
              </div>
              <Button
                type="submit"
                disabled={isLoading || !email}
                className="w-full py-3 rounded-md transition-colors hover:opacity-90"
                style={{
                  backgroundColor: companyColor || defaultColor,
                  color: companyTextColor || defaultTextColor,
                }}
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
              {forgotPasswordEmailSent && (
                <div className="text-green-500 text-sm w-full text-center">
                  {t("forgotPassword.emailSent")}
                </div>
              )}
            </form>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-[#cbd5e1] rounded-md"
                  required
                />
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-[#cbd5e1] rounded-md pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="w-full flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  className="text-[#6B7280] hover:text-[#4B5563] text-sm"
                >
                  {t("clientLogin.forgotPassword")}
                </button>
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-md transition-colors hover:opacity-90"
                style={{
                  backgroundColor: companyColor || defaultColor,
                  color: companyTextColor || defaultTextColor,
                }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader size="sm" className="mr-2" />
                    {t("common.loading")}
                  </div>
                ) : (
                  t("login.submit")
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
