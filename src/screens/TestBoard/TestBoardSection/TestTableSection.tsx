import { Button } from "../../../components/ui/button";
import { Checkbox } from "../../../components/ui/checkbox";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Skeleton } from "../../../components/Skeleton";
import EmptyState from "../../../components/EmptyState";
import ErrorState from "../../../components/ErrorState";
import { Eye, Edit, Power, Beaker } from "lucide-react";
import { Test } from "../../../services/testService";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedTests,
  setCurrentPage,
  selectSelectedTests,
  selectCurrentPage,
} from "../../../store/features/testSlice";
import { AppDispatch } from "../../../store/store";

interface TestTableSectionProps {
  tests: Test[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
}

export const TestTableSection: React.FC<TestTableSectionProps> = ({
  tests,
  loading,
  error,
  searchTerm,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const selectedTests = useSelector(selectSelectedTests);
  const currentPage = useSelector(selectCurrentPage);
  const testsPerPage = 10;

  // Filter tests based on search term
  const filteredTests = tests.filter((test) =>
    test.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const indexOfLastTest = currentPage * testsPerPage;
  const indexOfFirstTest = indexOfLastTest - testsPerPage;
  const currentTests = filteredTests.slice(indexOfFirstTest, indexOfLastTest);
  const totalPages = Math.ceil(filteredTests.length / testsPerPage);

  const handleSelectTest = (testId: number) => {
    const newSelectedTests = selectedTests.includes(testId)
      ? selectedTests.filter((id) => id !== testId)
      : [...selectedTests, testId];
    dispatch(setSelectedTests(newSelectedTests));
  };

  const handleSelectAll = () => {
    const newSelectedTests =
      selectedTests.length === currentTests.length
        ? []
        : currentTests.map((test) => test.id);
    dispatch(setSelectedTests(newSelectedTests));
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  if (loading) {
    return <Skeleton className="h-64" />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!tests.length) {
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
    <div className="flex flex-col gap-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] text-center">
                <Checkbox
                  checked={
                    selectedTests.length === currentTests.length &&
                    currentTests.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="w-[250px]">{t("Test Name")}</TableHead>
              <TableHead className="w-[100px] text-center">
                {t("Type")}
              </TableHead>
              <TableHead className="w-[100px] text-center">
                {t("Status")}
              </TableHead>
              <TableHead className="w-[150px]">{t("Last Run")}</TableHead>
              <TableHead className="w-[100px] text-center">
                {t("Duration")}
              </TableHead>
              <TableHead className="w-[120px] text-center">
                {t("Success Rate")}
              </TableHead>
              <TableHead className="w-[100px] text-center">
                {t("Actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTests.map((test) => (
              <TableRow key={test.id}>
                <TableCell className="text-center">
                  <Checkbox
                    checked={selectedTests.includes(test.id)}
                    onCheckedChange={() => handleSelectTest(test.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">{test.name}</TableCell>
                <TableCell className="text-center">{test.type}</TableCell>
                <TableCell className="w-[100px] text-center">
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-sm ${
                      test.status === "Passed"
                        ? "bg-green-100 text-green-800"
                        : test.status === "Failed"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {test.status}
                  </span>
                </TableCell>
                <TableCell>{test.lastRun}</TableCell>
                <TableCell className="text-center">{test.duration}</TableCell>
                <TableCell className="text-center">
                  {test.success_rate}%
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Power className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => handlePageChange(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  handlePageChange(Math.min(currentPage + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};
