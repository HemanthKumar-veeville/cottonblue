import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Textarea } from "../ui/textarea";
import { X } from "lucide-react";
import { TicketStatus } from "../../screens/Tickets/Tickets";

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
    sender: "Support - CottonBlue :",
    message: "Bonjour, nous investiguons actuellement le souci de connexion.",
  },
  {
    sender: "Vous :",
    message: "Merci pour votre retour.",
  },
  {
    sender: "Support - CottonBlue :",
    message: "Avez-vous tenté de réinitialiser votre mot de passe ?",
  },
  {
    sender: "Vous :",
    message: "Oui, sans succès.",
  },
  {
    sender: "Vous :",
    message: "C'est bon, cela fonctionne !",
  },
  {
    sender: "Support - CottonBlue :",
    message: "Parfait, ravi que ce soit réglé.",
  },
];

const MessageItem = ({
  sender,
  message,
}: {
  sender: string;
  message: string;
}) => (
  <div className="flex flex-col gap-1.5 p-2 bg-gray-100 rounded-md">
    <div className="font-medium text-gray-900 text-sm">{sender}</div>
    <div className="font-medium text-gray-900 text-sm">{message}</div>
  </div>
);

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
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-full h-full flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-white rounded-md overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between p-3 pb-0">
            <CardTitle className="font-bold text-gray-900 text-base">
              {ticket.id} - {ticket.title}
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
            <MessageList messages={messageData} />

            <Textarea
              placeholder="Écrire une réponse..."
              className="h-24 min-h-24 bg-gray-50 rounded-md border border-solid border-gray-300 text-gray-500"
            />

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                className="h-10 border border-solid border-gray-300 text-gray-900"
              >
                Marquer comme terminé
              </Button>
              <Button className="h-10 bg-teal-700 border border-solid border-gray-300 text-white">
                Envoyer la réponse
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
