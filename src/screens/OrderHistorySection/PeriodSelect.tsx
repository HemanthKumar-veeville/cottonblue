import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { TimeframeType } from "./TimeframeSelect";
import dayjs from "dayjs";
import { cn } from "../../lib/utils";
import { useCompanyColors } from "../../hooks/useCompanyColors";

interface DateRange {
  startDate: string;
  endDate: string;
}

interface PeriodSelectProps {
  timeframe: TimeframeType;
  value: DateRange;
  onChange: (value: DateRange) => void;
  onCustomDateChange?: (fromDate: Date, toDate: Date) => void;
}

const FormField = ({
  label,
  error,
  children,
  className,
  isRequired = false,
}: {
  label?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
  isRequired?: boolean;
}) => (
  <div className={cn("relative w-full", className)}>
    <div className="relative">
      {children}
      {label && (
        <span className="absolute -top-[10px] left-[10px] px-1 bg-white text-sm font-medium text-gray-600">
          {label} {isRequired && <span className="text-red-500">*</span>}
        </span>
      )}
    </div>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const formatDate = (date: Date): string => {
  return dayjs(date).format("YYYY-MM-DD");
};

const FloatingDateInput = ({
  label,
  value,
  onChange,
  className = "",
  isRequired = false,
  buttonStyles,
}: {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  className?: string;
  isRequired?: boolean;
  buttonStyles: React.CSSProperties;
}) => {
  return (
    <FormField label={label} className={className} isRequired={isRequired}>
      <input
        type="date"
        className="w-[180px] h-10 rounded-md border border-[var(--primary-color)] bg-white hover:bg-[var(--primary-light-color)] transition-all duration-200 px-4 text-sm focus:outline-none focus:ring-2 focus:border-transparent text-[var(--primary-color)]"
        style={{
          backgroundColor: "transparent",
          color: "var(--primary-color)",
          border: "1px solid var(--primary-color)",
          transform: "translateY(0)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          "--webkit-calendar-picker-indicator": {
            filter:
              "invert(1) brightness(50%) sepia(100%) saturate(1000%) hue-rotate(180deg)",
          },
        }}
        value={formatDate(value)}
        onChange={(e) => onChange(new Date(e.target.value))}
      />
    </FormField>
  );
};

export const PeriodSelect: React.FC<PeriodSelectProps> = ({
  timeframe,
  value,
  onChange,
  onCustomDateChange,
}) => {
  const { t } = useTranslation();
  const { buttonStyles } = useCompanyColors();

  const [fromDate, setFromDate] = React.useState(
    value.startDate
      ? new Date(value.startDate)
      : dayjs().startOf("year").toDate()
  );
  const [toDate, setToDate] = React.useState(
    value.endDate ? new Date(value.endDate) : new Date()
  );

  useEffect(() => {
    if (value.startDate) {
      setFromDate(new Date(value.startDate));
    }
    if (value.endDate) {
      setToDate(new Date(value.endDate));
    }
  }, [value]);

  const handleFromDateChange = (date: Date) => {
    setFromDate(date);
    const newDateRange = {
      startDate: formatDate(date),
      endDate: formatDate(toDate),
    };
    onChange(newDateRange);
    onCustomDateChange?.(date, toDate);
  };

  const handleToDateChange = (date: Date) => {
    setToDate(date);
    const newDateRange = {
      startDate: formatDate(fromDate),
      endDate: formatDate(date),
    };
    onChange(newDateRange);
    onCustomDateChange?.(fromDate, date);
  };

  if (timeframe !== "custom") {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      <FloatingDateInput
        label={t("dashboard.timeframes.from", "From")}
        value={fromDate}
        onChange={handleFromDateChange}
        isRequired
        buttonStyles={buttonStyles}
      />
      <FloatingDateInput
        label={t("dashboard.timeframes.to", "To")}
        value={toDate}
        onChange={handleToDateChange}
        isRequired
        buttonStyles={buttonStyles}
      />
    </div>
  );
};
