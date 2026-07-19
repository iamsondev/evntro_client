import React, { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router";
import axiosInstance from "@/api/axiosInstance";
import {
  MapPin,
  Calendar,
  Users,
  Search,
  SlidersHorizontal,
  X,
  ArrowLeft,
  ArrowRight,
  Layers,
  Sparkles,
  ChevronRight,
} from "lucide-react";

const CATEGORIES = [
  "Conference","Workshop","Seminar","Networking","Concert",
  "Festival","Sports","Webinar","Hackathon","Exhibition","Charity","Other",
];

const MOCK_EVENTS = [
  { _id:"m1", title:"Global Tech Summit 2026", description:"Experience the next frontier of tech, AI, cloud computing, and advanced agentic architectures. Network with builders worldwide.", category:"Conference", date:"2026-08-15T09:00:00.000Z", location:"BICC, Dhaka", capacity:500, banner:"https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200" },
  { _id:"m2", title:"Vite + Tailwind V4 Developer BootCamp", description:"Hands-on coding workshop exploring modern front-end tech stacks, high-performance UI systems, and responsive design systems.", category:"Workshop", date:"2026-08-22T10:00:00.000Z", location:"Gulshan, Dhaka", capacity:80, banner:"https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1200" },
  { _id:"m3", title:"Music Fest: Unplugged Symphony", description:"A magical night of live acoustic music and spectacular performances under the stars with popular national artists.", category:"Concert", date:"2026-09-05T18:00:00.000Z", location:"Army Stadium, Dhaka", capacity:2000, banner:"https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200" },
  { _id:"m4", title:"National Hackathon 2026", description:"36 hours of continuous building, brainstorming, and pitching. Create real-world solutions for community challenges.", category:"Hackathon", date:"2026-09-18T08:00:00.000Z", location:"MIST, Dhaka", capacity:350, banner:"https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200" },
  { _id:"m5", title:"Charity for Flood Relief", description:"A networking seminar and auction event to raise charity funds for flood-affected regions.", category:"Charity", date:"2026-10-02T15:00:00.000Z", location:"Dhanmondi Club, Dhaka", capacity:150, banner:"https://images.unsplash.com/photo-1469571486040-7a308409417d?q=80&w=1200" },
  { _id:"m6", title:"E-Commerce & Digital Retail Expo", description:"Meet industry innovators, checkout modern products, and discover marketing strategies in the digital retail landscape.", category:"Exhibition", date:"2026-10-15T11:00:00.000Z", location:"Jamuna Future Park, Dhaka", capacity:1000, banner:"https://images.unsplash.com/photo-1472851294608-062f824d296e?q=80&w=1200" },
  { _id:"m7", title:"AI Webinar: Future of Automation", description:"Join world-class speakers for an insightful 3-hour webinar exploring AI automation and its impact on global industries.", category:"Webinar", date:"2026-10-28T09:00:00.000Z", location:"Online / Virtual", capacity:5000, banner:"https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200" },
  { _id:"m8", title:"Sports Day Extravaganza", description:"A thrilling day of competitive sporting events, team challenges, and community wellness activities for all age groups.", category:"Sports", date:"2026-11-05T07:00:00.000Z", location:"Bashundhara Sports Complex, Dhaka", capacity:800, banner:"https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200" },
];

const formatDate = (d) => new Date(d).toLocaleDateString("en-US", { year:"numeric", month:"short", day:"numeric" });
const formatTime = (d) => new Date(d).toLocaleTimeString("en-US", { hour:"2-digit", minute:"2-digit" });

// ─── Reusable EventCard ───────────────────────────────────────────────────────
export const EventCard = ({ event }) => (
  <article className="group relative rounded-3xl border border-border/80 bg-card overflow-hidden shadow-md hover:shadow-xl hover:border-primary/25 transition-all duration-300 flex flex-col">
    <div className="relative aspect-video w-full overflow-hidden bg-muted">
      <img
        src={event.banner || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1200"}
        alt={event.title}
        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1200"; }}
      />
      <span className="absolute top-4 left-4 inline-flex items-center rounded-xl bg-background/88 backdrop-blur-md px-3.5 py-1 text-xs font-bold text-primary border border-border shadow-sm">
        {event.category}
      </span>
    </div>
    <div className="p-6 flex-1 flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors mb-2">{event.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-5">{event.description}</p>
      </div>
      <div className="space-y-3 border-t border-border/70 pt-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0 text-accent" />
          <span className="truncate">{event.location}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 shrink-0 text-accent" />
            <span>{formatDate(event.date)}</span>
          </div>
          <span className="font-semibold text-accent/90">{formatTime(event.date)}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/40">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 shrink-0 text-accent" />
            <span>Capacity</span>
          </div>
          <span className="font-bold text-foreground">{event.capacity.toLocaleString()} seats</span>
        </div>
      </div>
      <Link
        to={`/events/${event._id}`}
        className="mt-6 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary hover:text-primary-foreground text-primary font-bold text-sm shadow-sm transition-all duration-300"
      >
        View Event Details
      </Link>
    </div>
  </article>
);

// ─── Skeleton Card ────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm animate-pulse">
    <div className="bg-muted aspect-video w-full" />
    <div className="p-6 space-y-4">
      <div className="h-4 bg-muted rounded-full w-1/3" />
      <div className="h-6 bg-muted rounded-full w-3/4" />
      <div className="h-4 bg-muted rounded-full w-full" />
      <div className="h-4 bg-muted rounded-full w-5/6" />
      <div className="pt-4 grid grid-cols-2 gap-4">
        <div className="h-4 bg-muted rounded-full w-2/3" />
        <div className="h-4 bg-muted rounded-full w-1/2" />
      </div>
    </div>
  </div>
);

// ─── Pagination ───────────────────────────────────────────────────────────────
const Pagination = ({ currentPage, totalPages, onChange }) => {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mt-14 flex items-center justify-center gap-2">
      <button
        onClick={() => onChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center p-2.5 rounded-xl border border-border bg-card text-foreground hover:bg-secondary/40 disabled:opacity-35 disabled:pointer-events-none transition-colors cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onChange(page)}
          className={`h-9 w-9 text-sm font-bold rounded-xl border transition-all cursor-pointer ${
            page === currentPage
              ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
              : "bg-card border-border text-foreground hover:bg-secondary/40"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center p-2.5 rounded-xl border border-border bg-card text-foreground hover:bg-secondary/40 disabled:opacity-35 disabled:pointer-events-none transition-colors cursor-pointer"
      >
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
};

// ─── Main Events Page ─────────────────────────────────────────────────────────
const EventsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const location = searchParams.get("location") || "";

  const [searchInput, setSearchInput] = useState(search);
  const [locationInput, setLocationInput] = useState(location);

  const applyFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    next.set("page", "1");
    setSearchParams(next);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const next = new URLSearchParams(searchParams);
    next.set("page", page);
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearAll = () => {
    setSearchParams({});
    setSearchInput("");
    setLocationInput("");
    setCurrentPage(1);
  };

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: currentPage, limit: 9 };
      if (search) params.search = search;
      if (category) params.category = category;
      if (location) params.location = location;

      const res = await axiosInstance.get("/events", { params });
      const data = res.data;

      if (Array.isArray(data?.events)) {
        if (data.events.length === 0 && !search && !category && !location) {
          setEvents(MOCK_EVENTS);
          setTotalPages(1);
          setTotalEvents(MOCK_EVENTS.length);
        } else {
          setEvents(data.events);
          setTotalPages(data.totalPages || 1);
          setTotalEvents(data.totalEvents || data.events.length);
        }
      }
    } catch {
      let filtered = [...MOCK_EVENTS];
      if (search) filtered = filtered.filter(e => e.title.toLowerCase().includes(search.toLowerCase()) || e.description.toLowerCase().includes(search.toLowerCase()));
      if (category) filtered = filtered.filter(e => e.category === category);
      if (location) filtered = filtered.filter(e => e.location.toLowerCase().includes(location.toLowerCase()));
      setEvents(filtered);
      setTotalPages(1);
      setTotalEvents(filtered.length);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, category, location]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const hasFilters = search || category || location;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Page Title Banner */}
      <div className="border-b border-border/50 bg-background py-12 px-4 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2 text-primary font-bold text-xs tracking-widest uppercase mb-3">
            <Sparkles className="h-4 w-4 text-accent animate-pulse" />
            All Events
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground">Browse Events</h1>
          <p className="mt-3 text-muted-foreground max-w-xl">
            {totalEvents > 0 ? `${totalEvents} event${totalEvents > 1 ? "s" : ""} found` : "Find and join incredible events happening near you."}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* ─── Filter Bar ─── */}
        <div className="bg-card border border-border/80 rounded-3xl p-5 mb-10 shadow-sm flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
          {/* Search input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilter("search", searchInput)}
              placeholder="Search events by name or description..."
              className="w-full bg-background border border-border rounded-2xl pl-10 pr-4 py-3 text-sm text-foreground placeholder-muted-foreground/70 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
            />
          </div>
          {/* Location input */}
          <div className="w-full lg:w-[220px] relative">
            <SlidersHorizontal className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilter("location", locationInput)}
              placeholder="City or venue..."
              className="w-full bg-background border border-border rounded-2xl pl-10 pr-4 py-3 text-sm text-foreground placeholder-muted-foreground/70 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
            />
          </div>
          {/* Search button */}
          <button
            onClick={() => { applyFilter("search", searchInput); applyFilter("location", locationInput); }}
            className="w-full lg:w-auto px-6 py-3 bg-primary text-primary-foreground font-bold text-sm rounded-2xl hover:bg-primary/90 transition-all shadow-md shadow-primary/10 cursor-pointer"
          >
            Search
          </button>
          {hasFilters && (
            <button
              onClick={clearAll}
              className="w-full lg:w-auto flex items-center justify-center gap-1.5 px-4 py-3 text-xs font-bold text-accent border border-accent/20 bg-accent/5 hover:bg-accent/10 rounded-2xl transition-colors cursor-pointer"
            >
              <X className="h-3.5 w-3.5" /> Clear All Filters
            </button>
          )}
        </div>

        {/* ─── Category Chips ─── */}
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => applyFilter("category", "")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${!category ? "bg-primary text-primary-foreground shadow-md" : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-secondary/40"}`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => applyFilter("category", cat)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${category === cat ? "bg-primary text-primary-foreground shadow-md" : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-secondary/40"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ─── Grid ─── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(9)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : events.length === 0 ? (
          <div className="border border-dashed border-border rounded-3xl p-16 text-center max-w-lg mx-auto my-12">
            <Layers className="mx-auto h-12 w-12 text-muted-foreground/70 mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">No Events Found</h3>
            <p className="text-sm text-muted-foreground mb-6">Try adjusting your search or filters.</p>
            <button onClick={clearAll} className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold text-sm rounded-xl hover:bg-primary/95 transition-all cursor-pointer">
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => <EventCard key={event._id} event={event} />)}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onChange={handlePageChange} />
          </>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
