import { ArrowDownIcon } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";

const salesOverviewData = [
  {
    title: "Ventes totales",
    period: "Mois de mars",
    value: "350K €",
    label: "Ventes",
    percentage: "10,4 %",
    isPositive: true,
    lastPeriod: "7 derniers jours (7000 €)",
  },
  {
    title: "Commandes totales",
    period: "Mois de mars",
    value: "231",
    label: "commandes",
    percentage: "14,4 %",
    isPositive: true,
    lastPeriod: "7 derniers jours (30)",
  },
];

const SalesCard = ({
  title,
  period,
  value,
  label,
  percentage,
  lastPeriod,
}: {
  title: string;
  period: string;
  value: string;
  label: string;
  percentage: string;
  lastPeriod: string;
}) => (
  <Card className="flex-1 shadow-1dp-ambient">
    <CardContent className="flex flex-col gap-3 p-5">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] font-['Montserrat',Helvetica] leading-7">
            {title}
          </h3>
        </div>
        <p className="text-primary-neutal-500 text-sm tracking-[-0.28px] font-['Montserrat',Helvetica]">
          {period}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <span className="font-bold text-[#023337] text-[32px] font-['Montserrat',Helvetica]">
          {value}
        </span>

        <div className="flex items-end gap-1">
          <span className="font-normal text-1-tokens-color-modes-common-neutral-hightest text-base font-['Montserrat',Helvetica]">
            {label}
          </span>

          <div className="flex items-center">
            <ArrowDownIcon className="w-4 h-4 text-primary-success-500" />
            <span className="font-medium text-primary-success-500 text-sm font-['Montserrat',Helvetica]">
              {percentage}
            </span>
          </div>
        </div>
      </div>

      <p className="text-primary-neutal-500 text-sm font-['Montserrat',Helvetica]">
        {lastPeriod}
      </p>
    </CardContent>
  </Card>
);

export const SalesOverviewSection = (): JSX.Element => {
  return (
    <section className="flex gap-6 w-full">
      {salesOverviewData.map((card, index) => (
        <SalesCard
          key={index}
          title={card.title}
          period={card.period}
          value={card.value}
          label={card.label}
          percentage={card.percentage}
          lastPeriod={card.lastPeriod}
        />
      ))}
    </section>
  );
};
