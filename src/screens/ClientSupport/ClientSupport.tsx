import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Separator } from "../../components/ui/separator";
import { Textarea } from "../../components/ui/textarea";
import { ArrowLeft, CheckCircle, Send } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import ClientTicketPopup from "../ClientTicketPopup/ClientTicketPopup";

const TicketCard = ({
  ticket,
  isCompleted,
  onClick,
}: {
  ticket: any;
  isCompleted: boolean;
  onClick: () => void;
}) => {
  const { t } = useTranslation();
  return (
    <Card
      className="border-[color:var(--1-tokens-color-modes-border-primary)] rounded-[var(--2-tokens-screen-modes-common-spacing-XS)] overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-[var(--2-tokens-screen-modes-common-spacing-m)]">
        <div className="flex items-center justify-between p-[var(--2-tokens-screen-modes-common-spacing-s)] bg-white rounded-[var(--2-tokens-screen-modes-common-spacing-XS)]">
          <div className="flex flex-col gap-1.5">
            <h5 className="font-label-medium font-[number:var(--label-medium-font-weight)] text-black text-[length:var(--label-medium-font-size)] tracking-[var(--label-medium-letter-spacing)] leading-[var(--label-medium-line-height)]">
              {ticket.id} - {ticket.title}
            </h5>
            <p className="font-label-smaller font-[number:var(--label-smaller-font-weight)] text-black text-[length:var(--label-smaller-font-size)] tracking-[var(--label-smaller-letter-spacing)] leading-[var(--label-smaller-line-height)]">
              {t("clientSupport.ticket.location")}: {ticket.location}
            </p>
            <p className="font-label-smaller font-[number:var(--label-smaller-font-weight)] text-black text-[length:var(--label-smaller-font-size)] tracking-[var(--label-smaller-letter-spacing)] leading-[var(--label-smaller-line-height)]">
              {t("clientSupport.ticket.status")}: {ticket.status}
            </p>
          </div>
          <div
            className={`relative w-[var(--2-tokens-screen-modes-common-spacing-l)] h-6 ${
              isCompleted ? "bg-white" : ""
            } rounded-[35px] border-2 ${
              isCompleted ? "border-none" : "border-dashed"
            } border-1-tokens-color-modes-common-success-medium`}
          >
            {isCompleted && (
              <CheckCircle className="absolute w-[24px] h-[24px] top-[3px] left-[3px] text-1-tokens-color-modes-common-success-medium" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const TicketList = ({
  tickets,
  title,
  isCompleted,
  onTicketClick,
}: {
  tickets: any;
  title: string;
  isCompleted: boolean;
  onTicketClick: (ticket: any) => void;
}) => {
  const { t } = useTranslation();
  return (
    <>
      <h4 className="text-1-tokens-color-modes-common-neutral-hightest text-[length:var(--label-medium-font-size)] leading-[var(--label-medium-line-height)] font-label-medium font-[number:var(--label-medium-font-weight)] tracking-[var(--label-medium-letter-spacing)] [font-style:var(--label-medium-font-style)]">
        {title}
      </h4>
      {tickets.map((ticket: any, index: number) => (
        <TicketCard
          key={`${isCompleted ? "completed" : "active"}-${index}`}
          ticket={ticket}
          isCompleted={isCompleted}
          onClick={() => onTicketClick(ticket)}
        />
      ))}
    </>
  );
};

export default function ClientSupportTicket() {
  const { t } = useTranslation();
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  const activeTickets = [
    {
      id: "#123456",
      title: "Problème de connexion",
      location: "Chronodrive - Lille",
      status: "Ouvert",
    },
  ];

  const completedTickets = [
    {
      id: "#123456",
      title: "Problème de connexion",
      location: "Chronodrive - Lille",
      status: "Terminé",
    },
    {
      id: "#123456",
      title: "Problème de connexion",
      location: "Chronodrive - Lille",
      status: "Terminé",
    },
  ];

  const handleTicketClick = (ticket: any) => {
    setSelectedTicket(ticket);
  };

  return (
    <>
      <main className="flex flex-col items-start gap-[var(--2-tokens-screen-modes-common-spacing-XL)] pt-[var(--2-tokens-screen-modes-common-spacing-l)] pr-[var(--2-tokens-screen-modes-common-spacing-l)] pb-[var(--2-tokens-screen-modes-common-spacing-l)] pl-[var(--2-tokens-screen-modes-common-spacing-l)] bg-white rounded-[var(--2-tokens-screen-modes-button-border-radius)]">
        <header className="flex items-center gap-[var(--2-tokens-screen-modes-common-spacing-XS)]">
          <Button
            variant="ghost"
            size="icon"
            className="w-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-line-height)] h-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-line-height)]"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h3 className="text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] text-[length:var(--heading-h3-font-size)] leading-[var(--heading-h3-line-height)] font-heading-h3 font-[number:var(--heading-h3-font-weight)] tracking-[var(--heading-h3-letter-spacing)] [font-style:var(--heading-h3-font-style)]">
            {t("clientSupport.title")}
          </h3>
        </header>

        <div className="flex w-full gap-4">
          <div className="flex-1">
            <div className="flex flex-col gap-[var(--2-tokens-screen-modes-common-spacing-l)]">
              <div className="relative">
                <Input
                  className="pt-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-v)] pr-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-h)] pb-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-v)] pl-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-h)] bg-[color:var(--1-tokens-color-modes-input-primary-default-background)] rounded-[var(--2-tokens-screen-modes-input-border-radius)] border-[color:var(--1-tokens-color-modes-input-primary-default-border)]"
                  id="title"
                />
                <label
                  htmlFor="title"
                  className="absolute top-[-9px] left-4 px-1 bg-white text-[color:var(--1-tokens-color-modes-input-primary-default-placeholder-label)] text-[length:var(--label-smaller-font-size)] font-label-smaller font-[number:var(--label-smaller-font-weight)] tracking-[var(--label-smaller-letter-spacing)] leading-[var(--label-smaller-line-height)] [font-style:var(--label-smaller-font-style)]"
                >
                  {t("clientSupport.form.title")}
                </label>
              </div>

              <div className="relative h-[317px]">
                <Textarea
                  className="h-full pt-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-v)] pr-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-h)] pb-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-v)] pl-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-h)] bg-[color:var(--1-tokens-color-modes-input-primary-default-background)] rounded-[var(--2-tokens-screen-modes-input-border-radius)] border-[color:var(--1-tokens-color-modes-input-primary-default-border)]"
                  id="message"
                />
                <label
                  htmlFor="message"
                  className="absolute top-[-9px] left-4 px-1 bg-white text-[color:var(--1-tokens-color-modes-input-primary-default-placeholder-label)] text-[length:var(--label-smaller-font-size)] font-label-smaller font-[number:var(--label-smaller-font-weight)] tracking-[var(--label-smaller-letter-spacing)] leading-[var(--label-smaller-line-height)] [font-style:var(--label-smaller-font-style)]"
                >
                  {t("clientSupport.form.message")}
                </label>
              </div>

              <Button className="w-[352px] flex items-center justify-center gap-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-gap)] py-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-v)] px-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-h)] bg-[#00b85b] text-white rounded-[var(--2-tokens-screen-modes-button-border-radius)] border border-solid border-[#1a8563]">
                <Send className="w-4 h-4" />
                <span className="font-label-medium font-[number:var(--label-medium-font-weight)] text-[color:var(--1-tokens-color-modes-button-primary-default-text)] text-[length:var(--label-medium-font-size)] tracking-[var(--label-medium-letter-spacing)] leading-[var(--label-medium-line-height)] [font-style:var(--label-medium-font-style)]">
                  {t("clientSupport.ticket.submit")}
                </span>
              </Button>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-2.5 p-2.5">
            <TicketList
              tickets={activeTickets}
              title={t("clientSupport.activeTickets")}
              isCompleted={false}
              onTicketClick={handleTicketClick}
            />
            <TicketList
              tickets={completedTickets}
              title={t("clientSupport.completedTickets")}
              isCompleted={true}
              onTicketClick={handleTicketClick}
            />
          </div>
        </div>
      </main>
      {selectedTicket && (
        <ClientTicketPopup
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </>
  );
}
