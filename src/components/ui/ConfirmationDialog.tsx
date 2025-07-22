import { XIcon } from "lucide-react";
import { Button } from "./button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { useTranslation } from "react-i18next";

interface ConfirmationDialogProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  open: boolean;
  confirmText?: string;
  cancelText?: string;
}

const CloseButton = ({ onClose }: { onClose: () => void }) => (
  <Button
    variant="ghost"
    size="icon"
    className="w-8 h-8 p-0.5"
    onClick={onClose}
  >
    <XIcon className="w-6 h-6" />
  </Button>
);

const ConfirmationHeader = ({
  title,
  onClose,
}: {
  title: string;
  onClose: () => void;
}) => {
  return (
    <div className="flex flex-row items-center justify-between p-0 space-y-0">
      <h2 className="font-bold text-[#07515f] text-base">{title}</h2>
    </div>
  );
};

export const ConfirmationDialog = ({
  title,
  message,
  onConfirm,
  onCancel,
  open,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: ConfirmationDialogProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="flex flex-col gap-8 p-8 bg-white max-w-full w-auto">
        <ConfirmationHeader title={title} onClose={onCancel} />

        <div className="text-gray-600">{message}</div>

        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={onCancel}
            className="border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            {t(cancelText)}
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-[#07515f] hover:bg-[#07515f]/90 text-white"
          >
            {t(confirmText)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
