import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { SuperadminLayout } from "./components/Layout/SuperadminLayout";
import { AdminModeProvider } from "./components/Layout/SuperadminHeader";
import { ProductSidebarSection } from "./screens/SuperadminAdd/sections/ProductSidebarSection/ProductSidebarSection";
import ComingSoon from "./components/ComingSoon";
import NotFound from "./components/NotFound";
import Error from "./components/Error";
import { ProductList } from "./screens/ProductList";
import LoginPage from "./screens/Login/Login";
import Carousel from "./screens/Carousel/Carousel";
import Tickets from "./screens/Tickets/Tickets";
import "./i18n/config";
import AddClient from "./screens/AddClient/AddClient";
import { ClientList } from "./screens/ClientList";
import { useAppSelector } from "./store/store";

function App() {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

  return (
    <BrowserRouter>
      <Routes>
        {isLoggedIn ? (
          // Protected routes - only accessible when logged in
          <Route path="/" element={<SuperadminLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<ComingSoon />} />
            <Route path="order-history" element={<ComingSoon />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/add" element={<ProductSidebarSection />} />
            <Route path="products/stock" element={<ComingSoon />} />
            <Route path="products/carousel" element={<Carousel />} />
            <Route path="customers" element={<ClientList />} />
            <Route path="customers/add" element={<AddClient />} />
            <Route path="support/tickets" element={<Tickets />} />
            <Route path="settings" element={<ComingSoon />} />
            <Route path="logout" element={<ComingSoon />} />
            {/* Coming Soon Routes */}
            <Route path="analytics" element={<ComingSoon />} />
            <Route path="reports" element={<ComingSoon />} />
            <Route path="integrations" element={<ComingSoon />} />

            {/* Error Routes */}
            <Route path="error" element={<Error />} />
          </Route>
        ) : (
          // Public routes - only accessible when logged out
          <Route path="/" element={<LoginPage />} />
        )}

        {/* 404 Route - Must be last */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("app") as HTMLElement).render(
  <Provider store={store}>
    <AdminModeProvider>
      <App />
    </AdminModeProvider>
  </Provider>
);
