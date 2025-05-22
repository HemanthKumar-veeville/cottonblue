import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Separator } from "../../components/ui/separator";
import { Textarea } from "../../components/ui/textarea";
import { ArrowLeft, CheckCircle, Send, Inbox } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import ClientTicketPopup from "../ClientTicketPopup/ClientTicketPopup";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  createTicket,
  fetchTickets,
  updateTicketStatus,
} from "../../store/features/ticketSlice";
import { useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../../store/store";
import { getHost } from "../../utils/hostUtils";
import { TicketStatus } from "../Tickets/Tickets";
import { Skeleton } from "../../components/Skeleton";
import EmptyState from "../../components/EmptyState";
import { Badge } from "../../components/ui/badge";

interface Ticket {
  ticket_id: number;
  ticket_title: string;
  ticket_status: string;
  company_name: string;
  store_name: string | null;
  created_at: string;
  closed_at: string | null;
}

const TicketFormSkeleton = () => (
  <div className="flex-1 animate-pulse">
    <div className="flex flex-col gap-[var(--2-tokens-screen-modes-common-spacing-l)]">
      <div className="relative">
        <div className="h-[40px] bg-gray-200 rounded-[var(--2-tokens-screen-modes-input-border-radius)]" />
      </div>
      <div className="relative h-[317px]">
        <div className="h-full bg-gray-200 rounded-[var(--2-tokens-screen-modes-input-border-radius)]" />
      </div>
      <div className="w-[352px] h-[40px] bg-gray-200 rounded-[var(--2-tokens-screen-modes-button-border-radius)]" />
    </div>
  </div>
);

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "open":
      return "border-blue-200 text-blue-700 bg-blue-50/50 hover:bg-blue-100/50";
    case "in_progress":
      return "border-amber-200 text-amber-700 bg-amber-50/50 hover:bg-amber-100/50";
    case "closed":
      return "border-emerald-200 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-100/50";
    default:
      return "border-gray-200 text-gray-700 bg-gray-50/50 hover:bg-gray-100/50";
  }
};

const formatStatus = (status: string): string => {
  // Replace underscores with spaces and convert to sentence case
  return status.replace(/_/g, " ").replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
  });
};

const TicketCard = ({
  ticket,
  isCompleted,
  onClick,
  isUpdating,
}: {
  ticket: {
    ticket_id: number;
    ticket_title: string;
    ticket_status: string;
    company_name: string;
    store_name: string | null;
    created_at: string;
    closed_at: string | null;
  };
  isCompleted: boolean;
  onClick: () => void;
  isUpdating?: boolean;
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
                {ticket?.ticket_id} - {ticket?.ticket_title}
              </h5>
              <p className="font-label-smaller font-[number:var(--label-smaller-font-weight)] text-[color:var(--1-tokens-color-modes-input-primary-default-placeholder-label)] text-[length:var(--label-smaller-font-size)] tracking-[var(--label-smaller-letter-spacing)] leading-[var(--label-smaller-line-height)]">
                {t("clientSupport.ticket.location")}:{" "}
                {ticket?.company_name ?? "N/A"}
              </p>
              <p className="font-label-smaller font-[number:var(--label-smaller-font-weight)] text-[color:var(--1-tokens-color-modes-input-primary-default-placeholder-label)] text-[length:var(--label-smaller-font-size)] tracking-[var(--label-smaller-letter-spacing)] leading-[var(--label-smaller-line-height)]">
                {t("clientSupport.ticket.status")}:{" "}
                <Badge
                  className={`${getStatusColor(ticket?.ticket_status)} border`}
                >
                  {formatStatus(ticket?.ticket_status)}
                </Badge>
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
                className={`relative w-[var(--2-tokens-screen-modes-common-spacing-l)] h-6 rounded-[35px] border-1-tokens-color-modes-common-success-medium cursor-pointer hover:border-green-700 ${
                  isUpdating ? "animate-pulse" : ""
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
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
  updatingTicketId,
}: {
  tickets: any;
  isCompleted: boolean;
  onTicketClick: (ticket: any) => void;
  updatingTicketId?: number;
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
        {tickets.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title={t(
              isCompleted
                ? "clientSupport.noCompletedTickets"
                : "clientSupport.noActiveTickets"
            )}
            description={t(
              isCompleted
                ? "clientSupport.noCompletedTicketsDesc"
                : "clientSupport.noActiveTicketsDesc"
            )}
          />
        ) : (
          tickets.map((ticket: any, index: number) => (
            <TicketCard
              key={`${isCompleted ? "completed" : "active"}-${index}`}
              ticket={ticket}
              isCompleted={isCompleted}
              onClick={() => onTicketClick(ticket)}
              isUpdating={updatingTicketId === ticket.ticket_id}
            />
          ))
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function ClientSupportTicket() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const dnsPrefix = getHost();
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updatingTicketId, setUpdatingTicketId] = useState<
    number | undefined
  >();

  // Get tickets from Redux store
  const { tickets, status, error } = useSelector(
    (state: RootState) => state.ticket
  );

  const ticketList = tickets as unknown as Ticket[];
  // Filter tickets based on status
  const activeTickets =
    ticketList?.filter(
      (ticket: Ticket) => ticket?.ticket_status !== "closed"
    ) ?? [];
  const completedTickets =
    ticketList?.filter(
      (ticket: Ticket) => ticket?.ticket_status === "closed"
    ) ?? [];

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  // Fetch tickets on component mount
  useEffect(() => {
    if (dnsPrefix) {
      dispatch(fetchTickets({ dnsPrefix }));
    }
  }, [dispatch, dnsPrefix]);

  const handleTicketClick = (ticket: any) => {
    setSelectedTicket(ticket);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id === "title" ? "title" : "description"]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description) {
      // You might want to add proper validation feedback here
      return;
    }

    try {
      setIsSubmitting(true);
      await dispatch(
        createTicket({
          dnsPrefix: dnsPrefix || "",
          data: {
            title: formData.title,
            description: formData.description,
          },
        })
      );

      // Clear form after successful submission
      setFormData({
        title: "",
        description: "",
      });

      // Fetch tickets again after successful submission
      dispatch(fetchTickets({ dnsPrefix }));
    } catch (error) {
      console.error("Failed to create ticket:", error);
      // You might want to add proper error handling here
    } finally {
      setIsSubmitting(false);
    }
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
          {status === "loading" ? (
            <>
              <TicketFormSkeleton />
              <div className="flex-1">
                <Skeleton variant="tickets" />
              </div>
            </>
          ) : (
            <>
              <div className="flex-1">
                <div className="flex flex-col gap-[var(--2-tokens-screen-modes-common-spacing-l)]">
                  <div className="relative">
                    <Input
                      className="pt-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-v)] pr-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-h)] pb-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-v)] pl-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-padding-h)] bg-[color:var(--1-tokens-color-modes-input-primary-default-background)] rounded-[var(--2-tokens-screen-modes-input-border-radius)] border-[color:var(--1-tokens-color-modes-input-primary-default-border)]"
                      id="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
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
                      value={formData.description}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />
                    <label
                      htmlFor="message"
                      className="absolute top-[-9px] left-4 px-1 bg-white text-[color:var(--1-tokens-color-modes-input-primary-default-placeholder-label)] text-[length:var(--label-smaller-font-size)] font-label-smaller font-[number:var(--label-smaller-font-weight)] tracking-[var(--label-smaller-letter-spacing)] leading-[var(--label-smaller-line-height)] [font-style:var(--label-smaller-font-style)]"
                    >
                      {t("clientSupport.form.message")}
                    </label>
                  </div>

                  <Button
                    className={`w-[352px] flex items-center justify-center gap-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-gap)] py-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-v)] px-[var(--2-tokens-screen-modes-sizes-button-input-nav-large-padding-h)] bg-[#00b85b] text-white rounded-[var(--2-tokens-screen-modes-button-border-radius)] hover:bg-[#00b85b]/90 ${
                      isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {" "}
                    <Send
                      className={`w-4 h-4 ${
                        isSubmitting ? "animate-pulse" : ""
                      }`}
                    />{" "}
                    <span>
                      {" "}
                      {isSubmitting
                        ? t("clientSupport.ticket.submitting")
                        : t("clientSupport.ticket.submit")}{" "}
                    </span>{" "}
                  </Button>
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-5 p-2.5 pt-0 h-[calc(100vh-200px)] min-h-[500px]">
                <div className="flex flex-col h-full bg-[color:var(--1-tokens-color-modes-input-primary-default-background)] rounded-[var(--2-tokens-screen-modes-input-border-radius)] border border-[color:var(--1-tokens-color-modes-input-primary-default-border)] p-4">
                  <div className="flex gap-4 mb-4">
                    <Button
                      variant={activeTab === "active" ? "default" : "outline"}
                      onClick={() => setActiveTab("active")}
                      className={`flex-1 ${
                        activeTab === "active"
                          ? "bg-[#00b85b] text-white hover:bg-[#00b85b]/90"
                          : "text-[#00b85b] hover:bg-[#00b85b]/10"
                      }`}
                    >
                      {t("clientSupport.activeTickets")} (
                      {activeTickets?.length ?? 0})
                    </Button>
                    <Button
                      variant={
                        activeTab === "completed" ? "default" : "outline"
                      }
                      onClick={() => setActiveTab("completed")}
                      className={`flex-1 ${
                        activeTab === "completed"
                          ? "bg-[#00b85b] text-white hover:bg-[#00b85b]/90"
                          : "text-[#00b85b] hover:bg-[#00b85b]/10"
                      }`}
                    >
                      {t("clientSupport.completedTickets")} (
                      {completedTickets?.length ?? 0})
                    </Button>
                  </div>

                  {error && <div>Error: {error}</div>}

                  <AnimatePresence mode="wait">
                    {activeTab === "active" ? (
                      <TicketList
                        key="active"
                        tickets={activeTickets}
                        isCompleted={false}
                        onTicketClick={handleTicketClick}
                        updatingTicketId={updatingTicketId}
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
            </>
          )}
        </div>
      </main>
      {selectedTicket && (
        <ClientTicketPopup
          ticketId={selectedTicket.ticket_id}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </>
  );
}
