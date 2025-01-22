import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {createBrowserRouter, RouterProvider} from "react-router-dom";

import "./index.css";
import Home from "./Home";
import Chat from "./Chat";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {path: "/chat/:userId", element: <Chat />},
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
