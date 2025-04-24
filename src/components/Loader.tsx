import React from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

const sizeMap = {
  sm: "w-4 h-4",
  md: "w-8 h-8",
  lg: "w-12 h-12",
};

const Loader: React.FC<LoaderProps> = ({ size = "md", text, className }) => {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "flex flex-col items-center justify-center h-full w-full",
        className
      )}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.3,
          ease: "easeOut",
        }}
        className="relative"
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-gray-400/20 rounded-full blur-xl"
        />
        <Loader2 className={cn("animate-spin text-gray-600", sizeMap[size])} />
      </motion.div>
      {text && (
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-3 text-sm text-gray-500 font-medium"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default Loader;
