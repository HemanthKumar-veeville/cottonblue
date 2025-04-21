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
import { AdminClientHome } from "./screens/AdminClientHome/AdminClientHome";
import { ClientLayout } from "./components/Layout/ClientLayout";
import ClientProduct from "./screens/ClientProduct/ClientProduct";
import CartContainer from "./screens/Cart/Cart";
import History from "./screens/History/History";
import OrderDetails from "./screens/OrderDetails/OrderDetails";
import ClientSupport from "./screens/ClientSupport/ClientSupport";
import ClientLogin from "./screens/ClientLogin/ClientLogin";
import { isAdminHostname } from "./utils/hostUtils";

function App() {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const isSuperAdmin = useAppSelector((state) => state.auth.user?.super_admin);
  const isAdminDomain = isAdminHostname();
  console.log({ isAdminDomain, isSuperAdmin, isLoggedIn });
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Only fetch admin user data if we're on admin domain
    if (isAdminDomain) {
      dispatch(getUser("admin"));
    }
  }, [dispatch, isAdminDomain]);

  return (
    <BrowserRouter>
      <GlobalLoader />
      <Routes>
        {isAdminDomain ? (
          isLoggedIn && isSuperAdmin ? (
            // Protected admin routes - only accessible when logged in as super admin
            <Route path="/" element={<SuperadminLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<GlobalDashboard />} />
              <Route path="order-history" element={<ComingSoon />} />
              <Route path="products" element={<ProductList />} />
              <Route path="products/add" element={<ProductSidebarSection />} />
              <Route path="products/stock" element={<ComingSoon />} />
              <Route path="products/carousel" element={<Carousel />} />
              <Route path="customers" element={<ClientList />} />
              <Route
                path="customers/:company_name"
                element={<AgencyDetails />}
              />
              <Route path="agencies" element={<AgenciesList />} />
              <Route path="agencies/add" element={<AddAgency />} />
              <Route path="customers/edit" element={<AddClient />} />
              <Route path="customers/add" element={<AddClient />} />
              <Route path="support/tickets" element={<Tickets />} />
              <Route path="settings" element={<ComingSoon />} />
              <Route path="logout" element={<ComingSoon />} />
              <Route path="analytics" element={<ComingSoon />} />
              <Route path="reports" element={<ComingSoon />} />
              <Route path="integrations" element={<ComingSoon />} />
              <Route path="error" element={<Error />} />
            </Route>
          ) : (
            // Admin login route
            <Route path="/" element={<LoginPage />} />
          )
        ) : // Client routes
        isLoggedIn ? (
          <Route path="/" element={<ClientLayout />}>
            <Route index element={<AdminClientHome />} />
            <Route path="product/:id" element={<ClientProduct />} />
            <Route path="cart" element={<CartContainer />} />
            <Route path="history" element={<History />} />
            <Route path="order-details/:id" element={<OrderDetails />} />
            <Route path="support" element={<ClientSupport />} />
          </Route>
        ) : (
          <Route path="/" element={<ClientLogin />} />
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
