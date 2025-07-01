import { motion } from "framer-motion";
import { AlertCircle, Mail } from "lucide-react";
import { Button } from "./ui/button";
import { useAppSelector } from "../store/store";
import { getHost, isWarehouseHostname } from "../utils/hostUtils";
import { useTranslation } from "react-i18next";

interface CompanyNotRegisteredProps {
  adminEmail?: string;
  className?: string;
  error?: any;
}

const CompanyNotRegistered: React.FC<CompanyNotRegisteredProps> = ({
  adminEmail = "support@cottonblue.com",
  className = "",
  error,
}) => {
  const { t } = useTranslation();
  const { companyColor, companyLogo, companyTextColor } = useAppSelector(
    (state) => state.auth
  );
  const defaultColor = "#07515f";
  const defaultTextColor = "#ffffff";
  const warehouse = isWarehouseHostname();
  const domain = getHost();
  console.log({ error });
  const handleContactAdmin = () => {
    window.location.href = `mailto:${adminEmail}`;
  };

  return (
    <div className="flex h-screen">
      {/* Left Panel - Matches Login.tsx */}
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

      {/* Right Panel - Error Content */}
      <div className="w-full md:w-3/5 bg-[#f9fafb] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`w-full max-w-md p-8 bg-white rounded-lg shadow-sm ${className}`}
        >
          <div className="mb-8">
            <div className="w-12 h-12 mx-auto mb-6 text-[#475569]">
              <AlertCircle className="w-full h-full" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-center">
              {t("companyNotRegistered.title")}
            </h2>
            {error && <p className="text-[#475569] text-center">{error}</p>}
          </div>

          <div className="flex items-center justify-center space-x-2 mb-6">
            <Mail className="w-5 h-5 text-[#475569]" />
            <span className="text-[#475569]">{adminEmail}</span>
          </div>

          <Button
            onClick={handleContactAdmin}
            className="w-full py-3 rounded-md transition-colors hover:opacity-90"
            style={{
              backgroundColor: companyColor || defaultColor,
              color: companyTextColor || defaultTextColor,
            }}
          >
            {t("companyNotRegistered.contactAdmin")}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default CompanyNotRegistered;
