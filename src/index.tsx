import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
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
import ClientDetails from "./screens/ClientDetails/ClientDetails";
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
import {
  isAdminHostname,
  isDevHostname,
  isWarehouseHostname,
} from "./utils/hostUtils";
import ProductDetails from "./screens/ProductDetails/ProductDetails";
import { getHost } from "./utils/hostUtils";
import AddUser from "./screens/AddUser/AddUser";
import { UserList } from "./screens/UserList";
import UserDetails from "./screens/UserDetails/UserDetails";
import ClientSettings from "./screens/ClientSettings/ClientSettings";
import SuperAdminOrderHistory from "./screens/SuperAdminOrderHistory/SuperAdminOrderHistory";
import SuperAdminOrderDetails from "./screens/SuperAdminOrderDetails/SuperAdminOrderDetails";
import SuperAdminSettings from "./screens/SuperAdminSettings/SuperAdminSettings";
import AddProduct_step_1 from "./screens/AddProduct/AddProduct_step_1";
import ClientAdminDashboard from "./screens/ClientAdminDashboard/ClientAdminDashboard";
import OrderValidation from "./screens/OrderValidation/OrderValidation";
import { ClientDashboard } from "./screens/ClientDashboard/ClientDashboard";
import LinkProducts from "./screens/LinkProducts/LinkProducts";
import AddVariant from "./screens/AddVariant/AddVariant";
import CreatePassword from "./screens/CreatePassword/CreatePassword";
import { Warehouse } from "./screens/Warehouse/Warehouse";
import ManageStock from "./screens/ManageStock/ManageStock";
import ClientUserDetails from "./screens/UserDetails/ClientUserDetails";
import { ClientUserListSection } from "./screens/UserListSection/ClientUserListSection";
import ClientAddUser from "./screens/AddUser/ClientAddUser";
import TestBoard from "./screens/TestBoard/TestBoard";
import ErrorLogs from "./screens/ErrorLogs/ErrorLogs";

function App() {
  const isLoggedIn = useAppSelector((state) => state.auth.user?.logged_in);
  const isSuperAdmin = useAppSelector((state) => state.auth.user?.super_admin);
  const isAdminDomain = isAdminHostname();
  const isWarehouse = isWarehouseHostname();
  const isDevDomain = isDevHostname();

  const dnsPrefix = getHost();
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Only fetch admin user data if we're on admin domain
    if (isAdminDomain) {
      dispatch(getUser("admin"));
    } else {
      dispatch(getUser(dnsPrefix));
    }
  }, [dispatch, isAdminDomain, dnsPrefix]);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            style: {
              background: "green",
            },
          },
          error: {
            style: {
              background: "red",
            },
          },
        }}
      />
      <GlobalLoader />
      <Routes>
        {isWarehouse ? (
          isLoggedIn ? (
            // Warehouse routes - only accessible when logged in
            <Route path="/" element={<SuperadminLayout />}>
              <Route index element={<Navigate to="/warehouse" replace />} />
              <Route path="warehouse" element={<Warehouse />} />
              <Route path="products" element={<ProductList />} />
              <Route path="products/:id" element={<ProductDetails />} />
              <Route path="support" element={<ClientSupport />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          ) : (
            // Warehouse login route
            <Route path="/" element={<LoginPage />} />
          )
        ) : isAdminDomain ? (
          isLoggedIn && isSuperAdmin ? (
            // Protected admin routes - only accessible when logged in as super admin
            <Route path="/" element={<SuperadminLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<GlobalDashboard />} />
              <Route path="client-dashboard" element={<ClientDashboard />} />
              <Route
                path="order-history"
                element={<SuperAdminOrderHistory />}
              />
              <Route
                path="order-details/:store_id/:id"
                element={<SuperAdminOrderDetails />}
              />
              <Route path="products" element={<ProductList />} />
              <Route path="manage-stock" element={<ManageStock />} />
              <Route
                path="products/add"
                element={<ProductSidebarSection mode="add" />}
              />
              <Route
                path="products/allot-store/:id"
                element={<AddProduct_step_1 />}
              />
              <Route
                path="products/allot-store-edit/:id"
                element={<AddProduct_step_1 />}
              />
              <Route path="products/add-variant/:id" element={<AddVariant />} />
              <Route
                path="products/link-products/:id"
                element={<LinkProducts />}
              />
              <Route
                path="products/edit/:id"
                element={<ProductSidebarSection mode="edit" />}
              />
              <Route path="products/:id" element={<ProductDetails />} />
              <Route path="products/stock" element={<ComingSoon />} />
              <Route path="products/carousel" element={<Carousel />} />
              <Route path="warehouse" element={<Warehouse />} />
              <Route path="customers" element={<ClientList />} />
              <Route path="customers/edit" element={<AddClient />} />
              <Route path="customers/add" element={<AddClient />} />
              <Route
                path="customers/:company_name"
                element={<ClientDetails />}
              />
              <Route path="agencies" element={<AgenciesList />} />
              <Route path="agencies/edit/:id" element={<AddAgency />} />
              <Route path="agencies/add" element={<AddAgency />} />
              <Route path="users" element={<UserList />} />
              <Route path="users/add" element={<AddUser />} />
              <Route path="users/edit/:id" element={<AddUser />} />
              <Route path="users/:id" element={<UserDetails />} />
              <Route
                path="customers/:company_name/agencies/:agency_id"
                element={<AgencyDetails />}
              />
              <Route path="support/tickets" element={<Tickets />} />
              <Route path="settings" element={<SuperAdminSettings />} />
              {isDevDomain && (
                <>
                  <Route path="test-board" element={<TestBoard />} />
                  <Route path="error-logs" element={<ErrorLogs />} />
                </>
              )}
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
            <Route path="admin-dashboard" element={<ClientAdminDashboard />} />
            <Route
              path="validate-order/:store_id/:id"
              element={<OrderValidation />}
            />
            <Route path="users" element={<ClientUserListSection />} />
            <Route path="users/add" element={<ClientAddUser />} />
            <Route path="users/edit/:id" element={<ClientAddUser />} />
            <Route path="users/:id" element={<ClientUserDetails />} />
            <Route path="product/:id" element={<ClientProduct />} />
            <Route path="cart" element={<CartContainer />} />
            <Route path="history" element={<History />} />
            <Route path="order-details/:id" element={<OrderDetails />} />
            <Route path="support" element={<ClientSupport />} />
            <Route path="settings" element={<ClientSettings />} />
          </Route>
        ) : (
          <Route path="/" element={<ClientLogin />} />
        )}

        {/* 404 Route - Must be last */}
        <Route path="*" element={<NotFound />} />
        <Route path="/create-password" element={<CreatePassword />} />
        <Route path="/reset-password" element={<CreatePassword />} />
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
