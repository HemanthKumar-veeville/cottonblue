import { Card, CardContent } from "../../components/ui/card";
import { ScrollArea } from "../../components/ui/scroll-area";
import { CheckCircle, Search, Loader2 } from "lucide-react";
import React, { useState, useMemo, useEffect } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import TicketModal from "../../components/TicketModal/TicketModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useTranslation } from "react-i18next";
import { fetchTickets } from "../../store/features/ticketSlice";
import { useAppDispatch, RootState, useAppSelector } from "../../store/store";

export enum TicketStatus {
  OPEN = "open",
  IN_PROGRESS = "in progress",
  CLOSED = "closed",
}

interface Ticket {
  id: string;
  title: string;
  status: TicketStatus;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface TicketCardProps {
  ticket: Ticket;
  onClick: (ticket: Ticket) => void;
  onCheckboxClick: (ticket: Ticket, e: React.MouseEvent) => void;
}

const TicketCard: React.FC<TicketCardProps> = ({
  ticket,
  onClick,
  onCheckboxClick,
}) => {
  const { t } = useTranslation();

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.OPEN:
        return "bg-blue-100 text-blue-800";
      case TicketStatus.IN_PROGRESS:
        return "bg-yellow-100 text-yellow-800";
      case TicketStatus.CLOSED:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className="border-[color:var(--1-tokens-color-modes-border-primary)] hover:shadow-md transition-all duration-200 cursor-pointer"
        onClick={() => onClick(ticket)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onClick(ticket);
          }
        }}
      >
        <CardContent className="flex items-center justify-between p-[var(--2-tokens-screen-modes-common-spacing-m)]">
          <div className="flex w-full items-center justify-between p-[var(--2-tokens-screen-modes-common-spacing-s)] bg-white rounded-[var(--2-tokens-screen-modes-common-spacing-XS)] hover:bg-gray-50 transition-colors duration-200">
            <div className="flex flex-col items-start gap-1.5 flex-1 mr-4">
              <div className="font-label-medium font-[number:var(--label-medium-font-weight)] text-[color:var(--1-tokens-color-modes-common-neutral-hightest)] text-[length:var(--label-medium-font-size)] tracking-[var(--label-medium-letter-spacing)] leading-[var(--label-medium-line-height)] [font-style:var(--label-medium-font-style)] break-words">
                {ticket?.id ?? "#N/A"} - {ticket?.ticket_title ?? "Untitled"}
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  className={`${getStatusColor(
                    ticket?.status ?? TicketStatus.OPEN
                  )} font-label-small pointer-events-none`}
                >
                  {t(ticket?.status ?? TicketStatus.OPEN)}
                </Badge>
                <span className="font-label-small text-[color:var(--1-tokens-color-modes-common-neutral-medium)]">
                  {new Date(
                    ticket?.createdAt ?? new Date()
                  ).toLocaleDateString()}
                </span>
              </div>
            </div>
            {ticket?.status === TicketStatus.CLOSED ? (
              <motion.div
                className="relative w-[var(--2-tokens-screen-modes-common-spacing-l)] h-6 bg-white rounded-[35px] shrink-0"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <CheckCircle className="absolute w-[18px] h-[18px] top-[3px] left-[3px] text-green-600" />
              </motion.div>
            ) : (
              <motion.div
                className="w-[var(--2-tokens-screen-modes-common-spacing-l)] h-6 rounded-[35px] border-2 border-dashed border-green-600 shrink-0 cursor-pointer hover:border-green-700 transition-colors duration-200"
                onClick={(e: React.MouseEvent) => onCheckboxClick(ticket, e)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

interface TicketListProps {
  tickets: Ticket[];
  title: string;
  onTicketClick: (ticket: Ticket) => void;
  onCheckboxClick: (ticket: Ticket, e: React.MouseEvent) => void;
  isLoading?: boolean;
}

const TicketList: React.FC<TicketListProps> = ({
  tickets,
  title,
  onTicketClick,
  onCheckboxClick,
  isLoading = false,
}) => (
  <div className="flex flex-col items-start gap-[var(--2-tokens-screen-modes-common-spacing-m)] bg-white w-full">
    <h2 className="font-label-medium font-[number:var(--label-medium-font-weight)] text-1-tokens-color-modes-common-neutral-hightest text-[length:var(--label-medium-font-size)] tracking-[var(--label-medium-letter-spacing)] leading-[var(--label-medium-line-height)] [font-style:var(--label-medium-font-style)]">
      {title}
    </h2>
    <ScrollArea className="h-[742px] w-full md:h-[600px] sm:h-[400px]">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <motion.div className="flex flex-col gap-2.5" layout>
          <AnimatePresence mode="popLayout">
            {tickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onClick={onTicketClick}
                onCheckboxClick={onCheckboxClick}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </ScrollArea>
  </div>
);

const getStatusColor = (status: TicketStatus): string => {
  switch (status) {
    case TicketStatus.OPEN:
      return "bg-blue-100 text-blue-800";
    case TicketStatus.IN_PROGRESS:
      return "bg-yellow-100 text-yellow-800";
    case TicketStatus.CLOSED:
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function Tickets(): JSX.Element {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const { tickets, status } = useAppSelector(
    (state: RootState) => state.ticket
  );
  const isLoading = status === "loading";

  useEffect(() => {
    const fetchTicketsData = async () => {
      try {
        await dispatch(
          fetchTickets({
            dnsPrefix: "admin", // You'll need to get this from your app configuration
            ticketStatus: statusFilter === "all" ? undefined : statusFilter,
          })
        ).unwrap();
      } catch (error) {
        console.error("Failed to fetch tickets:", error);
      }
    };

    fetchTicketsData();
  }, [dispatch, statusFilter]);

  const handleTicketClick = (ticket: Ticket): void => {
    setSelectedTicket(ticket);
  };

  const handleCloseModal = (): void => {
    setSelectedTicket(null);
  };

  const handleCheckboxClick = async (ticket: Ticket, e: React.MouseEvent) => {
    e.stopPropagation();
    if (ticket.status !== TicketStatus.CLOSED) {
      // Here you would typically call an API to update the ticket status
      // For now, we'll just refetch the tickets
      try {
        await dispatch(
          fetchTickets({
            dnsPrefix: "admin",
            ticketStatus: statusFilter === "all" ? undefined : statusFilter,
          })
        ).unwrap();
      } catch (error) {
        console.error("Failed to update ticket status:", error);
      }
    }
  };

  const handleNewTicket = (): void => {
    const newTicket: Ticket = {
      id: `#${Math.floor(Math.random() * 1000000)}`,
      title: "",
      status: TicketStatus.OPEN,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setSelectedTicket(newTicket);
  };

  const filteredTicketsInProgress = useMemo(() => {
    return (
      tickets?.filter(
        (ticket: any) =>
          ticket?.ticket_status === TicketStatus.OPEN ||
          ticket?.ticket_status === TicketStatus.IN_PROGRESS
      ) ?? []
    );
  }, [tickets]);

  const filteredTicketsClosed = useMemo(() => {
    return (
      tickets?.filter(
        (ticket: any) => ticket?.ticket_status === TicketStatus.CLOSED
      ) ?? []
    );
  }, [tickets]);

  return (
    <section className="flex flex-col items-start gap-[var(--2-tokens-screen-modes-common-spacing-l)] p-[var(--2-tokens-screen-modes-common-spacing-l)] bg-white rounded-[var(--2-tokens-screen-modes-common-spacing-XS)] w-full">
      <div className="flex items-center justify-between w-full">
        <h1 className="font-heading-h3 font-[number:var(--heading-h3-font-weight)] text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] text-[length:var(--heading-h3-font-size)] tracking-[var(--heading-h3-letter-spacing)] leading-[var(--heading-h3-line-height)] [font-style:var(--heading-h3-font-style)]">
          {t("tickets.title")}
        </h1>
        <Button
          className="bg-[color:var(--1-tokens-color-modes-button-primary-default-background)] text-[color:var(--1-tokens-color-modes-button-primary-default-text)] hover:bg-[color:var(--1-tokens-color-modes-button-primary-hover-background)]"
          onClick={handleNewTicket}
        >
          {t("tickets.newTicket")}
        </Button>
      </div>

      <div className="flex items-center gap-[var(--2-tokens-screen-modes-common-spacing-m)] w-full">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[color:var(--1-tokens-color-modes-common-neutral-medium)] w-4 h-4 pointer-events-none" />
          <Input
            placeholder={t("tickets.search.placeholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 w-full placeholder:text-[color:var(--1-tokens-color-modes-common-neutral-medium)] placeholder:pl-0 font-label-medium"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) =>
            setStatusFilter(value as TicketStatus | "all")
          }
        >
          <SelectTrigger className="w-[180px] font-label-medium">
            <SelectValue placeholder={t("tickets.status.all")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("tickets.status.all")}</SelectItem>
            {Object.values(TicketStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {t(status)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-start justify-between p-2.5 w-full">
        <div className="flex-1">
          <TicketList
            tickets={filteredTicketsInProgress}
            title={t("tickets.lists.inProgress")}
            onTicketClick={handleTicketClick}
            onCheckboxClick={handleCheckboxClick}
            isLoading={isLoading}
          />
        </div>
        <div className="w-[1px] mx-4 bg-[color:var(--1-tokens-color-modes-input-primary-disable-background)] self-stretch" />
        <div className="flex-1">
          <TicketList
            tickets={filteredTicketsClosed}
            title={t("tickets.lists.closed")}
            onTicketClick={handleTicketClick}
            onCheckboxClick={handleCheckboxClick}
            isLoading={isLoading}
          />
        </div>
      </div>

      {selectedTicket && (
        <TicketModal onClose={handleCloseModal} ticket={selectedTicket} />
      )}
    </section>
  );
}
