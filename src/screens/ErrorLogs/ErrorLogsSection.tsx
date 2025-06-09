import { SearchIcon, DownloadIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

interface ErrorLogsSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const ErrorLogsSection = ({
  searchQuery,
  setSearchQuery,
}: ErrorLogsSectionProps): JSX.Element => {
  const { t } = useTranslation();
  const errorLogs = useSelector(
    (state: RootState) => state.auth.errorLogs?.logs || []
  );

  const handleExport = () => {
    if (!errorLogs.length) return;

    const csvContent = [
      // CSV Headers
      [
        "Timestamp",
        "Method",
        "Error Message",
        "User",
        "Endpoint",
        "Error Code",
      ].join(","),
      // CSV Data
      ...errorLogs.map((log) =>
        [
          log.created_at,
          log.method,
          `"${log.error_message.replace(/"/g, '""')}"`, // Escape quotes in error messages
          log.user_email,
          log.endpoint,
          log.error_code,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `error_logs_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="flex flex-col gap-[var(--2-tokens-screen-modes-common-spacing-m)] w-full">
      <header>
        <h3 className="font-heading-h3 text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] text-[length:var(--heading-h3-font-size)] tracking-[var(--heading-h3-letter-spacing)] leading-[var(--heading-h3-line-height)] font-[number:var(--heading-h3-font-weight)] [font-style:var(--heading-h3-font-style)]">
          Error Logs
        </h3>
      </header>

      <div className="flex items-center justify-between w-full">
        <div className="relative w-[400px]">
          <Input
            className="pl-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-h)] pr-12 py-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-v)] bg-[color:var(--1-tokens-color-modes-input-primary-default-background)] border-[color:var(--1-tokens-color-modes-input-primary-default-border)] rounded-[var(--2-tokens-screen-modes-input-border-radius)]"
            placeholder="Search error logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-line-height)] h-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-line-height)]">
            <SearchIcon className="w-5 h-5 text-[color:var(--1-tokens-color-modes-input-primary-default-icon)]" />
          </div>
        </div>

        <div className="flex items-center gap-[var(--2-tokens-screen-modes-common-spacing-m)]">
          <Button
            variant="outline"
            className="flex items-center gap-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-gap)] py-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-h)] px-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-v)] min-w-[92px] bg-[color:var(--1-tokens-color-modes-button-secondary-default-background)] border-[color:var(--1-tokens-color-modes-button-secondary-default-border)] rounded-[var(--2-tokens-screen-modes-button-border-radius)]"
            onClick={handleExport}
            disabled={!errorLogs.length}
          >
            <DownloadIcon className="w-6 h-6 text-[color:var(--1-tokens-color-modes-button-secondary-default-icon)]" />
            <span className="font-label-smaller text-[length:var(--label-smaller-font-size)] leading-[var(--label-smaller-line-height)] tracking-[var(--label-smaller-letter-spacing)] font-[number:var(--label-smaller-font-weight)] text-[color:var(--1-tokens-color-modes-button-secondary-default-text)] [font-style:var(--label-smaller-font-style)]">
              Export Logs
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
};
