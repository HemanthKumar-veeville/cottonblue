import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SuperadminLayout } from "./components/Layout/SuperadminLayout";
import { SuperadminAdd } from "./screens/SuperadminAdd/SuperadminAdd";
import { ProductSidebarSection } from "./screens/SuperadminAdd/sections/ProductSidebarSection/ProductSidebarSection";
import ComingSoon from "./components/ComingSoon";
import NotFound from "./components/NotFound";
import Error from "./components/Error";
import { ProductList } from "./screens/ProductList";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SuperadminLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<ComingSoon />} />
          <Route path="order-history" element={<ComingSoon />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/add" element={<ProductSidebarSection />} />
          <Route path="products/stock" element={<ComingSoon />} />
          <Route path="products/categories" element={<ComingSoon />} />
          <Route path="products/carousel" element={<ComingSoon />} />
          <Route path="customers" element={<ComingSoon />} />
          <Route path="customers/add" element={<ComingSoon />} />
          <Route path="support/messages" element={<ComingSoon />} />
          <Route path="settings" element={<ComingSoon />} />
          <Route path="logout" element={<ComingSoon />} />

          {/* Coming Soon Routes */}
          <Route path="analytics" element={<ComingSoon />} />
          <Route path="reports" element={<ComingSoon />} />
          <Route path="integrations" element={<ComingSoon />} />

          {/* Error Routes */}
          <Route path="error" element={<Error />} />
        </Route>

        {/* 404 Route - Must be last */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
