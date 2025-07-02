import React, { useEffect } from "react";
import ComingSoon from "../../components/ComingSoon";
import { useTranslation } from "react-i18next";

const ClientSettings: React.FC = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage("fr");
  }, [i18n]);

  return (
    <main className="flex flex-col items-start h-full bg-white rounded-[var(--2-tokens-screen-modes-common-spacing-XL)]">
      <ComingSoon variant="client" />
    </main>
  );
};

export default ClientSettings;
