import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Textarea } from "../ui/textarea";
import { X } from "lucide-react";
import { TicketStatus } from "../../screens/Tickets/Tickets";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  getTicketById,
  updateTicketStatus,
} from "../../store/features/ticketSlice";
import { AppDispatch, RootState, useAppSelector } from "../../store/store";
import { Badge } from "../ui/badge";

interface TicketMessage {
  message_id: number;
  sender: string;
  message: string;
  ticket_image: string | null;
  created_at: string;
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
  messages?: TicketMessage[];
}

interface TicketModalProps {
  onClose: () => void;
  ticketId: string;
}

const getStatusColor = (status: TicketStatus) => {
  switch (status) {
    case TicketStatus.OPEN:
      return "bg-teal-100 text-teal-800";
    case TicketStatus.IN_PROGRESS:
      return "bg-blue-100 text-blue-800";
    case TicketStatus.CLOSED:
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function TicketModal({ onClose, ticketId }: TicketModalProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentTicket = useAppSelector(
    (state: RootState) => state.ticket.currentTicket
  );

  const ticket = currentTicket?.ticket || null;
  const isClosedTicket = ticket?.ticket_status === TicketStatus.CLOSED;

  useEffect(() => {
    const fetchTicketMessages = async () => {
      try {
        await dispatch(
          getTicketById({
            dnsPrefix: "admin",
            ticketId,
          })
        ).unwrap();
      } catch (error) {
        console.error("Failed to fetch ticket messages:", error);
      }
    };
    if (!ticket) {
      fetchTicketMessages();
    }
  }, [ticket]);

  const handleSubmit = async () => {
    // Handle existing ticket response submission
    // This would be implemented separately
  };

  const handleMarkAsComplete = async () => {
    setIsSubmitting(true);
    try {
      await dispatch(
        updateTicketStatus({
          dnsPrefix: "admin",
          ticketId: ticket?.ticket_id?.toString(),
          status: TicketStatus.CLOSED,
        })
      ).unwrap();
      onClose();
    } catch (error) {
      console.error("Failed to update ticket status:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReopenTicket = async () => {
    setIsSubmitting(true);
    try {
      await dispatch(
        updateTicketStatus({
          dnsPrefix: "admin",
          ticketId: ticket?.ticket_id?.toString(),
          status: TicketStatus.OPEN,
        })
      ).unwrap();
      onClose();
    } catch (error) {
      console.error("Failed to reopen ticket:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-full h-full flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-white rounded-md overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between p-3 pb-0">
            <CardTitle className="font-bold text-gray-900 text-base flex items-center gap-2 flex-1">
              #{ticket?.ticket_id ?? "NA"} - {ticket?.ticket_title ?? "NA"}
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="p-3">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Badge
                    className={`${getStatusColor(
                      ticket?.ticket_status ?? TicketStatus.OPEN
                    )} font-label-small pointer-events-none`}
                  >
                    {t(ticket?.ticket_status ?? "NA")}
                  </Badge>
                  <span className="font-label-small text-[color:var(--1-tokens-color-modes-common-neutral-medium)]">
                    {ticket?.created_at
                      ? new Date(ticket.created_at).toLocaleDateString()
                      : "NA"}
                  </span>
                </div>
                {ticket?.closed_at && (
                  <span className="font-label-small text-[color:var(--1-tokens-color-modes-common-neutral-medium)]">
                    Closed at: {new Date(ticket.closed_at).toLocaleDateString()}
                  </span>
                )}
              </div>
              <div className="h-[400px] w-full overflow-auto">
                <div className="space-y-4">
                  {ticket?.messages?.map((message: TicketMessage) => (
                    <div
                      key={message.message_id}
                      className="bg-gray-50 p-4 rounded-lg"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold capitalize">
                          {message.sender ?? "NA"}
                        </span>
                        <span className="text-sm text-gray-500">
                          {message.created_at
                            ? new Date(message.created_at).toLocaleString()
                            : "NA"}
                        </span>
                      </div>
                      <p className="text-gray-700">{message.message ?? "NA"}</p>
                      {message.ticket_image && (
                        <img
                          src={message.ticket_image}
                          alt="Ticket attachment"
                          className="mt-2 max-w-full h-auto rounded"
                        />
                      )}
                    </div>
                  ))}
                </div>
                {!isClosedTicket && (
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t("tickets.modal.enterResponse")}
                    className="h-24 min-h-24 bg-gray-50 rounded-md border border-solid border-gray-300 text-gray-500 mt-4"
                  />
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              {!isClosedTicket && (
                <Button
                  variant="outline"
                  className="h-10 border border-solid border-gray-300 text-gray-900"
                  onClick={handleMarkAsComplete}
                  disabled={isSubmitting}
                >
                  {t("tickets.modal.markAsComplete")}
                </Button>
              )}
              {isClosedTicket && (
                <Button
                  variant="outline"
                  className="h-10 border border-solid border-gray-300 text-gray-900"
                  onClick={handleReopenTicket}
                  disabled={isSubmitting}
                >
                  {t("tickets.modal.reopenTicket")}
                </Button>
              )}
              {!isClosedTicket && (
                <Button
                  className="h-10 bg-teal-700 border border-solid border-gray-300 text-white"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {t("tickets.modal.sendResponse")}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
