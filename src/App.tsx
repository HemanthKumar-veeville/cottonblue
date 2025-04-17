import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClientLayout } from "./components/Layout/ClientLayout";
import { DashboardSection } from "./screens/ClientHomeSection/DashboardSection/DashboardSection";
// Import other client pages here

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<DashboardSection />} />
          {/* Add other client routes here */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
