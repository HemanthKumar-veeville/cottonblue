import React from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

interface ErrorProps {
  message?: string;
}

const Error: React.FC<ErrorProps> = ({ message = "Something went wrong" }) => {
  const location = useLocation();
  const errorMessage = location.state?.message || message;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center px-4"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-red-600 mb-4">
          Oops!
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
          {errorMessage}
        </h2>
        <p className="text-gray-600 mb-8">
          We apologize for the inconvenience. Please try again later.
        </p>
        <div className="relative w-48 h-48 mx-auto mb-8">
          <div className="absolute inset-0 border-8 border-red-300 rounded-full animate-pulse"></div>
          <div className="absolute inset-4 border-8 border-red-400 rounded-full animate-pulse delay-75"></div>
          <div className="absolute inset-8 border-8 border-red-500 rounded-full animate-pulse delay-150"></div>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
        >
          Try Again
        </button>
      </motion.div>
    </div>
  );
};

export default Error;
