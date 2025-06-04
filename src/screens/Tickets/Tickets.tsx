import { Card, CardContent } from "../../components/ui/card";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { CheckCircle, Search, Inbox } from "lucide-react";
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
import {
  fetchTickets,
  resetCurrentTicket,
  updateTicketStatus,
} from "../../store/features/ticketSlice";
import { useAppDispatch, RootState, useAppSelector } from "../../store/store";
import { Skeleton } from "../../components/Skeleton";
import {
  getTicketStatusText,
  getTicketStatusColor,
} from "../../utils/statusUtil";

export enum TicketStatus {
  OPEN = "open",
  IN_PROGRESS = "in_progress",
  CLOSED = "closed",
}

interface Ticket {
  ticket_id: number;
  ticket_title: string;
  ticket_status: TicketStatus;
  company_name: string;
  store_name: string | null;
  created_at: string;
  closed_at: string | null;
  description?: string;
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
                #{ticket.ticket_id} - {ticket.ticket_title}
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  className={`${getTicketStatusColor(
                    ticket.ticket_status
                  )} font-label-small pointer-events-none border`}
                >
                  {getTicketStatusText(ticket.ticket_status, t)}
                </Badge>
                <span className="font-label-small text-[color:var(--1-tokens-color-modes-common-neutral-medium)]">
                  {new Date(ticket.created_at).toLocaleDateString()}
                </span>
                {ticket.company_name && (
                  <span className="font-label-small text-[color:var(--1-tokens-color-modes-common-neutral-medium)]">
                    {ticket.company_name}
                  </span>
                )}
              </div>
            </div>
            {ticket.ticket_status === TicketStatus.CLOSED ? (
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
                // onClick={(e: React.MouseEvent) => onCheckboxClick(ticket, e)}
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

const EmptyState = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="flex flex-col items-center justify-center h-full py-8 px-4">
    <div className="rounded-full bg-gray-100 p-3 mb-4">
      <Inbox className="w-6 h-6 text-gray-400" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
    <p className="text-sm text-gray-500 text-center">{description}</p>
  </div>
);

const TicketList: React.FC<TicketListProps> = ({
  tickets,
  title,
  onTicketClick,
  onCheckboxClick,
  isLoading = false,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-start gap-[var(--2-tokens-screen-modes-common-spacing-m)] bg-white w-full">
      <h2 className="font-label-medium font-[number:var(--label-medium-font-weight)] text-1-tokens-color-modes-common-neutral-hightest text-[length:var(--label-medium-font-size)] tracking-[var(--label-medium-letter-spacing)] leading-[var(--label-medium-line-height)] [font-style:var(--label-medium-font-style)]">
        {title}
      </h2>
      <div className="h-[742px] w-full md:h-[600px] sm:h-[400px]">
        <ScrollAreaPrimitive.Root className="h-full w-full overflow-hidden">
          <ScrollAreaPrimitive.Viewport className="h-full w-full">
            <div className="p-1 pr-4">
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i} className="w-full">
                      <CardContent className="p-4">
                        <div className="animate-pulse flex items-center justify-between">
                          <div className="space-y-2 flex-1">
                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                            <div className="h-4 bg-gray-200 rounded w-1/4" />
                          </div>
                          <div className="h-6 w-6 bg-gray-200 rounded-full" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : tickets.length === 0 ? (
                <EmptyState
                  title={t("tickets.empty.title")}
                  description={t("tickets.empty.description")}
                />
              ) : (
                <motion.div className="flex flex-col gap-2.5" layout>
                  <AnimatePresence mode="popLayout">
                    {tickets.map((ticket) => (
                      <TicketCard
                        key={ticket.ticket_id}
                        ticket={ticket}
                        onClick={onTicketClick}
                        onCheckboxClick={onCheckboxClick}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </ScrollAreaPrimitive.Viewport>
          <ScrollAreaPrimitive.Scrollbar
            orientation="vertical"
            className="flex select-none touch-none p-0.5 bg-gray-100 transition-colors duration-150 ease-out hover:bg-gray-200 w-2"
          >
            <ScrollAreaPrimitive.Thumb className="flex-1 bg-gray-300 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
          </ScrollAreaPrimitive.Scrollbar>
        </ScrollAreaPrimitive.Root>
      </div>
    </div>
  );
};

export default function Tickets(): JSX.Element {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const { selectedCompany } = useAppSelector(
    (state: RootState) => state.client
  );
  const dns = selectedCompany?.dns || "admin";
  const { tickets, status } = useAppSelector(
    (state: RootState) => state.ticket
  );
  const isLoading = status === "loading";
  const { adminMode } = useAppSelector((state: RootState) => state.auth);
  const fetchTicketsData = async () => {
    try {
      await dispatch(
        fetchTickets({
          dnsPrefix: adminMode ? "admin" : dns,
          ticketStatus: statusFilter === "all" ? undefined : statusFilter,
        })
      ).unwrap();
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
    }
  };
  useEffect(() => {
    fetchTicketsData();
  }, [dispatch, statusFilter, selectedTicket, dns]);

  const handleTicketClick = (ticket: Ticket): void => {
    dispatch(resetCurrentTicket());
    setSelectedTicket(ticket);
  };

  const handleCloseModal = (): void => {
    setSelectedTicket(null);
  };

  const handleCheckboxClick = async (ticket: Ticket, e: React.MouseEvent) => {
    e.stopPropagation();
    if (ticket.ticket_status !== TicketStatus.CLOSED) {
      try {
        await dispatch(
          updateTicketStatus({
            dnsPrefix: dns,
            ticketId: ticket?.ticket_id?.toString(),
            status: TicketStatus.CLOSED,
          })
        ).unwrap();
        await fetchTicketsData();
      } catch (error) {
        console.error("Failed to update ticket status:", error);
      }
    }
  };

  const handleNewTicket = (): void => {
    const newTicket: Ticket = {
      ticket_id: Math.floor(Math.random() * 1000000),
      ticket_title: "",
      ticket_status: TicketStatus.OPEN,
      company_name: "",
      store_name: null,
      created_at: new Date().toISOString(),
      closed_at: null,
    };
    setSelectedTicket(newTicket);
  };

  const filteredTicketsInProgress = useMemo(() => {
    return (
      tickets?.filter((ticket: any) => {
        if (!ticket) return false;
        const matchesSearch =
          searchQuery === "" ||
          ticket.ticket_title
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          ticket.company_name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          ticket.ticket_id.toString().includes(searchQuery);

        return (
          matchesSearch &&
          (ticket.ticket_status === TicketStatus.OPEN ||
            ticket.ticket_status === TicketStatus.IN_PROGRESS)
        );
      }) ?? []
    );
  }, [tickets, searchQuery]);

  const filteredTicketsClosed = useMemo(() => {
    return (
      tickets?.filter((ticket: any) => {
        if (!ticket) return false;
        const matchesSearch =
          searchQuery === "" ||
          ticket.ticket_title
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          ticket.company_name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          ticket.ticket_id.toString().includes(searchQuery);

        return matchesSearch && ticket.ticket_status === TicketStatus.CLOSED;
      }) ?? []
    );
  }, [tickets, searchQuery]);

  return (
    <section className="flex flex-col items-start gap-[var(--2-tokens-screen-modes-common-spacing-l)] p-[var(--2-tokens-screen-modes-common-spacing-l)] bg-white rounded-[var(--2-tokens-screen-modes-common-spacing-XS)] w-full">
      <div className="flex items-center justify-between w-full">
        <h1 className="font-heading-h3 font-[number:var(--heading-h3-font-weight)] text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] text-[length:var(--heading-h3-font-size)] tracking-[var(--heading-h3-letter-spacing)] leading-[var(--heading-h3-line-height)] [font-style:var(--heading-h3-font-style)]">
          {t("tickets.title")}
        </h1>
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
                {getTicketStatusText(status, t)}
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
        <TicketModal
          onClose={handleCloseModal}
          ticketId={selectedTicket?.ticket_id?.toString()}
        />
      )}
    </section>
  );
}
