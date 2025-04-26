import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Dialog } from "../../components/ui/dialog";
import { Textarea } from "../../components/ui/textarea";
import { X } from "lucide-react";
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { replyToTicket } from "../../store/features/ticketSlice";
import { AppDispatch } from "../../store/store";
import { getHost } from "../../utils/hostUtils";

const messages = [
  {
    sender: "Support - CottonBlue :",
    content: "Bonjour, nous investiguons actuellement le souci de connexion.",
  },
  {
    sender: "Vous :",
    content: "Merci pour votre retour.",
  },
  {
    sender: "Support - CottonBlue :",
    content: "Avez-vous tenté de réinitialiser votre mot de passe ?",
  },
  {
    sender: "Vous :",
    content: "Oui, sans succès.",
  },
  {
    sender: "Vous :",
    content: "C'est bon, cela fonctionne !",
  },
  {
    sender: "Support - CottonBlue :",
    content: "Parfait, ravi que ce soit réglé.",
  },
];

const MessageCard = ({
  sender,
  content,
}: {
  sender: string;
  content: string;
}) => (
  <Card className="mb-2 bg-gray-100 border-none">
    <CardContent className="p-2.5">
      <div className="font-medium text-black text-sm tracking-wide leading-tight whitespace-nowrap">
        {sender}
      </div>
      <div className="font-medium text-black text-sm tracking-wide leading-tight">
        {content}
      </div>
    </CardContent>
  </Card>
);

interface PopupTicketProps {
  ticket: {
    id: string;
    title: string;
    location: string;
    status: string;
  };
  onClose: () => void;
}

const PopupTicket = ({ ticket, onClose }: PopupTicketProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const dnsPrefix = getHost();
  const [replyMessage, setReplyMessage] = React.useState("");

  const handleReply = async () => {
    if (!replyMessage.trim()) return;

    try {
      await dispatch(
        replyToTicket({
          dnsPrefix: dnsPrefix || "",
          ticketId: ticket.id,
          data: {
            message: replyMessage,
          },
        })
      );
      setReplyMessage(""); // Clear the input after successful reply
    } catch (error) {
      console.error("Failed to reply to ticket:", error);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 grid w-full max-w-[721px] -translate-x-1/2 -translate-y-1/2 gap-8 bg-white p-6 rounded-md shadow-lg">
          <header className="flex items-center justify-between w-full">
            <h2 className="font-bold text-[#1e2324] text-base">
              Ticket {ticket.id} - {ticket.title}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6 p-0.5"
              onClick={onClose}
            >
              <X className="w-6 h-6" />
            </Button>
          </header>
          <div className="h-[376px] w-full rounded-md overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
            <div className="p-4">
              {messages.map((message, index) => (
                <MessageCard
                  key={index}
                  sender={t(
                    message.sender === "Vous :"
                      ? "clientSupport.popup.you"
                      : "clientSupport.popup.support"
                  )}
                  content={message.content}
                />
              ))}
            </div>
          </div>
          <Textarea
            placeholder={t("clientSupport.popup.writeResponse")}
            className="h-[108px] bg-gray-200 rounded-md border border-solid border-gray-300 text-gray-500 font-small text-sm tracking-wide leading-tight"
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
          />
          <div className="flex justify-end">
            <Button
              className="bg-[#00b85b] border border-solid border-[#1a8563] text-white font-medium text-sm tracking-wide leading-tight"
              onClick={handleReply}
            >
              {t("clientSupport.popup.sendResponse")}
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </Dialog>
  );
};

export default PopupTicket;
