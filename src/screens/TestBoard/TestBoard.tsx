import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TestBoardSection } from "./TestBoardSection/TestBoardSection";
import { TestTableSection } from "./TestBoardSection/TestTableSection";
import {
  runTests,
  setSearchTerm,
  selectLoading,
  selectError,
  selectSearchTerm,
  selectFilteredTests,
  checkHealth,
} from "../../store/features/testSlice";
import { AppDispatch, useAppSelector } from "../../store/store";
import { AlertCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useTranslation } from "react-i18next";

const TestBoard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const { health } = useAppSelector((state) => state.test);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const searchTerm = useSelector(selectSearchTerm);
  const filteredTests = useSelector(selectFilteredTests);

  const handleSearch = (term: string) => {
    dispatch(setSearchTerm(term));
  };

  const handleRunTests = async () => {
    await dispatch(runTests());
  };

  const getServerHealth = async () => {
    await dispatch(checkHealth());
  };

  useEffect(() => {
    getServerHealth();
  }, []);

  if (!health || health.status !== "healthy") {
    return (
      <main className="flex flex-col items-center justify-center w-full h-[80vh] p-6 bg-white rounded-lg">
        <div className="flex flex-col items-center gap-6 max-w-md text-center">
          <div className="p-4 rounded-full bg-red-100">
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {t("testBoard.serverUnavailable")}
          </h2>
          <p className="text-gray-600">
            {t("testBoard.serverUnavailableDescription")}
          </p>
          <Button
            onClick={getServerHealth}
            className="mt-2 bg-[#07515f] hover:bg-[#064751] transition-colors"
          >
            {t("testBoard.retryConnection")}
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col w-full gap-8 p-6 bg-white rounded-lg overflow-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
      <TestBoardSection onSearch={handleSearch} onRunTests={handleRunTests} />
      <TestTableSection
        tests={filteredTests}
        loading={loading}
        error={error}
        searchTerm={searchTerm}
      />
    </main>
  );
};

export default TestBoard;
