import { ClientListSection } from "./ClientListSection/ClientListSection";
import { ClientTableSection } from "./ClientListSection/ClientTableSection";

export const ClientList = (): JSX.Element => {
  return (
    <main className="flex flex-col w-full gap-8 p-6 bg-white rounded-lg">
      <ClientListSection />
      <ClientTableSection />
    </main>
  );
};
