import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useTranslation } from "react-i18next";
import { useCompanyColors } from "../../hooks/useCompanyColors";

export type TimeframeType = "all" | "custom";

interface TimeframeSelectProps {
  value: TimeframeType;
  onChange: (value: TimeframeType) => void;
}

export const TimeframeSelect: React.FC<TimeframeSelectProps> = ({
  value,
  onChange,
}) => {
  const { t } = useTranslation();
  const { buttonStyles } = useCompanyColors();

  const timeframes: { value: TimeframeType; label: string }[] = [
    { value: "all", label: t("dashboard.timeframes.all") },
    { value: "custom", label: t("dashboard.timeframes.custom") },
  ];

  return (
    <div className="flex flex-col gap-1" style={buttonStyles}>
      <Select
        value={value}
        onValueChange={(val) => onChange(val as TimeframeType)}
      >
        <SelectTrigger
          className="w-[200px] h-10 rounded-md border-[var(--primary-color)] bg-white hover:bg-[var(--primary-light-color)] transition-all duration-200 px-4"
          style={{
            backgroundColor: "transparent",
            color: "var(--primary-color)",
            border: "1px solid var(--primary-color)",
            transform: "translateY(0)",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
          }}
        >
          <SelectValue
            placeholder={t("dashboard.timeframes.selectTimeframe")}
            className="text-sm font-medium truncate text-[var(--primary-color)]"
          />
        </SelectTrigger>
        <SelectContent className=" z-10 w-56 rounded-md bg-white shadow-lg ring-1 ring-[var(--primary-color)] ring-opacity-20 focus:outline-none">
          {timeframes.map((timeframe) => (
            <SelectItem
              key={timeframe.value}
              value={timeframe.value}
              className="text-sm font-medium hover:bg-[var(--primary-light-color)] transition-all duration-200 cursor-pointer px-4 py-2 text-[var(--primary-color)]"
              style={{
                backgroundColor: "transparent",
                color: "var(--primary-color)",
                border: "1px solid var(--primary-color)",
              }}
            >
              {timeframe.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
