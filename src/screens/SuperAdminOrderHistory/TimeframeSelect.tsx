import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useTranslation } from "react-i18next";

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

  const timeframes: { value: TimeframeType; label: string }[] = [
    { value: "all", label: t("dashboard.timeframes.all") },
    { value: "custom", label: t("dashboard.timeframes.custom") },
  ];

  return (
    <div className="flex flex-col gap-1">
      <Select
        value={value}
        onValueChange={(val) => onChange(val as TimeframeType)}
      >
        <SelectTrigger className="w-[200px] h-10 rounded-md border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] transition-all duration-200 px-4">
          <SelectValue
            placeholder={t("dashboard.timeframes.selectTimeframe")}
            className="text-[#475569] text-sm font-medium truncate"
          />
        </SelectTrigger>
        <SelectContent className="rounded-md border-[#E2E8F0] shadow-md min-w-[180px]">
          {timeframes.map((timeframe) => (
            <SelectItem
              key={timeframe.value}
              value={timeframe.value}
              className="text-sm font-medium text-[#475569] hover:bg-[#F8FAFC] hover:text-[#07515F] transition-all duration-200 cursor-pointer px-4 py-2"
            >
              {timeframe.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
