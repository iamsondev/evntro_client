import { useState } from "react";
import { Link, NavLink } from "react-router";
import { Menu, X, User, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo/Logo";
import { useTheme } from "@/context/ThemeContext";

const NAV_LINKS = [
  { label: "Explore Events", to: "/events" },
  { label: "Create Event", to: "/organizer/create" },
  { label: "About", to: "/about" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // TODO: replace with real auth state from your AuthContext
  const isLoggedIn = false;

  const linkClasses = ({ isActive }) =>
    `text-sm font-medium transition-colors hover:text-primary ${
      isActive ? "text-primary font-semibold" : "text-muted-foreground"
    }`;

  const ThemeToggle = () => (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-[36px] w-[36px] items-center justify-center rounded-xl text-foreground hover:bg-secondary/40 transition-colors duration-200 cursor-pointer"
      aria-label="Toggle Theme"
    >
      {theme === "light" ? (
        <Moon className="h-[20px] w-[20px] text-primary" />
      ) : (
        <Sun className="h-[20px] w-[20px] text-accent" />
      )}
    </Button>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Logo></Logo>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex md:items-center md:gap-8">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClasses}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop auth + theme toggle buttons */}
        <div className="hidden md:flex md:items-center md:gap-3">
          <ThemeToggle />
          <div className="h-4 w-[1px] bg-border mx-1" />
          {isLoggedIn ? (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild className="hover:text-primary">
                <Link to="/login">Log in</Link>
              </Button>
              <Button size="sm" asChild className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl">
                <Link to="/register">Register</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile items */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          {/* Mobile menu button */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-secondary/40 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <nav className="border-t border-border bg-background md:hidden transition-colors duration-300">
          <div className="space-y-1 px-4 py-3">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block rounded-md px-3 py-2 text-base font-medium ${
                    isActive
                      ? "bg-secondary/40 text-primary"
                      : "text-muted-foreground hover:bg-secondary/20"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
              {isLoggedIn ? (
                <Button variant="ghost" size="sm" asChild className="justify-start">
                  <Link to="/profile" onClick={() => setIsOpen(false)}>
                    Profile
                  </Link>
                </Button>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild className="justify-front hover:text-primary">
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      Log in
                    </Link>
                  </Button>
                  <Button size="sm" asChild className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl justify-center">
                    <Link to="/register" onClick={() => setIsOpen(false)}>
                      Register
                    </Link>
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
