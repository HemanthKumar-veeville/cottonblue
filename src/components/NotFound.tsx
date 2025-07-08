import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { isAdminHostname } from "../utils/hostUtils";
import { useTranslation } from "react-i18next";

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (isAdminHostname()) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center px-4"
      >
        <h1 className="text-9xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
          {t("notFound.title")}
        </h2>
        <p className="text-gray-600 mb-8">{t("notFound.description")}</p>
        <div className="relative w-48 h-48 mx-auto mb-8">
          <div className="absolute inset-0 border-8 border-gray-300 rounded-full"></div>
          <div className="absolute inset-4 border-8 border-gray-400 rounded-full"></div>
          <div className="absolute inset-8 border-8 border-gray-500 rounded-full"></div>
        </div>
        <button
          onClick={() => window.history.back()}
          className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
        >
          {t("notFound.button")}
        </button>
      </motion.div>
    </div>
  );
};

export default NotFound;
