import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Download } from "lucide-react";
import { useState } from "react";

const months = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

export const OrdersSectionSkeleton = () => (
  <div className="flex items-center justify-between w-full animate-pulse">
    <div className="flex items-start gap-6">
      <div className="w-[105px] h-10 bg-gray-200 rounded" />
      <div className="w-[105px] h-10 bg-gray-200 rounded" />
    </div>
    <div className="w-[160px] h-10 bg-gray-200 rounded" />
  </div>
);

interface MonthSelectProps {
  defaultValue: string;
  onValueChange?: (value: string) => void;
}

const MonthSelect = ({ defaultValue, onValueChange }: MonthSelectProps) => (
  <Select defaultValue={defaultValue} onValueChange={onValueChange}>
    <SelectTrigger className="w-[105px] border-[color:var(--1-tokens-color-modes-border-primary)] bg-[color:var(--1-tokens-color-modes-nav-tab-primary-default-background)] text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] font-label-small">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      {months.map((month) => (
        <SelectItem key={month} value={month}>
          {month}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

interface OrdersSectionProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

export function OrdersSection({
  selectedMonth,
  onMonthChange,
}: OrdersSectionProps): JSX.Element {
  const [selectedFilter, setSelectedFilter] = useState<string>("Mois");

  const handleExportKPI = () => {
    // TODO: Implement export functionality
  };

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-start gap-6">
        <MonthSelect
          defaultValue={selectedFilter}
          onValueChange={setSelectedFilter}
        />
        <MonthSelect
          defaultValue={selectedMonth}
          onValueChange={onMonthChange}
        />
      </div>
      <Button
        onClick={handleExportKPI}
        className="bg-[#00b85b] hover:bg-[#00a050] border-[#1a8563] text-[color:var(--1-tokens-color-modes-button-primary-default-text)] font-label-medium h-auto"
      >
        <Download className="w-4 h-4 mr-2" />
        Exporter les KPI
      </Button>
    </div>
  );
}
