import { Navigate, useLocation } from "react-router";
import { useAuth } from "@/context/AuthContext";

/**
 * ProtectedRoute
 * @param {string[]} roles  - Optional array of roles allowed (e.g. ['organizer', 'admin'])
 *                           If omitted, any logged-in user passes.
 */
const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
