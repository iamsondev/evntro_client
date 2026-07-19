import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
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
} from "lucide-react";

// Premium fallback mock data in case backend is empty or unavailable
const MOCK_EVENTS = [
  {
    _id: "mock1",
    title: "Global Tech Summit 2026",
    description: "Experience the next frontier of tech, AI, cloud computing, and advanced agentic architectures. Network with builders worldwide.",
    category: "Conference",
    date: "2026-08-15T09:00:00.000Z",
    location: "BICC, Dhaka",
    capacity: 500,
    banner: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200",
  },
  {
    _id: "mock2",
    title: "Vite + Tailwind V4 Developer BootCamp",
    description: "Hands-on coding workshop exploring modern front-end tech stacks, high-performance UI systems, and responsive design systems.",
    category: "Workshop",
    date: "2026-08-22T10:00:00.000Z",
    location: "Gulshan, Dhaka",
    capacity: 80,
    banner: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1200",
  },
  {
    _id: "mock3",
    title: "Music Fest: Unplugged Symphony",
    description: "A magical night of live acoustic music and spectacular performances under the stars with popular national artists.",
    category: "Concert",
    date: "2026-09-05T18:00:00.000Z",
    location: "Army Stadium, Dhaka",
    capacity: 2000,
    banner: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200",
  },
  {
    _id: "mock4",
    title: "National Hackathon 2026",
    description: "36 hours of continuous building, brainstorming, and pitching. Create real-world solutions for community challenges.",
    category: "Hackathon",
    date: "2026-09-18T08:00:00.000Z",
    location: "MIST, Dhaka",
    capacity: 350,
    banner: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200",
  },
  {
    _id: "mock5",
    title: "Charity for Flood Relief",
    description: "A networking seminar and auction event to raise charity funds for flood-affected regions. All collections go directly to donations.",
    category: "Charity",
    date: "2026-10-02T15:00:00.000Z",
    location: "Dhanmondi Club, Dhaka",
    capacity: 150,
    banner: "https://images.unsplash.com/photo-1469571486040-7a308409417d?q=80&w=1200",
  },
  {
    _id: "mock6",
    title: "E-Commerce and Digital Retail Expo",
    description: "Meet industry innovators, checkout modern products, and discover modern marketing strategies in the digital retail landscape.",
    category: "Exhibition",
    date: "2026-10-15T11:00:00.000Z",
    location: "Jamuna Future Park, Dhaka",
    capacity: 1000,
    banner: "https://images.unsplash.com/photo-1472851294608-062f824d296e?q=80&w=1200",
  },
];

const EventList = ({ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory }) => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);
  const [locationFilter, setLocationFilter] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchTriggered = useRef(false);

  // Fetch categories on load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/categories/available");
        if (response.data?.categories) {
          setCategories(response.data.categories);
        }
      } catch (err) {
        console.warn("Failed to fetch categories from backend, using default list.", err);
        setCategories([
          "Conference",
          "Workshop",
          "Seminar",
          "Networking",
          "Concert",
          "Festival",
          "Sports",
          "Webinar",
          "Hackathon",
          "Exhibition",
          "Charity",
          "Other",
        ]);
      }
    };
    fetchCategories();
  }, []);

  // Fetch events based on filters
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const params = {
          page: currentPage,
          limit: 6,
        };
        if (searchQuery) params.search = searchQuery;
        if (selectedCategory) params.category = selectedCategory;
        if (locationFilter) params.location = locationFilter;

        const response = await axiosInstance.get("/events", { params });
        
        let fetchedEvents = [];
        if (response.data && Array.isArray(response.data.events)) {
          fetchedEvents = response.data.events;
          setTotalPages(response.data.totalPages || 1);
          setTotalEvents(response.data.totalEvents || 0);
        } else if (Array.isArray(response.data)) {
          fetchedEvents = response.data;
          setTotalPages(1);
          setTotalEvents(response.data.length);
        }

        // If backend returned empty array but we didn't search or filter, show mock data
        if (fetchedEvents.length === 0 && !searchQuery && !selectedCategory && !locationFilter) {
          setEvents(MOCK_EVENTS);
          setTotalPages(1);
          setTotalEvents(MOCK_EVENTS.length);
        } else {
          setEvents(fetchedEvents);
        }
      } catch (err) {
        console.warn("API error, failing back to local premium mockup events", err);
        // Apply local filtering to mock data for simulated responsive experience
        let filteredMock = [...MOCK_EVENTS];
        if (searchQuery) {
          const lowerSearch = searchQuery.toLowerCase();
          filteredMock = filteredMock.filter(
            (ev) =>
              ev.title.toLowerCase().includes(lowerSearch) ||
              ev.description.toLowerCase().includes(lowerSearch)
          );
        }
        if (selectedCategory) {
          filteredMock = filteredMock.filter((ev) => ev.category === selectedCategory);
        }
        if (locationFilter) {
          const lowerLoc = locationFilter.toLowerCase();
          filteredMock = filteredMock.filter((ev) => ev.location.toLowerCase().includes(lowerLoc));
        }

        setEvents(filteredMock);
        setTotalPages(1);
        setTotalEvents(filteredMock.length);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [currentPage, searchQuery, selectedCategory, locationFilter]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setLocationFilter("");
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const formatTime = (dateString) => {
    const options = { hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleTimeString("en-US", options);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 transition-colors duration-300">
      
      {/* Title & Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-wider uppercase mb-2">
            <Sparkles className="h-4.5 w-4.5 text-accent animate-pulse" />
            Discover what's happening
          </div>
          <h2 className="text-3xl font-extrabold sm:text-4xl text-foreground">
            Upcoming Events List
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-xl">
            Explore and secure your slots for top classes conferences, coding bootcamps, live concerts, and summits.
          </p>
        </div>

        {/* Filters Summary & Reset */}
        {(searchQuery || selectedCategory || locationFilter) && (
          <button
            onClick={handleClearFilters}
            className="flex items-center gap-1 text-xs font-bold text-accent border border-accent/20 bg-accent/5 hover:bg-accent/10 rounded-xl px-4 py-2.5 transition-colors cursor-pointer"
          >
            <X className="h-3.5 w-3.5" /> Clear All Filters
          </button>
        )}
      </div>

      {/* Grid Filter Options */}
      <div className="bg-card border border-border/80 rounded-3xl p-5 mb-10 shadow-sm flex flex-col lg:flex-row gap-4 items-center justify-between transition-colors duration-300">
        
        {/* Category Badge Slider */}
        <div className="w-full lg:w-auto flex flex-wrap gap-2 items-center">
          <button
            onClick={() => {
              setSelectedCategory("");
              setCurrentPage(1);
            }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              selectedCategory === ""
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/10"
                : "bg-background text-foreground hover:bg-secondary/40 border border-border"
            }`}
          >
            All Categories
          </button>
          
          <div className="flex flex-wrap gap-1.5 matches-categories max-h-[85px] overflow-y-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
                className={`px-4.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/10"
                    : "bg-background/88 text-muted-foreground hover:text-foreground hover:bg-secondary/40 border border-border"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Location Filter Input */}
        <div className="w-full lg:w-[250px] relative">
          <SlidersHorizontal className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={locationFilter}
            onChange={(e) => {
              setLocationFilter(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Filter by city/venue..."
            className="w-full bg-background border border-border rounded-2xl pl-10 pr-4 py-3 text-sm text-foreground placeholder-muted-foreground/72 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-300"
          />
        </div>
      </div>

      {/* Main Events Cards Container */}
      {loading ? (
        // Skeleton Loader
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, idx) => (
            <div
              key={idx}
              className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm animate-pulse"
            >
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
          ))}
        </div>
      ) : events.length === 0 ? (
        // No results empty state (interactive)
        <div className="border border-dashed border-border rounded-3xl p-12 text-center max-w-xl mx-auto my-8">
          <Layers className="mx-auto h-12 w-12 text-muted-foreground/80 mb-4" />
          <h3 className="text-lg font-bold text-foreground mb-1">No Events Found</h3>
          <p className="text-sm text-muted-foreground mb-6">
            We couldn't find any events matching your selected criteria. Try adjusting your filters.
          </p>
          <button
            onClick={handleClearFilters}
            className="px-5 py-2.5 bg-primary text-primary-foreground font-semibold text-sm rounded-xl hover:bg-primary/95 transition-all shadow-md shadow-primary/20 pointer-events-auto cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        // Event Cards Grid
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <article
                key={event._id}
                className="group relative rounded-3xl border border-border/80 bg-card overflow-hidden shadow-md hover:shadow-xl hover:border-primary/25 transition-all duration-300 flex flex-col"
              >
                {/* Banner Image */}
                <Link to={`/events/${event._id}`} className="block relative aspect-video w-full overflow-hidden bg-muted group">
                  <img
                    src={event.banner || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1200"}
                    alt={event.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1200";
                    }}
                  />
                  {/* Category Badge overlay */}
                  <span className="absolute top-4 left-4 inline-flex items-center rounded-xl bg-background/88 backdrop-blur-md px-3.5 py-1 text-xs font-bold text-primary border border-border shadow-sm">
                    {event.category}
                  </span>
                </Link>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <Link to={`/events/${event._id}`}>
                      <h3 className="text-xl font-bold text-foreground line-clamp-1 hover:text-primary transition-colors mb-2">
                        {event.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-5">
                      {event.description}
                    </p>
                  </div>

                  {/* Metadata Icons Grid */}
                  <div className="space-y-3.5 border-t border-border/70 pt-4.5">
                    {/* Location */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-4 w-4 shrink-0 text-accent font-bold" />
                      <span className="truncate">{event.location}</span>
                    </div>

                    {/* Date Details */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 shrink-0 text-accent" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <span className="font-semibold text-accent/90">{formatTime(event.date)}</span>
                    </div>

                    {/* Capacity */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/40">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 shrink-0 text-accent" />
                        <span>Capacity</span>
                      </div>
                      <span className="font-bold text-foreground">{event.capacity} seats</span>
                    </div>

                    {/* Price/Admission */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/40">
                      <span className="font-semibold">Admission</span>
                      <span className="font-bold text-foreground bg-primary/5 px-2 py-0.5 rounded border border-primary/10 text-[10px]">
                        {(event.isFree ?? true) ? "Free" : `৳ ${event.price?.toLocaleString() || 0}`}
                      </span>
                    </div>
                  </div>

                  {/* Buy/View Ticket Link */}
                  <div className="mt-6">
                    <Link to={`/events/${event._id}`} className="block">
                      <button className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary hover:text-primary-foreground text-primary font-bold text-sm shadow-sm transition-all duration-300 cursor-pointer">
                        View Event Details
                      </button>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-16 flex items-center justify-center gap-3">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="flex items-center justify-center p-2.5 rounded-xl border border-border bg-card text-foreground hover:bg-secondary/40 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              
              <span className="text-sm font-semibold text-muted-foreground">
                Page <strong className="text-foreground">{currentPage}</strong> of <strong className="text-foreground">{totalPages}</strong>
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="flex items-center justify-center p-2.5 rounded-xl border border-border bg-card text-foreground hover:bg-secondary/40 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default EventList;
