import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Textarea } from "../../components/ui/textarea";
import { X, MessageSquare } from "lucide-react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { getTicketById, replyToTicket } from "../../store/features/ticketSlice";
import { AppDispatch, RootState, useAppSelector } from "../../store/store";
import { getHost } from "../../utils/hostUtils";
import { TicketStatus } from "../../screens/Tickets/Tickets";
import EmptyState from "../../components/EmptyState";
import {
  getTicketStatusColor,
  getTicketStatusText,
} from "../../utils/statusUtil";

interface TicketMessage {
  message_id: number;
  sender: string;
  message: string;
  ticket_image: string | null;
  created_at: string;
}

interface Ticket {
  ticket: {
    ticket_id: number;
    ticket_title: string;
    ticket_status: string;
    created_at: string;
    closed_at: string | null;
    messages: TicketMessage[];
  };
}

interface PopupTicketProps {
  ticketId: number;
  onClose: () => void;
}

const TicketPopupSkeleton = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="w-full h-full flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white rounded-md overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between p-3 pb-0">
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
        </CardHeader>
        <CardContent className="p-3">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
            <div className="h-[400px] w-full">
              <div className="space-y-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="bg-gray-100 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="h-24 w-full bg-gray-100 rounded-md mt-4 animate-pulse" />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

const PopupTicket = ({ ticketId, onClose }: PopupTicketProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const dnsPrefix = getHost();
  const [replyMessage, setReplyMessage] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const currentTicket = useAppSelector(
    (state: RootState) => state.ticket.currentTicket
  ) as Ticket | null;
  const ticket = currentTicket?.ticket || null;
  const status = useAppSelector((state: RootState) => state.ticket.status);
  const isLoading = status === "loading";

  React.useEffect(() => {
    const fetchTicketMessages = async () => {
      try {
        await dispatch(
          getTicketById({
            dnsPrefix: dnsPrefix || "",
            ticketId: ticketId.toString(),
          })
        );
      } catch (error) {
        console.error("Failed to fetch ticket messages:", error);
      }
    };

    fetchTicketMessages();
  }, [dispatch, dnsPrefix, ticketId]);

  const handleReply = async () => {
    if (!replyMessage.trim()) return;
    setIsSubmitting(true);

    try {
      await dispatch(
        replyToTicket({
          dnsPrefix: dnsPrefix || "",
          ticketId: ticketId.toString(),
          data: {
            message: replyMessage,
          },
        })
      );
      setReplyMessage("");
      await dispatch(
        getTicketById({
          dnsPrefix: dnsPrefix || "",
          ticketId: ticketId.toString(),
        })
      );
    } catch (error) {
      console.error("Failed to reply to ticket:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <TicketPopupSkeleton />;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-full h-full flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-white rounded-md overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between p-3 pb-0">
            <CardTitle className="font-bold text-gray-900 text-base flex items-center gap-2 flex-1">
              #{ticket?.ticket_id} - {ticket?.ticket_title}
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
                    className={`${getTicketStatusColor(
                      ticket?.ticket_status ?? ""
                    )} font-label-small pointer-events-none border`}
                  >
                    {getTicketStatusText(ticket?.ticket_status ?? "", t)}
                  </Badge>
                </div>
              </div>
              <div className="h-[400px] w-full overflow-auto pr-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                <div className="space-y-4">
                  {isLoading ? (
                    <TicketPopupSkeleton />
                  ) : !ticket?.messages?.length ? (
                    <EmptyState
                      icon={MessageSquare}
                      title={t("clientSupport.popup.noMessages")}
                      description={t("clientSupport.popup.startConversation")}
                    />
                  ) : (
                    ticket?.messages?.map(
                      (message: TicketMessage, index: number) => (
                        <div
                          key={message.message_id ?? index}
                          className="bg-gray-50 p-4 rounded-lg"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold capitalize">
                              {t(
                                message.sender === "client"
                                  ? "clientSupport.popup.you"
                                  : "clientSupport.popup.support"
                              )}
                            </span>
                            <span className="text-sm text-gray-500">
                              {message.created_at
                                ? new Date(message.created_at).toLocaleString()
                                : "NA"}
                            </span>
                          </div>
                          <p className="text-gray-700">
                            {message.message ?? "NA"}
                          </p>
                          {message.ticket_image && (
                            <img
                              src={message.ticket_image}
                              alt="Ticket attachment"
                              className="mt-2 max-w-full h-auto rounded"
                            />
                          )}
                        </div>
                      )
                    )
                  )}
                </div>
                {ticket?.ticket_status !== TicketStatus.CLOSED && (
                  <Textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder={t("clientSupport.popup.writeResponse")}
                    className="h-24 min-h-24 bg-gray-50 rounded-md border border-solid border-gray-300 text-gray-500 mt-4"
                  />
                )}
              </div>
            </div>

            {ticket?.ticket_status !== TicketStatus.CLOSED && (
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  className="h-10 bg-teal-700 border border-solid border-gray-300 text-white"
                  onClick={handleReply}
                  disabled={isSubmitting}
                >
                  {t("clientSupport.popup.sendResponse")}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PopupTicket;
