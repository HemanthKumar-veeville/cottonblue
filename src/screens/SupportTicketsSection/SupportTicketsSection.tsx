import { ChevronRightIcon } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { useTranslation } from "react-i18next";

const supportTickets = [
  {
    id: 1,
    col1: "TICK-2024-001",
    col2: "Problème de livraison",
    col3: "dashboard.sections.supportTickets.status.pending",
    col4: "2h",
    status: "warning",
  },
  {
    id: 2,
    col1: "TICK-2024-002",
    col2: "Retour produit",
    col3: "dashboard.sections.supportTickets.status.resolved",
    col4: "1j",
    status: "success",
  },
  {
    id: 3,
    col1: "TICK-2024-003",
    col2: "Question facturation",
    col3: "dashboard.sections.supportTickets.status.inProgress",
    col4: "4h",
    status: "warning",
  },
  {
    id: 4,
    col1: "TICK-2024-004",
    col2: "Demande de remboursement",
    col3: "dashboard.sections.supportTickets.status.resolved",
    col4: "1j",
    status: "success",
  },
  {
    id: 5,
    col1: "TICK-2024-005",
    col2: "Problème technique",
    col3: "dashboard.sections.supportTickets.status.new",
    col4: "30m",
    status: "default",
  },
  {
    id: 6,
    col1: "TICK-2024-006",
    col2: "Modification commande",
    col3: "dashboard.sections.supportTickets.status.pending",
    col4: "1h",
    status: "warning",
  },
];

const bestSales = [
  {
    id: 1,
    image: "/img/image.png",
    logo: "/img/chronodrive_logo.png",
    name: "Magnet + stylo",
    sales: "13 234",
    revenue: "195 394 €",
  },
  {
    id: 2,
    image: "/img/t_shirts.png",
    logo: "/img/chronodrive_logo.png",
    name: "Polo homme",
    sales: "10 944",
    revenue: "320 394 €",
  },
];

const topClients = [
  {
    id: 1,
    rank: "dashboard.sections.topClients.rank.first",
    logo: "/img/chronodrive_logo.png",
    logoHeight: "h-5",
  },
  {
    id: 2,
    rank: "dashboard.sections.topClients.rank.second",
    logo: "/img/carter_cash_logo.png",
    logoHeight: "h-[46px]",
  },
  {
    id: 3,
    rank: "dashboard.sections.topClients.rank.third",
    logo: "/img/dassault_logo.png",
    logoHeight: "h-[29px]",
  },
];

const SupportTicketsTable = () => {
  const { t } = useTranslation();

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-1-tokens-color-modes-common-primary-brand-lower rounded-md">
          <TableHead className="w-11 p-2">
            <Checkbox className="w-5 h-5 rounded border-[1.5px] border-solid border-1-tokens-color-modes-common-neutral-medium" />
          </TableHead>
          {[
            "dashboard.sections.supportTickets.table.ticketId",
            "dashboard.sections.supportTickets.table.subject",
            "dashboard.sections.supportTickets.table.status",
            "dashboard.sections.supportTickets.table.time",
          ].map((header, index) => (
            <TableHead
              key={index}
              className={`w-[145px] p-2.5 text-[#023337] text-[length:var(--text-small-font-size)] font-text-small ${
                index === 3 ? "text-right" : ""
              }`}
            >
              {t(header)}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {supportTickets.map((ticket) => (
          <TableRow
            key={ticket.id}
            className="border-b border-primary-neutal-300 hover:bg-gray-50 transition-colors"
          >
            <TableCell className="w-11 py-3 px-2">
              <Checkbox className="w-5 h-5 rounded border-[1.5px] border-solid border-1-tokens-color-modes-common-neutral-medium" />
            </TableCell>
            {[ticket.col1, ticket.col2, ticket.col3, ticket.col4].map(
              (col, index) => (
                <TableCell
                  key={index}
                  className={`w-[145px] py-3 px-2.5 ${
                    index === 3 ? "text-right" : ""
                  }`}
                >
                  <div
                    className={`font-normal text-[15px] ${
                      index === 2
                        ? ticket.status === "success"
                          ? "text-1-tokens-color-modes-common-success-medium"
                          : ticket.status === "warning"
                          ? "text-1-tokens-color-modes-common-warning-medium"
                          : "text-[color:var(--1-tokens-color-modes-input-primary-default-text)]"
                        : "text-1-tokens-color-modes-common-neutral-hightest"
                    }`}
                  >
                    {index === 2 ? t(col) : col}
                  </div>
                </TableCell>
              )
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const BestSalesCard = () => {
  const { t } = useTranslation();

  return (
    <Card className="w-full shadow-1dp-ambient">
      <CardContent className="p-5">
        <div className="flex flex-col gap-1 mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img className="w-6 h-6" alt="Icon" src="/img/icon-2.svg" />
              <div className="font-bold text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] text-lg leading-7">
                {t("dashboard.sections.bestSales.title")}
              </div>
            </div>
          </div>
          <div className="font-normal text-primary-neutal-500 text-sm tracking-[-0.28px]">
            {t("dashboard.sections.bestSales.period")}
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {bestSales.map((item) => (
            <div key={item.id} className="flex-1 min-w-[250px]">
              <div className="flex flex-col md:flex-row items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div
                    className="h-[106px] rounded-t-lg bg-cover bg-center w-full"
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                </div>
                <div className="flex-1 flex flex-col items-center gap-2 w-full">
                  <div className="flex flex-col items-center gap-1 w-full">
                    <div className="flex items-center justify-center py-1 w-full bg-[color:var(--1-tokens-color-modes-input-primary-default-background)] rounded-lg border border-[color:var(--1-tokens-color-modes-input-primary-default-border)]">
                      <img
                        className="w-[95px] h-[18px]"
                        alt="Logo"
                        src={item.logo}
                      />
                    </div>
                    <div className="font-text-small text-[color:var(--1-tokens-color-modes-input-primary-default-text)]">
                      {item.name}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 w-full">
                    <div className="flex items-center justify-center py-1 px-3 w-full bg-[color:var(--1-tokens-color-modes-input-primary-default-background)] rounded-md border border-[color:var(--1-tokens-color-modes-input-primary-default-border)]">
                      <div className="font-label-smaller text-[color:var(--1-tokens-color-modes-input-primary-default-text)]">
                        {item.sales} {t("dashboard.sections.bestSales.sales")}
                      </div>
                    </div>
                    <div className="flex items-center justify-center py-1 px-3 w-full bg-[color:var(--1-tokens-color-modes-input-primary-default-background)] rounded-md border border-[color:var(--1-tokens-color-modes-input-primary-default-border)]">
                      <div className="font-label-smaller text-[color:var(--1-tokens-color-modes-input-primary-default-text)]">
                        {item.revenue}{" "}
                        {t("dashboard.sections.bestSales.revenue")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const TopClientsCard = () => {
  const { t } = useTranslation();

  return (
    <Card className="w-full flex-1 shadow-1dp-ambient">
      <CardContent className="p-5 h-full">
        <div className="flex flex-col gap-1 mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img className="w-6 h-6" alt="Icon" src="/img/icon-2.svg" />
              <div className="font-bold text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] text-lg leading-7">
                {t("dashboard.sections.topClients.title")}
              </div>
            </div>
          </div>
          <div className="font-normal text-primary-neutal-500 text-sm tracking-[-0.28px]">
            {t("dashboard.sections.topClients.period")}
          </div>
        </div>
        <div className="flex items-center justify-center gap-16 flex-1 h-full">
          {topClients.map((client) => (
            <div key={client.id} className="flex flex-col items-center gap-4">
              <div className="flex flex-col items-center justify-center h-[50px]">
                <img
                  className={`w-full ${client.logoHeight} object-contain`}
                  alt={`Client ${t(client.rank)}`}
                  src={client.logo}
                />
              </div>
              <div className="font-bold text-1-tokens-color-modes-common-neutral-hightest text-base text-center">
                {t(client.rank)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const SupportTicketsSection = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="flex items-start gap-8 w-full">
      <Card className="w-full md:w-[588px] h-auto">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="inline-flex items-start gap-1">
              <div className="font-text-large text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)]">
                {t("dashboard.sections.supportTickets.title")}
              </div>
            </div>
            <div className="inline-flex items-center gap-1">
              <div className="font-normal text-coolgray-90 text-sm underline">
                {t("dashboard.sections.supportTickets.seeMore")}
              </div>
              <ChevronRightIcon className="w-3.5 h-3.5" />
            </div>
          </div>
          <SupportTicketsTable />
        </CardContent>
      </Card>
      <div className="flex flex-col gap-8 flex-1">
        <BestSalesCard />
        <TopClientsCard />
      </div>
    </div>
  );
};
