import React from "react";
import { motion } from "framer-motion";

const NotFound: React.FC = () => {
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
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="relative w-48 h-48 mx-auto mb-8">
          <div className="absolute inset-0 border-8 border-gray-300 rounded-full"></div>
          <div className="absolute inset-4 border-8 border-gray-400 rounded-full"></div>
          <div className="absolute inset-8 border-8 border-gray-500 rounded-full"></div>
        </div>
        <button
          onClick={() => window.history.back()}
          className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
        >
          Go Back
        </button>
      </motion.div>
    </div>
  );
};

export default NotFound;
