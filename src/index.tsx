import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { store, useAppDispatch, useAppSelector } from "./store/store";
import { SuperadminLayout } from "./components/Layout/SuperadminLayout";
import { AdminModeProvider } from "./components/Layout/SuperadminHeader";
import NotFound from "./components/NotFound";
import LoginPage from "./screens/Login/Login";
import "./i18n/config";
import GlobalLoader from "./components/GlobalLoader";
import { ClientLayout } from "./components/Layout/ClientLayout";
import ClientLogin from "./screens/ClientLogin/ClientLogin";
import {
  isAdminHostname,
  isDevHostname,
  isWarehouseHostname,
  getHost,
} from "./utils/hostUtils";
import { getUser } from "./store/features/authSlice";
import CreatePassword from "./screens/CreatePassword/CreatePassword";
import { adminRoutes } from "./routes/admin.routes";
import { warehouseRoutes } from "./routes/warehouse.routes";
import { clientRoutes } from "./routes/client.routes";

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
        {/* Warehouse Routes */}
        {isWarehouse ? (
          isLoggedIn ? (
            <Route path="/" element={<SuperadminLayout />}>
              {warehouseRoutes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              ))}
            </Route>
          ) : (
            <Route path="/" element={<LoginPage />} />
          )
        ) : isAdminDomain ? (
          isLoggedIn && isSuperAdmin ? (
            <Route path="/" element={<SuperadminLayout />}>
              {adminRoutes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    isDevDomain ||
                    !["test-board", "error-logs"].includes(route.path) ? (
                      route.element
                    ) : (
                      <NotFound />
                    )
                  }
                />
              ))}
            </Route>
          ) : (
            <Route path="/" element={<LoginPage />} />
          )
        ) : // Client Routes
        isLoggedIn ? (
          <Route path="/" element={<ClientLayout />}>
            {clientRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Route>
        ) : (
          <Route path="/" element={<ClientLogin />} />
        )}

        {/* Common Routes */}
        <Route path="/create-password" element={<CreatePassword />} />
        <Route path="/reset-password" element={<CreatePassword />} />

        {/* 404 Route - Must be last */}
        <Route
          path="*"
          element={
            isAdminDomain ? (
              <Navigate to="/" />
            ) : isWarehouse ? (
              <Navigate to="/" />
            ) : (
              <ClientLogin />
            )
          }
        />
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
