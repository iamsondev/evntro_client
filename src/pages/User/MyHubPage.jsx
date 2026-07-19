import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import axiosInstance from "@/api/axiosInstance";
import { useAuth } from "@/context/AuthContext";
import {
  CalendarDays,
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
  Heart,
  Trash2,
  Pencil,
  Plus,
  Loader2,
  Inbox,
  AlertCircle,
  Calendar,
  Users,
  Compass
} from "lucide-react";

const statusIcon = {
  registered: <CheckCircle className="h-4 w-4 text-green-500" />,
  confirmed: <CheckCircle className="h-4 w-4 text-green-500" />,
  cancelled: <XCircle className="h-4 w-4 text-destructive" />,
  pending: <Clock className="h-4 w-4 text-accent" />
};

const statusClass = {
  registered: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  confirmed: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  pending: "bg-accent/10 text-accent border-accent/20"
};

const eventStatusClass = {
  published: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  draft: "bg-muted text-muted-foreground border-border",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  completed: "bg-primary/10 text-primary border-primary/20",
};

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });

const MyHubPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Tab state synced with URL search params (defaults to 'registrations')
  const activeTab = searchParams.get("tab") || "registrations";

  const [registrations, setRegistrations] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [createdEvents, setCreatedEvents] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [removingWishlistId, setRemovingWishlistId] = useState(null);

  const isOrganizer = user?.role === "organizer" || user?.role === "admin";

  const fetchHubData = async () => {
    setLoading(true);
    setError(null);
    try {
      const requests = [
        axiosInstance.get("/events/my-registrations").catch(() => ({ data: [] })),
        axiosInstance.get("/wishlist").catch(() => ({ data: [] }))
      ];

      // If user is organizer or admin, also fetch their created events
      if (isOrganizer) {
        requests.push(axiosInstance.get("/events/my").catch(() => ({ data: [] })));
      }

      const results = await Promise.all(requests);

      const regRes = results[0];
      const wishRes = results[1];

      setRegistrations(Array.isArray(regRes.data) ? regRes.data : regRes.data?.registrations || []);
      setWishlist(Array.isArray(wishRes.data) ? wishRes.data : wishRes.data?.wishlist || []);

      if (isOrganizer && results[2]) {
        const createdRes = results[2];
        setCreatedEvents(Array.isArray(createdRes.data) ? createdRes.data : createdRes.data?.events || []);
      }
    } catch (err) {
      setError("Failed to fetch dashboard data. Ensure the backend is reachable.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchHubData();
    }
  }, [user]);

  const handleTabChange = (tabName) => {
    setSearchParams({ tab: tabName });
  };

  // Delete event handler (organizer tab)
  const handleDeleteEvent = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this event? This action will permanently remove it.")) return;
    setDeletingId(id);
    try {
      await axiosInstance.delete(`/events/${id}`);
      setCreatedEvents((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      alert(err.response?.data?.msg || "Delete operation failed.");
    } finally {
      setDeletingId(null);
    }
  };

  // Remove event from wishlist handler
  const handleRemoveWishlist = async (eventId, itemId, e) => {
    e.stopPropagation();
    e.preventDefault();
    setRemovingWishlistId(itemId);
    try {
      await axiosInstance.delete(`/wishlist/${eventId}`);
      setWishlist((prev) => prev.filter((i) => i._id !== itemId));
    } catch {
      // fail silently
    } finally {
      setRemovingWishlistId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-card border border-border/80 rounded-3xl p-8 text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <h2 className="text-xl font-bold text-foreground">Loading Error</h2>
          <p className="text-sm text-muted-foreground">{error}</p>
          <button 
            onClick={fetchHubData} 
            className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-2xl hover:bg-primary/95 transition-all text-sm cursor-pointer"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-8 transition-colors duration-300">
      <div className="mx-auto max-w-5xl space-y-8">
        
        {/* Unified Hub Header greeting card */}
        <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 relative overflow-hidden backdrop-blur-md">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(47,62,168,0.03),transparent_50%)]" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                My Workspace ⚡
              </h1>
              <p className="text-muted-foreground mt-1.5 max-w-xl">
                Hello, {user?.name || "Member"}. Review reservation bookings, monitor wishlists, and manage organizer listings.
              </p>
            </div>
            
            {/* Create Event quick actions helper */}
            {isOrganizer && (
              <Link
                to="/events/create"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground font-extrabold text-sm rounded-2xl hover:bg-primary/95 shadow-lg shadow-primary/10 transition-all hover:-translate-y-0.5"
              >
                <Plus className="h-4.5 w-4.5" /> Create New Event
              </Link>
            )}
          </div>
        </div>

        {/* Centralized Tabs Switcher Bar */}
        <div className="flex border-b border-border/60 gap-8 overflow-x-auto pb-px">
          <button
            onClick={() => handleTabChange("registrations")}
            className={`flex items-center gap-2 pb-4 text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "registrations"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <CalendarDays className="h-4.5 w-4.5" />
            My Registrations ({registrations.length})
          </button>
          
          <button
            onClick={() => handleTabChange("wishlist")}
            className={`flex items-center gap-2 pb-4 text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "wishlist"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Heart className="h-4.5 w-4.5" />
            Saved Wishlist ({wishlist.length})
          </button>

          {isOrganizer && (
            <button
              onClick={() => handleTabChange("events")}
              className={`flex items-center gap-2 pb-4 text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "events"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Calendar className="h-4.5 w-4.5" />
              Created Events ({createdEvents.length})
            </button>
          )}
        </div>

        {/* Tab Contents Panels */}
        <div className="pt-2">
          
          {/* TAB 1: REGISTRATIONS */}
          {activeTab === "registrations" && (
            <div className="space-y-4">
              {registrations.length === 0 ? (
                <div className="border border-dashed border-border rounded-3xl p-16 text-center flex flex-col items-center gap-4 bg-card/20">
                  <Inbox className="h-12 w-12 text-muted-foreground/60" />
                  <h3 className="text-lg font-bold text-foreground">No Registrations Found</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    You haven't reserved seats for any events yet. Look through current events to get going!
                  </p>
                  <Link to="/events" className="mt-2 px-6 py-2.5 bg-primary text-primary-foreground font-semibold text-sm rounded-xl hover:bg-primary/95 transition-all">
                    Browse Events
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {registrations.map((reg) => {
                    const ev = reg.event || reg;
                    const status = reg.status || "pending";
                    return (
                      <div key={reg._id} className="bg-card border border-border/80 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex gap-4 items-start">
                          <img
                            src={ev.banner || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=200"}
                            className="h-16 w-24 object-cover rounded-xl shrink-0 bg-muted border border-border/20"
                            alt={ev.title}
                            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=200"; }}
                          />
                          <div>
                            <h3 className="font-bold text-foreground line-clamp-1">{ev.title || "Event Booking"}</h3>
                            <div className="flex flex-wrap gap-4 mt-2 text-xs text-muted-foreground">
                              {ev.date && <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5 text-accent" />{formatDate(ev.date)}</span>}
                              {ev.location && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-accent" />{ev.location}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                          <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusClass[status] || statusClass.pending}`}>
                            {statusIcon[status] || statusIcon.pending}
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                          <Link to={`/events/${ev._id}`} className="text-xs font-bold text-primary hover:underline px-2 py-1">
                            View Event
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: WISHLIST */}
          {activeTab === "wishlist" && (
            <div>
              {wishlist.length === 0 ? (
                <div className="border border-dashed border-border rounded-3xl p-16 text-center flex flex-col items-center gap-4 bg-card/20">
                  <Heart className="h-12 w-12 text-muted-foreground/50" />
                  <h3 className="text-lg font-bold text-foreground">Wishlist is Empty</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Bookmark event pages and return here to browse lists later.
                  </p>
                  <Link to="/events" className="mt-2 px-6 py-2.5 bg-primary text-primary-foreground font-semibold text-sm rounded-xl hover:bg-primary/95 transition-all">
                    Browse Events
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {wishlist.map((item) => {
                    const ev = item.event || item;
                    return (
                      <div key={item._id} className="bg-card border border-border/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between">
                        <div className="relative h-40 bg-muted overflow-hidden">
                          <img
                            src={ev.banner || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600"}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            alt={ev.title}
                            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600"; }}
                          />
                          <button
                            onClick={(e) => handleRemoveWishlist(ev._id, item._id, e)}
                            disabled={removingWishlistId === item._id}
                            className="absolute top-3 right-3 p-2 bg-background/80 backdrop-blur-sm rounded-xl border border-border hover:bg-destructive hover:text-white hover:border-destructive transition-all cursor-pointer disabled:opacity-50"
                            title="Remove from wishlist"
                          >
                            {removingWishlistId === item._id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="font-bold text-foreground line-clamp-1 mb-3 group-hover:text-primary transition-colors">{ev.title}</h3>
                            <div className="space-y-1.5 text-xs text-muted-foreground">
                              {ev.date && <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-accent" />{formatDate(ev.date)}</div>}
                              {ev.location && <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-accent" />{ev.location}</div>}
                            </div>
                          </div>
                          <div className="mt-5 pt-3 border-t border-border/40 flex items-center justify-between">
                            <Link
                              to={`/events/${ev._id}`}
                              className="text-xs font-bold text-primary hover:underline"
                            >
                              Explore Event →
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CREATED EVENTS */}
          {activeTab === "events" && isOrganizer && (
            <div className="space-y-4">
              {createdEvents.length === 0 ? (
                <div className="border border-dashed border-border rounded-3xl p-16 text-center flex flex-col items-center gap-4 bg-card/20">
                  <Inbox className="h-12 w-12 text-muted-foreground/60" />
                  <h3 className="text-lg font-bold text-foreground">No Listings Yet</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    You have not hosted or created any event pages on Evntro. Set one up to get started!
                  </p>
                  <Link to="/events/create" className="mt-2 px-6 py-2.5 bg-primary text-primary-foreground font-semibold text-sm rounded-xl hover:bg-primary/95 transition-all">
                    Create Event
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {createdEvents.map((ev) => (
                    <div key={ev._id} className="bg-card border border-border/80 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 shadow-sm hover:shadow-md transition-shadow group">
                      <img
                        src={ev.banner || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=200"}
                        className="h-20 w-32 object-cover rounded-xl shrink-0 bg-muted border border-border/20"
                        alt={ev.title}
                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=200"; }}
                      />

                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-foreground line-clamp-1 mb-1">{ev.title}</h3>
                        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                          {ev.date && <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-accent" />{formatDate(ev.date)}</span>}
                          {ev.location && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-accent" />{ev.location}</span>}
                          {ev.capacity && <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-accent" />{ev.capacity.toLocaleString()} seats</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border capitalize ${eventStatusClass[ev.status] || eventStatusClass.draft}`}>
                          {ev.status || "draft"}
                        </span>
                        <button
                          onClick={() => navigate(`/events/${ev._id}`)}
                          className="p-2.5 rounded-xl border border-border bg-background hover:bg-secondary/40 text-muted-foreground hover:text-primary transition-all cursor-pointer"
                          title="Edit Event"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteEvent(ev._id, e)}
                          disabled={deletingId === ev._id}
                          className="p-2.5 rounded-xl border border-border bg-background hover:bg-destructive hover:text-white hover:border-destructive text-muted-foreground transition-all cursor-pointer disabled:opacity-50"
                          title="Delete Event"
                        >
                          {deletingId === ev._id ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default MyHubPage;
