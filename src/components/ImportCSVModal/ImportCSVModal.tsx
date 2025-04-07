import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Paperclip, Upload, Wrench, X } from "lucide-react";

const Header = ({ onClose }: { onClose: () => void }) => (
  <DialogHeader className="flex items-center justify-between p-0 mb-8">
    <DialogTitle className="font-bold text-base text-[#1E2324]">
      Importer un fichier CSV
    </DialogTitle>
  </DialogHeader>
);

const FileDropArea = () => (
  <div className="flex flex-col h-[196px] items-center justify-center gap-4 px-6 py-4 border border-dashed rounded-2 overflow-hidden border-[color:var(--1-tokens-color-modes-border-primary)]">
    <div className="flex w-6 h-6 items-center justify-center">
      <Upload className="w-6 h-6" />
    </div>
    <div className="text-center text-sm text-[color:var(--1-tokens-color-modes-input-primary-default-text)]">
      Glissez un fichier ici ou cliquez pour en sélectionner un
    </div>
    <Input
      className="text-sm text-[color:var(--1-tokens-color-modes-input-primary-default-placeholder-label)] bg-[color:var(--1-tokens-color-modes-input-primary-default-background)] border-[color:var(--1-tokens-color-modes-input-primary-default-border)] rounded-md"
      placeholder="Choisir un fichier..."
      readOnly
    />
  </div>
);

const Footer = () => (
  <div className="flex flex-col items-center gap-4 mt-4">
    <Button
      variant="link"
      className="font-bold text-base text-[color:var(--1-tokens-color-modes-button-secondary-default-text)] underline p-0"
    >
      <Paperclip className="h-4 w-4 mr-1" /> Télécharger le modèle CSV
    </Button>
    <p className="font-medium text-sm text-center text-[color:var(--1-tokens-color-modes-button-secondary-default-text)] leading-5">
      <Wrench className="h-4 w-4 inline mr-1" /> Assurez-vous que le fichier
      respecte bien le format requis (colonnes, types, etc.)
    </p>
  </div>
);

const ImportButton = () => (
  <Button className="w-full mt-4 bg-[#07515f] text-white border-[color:var(--1-tokens-color-modes-border-primary)]">
    Importer
  </Button>
);

export default function PopupImportCsv(): JSX.Element {
  const handleClose = () => {
    // Handle close action
  };

  return (
    <Dialog defaultOpen>
      <DialogContent className="p-6 max-w-md">
        <Header onClose={handleClose} />
        <FileDropArea />
        <Footer />
        <ImportButton />
      </DialogContent>
    </Dialog>
  );
}
