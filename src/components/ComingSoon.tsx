import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Timer, Construction } from "lucide-react";
import { useCompanyColors } from "../hooks/useCompanyColors";

interface ComingSoonProps {
  variant?: "superadmin" | "client";
}

const ComingSoon: React.FC<ComingSoonProps> = ({ variant = "client" }) => {
  const { t } = useTranslation();
  const { buttonStyles } = useCompanyColors();

  // Superadmin uses #07515f as primary color with #e9fffd as light variant
  // Client uses CSS var(--primary-color) with var(--primary-light-color) as light variant
  const colorScheme =
    variant === "superadmin"
      ? {
          primary: "#07515f",
          light: "#e9fffd",
          gradient: "from-[#e9fffd] via-white to-[#f0fffe]",
        }
      : buttonStyles;

  return (
    <div
      className={`flex flex-col items-center justify-center h-full w-full bg-gradient-to-br ${
        variant === "superadmin"
          ? colorScheme.gradient
          : "from-[var(--primary-light-color)] via-white to-[var(--primary-light-color)]"
      } p-8`}
      style={variant === "client" ? buttonStyles : undefined}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl mx-auto"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <Construction
              className="w-24 h-24 opacity-90"
              style={
                variant === "client"
                  ? { color: "var(--primary-color)" }
                  : { color: colorScheme.primary }
              }
            />
            <motion.div
              animate={{
                rotate: 360,
                transition: { duration: 20, repeat: Infinity, ease: "linear" },
              }}
              className="absolute top-0 left-0 w-full h-full"
            >
              <Timer
                className="w-8 h-8 absolute -top-2 -right-2"
                style={
                  variant === "client"
                    ? { color: "var(--primary-color)" }
                    : { color: colorScheme.primary }
                }
              />
            </motion.div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-4xl font-bold mb-6"
          style={
            variant === "client"
              ? { color: "var(--primary-color)" }
              : { color: colorScheme.primary }
          }
        >
          {t("comingSoon.title", "Coming Soon")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-lg text-gray-600 mb-8"
        >
          {t(
            "comingSoon.description",
            "We're working hard to bring you something amazing. This feature is currently under development."
          )}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex justify-center space-x-2"
        >
          <div
            className="h-2 w-2 rounded-full animate-pulse"
            style={
              variant === "client"
                ? { backgroundColor: "var(--primary-color)" }
                : { backgroundColor: colorScheme.primary }
            }
          />
          <div
            className="h-2 w-2 rounded-full animate-pulse delay-100"
            style={
              variant === "client"
                ? { backgroundColor: "var(--primary-color)" }
                : { backgroundColor: colorScheme.primary }
            }
          />
          <div
            className="h-2 w-2 rounded-full animate-pulse delay-200"
            style={
              variant === "client"
                ? { backgroundColor: "var(--primary-color)" }
                : { backgroundColor: colorScheme.primary }
            }
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ComingSoon;
