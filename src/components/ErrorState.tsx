import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Button } from "./ui/button";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
  variant?: "inline" | "fullPage";
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Error",
  message,
  onRetry,
  className = "",
  variant = "inline",
}) => {
  if (variant === "inline") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`flex items-center justify-center p-4 ${className}`}
      >
        <div className="flex items-center space-x-2 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <span>{message}</span>
          {onRetry && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRetry}
              className="ml-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Retry
            </Button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`min-h-[400px] flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 ${className}`}
    >
      <div className="text-center px-4">
        <div className="w-16 h-16 mx-auto mb-4 text-red-500">
          <AlertCircle className="w-full h-full" />
        </div>
        <h1 className="text-2xl font-bold text-red-600 mb-2">{title}</h1>
        <p className="text-gray-600 mb-6">{message}</p>
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="destructive"
            className="hover:bg-red-700"
          >
            Try Again
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default ErrorState;
