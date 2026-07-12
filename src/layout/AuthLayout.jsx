import React from "react";
import Logo from "@/components/Logo/Logo";
import { Outlet, Link } from "react-router";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const AuthLayout = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center bg-background text-foreground transition-colors duration-305 overflow-hidden font-sans">
      
      {/* 1. Background Image from Unsplash with Slow Zoom Effect */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2000"
          alt="Event Background"
          className="w-full h-full object-cover select-none pointer-events-none transform scale-105 transition-transform duration-[10000ms] ease-out brightness-[0.75] dark:brightness-[0.35]"
        />
        {/* Dynamic bright/dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-background/88 via-background/40 to-primary/10 dark:from-background dark:via-background/80 dark:to-primary/20 transition-all duration-300" />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-40" />
      </div>

      {/* 2. Floating Header & Navigation */}
      <div className="absolute top-6 left-6 sm:left-10 z-20">
        <Link
          to="/"
          className="block p-2 sm:p-2.5 rounded-2xl bg-card border border-border shadow-lg hover:opacity-95 transition-all duration-200 cursor-pointer"
        >
          <Logo />
        </Link>
      </div>

      {/* Floating Back to Home & Theme Toggle buttons */}
      <div className="absolute top-6 right-6 sm:right-10 z-20 flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center p-2.5 sm:p-3 rounded-2xl bg-card border border-border text-foreground hover:bg-secondary/40 shadow-lg backdrop-blur-md transition-all duration-200 cursor-pointer"
          aria-label="Toggle Theme"
        >
          {theme === "light" ? (
            <Moon className="h-4 w-4 text-primary" />
          ) : (
            <Sun className="h-4 w-4 text-accent" />
          )}
        </button>
        <Link
          to="/"
          className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-foreground/80 hover:text-foreground transition-all duration-200 bg-card hover:bg-secondary/40 border border-border rounded-2xl py-2.5 px-4 shadow-lg backdrop-blur-md cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
      </div>

      {/* 3. Central Login/Register Card Container */}
      <div className="relative z-10 w-full max-w-[90%] sm:max-w-md md:max-w-lg mt-24 mb-16 flex flex-col items-center">
        <div className="w-full transition-all duration-300">
          <Outlet />
        </div>

        {/* Footnote */}
        <div className="mt-8 text-center text-xs text-muted-foreground flex gap-4 justify-center relative z-10 font-semibold">
          <a href="#privacy" className="hover:text-primary transition-colors">Privacy Policy</a>
          <span>•</span>
          <a href="#terms" className="hover:text-primary transition-colors">Terms of Service</a>
          <span>•</span>
          <a href="#help" className="hover:text-primary transition-colors">Help Centre</a>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
