import React, { useEffect, useRef } from "react";
import { Link } from "react-router";
import { Zap, Globe, Shield, BarChart3, Bell, Smartphone } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  {
    icon: Zap,
    title: "Instant Registration",
    description: "One-click event registration with real-time confirmation. No waiting, no friction — your seat is secured the moment you click.",
    gradient: "from-primary/15 to-primary/5",
    iconColor: "text-primary",
  },
  {
    icon: Globe,
    title: "Discover Anywhere",
    description: "Filter by city, date, category, or keyword. Find online webinars or in-person events happening right in your neighbourhood.",
    gradient: "from-accent/15 to-accent/5",
    iconColor: "text-accent",
  },
  {
    icon: Shield,
    title: "Secure & Trusted",
    description: "Cookie-based auth, end-to-end data encryption, and strict role-based access ensure your account and events stay safe.",
    gradient: "from-primary/10 to-accent/5",
    iconColor: "text-primary",
  },
  {
    icon: BarChart3,
    title: "Organizer Analytics",
    description: "Track registrations, capacity fill-rate, and audience demographics from your organizer dashboard in real time.",
    gradient: "from-accent/10 to-primary/5",
    iconColor: "text-accent",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description: "Get AI-curated event recommendations, timely reminders, and updates for every event you're registered for.",
    gradient: "from-primary/15 to-accent/5",
    iconColor: "text-primary",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    description: "Fully responsive across all devices. Browse, register, and manage events just as comfortably on your phone as your desktop.",
    gradient: "from-accent/15 to-primary/5",
    iconColor: "text-accent",
  },
];

const FeaturesSection = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        ".features-header",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".features-header",
            start: "top 85%",
            toggleActions: "play none none none",
          },
          clearProps: "all"
        }
      );

      // Staggered grid cards animation
      gsap.fromTo(
        ".feature-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".features-grid",
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
    <section ref={containerRef} className="py-24 bg-muted/10 border-y border-border/50 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 features-header">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary ring-1 ring-primary/20 mb-4 tracking-wider uppercase">
            Platform Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
            Everything you need in one place
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Evntro is built from the ground up to make event experiences seamless for both attendees and organizers.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 features-grid">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group bg-card border border-border/80 rounded-3xl p-7 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 flex flex-col gap-5 feature-card"
            >
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${f.gradient} border border-border/60 group-hover:scale-110 transition-transform duration-300`}
              >
                <f.icon className={`h-6 w-6 ${f.iconColor}`} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold text-sm rounded-2xl hover:bg-primary/95 shadow-lg shadow-primary/15 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            Get Started for Free →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
