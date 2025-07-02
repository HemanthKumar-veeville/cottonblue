import React, { useEffect } from "react";
import ComingSoon from "../../components/ComingSoon";
import { useTranslation } from "react-i18next";

function SuperAdminSettings() {
  const { i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage("fr");
  }, [i18n]);

  return (
    <main className="flex flex-col w-full h-full bg-white rounded-lg">
      <ComingSoon variant="superadmin" />
    </main>
  );
}

export default SuperAdminSettings;
