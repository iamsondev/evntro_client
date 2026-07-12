import React, { useState, useEffect, useRef } from "react";
import { Mail, CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success
  const containerRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || status !== "idle") return;
    setStatus("loading");
    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1000);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".newsletter-card",
        { opacity: 0, scale: 0.96, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".newsletter-card",
            start: "top 85%",
            toggleActions: "play none none none"
          },
          clearProps: "all"
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative py-24 bg-background overflow-hidden transition-colors duration-300">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(47,62,168,0.07),transparent_55%)] dark:bg-[radial-gradient(ellipse_at_top_left,rgba(91,110,245,0.1),transparent_55%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(156,122,46,0.06),transparent_55%)] dark:bg-[radial-gradient(ellipse_at_bottom_right,rgba(201,168,118,0.08),transparent_55%)] pointer-events-none" />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-card border border-border/80 rounded-3xl p-10 sm:p-14 shadow-2xl text-center newsletter-card">
          {/* Icon */}
          <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/10 border border-primary/20 mx-auto mb-6">
            <Mail className="h-7 w-7 text-primary" />
          </div>

          {/* Badge */}
          <div className="flex items-center justify-center gap-2 text-accent font-bold text-xs tracking-widest uppercase mb-4">
            <Sparkles className="h-4 w-4 animate-pulse" /> Stay Updated
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4">
            Never Miss an Event
          </h2>
          <p className="text-muted-foreground mb-10 max-w-md mx-auto leading-relaxed">
            Subscribe to our weekly digest and be the first to know about new events, exclusive offers, and handpicked highlights — delivered straight to your inbox.
          </p>

          {status === "success" ? (
            <div className="flex flex-col items-center gap-3 animate-in fade-in">
              <CheckCircle className="h-12 w-12 text-green-500" />
              <p className="text-lg font-bold text-foreground">You're in! 🎉</p>
              <p className="text-sm text-muted-foreground">
                Check your inbox for a confirmation email. We'll be in touch soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="relative flex-1">
                <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-background border border-border rounded-2xl pl-11 pr-4 py-3.5 text-sm text-foreground placeholder-muted-foreground/70 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-sm rounded-2xl shadow-lg shadow-primary/15 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 cursor-pointer shrink-0"
              >
                {status === "loading" ? (
                  <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>Subscribe <ArrowRight className="h-4 w-4" /></>
                )}
              </button>
            </form>
          )}

          <p className="mt-5 text-xs text-muted-foreground">
            No spam, ever. Unsubscribe at any time. 🔒 We respect your privacy.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
