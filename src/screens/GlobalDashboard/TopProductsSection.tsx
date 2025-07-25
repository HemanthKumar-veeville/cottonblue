import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Download } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  fetchDashboard,
  resetDashboard,
} from "../../store/features/dashboardSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { RootState } from "../../store/store";
import { getHost } from "../../utils/hostUtils";
import { useSelector } from "react-redux";

type TimeframeOption = "Weekly" | "Monthly" | "Quarterly" | "Yearly";

const timeframeOptions: TimeframeOption[] = [
  "Weekly",
  "Monthly",
  "Quarterly",
  "Yearly",
];

// Constants for localStorage keys
const TIMEFRAME_KEY = "dashboard_timeframe";
const PERIOD_KEY = "dashboard_period";

// Function to get stored value with fallback
const getStoredValue = (key: string, fallback: string): string => {
  const stored = localStorage.getItem(key);
  return stored || fallback;
};

const getTimeframeValues = (timeframe: TimeframeOption): string[] => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  switch (timeframe) {
    case "Weekly":
      // Generate weeks 1-52
      return Array.from({ length: 52 }, (_, i) => String(i + 1));

    case "Monthly":
      // Generate months 1-12
      return Array.from({ length: 12 }, (_, i) => String(i + 1));

    case "Quarterly":
      // Generate quarters 1-4
      return ["1", "2", "3", "4"];

    case "Yearly":
      // Only return current year
      return [
        String(currentYear),
        String(currentYear - 1),
        String(currentYear - 2),
        String(currentYear - 3),
        String(currentYear - 4),
      ];

    default:
      return [];
  }
};

const getWeekLabel = (value: string, t: any): string => {
  const currentYear = new Date().getFullYear();
  const weekNumber = parseInt(value);

  // Create a date for January 1st of current year
  const yearStart = new Date(currentYear, 0, 1);

  // Calculate the first day of the week
  const weekStart = new Date(yearStart);
  weekStart.setDate(yearStart.getDate() + (weekNumber - 1) * 7);

  // Calculate the last day of the week
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  // Format the dates
  const formatDate = (date: Date) => {
    const month = date.toLocaleString("default", { month: "short" });
    const day = String(date.getDate()).padStart(2, "0");
    return `${month.substring(0, 3)} ${day}`;
  };

  return (
    t("dashboard.timeframes.periods.week", { number: value }) +
    " (" +
    t("dashboard.timeframes.periods.weekRange", {
      startDate: formatDate(weekStart),
      endDate: formatDate(weekEnd),
    }) +
    ")"
  );
};

const getTimeframeLabel = (value: string, t: any): string => {
  return t(`dashboard.timeframes.periods.month.${value}`);
};

const getQuarterLabel = (value: string, t: any): string => {
  return t(`dashboard.timeframes.periods.quarter.${value}`);
};

const getYearLabel = (value: string): string => {
  return value;
};

const getDisplayLabel = (
  option: string,
  timeframe: TimeframeOption,
  t: any
): string => {
  switch (timeframe) {
    case "Monthly":
      return getTimeframeLabel(option, t);
    case "Weekly":
      return getWeekLabel(option, t);
    case "Quarterly":
      return getQuarterLabel(option, t);
    case "Yearly":
      return getYearLabel(option);
    default:
      return option;
  }
};

interface TimeframeSelectProps {
  value: TimeframeOption;
  onChange: (value: TimeframeOption) => void;
}

interface PeriodSelectProps {
  timeframe: TimeframeOption;
  value: string;
  onChange: (value: string) => void;
}

const TimeframeSelect: React.FC<TimeframeSelectProps> = ({
  value,
  onChange,
}) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-1">
      <Select
        value={value}
        onValueChange={(val) => onChange(val as TimeframeOption)}
      >
        <SelectTrigger className="w-[180px] h-10 rounded-md border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] transition-all duration-200 px-4">
          <SelectValue
            placeholder={t("dashboard.timeframes.selectTimeframe")}
            className="text-[#475569] text-sm font-medium truncate"
          />
        </SelectTrigger>
        <SelectContent className="rounded-md border-[#E2E8F0] shadow-md min-w-[180px]">
          {timeframeOptions.map((option) => (
            <SelectItem
              key={option}
              value={option}
              className="text-sm font-medium text-[#475569] hover:bg-[#F8FAFC] hover:text-[#07515F] transition-all duration-200 cursor-pointer px-4 py-2"
            >
              {t(`dashboard.timeframes.${option.toLowerCase()}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

const PeriodSelect: React.FC<PeriodSelectProps> = ({
  timeframe,
  value,
  onChange,
}) => {
  const { t } = useTranslation();
  const options = getTimeframeValues(timeframe);

  return (
    <div className="flex flex-col gap-1">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[240px] h-10 rounded-md border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] transition-all duration-200 px-4">
          <SelectValue
            placeholder={t("dashboard.timeframes.selectPeriod")}
            className="text-[#475569] text-sm font-medium truncate font-mono"
          >
            {getDisplayLabel(value, timeframe, t)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="rounded-md border-[#E2E8F0] shadow-md min-w-[320px] max-h-[300px]">
          {options.map((option) => (
            <SelectItem
              key={option}
              value={option}
              className="text-sm font-medium text-[#475569] hover:bg-[#F8FAFC] hover:text-[#07515F] transition-all duration-200 cursor-pointer px-4 py-2 font-mono"
            >
              {getDisplayLabel(option, timeframe, t)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

const getDefaultPeriodValue = (timeframe: TimeframeOption): string => {
  const currentDate = new Date();

  switch (timeframe) {
    case "Weekly":
      // Get current week number (1-52)
      const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
      const days = Math.floor(
        (currentDate.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)
      );
      const currentWeek = Math.ceil((days + startOfYear.getDay() + 1) / 7);
      return String(currentWeek);

    case "Monthly":
      // Get current month (1-12)
      return String(currentDate.getMonth() + 1);

    case "Quarterly":
      // Get current quarter (1-4)
      return String(Math.floor(currentDate.getMonth() / 3) + 1);

    case "Yearly":
      // Get current year
      return String(currentDate.getFullYear());

    default:
      return "";
  }
};

const TopProductsSection: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  // Initialize state with stored values
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeframeOption>(
    getStoredValue(TIMEFRAME_KEY, "Monthly") as TimeframeOption
  );
  const [selectedPeriod, setSelectedPeriod] = useState<string>(() => {
    const storedTimeframe = getStoredValue(
      TIMEFRAME_KEY,
      "Monthly"
    ) as TimeframeOption;
    return getDefaultPeriodValue(storedTimeframe);
  });

  const { summary } = useSelector((state: RootState) => state.dashboard);
  const { selectedCompany } = useSelector((state: RootState) => state.client);

  const dns_prefix = selectedCompany?.dns ?? getHost();
  const { adminMode } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!summary) {
      dispatch(
        fetchDashboard({
          dns_prefix: adminMode ? "admin" : dns_prefix || "admin",
          filter_by: selectedTimeframe.toLowerCase(),
          filter_value: selectedPeriod,
        })
      );
    }
  }, [dispatch, selectedPeriod, selectedTimeframe, dns_prefix, summary]);

  const handleTimeframeChange = (timeframe: TimeframeOption) => {
    dispatch(resetDashboard());
    setSelectedTimeframe(timeframe);
    localStorage.setItem(TIMEFRAME_KEY, timeframe);

    // Get the default period value for the newly selected timeframe
    const newPeriodValue = getDefaultPeriodValue(timeframe);
    setSelectedPeriod(newPeriodValue);
    localStorage.setItem(PERIOD_KEY, newPeriodValue);
  };

  const handlePeriodChange = (period: string) => {
    dispatch(resetDashboard());
    setSelectedPeriod(period);
    localStorage.setItem(PERIOD_KEY, period);
  };

  const handleDownload = () => {
    if (!summary?.dashboard_data) return;

    const data = summary.dashboard_data;
    console.log(data);
    const doc = new jsPDF("p", "mm", "a4"); // portrait, millimetres
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const leftMargin = 14; // consistent left padding
    const lineGap = 8; // vertical spacing helper
    let cursorY = 20; // keeps track of current Y

    // ---------- HEADER --------------------------------------------------------
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(7, 81, 95); // #07515F
    doc.text(`KPI Marketing – ${dns_prefix} (2025)`, pageWidth / 2, cursorY, {
      align: "center",
    });

    cursorY += lineGap + 2;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(71, 85, 105); // #475569
    doc.text(
      `Période : ${getDisplayLabel(selectedPeriod, selectedTimeframe, t)}`,
      pageWidth / 2,
      cursorY,
      { align: "center" }
    );

    // ---------- INDICATEURS CLÉS ---------------------------------------------
    cursorY += lineGap * 2;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(7, 81, 95);
    doc.text("Indicateurs Clés", leftMargin, cursorY);

    const keyMetrics = [
      [
        "Chiffre d'affaires",
        `${data.total_amount.toLocaleString("fr-FR", {
          minimumFractionDigits: 0,
        })} EUR`,
      ],
      ["Commandes totales", data.total_orders.toLocaleString("fr-FR")],
      [
        "Panier moyen",
        `${data.average_basket_value.toLocaleString("fr-FR", {
          minimumFractionDigits: 2,
        })} EUR`,
      ],
      ["Utilisateurs actifs", data.total_active_users.toLocaleString("fr-FR")],
      ["Utilisateurs enregistrés", data.total_users.toLocaleString("fr-FR")],
    ];

    cursorY += lineGap;
    autoTable(doc, {
      startY: cursorY,
      margin: { left: leftMargin },
      head: [["Indicateur", "Valeur"]],
      body: keyMetrics,
      theme: "striped",
      headStyles: {
        fillColor: [7, 81, 95],
        textColor: 255,
        fontStyle: "bold",
      },
      styles: {
        font: "helvetica",
        fontSize: 10,
        cellPadding: 3,
      },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });

    // keep Y position after the table
    cursorY = (doc as any).lastAutoTable.finalY + lineGap * 2;

    // ---------- TOP 10 PRODUITS LES PLUS VENDUS -------------------------------
    doc.setFontSize(16);
    doc.setTextColor(7, 81, 95);
    doc.text("Top 10 Produits les Plus Vendus", leftMargin, cursorY);

    const products = (data.most_sold_products || [])
      .slice(0, 10)
      .map((p: any, idx: number) => [
        `${idx + 1}`,
        p.product_name,
        `${p.ordered_quantity.toLocaleString("fr-FR")} unités`,
      ]);

    cursorY += lineGap;
    if (products.length > 0) {
      autoTable(doc, {
        startY: cursorY,
        margin: { left: leftMargin },
        head: [["#", "Produit", "Quantité"]],
        body: products,
        theme: "plain",
        styles: { font: "helvetica", fontSize: 10, cellPadding: 2 },
        columnStyles: { 0: { halign: "center", cellWidth: 10 } },
      });
      cursorY = (doc as any).lastAutoTable.finalY + lineGap * 2;
    } else {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(11);
      doc.setTextColor(128, 128, 128); // Gray color for empty state
      doc.text(
        "Aucun produit vendu pour cette période",
        leftMargin,
        cursorY + lineGap,
        { align: "left" }
      );
      cursorY += lineGap * 3;
    }

    // ---------- MEILLEURS CLIENTS --------------------------------------------
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(7, 81, 95);
    doc.text("Meilleurs Clients", leftMargin, cursorY);

    const clients = (data.top_clients || []).map((c: any, idx: number) => [
      `${idx + 1}`,
      c.company_name,
      `${c.total_orders.toLocaleString("fr-FR")} commandes`,
      `${c.total_amount.toLocaleString("fr-FR", {
        minimumFractionDigits: 0,
      })} EUR`,
    ]);

    cursorY += lineGap;
    if (clients.length > 0) {
      autoTable(doc, {
        startY: cursorY,
        margin: { left: leftMargin },
        head: [["#", "Client", "Commandes", "Chiffre d'affaires"]],
        body: clients,
        theme: "plain",
        styles: { font: "helvetica", fontSize: 10, cellPadding: 2 },
        columnStyles: { 0: { halign: "center", cellWidth: 10 } },
      });
      cursorY = (doc as any).lastAutoTable.finalY + lineGap * 2;
    } else {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(11);
      doc.setTextColor(128, 128, 128); // Gray color for empty state
      doc.text(
        "Aucune donnée client disponible pour cette période",
        leftMargin,
        cursorY + lineGap,
        { align: "left" }
      );
      cursorY += lineGap * 3;
    }

    // ---------- FOOTER with date & pagination --------------------------------
    const totalPages = (doc.internal as any).getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);

      doc.text(
        `Généré le ${new Date().toLocaleDateString("fr-FR")}`,
        pageWidth - leftMargin,
        pageHeight - 10,
        { align: "right" }
      );
      doc.text(`Page ${i} / ${totalPages}`, leftMargin, pageHeight - 10, {
        align: "left",
      });
    }

    // ---------- SAVE ---------------------------------------------------------
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    doc.save(`rapport-kpi-${dns_prefix}-${timestamp}.pdf`);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-start gap-6">
          <TimeframeSelect
            value={selectedTimeframe}
            onChange={handleTimeframeChange}
          />
          <PeriodSelect
            timeframe={selectedTimeframe}
            value={selectedPeriod}
            onChange={handlePeriodChange}
          />
        </div>

        <Button
          onClick={handleDownload}
          className="bg-[#07515F] hover:bg-[#064249] text-white gap-3 px-5 py-2.5 h-10 rounded-md transition-all duration-200 font-medium"
        >
          <Download className="w-4 h-4" />
          <span>{t("dashboard.actions.exportKPI")}</span>
        </Button>
      </div>
    </div>
  );
};

export { TopProductsSection };
