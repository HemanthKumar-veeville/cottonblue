import { useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { ScrollArea, ScrollBar } from "../../components/ui/scroll-area";
import { Crown, MessageSquare, Package2 } from "lucide-react";
import React from "react";
import { RootState } from "../../store/store";
import {
  colors,
  typography,
  spacing,
  shadows,
  borderRadius,
} from "../../theme/constants";

import { useTranslation } from "react-i18next";
import BudgetDashboard from "../ClientDashboard/BudgetDashboard";
import { useLocation } from "react-router-dom";
import EmptyState from "../../components/EmptyState";

interface Product {
  id: number;
  name: string;
  image: string;
  price: string;
  quantity: number;
}

interface Client {
  id: number;
  name: string;
}

interface Ticket {
  id: number;
  issue: string;
  client: string;
}

const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
  <div className="flex flex-col bg-[#F8FAFC] rounded-md transition-all duration-200 hover:shadow-md p-4">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-6">
        <div className="font-semibold text-lg text-[#475569]">
          #{product.id}
        </div>
        <div className="flex items-center">
          <div className="w-20 h-20 rounded-md overflow-hidden border border-[#E2E8F0] flex items-center justify-center bg-white">
            <img
              className="max-w-full max-h-full object-contain"
              alt={`${product.name} image`}
              src={product.image}
            />
          </div>
          <div className="w-px h-16 bg-[#E2E8F0] mx-4"></div>
          <div className="flex flex-col gap-2">
            <div className="font-medium text-[#475569]">{product.name}</div>
            <div className="text-[#64748B] text-sm font-medium">
              Ref : {product.id}
              <br />
              Prix : {product.price}
            </div>
          </div>
        </div>
      </div>
      <div className="font-bold text-[#475569] text-2xl">
        {product.quantity}
      </div>
    </div>
  </div>
);

const ClientCard: React.FC<{ client: Client }> = ({ client }) => (
  <Card className="transition-all duration-200 hover:shadow-md rounded-md">
    <CardContent className="px-6 py-4">
      <div className="font-semibold text-lg text-[#475569] flex items-center gap-2">
        <span>#{client.id}</span>
        <span className="text-[#64748B]">:</span>
        <span>{client.name}</span>
      </div>
    </CardContent>
  </Card>
);

const TicketCard: React.FC<{ ticket: Ticket }> = ({ ticket }) => (
  <div className="p-4 rounded-md border border-[#E2E8F0] bg-white transition-all duration-200 hover:shadow-md">
    <div className="flex flex-col gap-2">
      <div className="font-medium text-[#475569]">{ticket.issue}</div>
      <div className="text-[#64748B] text-sm font-medium">{ticket.client}</div>
    </div>
  </div>
);

const DashboardSection: React.FC = () => {
  const { summary } = useSelector((state: RootState) => state.dashboard);
  const { t } = useTranslation();
  const pathname = useLocation().pathname;

  const topProducts =
    summary?.dashboard_data?.most_sold_products?.map(
      (prod: any, index: number) => ({
        id: index + 1,
        name: prod.product_name,
        image: prod.product_image,
        price: `${prod.price_of_pack} €/${prod.pack_quantity}pcs`,
        quantity: prod.ordered_quantity,
      })
    ) || [];

  const topClients = [
    { id: 1, name: "Chronodrive" },
    { id: 2, name: "Dassault Aviation" },
    { id: 3, name: "Cultura" },
  ];

  const latestTickets = [
    { id: 1, issue: "Problème de connexion", client: "Chronodrive - Lille" },
    {
      id: 2,
      issue: "Problème de connexion",
      client: "Dassault System - Seclin",
    },
  ];

  return (
    <div className="flex gap-8 w-full">
      <Card className="flex-1 rounded-md shadow-md">
        <CardHeader className="flex flex-row items-center gap-4 pb-2 px-6 pt-6">
          <Crown className="w-6 h-6 text-[#07515F]" />
          <CardTitle className="font-bold text-lg text-[#475569]">
            {t("dashboard.topProducts")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[32rem]">
            <div className="flex flex-col gap-4 p-6 pt-4">
              {topProducts.length === 0 ? (
                <EmptyState
                  icon={Package2}
                  title={t("dashboard.noTopProducts")}
                  description={t("dashboard.noTopProductsDescription")}
                  className="h-[28rem]"
                />
              ) : (
                topProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              )}
            </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </CardContent>
      </Card>
      <div className="flex flex-col gap-8 flex-1">
        {!pathname?.includes("client-dashboard") ? (
          <Card className="rounded-md shadow-md">
            <CardHeader className="pb-2 px-6 pt-6">
              <div className="flex items-center gap-4">
                <Crown className="w-6 h-6 text-[#07515F]" />
                <CardTitle className="font-bold text-lg text-[#475569]">
                  {t("dashboard.topClients")}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 px-6 pb-6">
              {topClients.map((client) => (
                <ClientCard key={client.id} client={client} />
              ))}
            </CardContent>
          </Card>
        ) : (
          <BudgetDashboard />
        )}
        <Card className="flex-1 rounded-md shadow-md">
          <CardHeader className="pb-2 px-6 pt-6">
            <div className="flex items-center gap-4">
              <MessageSquare className="w-6 h-6 text-[#07515F]" />
              <CardTitle className="font-bold text-lg text-[#475569]">
                {t("dashboard.latestTickets")}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 px-6 pb-6">
            {latestTickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export { DashboardSection };
