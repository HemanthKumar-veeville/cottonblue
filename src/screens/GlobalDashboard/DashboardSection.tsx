import { useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { ScrollArea, ScrollBar } from "../../components/ui/scroll-area";
import { Crown, MessageSquare } from "lucide-react";
import React from "react";
import { RootState } from "../../store/store";

const ProductCard = ({ product }) => (
  <div className="flex flex-col bg-gray-50 rounded p-2">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-4 w-[352px]">
        <div className="font-bold text-lg leading-7 text-[#475569]">
          #{product.id}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-[82px] h-[82px] rounded overflow-hidden border border-solid border-primary-neutal-200 relative">
            <img
              className="absolute w-[85px] h-[81px] top-0 -left-0.5 object-cover"
              alt={`${product.name} image`}
              src={product.image}
            />
          </div>
          <div className="flex flex-col h-[82px] justify-between">
            <div className="mt-[-1px] font-medium text-[#475569]">
              {product.name}
            </div>
            <div className="text-[#475569] text-sm">
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

const ClientCard = ({ client }) => (
  <Card className="shadow-1dp-ambient rounded">
    <CardContent className="px-5 py-2">
      <div className="font-bold text-lg leading-7 text-[#475569]">
        #{client.id} : {client.name}
      </div>
    </CardContent>
  </Card>
);

const TicketCard = ({ ticket }) => (
  <div className="p-2 rounded border border-solid border-gray-300">
    <div className="bg-white rounded p-1">
      <div className="flex flex-col gap-1">
        <div className="font-medium text-[#475569]">{ticket.issue}</div>
        <div className="text-[#475569] text-xs">{ticket.client}</div>
      </div>
    </div>
  </div>
);

const DashboardSection = (): JSX.Element => {
  const { summary } = useSelector((state: RootState) => state.dashboard);
  console.log({ summary });
  const topProducts =
    summary?.dashboard_data?.most_sold_products?.map((prod, index) => ({
      id: index + 1,
      name: prod.product_name,
      image: prod.product_image,
      price: `${prod.price_of_pack} €/${prod.pack_quantity}pcs`,
      quantity: prod.ordered_quantity,
    })) || [];

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
      <Card className="flex-1 rounded">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <Crown className="w-6 h-6 text-[#475569]" />
          <CardTitle className="font-bold text-lg leading-7 text-[#475569]">
            Top 10 produits commandés
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[28rem] pr-4">
            <div className="flex flex-col gap-4 p-5 pt-0">
              {topProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-8 flex-1">
        <Card className="rounded">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Crown className="w-6 h-6 text-[#475569]" />
              <CardTitle className="font-bold text-lg leading-7 text-[#475569]">
                Top 3 clients
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {topClients.map((client) => (
              <ClientCard key={client.id} client={client} />
            ))}
          </CardContent>
        </Card>

        <Card className="flex-1 rounded">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="flex w-6 h-6 items-center justify-center p-0.5">
                <MessageSquare className="w-4 h-4 text-[#475569]" />
              </div>
              <CardTitle className="font-bold text-lg leading-7 text-[#475569]">
                Derniers tickets
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
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
