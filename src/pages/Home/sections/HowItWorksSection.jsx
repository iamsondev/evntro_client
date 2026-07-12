import React, { useEffect, useRef } from "react";
import { Search, UserCheck, CalendarCheck } from "lucide-react";
import { Link } from "react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    number: "01",
    icon: Search,
    title: "Discover Events",
    description:
      "Browse thousands of curated events — concerts, summits, workshops, hackathons — filtered by category, city, or date.",
    cta: { label: "Browse Events", to: "/events" },
    color: "from-primary/15 to-primary/5",
    iconColor: "text-primary",
    borderColor: "border-primary/20",
  },
  {
    number: "02",
    icon: UserCheck,
    title: "Register Instantly",
    description:
      "One-click registration with your Evntro account. No long forms, no hassle. Your seat is confirmed immediately.",
    cta: { label: "Create Account", to: "/register" },
    color: "from-accent/15 to-accent/5",
    iconColor: "text-accent",
    borderColor: "border-accent/20",
  },
  {
    number: "03",
    icon: CalendarCheck,
    title: "Attend & Experience",
    description:
      "Get event reminders, manage your calendar, and attend unforgettable experiences. Rate and review afterwards.",
    cta: { label: "Learn More", to: "/events" },
    color: "from-primary/10 to-accent/5",
    iconColor: "text-primary",
    borderColor: "border-primary/15",
  },
];

const HowItWorksSection = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header entrance
      gsap.fromTo(
        ".how-header",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".how-header",
            start: "top 85%",
            toggleActions: "play none none none",
          },
          clearProps: "all"
        }
      );

      // Connecting line animation
      gsap.fromTo(
        ".connecting-line",
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: "left center",
          duration: 1.2,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: ".steps-grid",
            start: "top 80%",
            toggleActions: "play none none none",
          },
          clearProps: "all"
        }
      );

      // Staggered steps entrance
      gsap.fromTo(
        ".step-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".steps-grid",
            start: "top 80%",
            toggleActions: "play none none none",
          },
          clearProps: "all"
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-24 bg-background transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 how-header">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary ring-1 ring-primary/20 mb-4 tracking-wider uppercase">
            Simple Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
            How Evntro Works
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            From discovery to experience, we make event registration seamless and delightful.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative steps-grid">
          {/* Connecting line (desktop) */}
          <div className="absolute top-14 left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)] hidden md:block h-px bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 connecting-line origin-left" />

          {STEPS.map((step) => (
            <div
              key={step.number}
              className="relative flex flex-col items-center text-center group step-card"
            >
              {/* Icon circle */}
              <div
                className={`relative z-10 flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br ${step.color} border ${step.borderColor} shadow-lg group-hover:scale-105 transition-transform duration-300 mb-6`}
              >
                <step.icon className={`h-10 w-10 ${step.iconColor}`} />
                <span className="absolute -top-2.5 -right-2.5 h-7 w-7 flex items-center justify-center rounded-full bg-card border border-border text-[11px] font-black text-foreground shadow-sm">
                  {step.number}
                </span>
              </div>

              <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5 max-w-xs">
                {step.description}
              </p>
              <Link
                to={step.cta.to}
                className="text-xs font-bold text-primary hover:text-primary/80 transition-colors underline underline-offset-4"
              >
                {step.cta.label} →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
