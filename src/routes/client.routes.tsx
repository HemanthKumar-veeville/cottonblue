import { AdminClientHome } from "../screens/AdminClientHome/AdminClientHome";
import ClientAdminDashboard from "../screens/ClientAdminDashboard/ClientAdminDashboard";
import OrderValidation from "../screens/OrderValidation/OrderValidation";
import { ClientUserListSection } from "../screens/UserListSection/ClientUserListSection";
import ClientAddUser from "../screens/AddUser/ClientAddUser";
import ClientUserDetails from "../screens/UserDetails/ClientUserDetails";
import ClientProduct from "../screens/ClientProduct/ClientProduct";
import CartContainer from "../screens/Cart/Cart";
import History from "../screens/History/History";
import OrderDetails from "../screens/OrderDetails/OrderDetails";
import ClientSupport from "../screens/ClientSupport/ClientSupport";
import ClientSettings from "../screens/ClientSettings/ClientSettings";

export const clientRoutes = [
  { path: "/", element: <AdminClientHome /> },
  { path: "admin-dashboard", element: <ClientAdminDashboard /> },
  { path: "validate-order/:store_id/:id", element: <OrderValidation /> },
  { path: "users", element: <ClientUserListSection /> },
  { path: "users/add", element: <ClientAddUser /> },
  { path: "users/edit/:id", element: <ClientAddUser /> },
  { path: "users/:id", element: <ClientUserDetails /> },
  { path: "product/:id", element: <ClientProduct /> },
  { path: "cart", element: <CartContainer /> },
  { path: "history", element: <History /> },
  { path: "order-details/:id", element: <OrderDetails /> },
  { path: "support", element: <ClientSupport /> },
  { path: "settings", element: <ClientSettings /> },
];
