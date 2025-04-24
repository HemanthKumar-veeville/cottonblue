import React from "react";

const ComingSoon: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Coming Soon</h1>
        <p className="text-gray-600">This feature is under development</p>
      </div>
    </div>
  );
};

export default ComingSoon;
