import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { X } from "lucide-react";
import { TicketStatus } from "../../screens/Tickets/Tickets";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { createTicket } from "../../store/features/ticketSlice";
import { AppDispatch } from "../../store/store";

interface Ticket {
  id: string;
  title: string;
  status: TicketStatus;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface TicketModalProps {
  onClose: () => void;
  ticket: Ticket;
}

const messageData = [
  {
    sender: "tickets.modal.messages.support",
    message: "tickets.modal.messages.investigating",
  },
  {
    sender: "tickets.modal.messages.you",
    message: "tickets.modal.messages.thanks",
  },
  {
    sender: "tickets.modal.messages.support",
    message: "tickets.modal.messages.resetPassword",
  },
  {
    sender: "tickets.modal.messages.you",
    message: "tickets.modal.messages.noSuccess",
  },
  {
    sender: "tickets.modal.messages.you",
    message: "tickets.modal.messages.working",
  },
  {
    sender: "tickets.modal.messages.support",
    message: "tickets.modal.messages.perfect",
  },
];

const MessageItem = ({
  sender,
  message,
}: {
  sender: string;
  message: string;
}) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-1.5 p-2 bg-gray-100 rounded-md">
      <div className="font-medium text-gray-900 text-sm">{t(sender)}</div>
      <div className="font-medium text-gray-900 text-sm">{t(message)}</div>
    </div>
  );
};

const MessageList = ({
  messages,
}: {
  messages: { sender: string; message: string }[];
}) => (
  <ScrollArea className="h-[250px] w-full rounded-md">
    <div className="flex flex-col gap-1.5">
      {messages.map((item, index) => (
        <MessageItem key={index} sender={item.sender} message={item.message} />
      ))}
    </div>
  </ScrollArea>
);

export default function TicketModal({ onClose, ticket }: TicketModalProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [ticketTitle, setTicketTitle] = useState(ticket.title);
  const [ticketDescription, setTicketDescription] = useState(
    ticket.description || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isNewTicket = ticket.title === "";

  const handleSubmit = async () => {
    if (isNewTicket) {
      if (!ticketTitle.trim()) {
        // You might want to add proper form validation and error handling here
        return;
      }

      setIsSubmitting(true);
      try {
        await dispatch(
          createTicket({
            dnsPrefix: "admin", // You'll need to get this from your app configuration
            data: {
              ticket_title: ticketTitle.trim(),
              ticket_description: ticketDescription.trim(),
            },
          })
        ).unwrap();
        onClose();
      } catch (error) {
        console.error("Failed to create ticket:", error);
        // You might want to add proper error handling here
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Handle existing ticket response submission
      // This would be implemented separately
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-full h-full flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-white rounded-md overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between p-3 pb-0">
            <CardTitle className="font-bold text-gray-900 text-base flex items-center gap-2 flex-1">
              {ticket.id} -
              {isNewTicket ? (
                <Input
                  value={ticketTitle}
                  onChange={(e) => setTicketTitle(e.target.value)}
                  placeholder={t("tickets.modal.enterTitle")}
                  className="flex-1"
                />
              ) : (
                ticket.title
              )}
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

          <CardContent className="flex flex-col gap-6 p-4">
            {!isNewTicket && <MessageList messages={messageData} />}

            <Textarea
              value={ticketDescription}
              onChange={(e) => setTicketDescription(e.target.value)}
              placeholder={
                isNewTicket
                  ? t("tickets.modal.enterDescription")
                  : t("tickets.modal.writeResponse")
              }
              className="h-24 min-h-24 bg-gray-50 rounded-md border border-solid border-gray-300 text-gray-500"
            />

            <div className="flex justify-end gap-2">
              {!isNewTicket && (
                <Button
                  variant="outline"
                  className="h-10 border border-solid border-gray-300 text-gray-900"
                >
                  {t("tickets.modal.markAsComplete")}
                </Button>
              )}
              <Button
                className="h-10 bg-teal-700 border border-solid border-gray-300 text-white"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isNewTicket
                  ? isSubmitting
                    ? t("tickets.modal.creating")
                    : t("tickets.modal.createTicket")
                  : t("tickets.modal.sendResponse")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
