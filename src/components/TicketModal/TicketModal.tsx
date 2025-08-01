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
  replyToTicket,
  updateTicketStatus,
  resetCurrentTicket,
} from "../../store/features/ticketSlice";
import { AppDispatch, RootState, useAppSelector } from "../../store/store";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import {
  getTicketStatusColor,
  getTicketStatusText,
} from "../../utils/statusUtil";
import { formatDateToParis } from "../../utils/dateUtils";

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

const TicketModalSkeleton = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-full h-full flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-white rounded-md overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between p-3 pb-0">
            <CardTitle className="font-bold text-gray-900 text-base flex items-center gap-2 flex-1">
              <Skeleton className="h-6 w-48" />
            </CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="p-3">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <div className="h-[400px] w-full">
                <div className="space-y-4">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                      <Skeleton className="h-16 w-full" />
                    </div>
                  ))}
                </div>
                <Skeleton className="h-24 w-full mt-4" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default function TicketModal({ onClose, ticketId }: TicketModalProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const currentTicket = useAppSelector(
    (state: RootState) => state.ticket.currentTicket
  );

  const ticket = currentTicket?.ticket || null;
  const isClosedTicket = ticket?.ticket_status === TicketStatus.CLOSED;
  const { selectedCompany } = useAppSelector(
    (state: RootState) => state.client
  );
  const dns = selectedCompany?.dns || "admin";
  useEffect(() => {
    const fetchTicketMessages = async () => {
      try {
        setIsLoading(true);
        await dispatch(
          getTicketById({
            dnsPrefix: dns,
            ticketId,
          })
        ).unwrap();
      } catch (error) {
        console.error("Failed to fetch ticket messages:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTicketMessages();
  }, [ticketId, dns]);

  if (isLoading) {
    return <TicketModalSkeleton />;
  }

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      await dispatch(
        replyToTicket({
          dnsPrefix: dns,
          ticketId,
          data: { message: description },
        })
      ).unwrap();
      await dispatch(getTicketById({ dnsPrefix: dns, ticketId }));
      setDescription("");
    } catch (error) {
      console.error("Failed to reply to ticket:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsComplete = async () => {
    try {
      setIsLoading(true);
      await dispatch(
        updateTicketStatus({
          dnsPrefix: dns,
          ticketId: ticket?.ticket_id?.toString(),
          status: TicketStatus.CLOSED,
        })
      ).unwrap();
      onClose();
      await dispatch(resetCurrentTicket());
      await dispatch(getTicketById({ dnsPrefix: dns, ticketId }));
    } catch (error) {
      console.error("Failed to update ticket status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReopenTicket = async () => {
    try {
      setIsLoading(true);
      await dispatch(
        updateTicketStatus({
          dnsPrefix: dns,
          ticketId: ticket?.ticket_id?.toString(),
          status: TicketStatus.OPEN,
        })
      ).unwrap();
      onClose();
      await dispatch(resetCurrentTicket());
      await dispatch(getTicketById({ dnsPrefix: dns, ticketId }));
    } catch (error) {
      console.error("Failed to reopen ticket:", error);
    } finally {
      setIsLoading(false);
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
                  <span className="font-medium text-black">{`Créé par: `}</span>
                  <span className="font-label-small text-[color:var(--1-tokens-color-modes-common-neutral-medium)]">
                    {`${ticket?.raised_by?.firstname} ${ticket?.raised_by?.lastname}`}
                  </span>{" "}
                  <span className="font-label-small text-[color:var(--1-tokens-color-modes-common-neutral-medium)]">
                    |
                  </span>
                  <span className="font-label-small text-[color:var(--1-tokens-color-modes-common-neutral-medium)]">
                    {ticket?.raised_by?.email}
                  </span>
                  <span className="font-label-small text-[color:var(--1-tokens-color-modes-common-neutral-medium)]">
                    |
                  </span>
                  <span className="font-label-small text-[color:var(--1-tokens-color-modes-common-neutral-medium)]">
                    {ticket?.raised_by?.phone_number ?? "-"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    className={`${getTicketStatusColor(
                      ticket?.ticket_status ?? TicketStatus.OPEN
                    )} font-label-small pointer-events-none border`}
                  >
                    {getTicketStatusText(ticket?.ticket_status ?? "open", t)}
                  </Badge>
                  <span className="font-label-small text-[color:var(--1-tokens-color-modes-common-neutral-medium)]">
                    {ticket?.created_at
                      ? formatDateToParis(ticket?.created_at)
                      : "NA"}
                  </span>
                </div>
                {ticket?.closed_at && (
                  <span className="font-label-small text-[color:var(--1-tokens-color-modes-common-neutral-medium)]">
                    {t("tickets.modal.closedAt")}:{" "}
                    {ticket?.closed_at
                      ? formatDateToParis(ticket?.closed_at)
                      : "NA"}
                  </span>
                )}
              </div>
              <div className="h-[400px] w-full overflow-auto pr-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
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
                          {message?.created_at
                            ? formatDateToParis(message?.created_at)
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
                  disabled={isLoading}
                >
                  {t("tickets.modal.markAsComplete")}
                </Button>
              )}
              {isClosedTicket && (
                <Button
                  variant="outline"
                  className="h-10 border border-solid border-gray-300 text-gray-900"
                  onClick={handleReopenTicket}
                  disabled={isLoading}
                >
                  {t("tickets.modal.reopenTicket")}
                </Button>
              )}
              {!isClosedTicket && (
                <Button
                  className="h-10 bg-teal-700 border border-solid border-gray-300 text-white"
                  onClick={handleSubmit}
                  disabled={isLoading}
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
