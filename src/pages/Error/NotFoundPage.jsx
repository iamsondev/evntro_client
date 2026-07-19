import { Link, useNavigate } from "react-router";
import { Home, ArrowLeft, Search, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";

const FloatingOrb = ({ style }) => (
  <div
    className="absolute rounded-full blur-3xl opacity-20 animate-pulse"
    style={style}
  />
);

const NotFoundPage = () => {
  const navigate = useNavigate();
  const counterRef = useRef(null);

  // Animated number counter effect
  useEffect(() => {
    const el = counterRef.current;
    if (!el) return;
    let start = 0;
    const end = 404;
    const duration = 800;
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start = Math.min(start + step, end);
      el.textContent = start;
      if (start >= end) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center overflow-hidden bg-background px-4">
      {/* Background orbs */}
      <FloatingOrb style={{ width: 500, height: 500, background: "hsl(var(--primary))", top: "-10%", left: "-10%", animationDuration: "4s" }} />
      <FloatingOrb style={{ width: 400, height: 400, background: "hsl(var(--accent))", bottom: "-10%", right: "-5%", animationDuration: "6s", animationDelay: "1s" }} />
      <FloatingOrb style={{ width: 300, height: 300, background: "hsl(var(--primary))", bottom: "20%", left: "20%", animationDuration: "5s", animationDelay: "2s" }} />

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl">
        {/* 404 number */}
        <div className="relative mb-6">
          {/* Glow ring */}
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl scale-150" />
          <h1
            ref={counterRef}
            className="relative text-[10rem] sm:text-[14rem] font-black leading-none tracking-tighter bg-clip-text text-transparent"
            style={{
              backgroundImage: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 60%, hsl(var(--primary)) 100%)",
            }}
          >
            404
          </h1>
        </div>

        {/* Decorative line */}
        <div className="flex items-center gap-3 mb-6 w-full max-w-xs">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        {/* Headline */}
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
          Page Not Found
        </h2>
        <p className="text-muted-foreground text-base sm:text-lg max-w-md mb-10 leading-relaxed">
          Looks like this event got cancelled — or the page you're looking for
          doesn't exist. Let's get you back on track.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="gap-2 rounded-xl border-border/60 hover:border-primary/40 hover:text-primary transition-all w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>

          <Button
            asChild
            className="gap-2 rounded-xl bg-primary hover:bg-primary/90 font-semibold shadow-lg shadow-primary/25 transition-all w-full sm:w-auto"
          >
            <Link to="/">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="gap-2 rounded-xl border-border/60 hover:border-accent/40 hover:text-accent transition-all w-full sm:w-auto"
          >
            <Link to="/events">
              <Search className="h-4 w-4" />
              Browse Events
            </Link>
          </Button>
        </div>

        {/* Bottom hint */}
        <p className="mt-10 text-xs text-muted-foreground/60">
          Error code{" "}
          <span className="font-mono text-muted-foreground">404</span> — Not
          Found
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;
