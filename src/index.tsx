import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SuperadminAdd } from "./screens/SuperadminAdd/SuperadminAdd";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <SuperadminAdd />
  </StrictMode>,
);
