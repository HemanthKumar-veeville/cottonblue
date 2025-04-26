import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Separator } from "../../components/ui/separator";
import { Textarea } from "../../components/ui/textarea";
import { ArrowLeft, CheckCircle, Send } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import ClientTicketPopup from "../ClientTicketPopup/ClientTicketPopup";
import { motion, AnimatePresence } from "framer-motion";

const TicketCard = ({
  ticket,
  isCompleted,
  onClick,
  onCircleClick,
}: {
  ticket: any;
  isCompleted: boolean;
  onClick: () => void;
  onCircleClick?: () => void;
}) => {
  const { t } = useTranslation();
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className="border-[color:var(--1-tokens-color-modes-border-primary)] rounded-[var(--2-tokens-screen-modes-common-spacing-XS)] overflow-hidden cursor-pointer hover:bg-[color:var(--1-tokens-color-modes-input-primary-hover-background)] transition-colors"
        onClick={onClick}
      >
        <CardContent className="p-[var(--2-tokens-screen-modes-common-spacing-m)]">
          <div className="flex items-center justify-between p-[var(--2-tokens-screen-modes-common-spacing-s)]">
            <div className="flex flex-col gap-1.5">
              <h5 className="font-label-medium font-[number:var(--label-medium-font-weight)] text-[color:var(--1-tokens-color-modes-input-primary-default-text)] text-[length:var(--label-medium-font-size)] tracking-[var(--label-medium-letter-spacing)] leading-[var(--label-medium-line-height)]">
                {ticket.id} - {ticket.title}
              </h5>
              <p className="font-label-smaller font-[number:var(--label-smaller-font-weight)] text-[color:var(--1-tokens-color-modes-input-primary-default-placeholder-label)] text-[length:var(--label-smaller-font-size)] tracking-[var(--label-smaller-letter-spacing)] leading-[var(--label-smaller-line-height)]">
                {t("clientSupport.ticket.location")}: {ticket.location}
              </p>
              <p className="font-label-smaller font-[number:var(--label-smaller-font-weight)] text-[color:var(--1-tokens-color-modes-input-primary-default-placeholder-label)] text-[length:var(--label-smaller-font-size)] tracking-[var(--label-smaller-letter-spacing)] leading-[var(--label-smaller-line-height)]">
                {t("clientSupport.ticket.status")}: {ticket.status}
              </p>
            </div>
            {isCompleted ? (
              <motion.div
                className="relative w-[var(--2-tokens-screen-modes-common-spacing-l)] h-6 bg-[color:var(--1-tokens-color-modes-input-primary-default-background)] rounded-[35px]"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <CheckCircle className="absolute w-[24px] h-[24px] top-[3px] left-[3px] text-1-tokens-color-modes-common-success-medium" />
              </motion.div>
            ) : (
              <motion.div
                className="relative w-[var(--2-tokens-screen-modes-common-spacing-l)] h-6 rounded-[35px] border-2 border-dashed border-1-tokens-color-modes-common-success-medium cursor-pointer hover:border-green-700"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onCircleClick?.();
                }}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const TicketList = ({
  tickets,
  isCompleted,
  onTicketClick,
  onCircleClick,
}: {
  tickets: any;
  isCompleted: boolean;
  onTicketClick: (ticket: any) => void;
  onCircleClick?: (ticket: any) => void;
}) => {
  const { t } = useTranslation();
  return (
    <motion.div
      className="flex flex-col gap-2.5 overflow-y-auto pr-2 scrollbar-hide"
      layout
      style={{
        height: "calc(100% - 40px)",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <AnimatePresence mode="popLayout">
        {tickets.map((ticket: any, index: number) => (
          <TicketCard
            key={`${isCompleted ? "completed" : "active"}-${index}`}
            ticket={ticket}
            isCompleted={isCompleted}
            onClick={() => onTicketClick(ticket)}
            onCircleClick={() => onCircleClick?.(ticket)}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default function ClientSupportTicket() {
  const { t } = useTranslation();
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");
  const [activeTickets, setActiveTickets] = useState([
    {
      id: "#123456a",
      title: "Problème de connexion",
      location: "Chronodrive - Lille",
      status: "Ouvert",
    },
    {
      id: "#123456b",
      title: "Problème de connexion",
      location: "Chronodrive - Lille",
      status: "Ouvert",
    },
    {
      id: "#123456c",
      title: "Problème de connexion",
      location: "Chronodrive - Lille",
      status: "Ouvert",
    },
    {
      id: "#123456d",
      title: "Problème de connexion",
      location: "Chronodrive - Lille",
      status: "Ouvert",
    },
    {
      id: "#123456e",
      title: "Problème de connexion",
      location: "Chronodrive - Lille",
      status: "Ouvert",
    },
  ]);

  const [completedTickets, setCompletedTickets] = useState([
    {
      id: "#123456a1",
      title: "Problème de connexion",
      location: "Chronodrive - Lille",
      status: "Terminé",
    },
    {
      id: "#123456b1",
      title: "Problème de connexion",
      location: "Chronodrive - Lille",
      status: "Terminé",
    },
    {
      id: "#123456c1",
      title: "Problème de connexion",
      location: "Chronodrive - Lille",
      status: "Terminé",
    },
    {
      id: "#123456d1",
      title: "Problème de connexion",
      location: "Chronodrive - Lille",
      status: "Terminé",
    },
    {
      id: "#123456e1",
      title: "Problème de connexion",
      location: "Chronodrive - Lille",
      status: "Terminé",
    },
    {
      id: "#123456f1",
      title: "Problème de connexion",
      location: "Chronodrive - Lille",
      status: "Terminé",
    },
    {
      id: "#123456g1",
      title: "Problème de connexion",
      location: "Chronodrive - Lille",
      status: "Terminé",
    },
    {
      id: "#123456h1",
      title: "Problème de connexion",
      location: "Chronodrive - Lille",
      status: "Terminé",
    },
    {
      id: "#123456i1",
      title: "Problème de connexion",
      location: "Chronodrive - Lille",
      status: "Terminé",
    },
    {
      id: "#123456j1",
      title: "Problème de connexion",
      location: "Chronodrive - Lille",
      status: "Terminé",
    },
    {
      id: "#123456k1",
      title: "Problème de connexion",
      location: "Chronodrive - Lille",
      status: "Terminé",
    },
    {
      id: "#123456l1",
      title: "Problème de connexion",
      location: "Chronodrive - Lille",
      status: "Terminé",
    },
  ]);

  const handleTicketClick = (ticket: any) => {
    setSelectedTicket(ticket);
  };

  const handleTicketComplete = (ticket: any) => {
    setActiveTickets((prev) => prev.filter((t) => t.id !== ticket.id));
    const updatedTicket = {
      ...ticket,
      status: "Terminé",
    };
    setCompletedTickets((prev) => [updatedTicket, ...prev]);
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

          <div className="flex-1 flex flex-col gap-5 p-2.5 pt-0 h-[calc(100vh-200px)] min-h-[500px]">
            <div className="flex flex-col h-full bg-[color:var(--1-tokens-color-modes-input-primary-default-background)] rounded-[var(--2-tokens-screen-modes-input-border-radius)] border border-[color:var(--1-tokens-color-modes-input-primary-default-border)] p-4">
              <div className="flex gap-4 mb-4">
                <Button
                  variant={activeTab === "active" ? "default" : "outline"}
                  onClick={() => setActiveTab("active")}
                  className="flex-1"
                >
                  {t("clientSupport.activeTickets")}
                </Button>
                <Button
                  variant={activeTab === "completed" ? "default" : "outline"}
                  onClick={() => setActiveTab("completed")}
                  className="flex-1"
                >
                  {t("clientSupport.completedTickets")}
                </Button>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === "active" ? (
                  <TicketList
                    key="active"
                    tickets={activeTickets}
                    isCompleted={false}
                    onTicketClick={handleTicketClick}
                    onCircleClick={handleTicketComplete}
                  />
                ) : (
                  <TicketList
                    key="completed"
                    tickets={completedTickets}
                    isCompleted={true}
                    onTicketClick={handleTicketClick}
                  />
                )}
              </AnimatePresence>
            </div>
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
