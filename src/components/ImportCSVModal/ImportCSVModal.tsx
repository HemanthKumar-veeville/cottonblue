import { useState, useCallback } from "react";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Paperclip, Upload, Wrench, X, AlertCircle } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

interface ImportCSVModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (file: File) => Promise<void>;
}

const Header = ({ onClose }: { onClose: () => void }) => (
  <DialogHeader className="flex items-center p-0 mb-8">
    <DialogTitle className="text-xl font-semibold text-[#1E2324]">
      Importer un fichier CSV
    </DialogTitle>
  </DialogHeader>
);

const FileDropArea = ({
  onFileSelect,
}: {
  onFileSelect: (file: File | null) => void;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file && file.type === "text/csv") {
        setSelectedFile(file);
        onFileSelect(file);
      } else {
        toast.error("Veuillez sélectionner un fichier CSV valide");
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
    },
    maxFiles: 1,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  });

  return (
    <div
      {...getRootProps()}
      className={`flex flex-col h-[196px] items-center justify-center gap-4 px-6 py-4 border border-dashed rounded-2 overflow-hidden transition-colors duration-200 ${
        isDragActive || isDragging
          ? "border-[#07515f] bg-[#07515f]/5"
          : "border-[color:var(--1-tokens-color-modes-border-primary)]"
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex w-8 h-8 items-center justify-center">
        <Upload className="w-8 h-8 text-[#07515f]" />
      </div>
      <div className="text-center">
        {selectedFile ? (
          <span className="font-medium text-base text-[#1E2324]">
            {selectedFile.name}
          </span>
        ) : (
          <div className="space-y-1">
            <p className="text-base font-medium text-[#1E2324]">
              Glissez un fichier ici
            </p>
            <p className="text-sm text-[color:var(--1-tokens-color-modes-input-primary-default-text)]">
              ou cliquez pour en sélectionner un
            </p>
          </div>
        )}
      </div>
      {selectedFile && (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedFile(null);
            onFileSelect(null);
          }}
          className="text-red-500 hover:text-red-600"
        >
          Supprimer
        </Button>
      )}
    </div>
  );
};

const Footer = () => (
  <div className="flex flex-col items-center gap-4 mt-4">
    <Button
      variant="link"
      className="font-medium text-sm text-[color:var(--1-tokens-color-modes-button-secondary-default-text)] hover:text-[#07515f] flex items-center gap-1.5 p-0"
      onClick={() => {
        // Implement CSV template download
        const template = "column1,column2,column3\nvalue1,value2,value3";
        const blob = new Blob([template], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "template.csv";
        a.click();
        window.URL.revokeObjectURL(url);
      }}
    >
      <Paperclip className="h-4 w-4" />
      Télécharger le modèle CSV
    </Button>
    <div className="flex items-center gap-2 text-sm text-[color:var(--1-tokens-color-modes-button-secondary-default-text)] leading-5">
      <Wrench className="h-4 w-4 flex-shrink-0" />
      <span>
        Assurez-vous que le fichier respecte bien le format requis (colonnes,
        types, etc.)
      </span>
    </div>
  </div>
);

const ImportButton = ({
  onImport,
  disabled,
}: {
  onImport: () => Promise<void>;
  disabled: boolean;
}) => (
  <Button
    className="w-full mt-4 bg-[#07515f] text-white border-[color:var(--1-tokens-color-modes-border-primary)] hover:bg-[#07515f]/90 disabled:opacity-50 disabled:cursor-not-allowed"
    onClick={onImport}
    disabled={disabled}
  >
    Importer
  </Button>
);

export default function ImportCSVModal({
  isOpen,
  onClose,
  onImport,
}: ImportCSVModalProps): JSX.Element {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    try {
      setIsImporting(true);
      await onImport(selectedFile);
      toast.success("Fichier importé avec succès");
      onClose();
    } catch (error) {
      toast.error("Erreur lors de l'importation du fichier");
      console.error("Import error:", error);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-6 max-w-md">
        <Header onClose={onClose} />
        <FileDropArea onFileSelect={handleFileSelect} />
        <Footer />
        <ImportButton
          onImport={handleImport}
          disabled={!selectedFile || isImporting}
        />
      </DialogContent>
    </Dialog>
  );
}
