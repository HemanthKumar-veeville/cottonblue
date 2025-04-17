import { DownloadIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useTranslation } from "react-i18next";

const Heading = ({ text }: { text: string }) => (
  <h3 className="text-[length:var(--heading-h3-font-size)] font-heading-h3 font-[number:var(--heading-h3-font-weight)] text-[color:var(--1-tokens-color-modes-nav-tab-primary-default-text)] tracking-[var(--heading-h3-letter-spacing)] leading-[var(--heading-h3-line-height)] [font-style:var(--heading-h3-font-style)]">
    {text}
  </h3>
);

const DownloadButton = ({ label }: { label: string }) => (
  <Button
    variant="ghost"
    className="flex items-center gap-[var(--2-tokens-screen-modes-sizes-button-input-nav-medium-gap)]"
  >
    <span className="text-[length:var(--label-small-font-size)] leading-[var(--label-small-line-height)] font-label-small font-[number:var(--label-small-font-weight)] text-[color:var(--1-tokens-color-modes-button-ghost-default-text)] tracking-[var(--label-small-letter-spacing)] [font-style:var(--label-small-font-style)]">
      {label}
    </span>
    <DownloadIcon className="w-4 h-4" />
  </Button>
);

export const OrderHistorySection = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <header className="flex items-center justify-between w-full">
      <Heading text={t("history.title")} />
      <DownloadButton label={t("history.downloadSelectedInvoices")} />
    </header>
  );
};
