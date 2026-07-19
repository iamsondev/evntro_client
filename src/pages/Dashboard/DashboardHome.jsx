import { useAuth } from "@/context/AuthContext";
import UserDashboardPanel from "./components/UserDashboardPanel";
import OrganizerDashboardPanel from "./components/OrganizerDashboardPanel";
import AdminDashboardPanel from "./components/AdminDashboardPanel";

const DashboardHome = () => {
  const { user } = useAuth();
  const role = user?.role || "user";

  if (role === "admin") {
    return <AdminDashboardPanel />;
  }

  if (role === "organizer") {
    return <OrganizerDashboardPanel />;
  }

  return <UserDashboardPanel />;
};

export default DashboardHome;
