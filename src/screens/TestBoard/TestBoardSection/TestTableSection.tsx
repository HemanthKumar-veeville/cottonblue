import { Button } from "../../../components/ui/button";
import { Checkbox } from "../../../components/ui/checkbox";
import { TestResult, TestFileResult } from "../../../services/testService";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedTests,
  selectSelectedTests,
  selectFilteredTests,
  selectFilteredAvailableTests,
  fetchAvailableTests,
} from "../../../store/features/testSlice";
import { AppDispatch } from "../../../store/store";
import { useTranslation } from "react-i18next";
import { Skeleton } from "../../../components/Skeleton";
import EmptyState from "../../../components/EmptyState";
import ErrorState from "../../../components/ErrorState";
import {
  Eye,
  Edit,
  Power,
  Beaker,
  ChevronDown,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../../components/ui/collapsible";
import { cn } from "../../../lib/utils";
import { Badge } from "../../../components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "../../../components/ui/tooltip";

interface TestTableSectionProps {
  loading: boolean;
  error: string | null;
  searchTerm: string;
}

export const TestTableSection: React.FC<TestTableSectionProps> = ({
  loading,
  error,
  searchTerm,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const selectedTests = useSelector(selectSelectedTests);
  const filteredTestsData = useSelector(selectFilteredTests);
  const availableTests = useSelector(selectFilteredAvailableTests);
  const [expandedFiles, setExpandedFiles] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchAvailableTests());
  }, [dispatch]);

  const handleSelectTest = (testFilePath: string) => {
    const newSelectedTests = selectedTests.includes(testFilePath)
      ? selectedTests.filter((path) => path !== testFilePath)
      : [...selectedTests, testFilePath];
    dispatch(setSelectedTests(newSelectedTests));
  };

  const toggleFileExpansion = (filePath: string) => {
    setExpandedFiles((prev) =>
      prev.includes(filePath)
        ? prev.filter((p) => p !== filePath)
        : [...prev, filePath]
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "passed":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "passed":
        return "bg-green-50 border-green-200";
      case "failed":
        return "bg-red-50 border-red-200";
      default:
        return "bg-yellow-50 border-yellow-200";
    }
  };

  if (loading) {
    return <Skeleton className="h-64" />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  // Show available tests if no test results yet
  if (!filteredTestsData?.data.testResults.length) {
    if (!availableTests?.data.tests.length) {
      return (
        <EmptyState
          icon={Beaker}
          title={t("No Tests Found")}
          description={
            searchTerm
              ? t("No tests match your search criteria")
              : t("No tests have been created yet")
          }
        />
      );
    }

    return (
      <TooltipProvider>
        <div className="h-[calc(100vh-200px)] overflow-auto">
          <div className="space-y-4 p-4">
            {availableTests.data.tests.map((file) => (
              <div
                key={file.filePath}
                className="rounded-lg border p-4 bg-white"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedTests.includes(file.filePath)}
                      onCheckedChange={() => handleSelectTest(file.filePath)}
                    />
                    <button
                      onClick={() => toggleFileExpansion(file.filePath)}
                      className="flex items-center gap-2 hover:text-primary"
                    >
                      {expandedFiles.includes(file.filePath) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                      <span className="font-medium">
                        {file.filePath.split("/").pop()}
                      </span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleFileExpansion(file.filePath)}
                    >
                      <Power className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {expandedFiles.includes(file.filePath) && (
                  <div className="mt-4 space-y-3">
                    {file.describes.map((describe, describeIndex) => (
                      <div
                        key={`${file.filePath}-${describeIndex}`}
                        className="ml-6"
                      >
                        <div className="font-medium mb-2">{describe.title}</div>
                        <div className="space-y-2">
                          {describe.tests.map((test, testIndex) => (
                            <div
                              key={`${file.filePath}-${describeIndex}-${testIndex}`}
                              className="rounded-md border p-3 bg-gray-50"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                  <div className="font-medium">
                                    {test.title}
                                  </div>
                                </div>
                                <div className="flex gap-1">
                                  <Button variant="ghost" size="icon">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    {file.tests.map((test, index) => (
                      <div
                        key={`${file.filePath}-standalone-${index}`}
                        className="rounded-md border p-3 bg-gray-50"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="font-medium">{test.title}</div>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </TooltipProvider>
    );
  }

  // Show test results if available
  return (
    <TooltipProvider>
      <div className="h-[calc(100vh-200px)] overflow-auto">
        <div className="space-y-4 p-4">
          {filteredTestsData.data.testResults.map((fileResult) => (
            <div
              key={fileResult.testFilePath}
              className={cn(
                "rounded-lg border p-4",
                getStatusColor(
                  fileResult.numFailingTests > 0
                    ? "failed"
                    : fileResult.numPendingTests ===
                      fileResult.testResults.length
                    ? "pending"
                    : "passed"
                )
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedTests.includes(fileResult.testFilePath)}
                    onCheckedChange={() =>
                      handleSelectTest(fileResult.testFilePath)
                    }
                  />
                  <button
                    onClick={() => toggleFileExpansion(fileResult.testFilePath)}
                    className="flex items-center gap-2 hover:text-primary"
                  >
                    {expandedFiles.includes(fileResult.testFilePath) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                    <span className="font-medium">
                      {fileResult.testFilePath.split("/").pop()}
                    </span>
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Badge className="gap-1 bg-green-50 text-green-700 border-green-200">
                      <CheckCircle2 className="w-3 h-3" />
                      {fileResult.numPassingTests}
                    </Badge>
                    <Badge className="gap-1 bg-red-50 text-red-700 border-red-200">
                      <XCircle className="w-3 h-3" />
                      {fileResult.numFailingTests}
                    </Badge>
                    {fileResult.numPendingTests > 0 && (
                      <Badge className="gap-1 bg-gray-50 text-gray-700 border-gray-200">
                        <AlertCircle className="w-3 h-3" />
                        {fileResult.numPendingTests}
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleFileExpansion(fileResult.testFilePath)}
                  >
                    <Power className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {expandedFiles.includes(fileResult.testFilePath) && (
                <div className="mt-4 space-y-3">
                  {fileResult.testResults.map((test, index) => (
                    <div
                      key={`${fileResult.testFilePath}-${index}`}
                      className={cn(
                        "rounded-md border p-3",
                        getStatusColor(test.status)
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {getStatusIcon(test.status)}
                          <div>
                            <div className="font-medium">{test.title}</div>
                            {test.ancestorTitles.length > 0 && (
                              <div className="text-sm text-muted-foreground">
                                {test.ancestorTitles.join(" › ")}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                {test.duration}ms
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <span>Test Duration</span>
                            </TooltipContent>
                          </Tooltip>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      {test.failureMessages.length > 0 && (
                        <div className="mt-2 rounded-md bg-red-50 p-3 text-sm text-red-800 font-mono">
                          {test.failureMessages.map((message, i) => (
                            <div key={i} className="whitespace-pre-wrap">
                              {message}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
};
