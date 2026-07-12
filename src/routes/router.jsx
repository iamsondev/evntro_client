import { createBrowserRouter } from "react-router";
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
import MyRegistrationsPage from "@/pages/User/MyRegistrationsPage";
import WishlistPage from "@/pages/User/WishlistPage";
import MyEventsPage from "@/pages/User/MyEventsPage";

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

      // Events – protected (organizer / admin only)
      {
        path: "events/create",
        element: (
          <ProtectedRoute roles={["organizer", "admin"]}>
            <CreateEventPage />
          </ProtectedRoute>
        ),
      },

      // User pages – any logged-in user
      {
        path: "my-registrations",
        element: (
          <ProtectedRoute>
            <MyRegistrationsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "wishlist",
        element: (
          <ProtectedRoute>
            <WishlistPage />
          </ProtectedRoute>
        ),
      },

      // Organizer pages
      {
        path: "my-events",
        element: (
          <ProtectedRoute roles={["organizer", "admin"]}>
            <MyEventsPage />
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
