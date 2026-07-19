import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { Menu, X, Sun, Moon, User, ChevronDown, Plus, CalendarDays, Heart, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo/Logo";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-[36px] w-[36px] rounded-xl text-foreground hover:bg-secondary/40 transition-colors cursor-pointer"
      aria-label="Toggle Theme"
    >
      {theme === "light" ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-accent" />}
    </Button>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const isOrganizer = user?.role === "organizer" || user?.role === "admin";

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    setProfileOpen(false);
    setIsOpen(false);
    navigate("/");
  };

  const linkCls = ({ isActive }) =>
    `text-sm font-semibold transition-colors hover:text-primary ${isActive ? "text-primary" : "text-muted-foreground"}`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/95 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <Logo />
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex md:items-center md:gap-7">
          <NavLink to="/events" className={linkCls}>Browse Events</NavLink>
          <NavLink to="/about" className={linkCls}>About</NavLink>
          <NavLink to="/contact" className={linkCls}>Contact</NavLink>
          {user && <NavLink to="/my-portal?tab=registrations" className={linkCls}>My Registrations</NavLink>}
          {user && <NavLink to="/my-portal?tab=wishlist" className={linkCls}>Wishlist</NavLink>}
          {isOrganizer && <NavLink to="/my-portal?tab=events" className={linkCls}>My Events</NavLink>}
        </nav>

        {/* Desktop right side */}
        <div className="hidden md:flex md:items-center md:gap-3">
          {/* Organizer Create Event CTA */}
          {isOrganizer && (
            <Link
              to="/events/create"
              className="flex items-center gap-1.5 px-4 py-2 bg-accent text-background dark:text-foreground font-bold text-xs rounded-xl hover:opacity-90 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" /> Create Event
            </Link>
          )}

          <ThemeToggle />
          <div className="h-4 w-px bg-border mx-1" />

          {user ? (
            /* Profile Dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileOpen((p) => !p)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-xl text-sm font-semibold text-foreground hover:bg-secondary/40 border border-border transition-all cursor-pointer"
              >
                <div className="h-7 w-7 rounded-lg border border-primary/20 overflow-hidden shrink-0 relative flex items-center justify-center">
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
                    className="h-full w-full bg-primary/10 flex items-center justify-center text-primary font-black uppercase text-xs"
                    style={{ display: user?.avatar ? 'none' : 'flex' }}
                  >
                    {user?.name?.slice(0, 2) || <User className="h-3.5 w-3.5" />}
                  </div>
                </div>
                <span className="max-w-[100px] truncate">{user.name || user.email}</span>
                <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${profileOpen ? "rotate-180" : ""}`} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 w-52 bg-card border border-border rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-xs text-muted-foreground">Signed in as</p>
                    <p className="text-sm font-bold text-foreground truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">{user.role}</span>
                  </div>
                  <div className="py-1">
                    <Link to="/dashboard" onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-secondary/40 transition-colors">
                      <LayoutDashboard className="h-4 w-4 text-primary" /> Dashboard
                    </Link>
                    {isOrganizer && (
                      <Link to="/events/create" onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-secondary/40 transition-colors">
                        <Plus className="h-4 w-4 text-accent" /> Create Event
                      </Link>
                    )}
                    {isOrganizer && (
                      <Link to="/my-portal?tab=events" onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-secondary/40 transition-colors">
                        <CalendarDays className="h-4 w-4 text-accent" /> My Events
                      </Link>
                    )}
                    <Link to="/my-portal?tab=registrations" onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-secondary/40 transition-colors">
                      <CalendarDays className="h-4 w-4 text-accent" /> My Registrations
                    </Link>
                    <Link to="/my-portal?tab=wishlist" onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-secondary/40 transition-colors">
                      <Heart className="h-4 w-4 text-accent" /> Wishlist
                    </Link>
                    <div className="h-px bg-border my-1" />
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/8 transition-colors cursor-pointer">
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild className="hover:text-primary">
                <Link to="/login">Log in</Link>
              </Button>
              <Button size="sm" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl">
                <Link to="/register">Register</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile right side */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl p-2 text-muted-foreground hover:bg-secondary/40 transition-colors"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <nav className="border-t border-border bg-background md:hidden transition-colors duration-300">
          <div className="space-y-1 px-4 py-4">
            <NavLink to="/events" onClick={() => setIsOpen(false)}
              className={({ isActive }) => `block rounded-xl px-3 py-2.5 text-sm font-semibold ${isActive ? "bg-secondary/40 text-primary" : "text-muted-foreground hover:bg-secondary/20"}`}>
              Browse Events
            </NavLink>
            <NavLink to="/about" onClick={() => setIsOpen(false)}
              className={({ isActive }) => `block rounded-xl px-3 py-2.5 text-sm font-semibold ${isActive ? "bg-secondary/40 text-primary" : "text-muted-foreground hover:bg-secondary/20"}`}>
              About
            </NavLink>
            <NavLink to="/contact" onClick={() => setIsOpen(false)}
              className={({ isActive }) => `block rounded-xl px-3 py-2.5 text-sm font-semibold ${isActive ? "bg-secondary/40 text-primary" : "text-muted-foreground hover:bg-secondary/20"}`}>
              Contact
            </NavLink>

            {user && (
              <NavLink to="/dashboard" onClick={() => setIsOpen(false)}
                className={({ isActive }) => `block rounded-xl px-3 py-2.5 text-sm font-semibold ${isActive ? "bg-secondary/40 text-primary" : "text-muted-foreground hover:bg-secondary/20"}`}>
                Dashboard
              </NavLink>
            )}
            {user && (
              <NavLink to="/my-portal?tab=registrations" onClick={() => setIsOpen(false)}
                className={({ isActive }) => `block rounded-xl px-3 py-2.5 text-sm font-semibold ${isActive ? "bg-secondary/40 text-primary" : "text-muted-foreground hover:bg-secondary/20"}`}>
                My Registrations
              </NavLink>
            )}
            {user && (
              <NavLink to="/my-portal?tab=wishlist" onClick={() => setIsOpen(false)}
                className={({ isActive }) => `block rounded-xl px-3 py-2.5 text-sm font-semibold ${isActive ? "bg-secondary/40 text-primary" : "text-muted-foreground hover:bg-secondary/20"}`}>
                Wishlist
              </NavLink>
            )}
            {isOrganizer && (
              <NavLink to="/my-portal?tab=events" onClick={() => setIsOpen(false)}
                className={({ isActive }) => `block rounded-xl px-3 py-2.5 text-sm font-semibold ${isActive ? "bg-secondary/40 text-primary" : "text-muted-foreground hover:bg-secondary/20"}`}>
                My Events
              </NavLink>
            )}

            <div className="mt-4 pt-4 border-t border-border flex flex-col gap-2">
              {isOrganizer && (
                <Link to="/events/create" onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-accent text-background dark:text-foreground font-bold text-sm rounded-xl hover:opacity-90 transition-all">
                  <Plus className="h-4 w-4" /> Create Event
                </Link>
              )}
              {user ? (
                <button onClick={handleLogout}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-destructive/10 text-destructive font-bold text-sm rounded-xl hover:bg-destructive/20 transition-all cursor-pointer">
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild className="justify-center hover:text-primary">
                    <Link to="/login" onClick={() => setIsOpen(false)}>Log in</Link>
                  </Button>
                  <Button size="sm" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl justify-center">
                    <Link to="/register" onClick={() => setIsOpen(false)}>Register</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
