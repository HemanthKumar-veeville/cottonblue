import { Navigate } from "react-router-dom";
import { Warehouse } from "../screens/Warehouse/Warehouse";
import { ProductList } from "../screens/ProductList";
import ProductDetails from "../screens/ProductDetails/ProductDetails";
import ClientSupport from "../screens/ClientSupport/ClientSupport";
import NotFound from "../components/NotFound";

export const warehouseRoutes = [
  { path: "/", element: <Navigate to="/warehouse" replace /> },
  { path: "warehouse", element: <Warehouse /> },
  { path: "products", element: <ProductList /> },
  { path: "products/:id", element: <ProductDetails /> },
  { path: "support", element: <ClientSupport /> },
  { path: "*", element: <NotFound /> },
];
