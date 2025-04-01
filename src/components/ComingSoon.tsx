import React from "react";
import { motion } from "framer-motion";

const ComingSoon: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center px-4"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
          Coming Soon
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          We're working hard to bring you something amazing. Stay tuned!
        </p>
        <div className="relative w-64 h-64 mx-auto">
          <div className="absolute inset-0 border-4 border-blue-500 rounded-full animate-pulse"></div>
          <div className="absolute inset-4 border-4 border-indigo-500 rounded-full animate-pulse delay-75"></div>
          <div className="absolute inset-8 border-4 border-purple-500 rounded-full animate-pulse delay-150"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default ComingSoon;
