import React from "react";
import { useAppSelector } from "../store/store";
import Loader from "./Loader";
import { motion, AnimatePresence } from "framer-motion";

const GlobalLoader: React.FC = () => {
  const isLoading = useAppSelector((state) => state.auth.isLoading);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Backdrop with gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-[2px]" />

          {/* Glass effect container */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />

          {/* Subtle border gradient */}
          <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-br from-white/20 to-white/5">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent" />
          </div>

          {/* Loader content */}
          <div className="relative h-full w-full">
            <Loader />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlobalLoader;
