import { Navigate } from "react-router-dom";
import { ProductSidebarSection } from "../screens/SuperadminAdd/sections/ProductSidebarSection/ProductSidebarSection";
import ComingSoon from "../components/ComingSoon";
import { ProductList } from "../screens/ProductList";
import Carousel from "../screens/Carousel/Carousel";
import Tickets from "../screens/Tickets/Tickets";
import { ClientList } from "../screens/ClientList";
import { GlobalDashboard } from "../screens/GlobalDashboard/GlobalDashboard";
import ClientDetails from "../screens/ClientDetails/ClientDetails";
import AgencyDetails from "../screens/AgencyDetails/AgencyDetails";
import { AgenciesList } from "../screens/AgenciesList";
import AddAgency from "../screens/AddAgency/AddAgency";
import ProductDetails from "../screens/ProductDetails/ProductDetails";
import AddUser from "../screens/AddUser/AddUser";
import { UserList } from "../screens/UserList";
import UserDetails from "../screens/UserDetails/UserDetails";
import SuperAdminOrderHistory from "../screens/SuperAdminOrderHistory/SuperAdminOrderHistory";
import SuperAdminOrderDetails from "../screens/SuperAdminOrderDetails/SuperAdminOrderDetails";
import SuperAdminSettings from "../screens/SuperAdminSettings/SuperAdminSettings";
import AddProduct_step_1 from "../screens/AddProduct/AddProduct_step_1";
import { ClientDashboard } from "../screens/ClientDashboard/ClientDashboard";
import LinkProducts from "../screens/LinkProducts/LinkProducts";
import AddVariant from "../screens/AddVariant/AddVariant";
import { Warehouse } from "../screens/Warehouse/Warehouse";
import ManageStock from "../screens/ManageStock/ManageStock";
import TestBoard from "../screens/TestBoard/TestBoard";
import ErrorLogs from "../screens/ErrorLogs/ErrorLogs";
import Error from "../components/Error";
import AddClient from "../screens/AddClient/AddClient";

export const adminRoutes = [
  { path: "/", element: <Navigate to="/dashboard" replace /> },
  { path: "dashboard", element: <GlobalDashboard /> },
  { path: "client-dashboard", element: <ClientDashboard /> },
  { path: "order-history", element: <SuperAdminOrderHistory /> },
  { path: "order-details/:store_id/:id", element: <SuperAdminOrderDetails /> },
  { path: "products", element: <ProductList /> },
  { path: "manage-stock", element: <ManageStock /> },
  { path: "products/add", element: <ProductSidebarSection mode="add" /> },
  { path: "products/allot-store/:id", element: <AddProduct_step_1 /> },
  { path: "products/allot-store-edit/:id", element: <AddProduct_step_1 /> },
  { path: "products/add-variant/:id", element: <AddVariant /> },
  { path: "products/link-products/:id", element: <LinkProducts /> },
  { path: "products/edit/:id", element: <ProductSidebarSection mode="edit" /> },
  { path: "products/:id", element: <ProductDetails /> },
  { path: "products/stock", element: <ComingSoon /> },
  { path: "products/carousel", element: <Carousel /> },
  { path: "warehouse", element: <Warehouse /> },
  { path: "customers", element: <ClientList /> },
  { path: "customers/edit", element: <AddClient /> },
  { path: "customers/add", element: <AddClient /> },
  { path: "customers/:company_name", element: <ClientDetails /> },
  { path: "agencies", element: <AgenciesList /> },
  { path: "agencies/edit/:id", element: <AddAgency /> },
  { path: "agencies/add", element: <AddAgency /> },
  { path: "users", element: <UserList /> },
  { path: "users/add", element: <AddUser /> },
  { path: "users/edit/:id", element: <AddUser /> },
  { path: "users/:id", element: <UserDetails /> },
  {
    path: "customers/:company_name/agencies/:agency_id",
    element: <AgencyDetails />,
  },
  { path: "support/tickets", element: <Tickets /> },
  { path: "settings", element: <SuperAdminSettings /> },
  { path: "logout", element: <ComingSoon /> },
  { path: "analytics", element: <ComingSoon /> },
  { path: "reports", element: <ComingSoon /> },
  { path: "integrations", element: <ComingSoon /> },
  { path: "error", element: <Error /> },
  { path: "test-board", element: <TestBoard /> },
  { path: "error-logs", element: <ErrorLogs /> },
];
