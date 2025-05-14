import { ArrowDownIcon } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { useTranslation } from "react-i18next";

const salesOverviewData = [
  {
    titleKey: "dashboard.sections.salesOverview.totalSales.title",
    periodKey: "dashboard.sections.salesOverview.totalSales.period",
    value: "350K €",
    labelKey: "dashboard.sections.salesOverview.totalSales.sales",
    percentage: "10,4 %",
    isPositive: true,
    lastPeriodKey: "dashboard.sections.salesOverview.totalSales.lastPeriod",
  },
  {
    titleKey: "dashboard.sections.salesOverview.totalOrders.title",
    periodKey: "dashboard.sections.salesOverview.totalOrders.period",
    value: "231",
    labelKey: "dashboard.sections.salesOverview.totalOrders.orders",
    percentage: "14,4 %",
    isPositive: true,
    lastPeriodKey: "dashboard.sections.salesOverview.totalOrders.lastPeriod",
  },
];

const SalesCard = ({
  titleKey,
  periodKey,
  value,
  labelKey,
  percentage,
  lastPeriodKey,
}: {
  titleKey: string;
  periodKey: string;
  value: string;
  labelKey: string;
  percentage: string;
  lastPeriodKey: string;
}) => {
  const { t } = useTranslation();

  return (
    <Card className="flex-1 shadow-1dp-ambient">
      <CardContent className="flex flex-col gap-3 p-5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)]">
              {t(titleKey)}
            </h3>
          </div>
          <p className="text-primary-neutal-500 text-sm tracking-[-0.28px]">
            {t(periodKey)}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-bold text-[#023337] text-[32px]">{value}</span>

          <div className="flex items-end gap-1">
            <span className="font-normal text-1-tokens-color-modes-common-neutral-hightest text-base">
              {t(labelKey)}
            </span>

            <div className="flex items-center">
              <ArrowDownIcon className="w-4 h-4 text-primary-success-500" />
              <span className="font-medium text-primary-success-500 text-sm">
                {percentage}
              </span>
            </div>
          </div>
        </div>

        <p className="text-primary-neutal-500 text-sm">{t(lastPeriodKey)}</p>
      </CardContent>
    </Card>
  );
};

export const SalesOverviewSection = (): JSX.Element => {
  return (
    <section className="flex gap-6 w-full">
      {salesOverviewData.map((card, index) => (
        <SalesCard
          key={index}
          titleKey={card.titleKey}
          periodKey={card.periodKey}
          value={card.value}
          labelKey={card.labelKey}
          percentage={card.percentage}
          lastPeriodKey={card.lastPeriodKey}
        />
      ))}
    </section>
  );
};
