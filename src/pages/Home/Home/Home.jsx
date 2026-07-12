import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import Banner from "../Banner/Banner";
import { EventCard } from "@/pages/Events/EventsPage";
import axiosInstance from "@/api/axiosInstance";
import { Sparkles, ChevronRight, Loader2 } from "lucide-react";
import PartnersSection from "../sections/PartnersSection";
import FeaturesSection from "../sections/FeaturesSection";
import StatsSection from "../sections/StatsSection";
import HowItWorksSection from "../sections/HowItWorksSection";
import TestimonialsSection from "../sections/TestimonialsSection";
import CtaBannerSection from "../sections/CtaBannerSection";
import NewsletterSection from "../sections/NewsletterSection";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const MOCK_FEATURED = [
  { _id:"m1", title:"Global Tech Summit 2026", description:"Experience the next frontier of tech, AI, cloud computing, and advanced agentic architectures.", category:"Conference", date:"2026-08-15T09:00:00.000Z", location:"BICC, Dhaka", capacity:500, banner:"https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200" },
  { _id:"m2", title:"Vite + Tailwind V4 Developer BootCamp", description:"Hands-on coding workshop exploring modern front-end tech stacks and responsive design systems.", category:"Workshop", date:"2026-08-22T10:00:00.000Z", location:"Gulshan, Dhaka", capacity:80, banner:"https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1200" },
  { _id:"m3", title:"Music Fest: Unplugged Symphony", description:"A magical night of live acoustic music and spectacular performances under the stars.", category:"Concert", date:"2026-09-05T18:00:00.000Z", location:"Army Stadium, Dhaka", capacity:2000, banner:"https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200" },
  { _id:"m4", title:"National Hackathon 2026", description:"36 hours of continuous building, brainstorming, and pitching. Create real-world solutions.", category:"Hackathon", date:"2026-09-18T08:00:00.000Z", location:"MIST, Dhaka", capacity:350, banner:"https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200" },
  { _id:"m5", title:"Charity for Flood Relief", description:"A networking seminar and auction event to raise charity funds for flood-affected regions.", category:"Charity", date:"2026-10-02T15:00:00.000Z", location:"Dhanmondi Club, Dhaka", capacity:150, banner:"https://images.unsplash.com/photo-1469571486040-7a308409417d?q=80&w=1205" },
  { _id:"m6", title:"E-Commerce & Digital Retail Expo", description:"Meet industry innovators and discover modern marketing strategies in the digital retail landscape.", category:"Exhibition", date:"2026-10-15T11:00:00.000Z", location:"Jamuna Future Park, Dhaka", capacity:1000, banner:"https://images.unsplash.com/photo-1472851294608-062f824d296e?q=80&w=1200" },
];

const CATEGORY_CHIPS = [
  { label:"🎤 Concert", value:"Concert" },
  { label:"💻 Workshop", value:"Workshop" },
  { label:"🏆 Hackathon", value:"Hackathon" },
  { label:"🌐 Conference", value:"Conference" },
  { label:"🎪 Festival", value:"Festival" },
  { label:"📡 Webinar", value:"Webinar" },
  { label:"🤝 Networking", value:"Networking" },
  { label:"❤️ Charity", value:"Charity" },
];

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axiosInstance.get("/events", { params: { page: 1, limit: 6 } });
        const data = res.data?.events || res.data || [];
        setEvents(data.length > 0 ? data : MOCK_FEATURED);
      } catch {
        setEvents(MOCK_FEATURED);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      // Category chips staggered entry
      gsap.fromTo(
        ".animate-chip",
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.05,
          ease: "power2.out",
          delay: 0.1,
          clearProps: "all"
        }
      );

      // Featured events cards staggered scroll entrance
      gsap.fromTo(
        ".event-card-wrapper",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".featured-events-section",
            start: "top 80%",
            toggleActions: "play none none none",
          },
          clearProps: "all"
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [loading]);

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Hero Banner — search state flows to category chips & "See all" link */}
      <Banner searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* ─── Partners Showcase ─── */}
      <PartnersSection />

      {/* ─── Category Quick-Filter Chips ─── */}
      <section className="border-b border-border/40 bg-card py-6 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORY_CHIPS.map((chip) => (
              <Link
                key={chip.value}
                to={`/events?category=${chip.value}`}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-background border border-border text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/5 transition-all animate-chip animate-chip"
              >
                {chip.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Stats Section ─── */}
      <StatsSection />

      {/* ─── Featured Events ─── */}
      <section id="event-list-section" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 featured-events-section">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-primary font-bold text-xs tracking-widest uppercase mb-2">
              <Sparkles className="h-4 w-4 text-accent animate-pulse" />
              Handpicked for you
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">Featured Events</h2>
            <p className="mt-2 text-sm text-muted-foreground">Highlights from the most popular upcoming events.</p>
          </div>
          <Link
            to={searchQuery ? `/events?search=${encodeURIComponent(searchQuery)}` : "/events"}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary/80 transition-colors shrink-0"
          >
            See All Events <ChevronRight className="h-4.5 w-4.5" />
          </Link>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.slice(0, 6).map((event) => (
              <div key={event._id || event.title} className="event-card-wrapper">
                <EventCard event={event} />
              </div>
            ))}
          </div>
        )}

        {/* CTA at bottom */}
        <div className="mt-12 text-center font-bold">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold text-sm rounded-2xl hover:bg-primary/95 shadow-lg shadow-primary/15 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            Browse All Events <ChevronRight className="h-4.5 w-4.5" />
          </Link>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <HowItWorksSection />

      {/* ─── Platform Features ─── */}
      <FeaturesSection />

      {/* ─── Testimonials Showcase ─── */}
      <TestimonialsSection />

      {/* ─── Action Call Banner (CTA) ─── */}
      <CtaBannerSection />

      {/* ─── Newsletter Signup ─── */}
      <NewsletterSection />
    </div>
  );
};

export default Home;
