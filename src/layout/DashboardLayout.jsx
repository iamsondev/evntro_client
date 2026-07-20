import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import Logo from "@/components/Logo/Logo";
import {
  LayoutDashboard,
  Calendar,
  Heart,
  CalendarPlus,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  User,
  Users,
  Compass,
  Sparkles
} from "lucide-react";

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const getLinksByRole = () => {
    const role = user?.role || "user";
    const links = [
      {
        to: "/dashboard",
        label: "Overview",
        icon: LayoutDashboard,
        end: true,
      },
    ];

    if (role === "admin") {
      links.push(
        { to: "/dashboard/events", label: "Manage All Events", icon: Calendar },
        { to: "/dashboard/create-event", label: "Create Event", icon: CalendarPlus },
        { to: "/dashboard/users", label: "System Users", icon: Users },
      );
    } else if (role === "organizer") {
      links.push(
        { to: "/my-portal?tab=events", label: "My Created Events", icon: Calendar },
        { to: "/dashboard/create-event", label: "Create Event", icon: CalendarPlus },
      );
    } else {
      // Normal user (attendee)
      links.push(
        { to: "/my-portal?tab=registrations", label: "My Registrations", icon: Calendar },
        { to: "/my-portal?tab=wishlist", label: "My Wishlist", icon: Heart },
      );
    }

    return links;
  };

  const sidebarLinks = getLinksByRole();
  const roleDisplay = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "User";

  return (
    <div className="min-h-screen bg-background text-foreground flex transition-colors duration-300">
      {/* ─── Mobile Sidebar Overlay ─── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─── Sidebar Panel ─── */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-card border-r border-border/80 flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div>
          <div className="h-20 px-6 border-b border-border/60 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <Logo />
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 px-2 rounded-lg border border-border lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Profile Overview */}
          <div className="p-6 border-b border-border/60 bg-muted/20">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl border-2 border-primary/20 overflow-hidden shrink-0 relative flex items-center justify-center">
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="h-full w-full object-cover" 
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const fallbackElem = e.target.nextSibling;
                      if (fallbackElem) fallbackElem.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className="h-full w-full bg-gradient-to-tr from-primary/10 to-accent/10 flex items-center justify-center text-primary font-black uppercase text-lg select-none"
                  style={{ display: user?.avatar ? 'none' : 'flex' }}
                >
                  {user?.name?.slice(0, 2) || "EV"}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-foreground truncate">{user?.name || "Guest User"}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground bg-secondary/80 px-2 py-0.5 rounded-full border border-border/40">
                    {roleDisplay}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Menu */}
          <nav className="p-4 space-y-1.5">
            {sidebarLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-4.5 py-3.5 rounded-2xl text-sm font-bold border transition-all duration-300 ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/10"
                      : "bg-transparent text-muted-foreground border-transparent hover:text-foreground hover:bg-secondary/40"
                  }`
                }
              >
                <link.icon className="h-4.5 w-4.5 shrink-0" />
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="p-4 border-t border-border/60">
          <div className="flex items-center justify-between gap-2 mb-4 px-2">
            <Link
              to="/events"
              className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
            >
              <Compass className="h-4 w-4" /> Explore Events
            </Link>

            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-border bg-background hover:bg-secondary/40 text-foreground transition-colors cursor-pointer"
              title="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4.5 py-3.5 border border-destructive/20 text-destructive hover:bg-destructive hover:text-white rounded-2xl text-sm font-bold transition-all duration-200 cursor-pointer"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* ─── Main Content Canvas ─── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-20 px-6 sm:px-8 border-b border-border/60 flex items-center justify-between bg-card">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 border border-border rounded-xl lg:hidden text-foreground hover:bg-secondary/30 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h2 className="font-extrabold text-lg text-foreground capitalize">
                Dashboard Area
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col text-right hidden sm:block">
              <span className="text-sm font-bold text-foreground">{user?.email}</span>
              <span className="text-[10px] text-muted-foreground font-semibold">{user?.role}</span>
            </div>
            <div className="h-10 w-10 rounded-xl border border-primary/10 overflow-hidden shadow-inner relative flex items-center justify-center">
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="h-full w-full object-cover" 
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const fallbackElem = e.target.nextSibling;
                    if (fallbackElem) fallbackElem.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className="h-full w-full bg-primary/5 flex items-center justify-center text-primary font-black uppercase"
                style={{ display: user?.avatar ? 'none' : 'flex' }}
              >
                {user?.name?.slice(0, 2) || <User className="h-5 w-5" />}
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto bg-muted/10 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
