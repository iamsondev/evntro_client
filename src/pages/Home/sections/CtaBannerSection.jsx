import React, { useEffect, useRef } from "react";
import { Link } from "react-router";
import { ArrowRight, CalendarDays, Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CtaBannerSection = () => {
  const { user } = useAuth();
  const isOrganizer = user?.role === "organizer" || user?.role === "admin";
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cta-content > *",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none none"
          },
          clearProps: "all"
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative overflow-hidden bg-primary py-20 transition-colors duration-300">
      {/* Background geometric patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-white -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-accent translate-x-1/4 translate-y-1/4" />
        <div className="absolute top-1/2 left-1/2 w-32 h-32 rounded-full bg-white -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center cta-content">
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-5">
          {isOrganizer
            ? "Ready to host your next event?"
            : "Your next great experience starts here."}
        </h2>
        <p className="text-lg text-white/80 max-w-2xl mx-auto mb-10 font-medium">
          {isOrganizer
            ? "Create, publish, and manage events for thousands of attendees with zero complexity. Your audience is waiting."
            : "Join thousands of event-goers discovering world-class concerts, workshops, hackathons, and summits across Bangladesh."}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {isOrganizer ? (
            <Link
              to="/events/create"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-bold text-sm rounded-2xl hover:bg-white/90 shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus className="h-4.5 w-4.5" /> Create an Event
            </Link>
          ) : (
            <>
              <Link
                to="/events"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-bold text-sm rounded-2xl hover:bg-white/90 shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                <CalendarDays className="h-4.5 w-4.5" /> Browse Events
              </Link>
              {!user && (
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/40 text-white font-bold text-sm rounded-2xl hover:bg-white/10 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  Create Free Account <ArrowRight className="h-4.5 w-4.5" />
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default CtaBannerSection;
