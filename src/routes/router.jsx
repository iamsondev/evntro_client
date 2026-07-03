import AuthLayout from "@/layout/AuthLayout";
import RootLayout from "@/layout/RootLayout";
import Login from "@/pages/Authentication/Login/Login";
import Register from "@/pages/Authentication/Register/Register";
import Home from "@/pages/Home/Home/Home";
import { createBrowserRouter } from "react-router";
export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
    ],
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
    ],
  },
]);
