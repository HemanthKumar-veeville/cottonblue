import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store, useAppDispatch } from "./store/store";
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
import { getUser } from "./store/features/authSlice";
import GlobalLoader from "./components/GlobalLoader";
import { GlobalDashboard } from "./screens/GlobalDashboard/GlobalDashboard";
import AgencyDetails from "./screens/AgencyDetails/AgencyDetails";
import { AgenciesList } from "./screens/AgenciesList";
import AddAgency from "./screens/AddAgency/AddAgency";
function App() {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const isAdmin = useAppSelector((state) => state.auth.isAdmin);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUser("admin"));
  }, [dispatch]);

  return (
    <BrowserRouter>
      <GlobalLoader />
      <Routes>
        {isLoggedIn ? (
          // Protected routes - only accessible when logged in
          <Route path="/" element={<SuperadminLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<GlobalDashboard />} />
            <Route path="order-history" element={<ComingSoon />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/add" element={<ProductSidebarSection />} />
            <Route path="products/stock" element={<ComingSoon />} />
            <Route path="products/carousel" element={<Carousel />} />
            <Route path="customers" element={<ClientList />} />
            <Route path="agencies" element={<AgenciesList />} />
            <Route path="agencies/add" element={<AddAgency />} />
            <Route path="customers/:id" element={<AgencyDetails />} />
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
