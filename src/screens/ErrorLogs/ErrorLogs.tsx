import React from "react";
import { ErrorLogsSection } from "./ErrorLogsSection";
import { ErrorLogsTableSection } from "./ErrorLogsTableSection";
import { useState } from "react";

const ErrorLogs: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <main className="flex flex-col w-full gap-8 p-6 bg-white rounded-lg">
      <ErrorLogsSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <ErrorLogsTableSection searchQuery={searchQuery} />
    </main>
  );
};

export default ErrorLogs;
