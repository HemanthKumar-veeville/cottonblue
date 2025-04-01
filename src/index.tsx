import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SuperadminLayout } from "./components/Layout/SuperadminLayout";
import { SuperadminAdd } from "./screens/SuperadminAdd/SuperadminAdd";
import { ProductSidebarSection } from "./screens/SuperadminAdd/sections/ProductSidebarSection/ProductSidebarSection";

// Placeholder components for routes - you'll need to create these
const Dashboard = () => <div>Dashboard Page</div>;
const OrderHistory = () => <div>Order History Page</div>;
const Products = () => <div>Products List Page</div>;
const AddProduct = () => <ProductSidebarSection />;
const StockManagement = () => <div>Stock Management Page</div>;
const Categories = () => <div>Categories Page</div>;
const Carousel = () => <div>Carousel Page</div>;
const Customers = () => <div>Customers List Page</div>;
const AddCustomer = () => <div>Add Customer Page</div>;
const Messages = () => <div>Messages Page</div>;
const Settings = () => <div>Settings Page</div>;
const Logout = () => <div>Logout Page</div>;

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SuperadminLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="order-history" element={<OrderHistory />} />
          <Route path="products" element={<Products />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/stock" element={<StockManagement />} />
          <Route path="products/categories" element={<Categories />} />
          <Route path="products/carousel" element={<Carousel />} />
          <Route path="customers" element={<Customers />} />
          <Route path="customers/add" element={<AddCustomer />} />
          <Route path="support/messages" element={<Messages />} />
          <Route path="settings" element={<Settings />} />
          <Route path="logout" element={<Logout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
