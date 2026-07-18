import { createBrowserRouter, Navigate } from "react-router";
import AuthLayout from "@/layout/AuthLayout";
import RootLayout from "@/layout/RootLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

// Pages
import Home from "@/pages/Home/Home/Home";
import Login from "@/pages/Authentication/Login/Login";
import Register from "@/pages/Authentication/Register/Register";
import EventsPage from "@/pages/Events/EventsPage";
import EventDetailPage from "@/pages/Events/EventDetailPage";
import CreateEventPage from "@/pages/Events/CreateEventPage";
import MyHubPage from "@/pages/User/MyHubPage";
import PaymentSuccessPage from "@/pages/Events/PaymentSuccessPage";

// Dashboard
import DashboardLayout from "@/layout/DashboardLayout";
import DashboardHome from "@/pages/Dashboard/DashboardHome";

export const router = createBrowserRouter([
  // ── Public root (Navbar + Footer) ────────────────────────────────────────
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Home },

      // Events – public
      { path: "events", Component: EventsPage },
      { path: "events/:id", Component: EventDetailPage },
      { path: "payment-success", Component: PaymentSuccessPage },

      // Events – protected (organizer / admin only)
      {
        path: "events/create",
        element: (
          <ProtectedRoute roles={["organizer", "admin"]}>
            <CreateEventPage />
          </ProtectedRoute>
        ),
      },

      // Centralized hub portal route
      {
        path: "my-portal",
        element: (
          <ProtectedRoute>
            <MyHubPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "my-registrations",
        element: <Navigate to="/my-portal?tab=registrations" replace />,
      },
      {
        path: "wishlist",
        element: <Navigate to="/my-portal?tab=wishlist" replace />,
      },
      {
        path: "my-events",
        element: <Navigate to="/my-portal?tab=events" replace />,
      },
    ],
  },

  // ── Dashboard layout (Sidebar + Role-based views) ──────────────────────────
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, Component: DashboardHome },
      {
        path: "registrations",
        element: <Navigate to="/my-portal?tab=registrations" replace />,
      },
      {
        path: "wishlist",
        element: <Navigate to="/my-portal?tab=wishlist" replace />,
      },
      {
        path: "events",
        element: <Navigate to="/my-portal?tab=events" replace />,
      },
      {
        path: "create-event",
        element: (
          <ProtectedRoute roles={["organizer", "admin"]}>
            <CreateEventPage />
          </ProtectedRoute>
        ),
      },
    ],
  },

  // ── Auth layout (no Navbar) ───────────────────────────────────────────────
  {
    path: "/",
    Component: AuthLayout,
    children: [
      { path: "login", Component: Login },
      { path: "register", Component: Register },
    ],
  },
]);

