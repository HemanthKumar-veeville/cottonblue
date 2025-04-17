import { OrderDetailsSection } from "../OrderDetailsSection/OrderDetailsSection";
import { OrderHistorySection } from "../OrderHistorySection/OrderHistorySection";

export default function History(): JSX.Element {
  return (
    <main className="flex flex-col w-full gap-8 p-6">
      <OrderHistorySection />
      <OrderDetailsSection />
    </main>
  );
}
