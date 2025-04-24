import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { login, loginPage } from "../../store/features/authSlice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import { useTranslation } from "react-i18next";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error, company, companyColor, companyLogo } =
    useAppSelector((state) => state.auth);
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    dispatch(loginPage("admin"));
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(login({ email, password, company: "admin" })).unwrap();
      navigate("/dashboard"); // Redirect to dashboard after successful login
      window.location.reload(); // Refresh the page
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Panel */}
      <div
        className={`hidden md:flex md:w-2/5 bg-[${"#07515f"}] flex-col items-center justify-center relative overflow-hidden`}
      >
        <div className="flex flex-col items-center justify-center w-full">
          <div className="inline-flex flex-col items-center">
            <img className="" alt="Logo" src={"/img/Logo_cb_svg.svg"} />
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-3/5 bg-[#f9fafb] flex items-center justify-center p-6">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Bonjour !</h2>
            <p className="text-[#475569]">
              Bienvenue sur votre espace administrateur
            </p>
          </div>

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
            <div>
              <Input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-[#cbd5e1] rounded-md"
                required
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#07515f] hover:bg-[#07515f]/90 text-white py-3 rounded-md transition-colors"
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
        </div>
      </div>
    </div>
  );
}
