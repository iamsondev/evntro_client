import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import axiosInstance from "@/api/axiosInstance";
import {
  Calendar,
  Users,
  Plus,
  Loader2,
  Trash2,
  TrendingUp,
  Inbox,
  AlertCircle,
  Eye
} from "lucide-react";

const formatDate = (d) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

const OrganizerDashboardPanel = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axiosInstance.get("/events/my");
        setEvents(Array.isArray(res.data) ? res.data : res.data?.events || []);
      } catch {
        setError("Could not load your events. Ensure the backend is currently running.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this event? This action is permanent.")) return;
    setDeletingId(id);
    try {
      await axiosInstance.delete(`/events/${id}`);
      setEvents((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      alert(err.response?.data?.msg || "Delete operation failed.");
    } finally {
      setDeletingId(null);
    }
  };

  // Calculations for stats
  const totalEvents = events.length;
  // Let's sum registrations count if available, or simulate a realistic calculation from mock capacities
  const totalRegistrations = events.reduce((sum, item) => sum + (item.registeredCount || 0), 0);
  const averageCapacity = events.length > 0 
    ? Math.round((events.reduce((sum, item) => sum + (item.capacity ? (item.registeredCount || 0) / item.capacity : 0), 0) / events.length) * 100)
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Overview Block */}
      <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 relative overflow-hidden backdrop-blur-md">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(47,62,168,0.04),transparent_50%)]" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
              Organizer Panel 🏢
            </h1>
            <p className="text-muted-foreground mt-1.5 max-w-xl">
              Create and manage your events. Monitor registrations, check attendance levels, and build experiences.
            </p>
          </div>
          <Link
            to="/events/create"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground font-bold text-sm rounded-2xl hover:bg-primary/95 shadow-lg shadow-primary/10 transition-all hover:-translate-y-0.5 active:translate-y-0 text-center shrink-0 cursor-pointer"
          >
            <Plus className="h-4.5 w-4.5" /> Create New Event
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border/80 rounded-3xl p-6 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-sm font-semibold text-muted-foreground">Created Events</span>
            <h3 className="text-4xl font-black text-foreground mt-1.5">{totalEvents}</h3>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Calendar className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-card border border-border/80 rounded-3xl p-6 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-sm font-semibold text-muted-foreground">Total Bookings</span>
            <h3 className="text-4xl font-black text-foreground mt-1.5">{totalRegistrations}</h3>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
            <Users className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-card border border-border/80 rounded-3xl p-6 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-sm font-semibold text-muted-foreground">Average Seat Fill rate</span>
            <h3 className="text-4xl font-black text-foreground mt-1.5">{averageCapacity}%</h3>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Organizer Events Table List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-xl text-foreground">
            My Managed Events
          </h3>
        </div>

        {error ? (
          <div className="rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive p-6 text-sm font-semibold flex items-center gap-2">
            <AlertCircle className="h-5 w-5 shrink-0" /> {error}
          </div>
        ) : events.length === 0 ? (
          <div className="border border-dashed border-border rounded-3xl p-16 text-center flex flex-col items-center gap-4">
            <Inbox className="h-12 w-12 text-muted-foreground/60" />
            <h4 className="text-lg font-bold text-foreground">No Active Listings</h4>
            <p className="text-sm text-muted-foreground">Get started by creating your very first event page on Evntro.</p>
            <Link to="/events/create" className="mt-2 px-6 py-2.5 bg-primary text-primary-foreground font-semibold text-sm rounded-xl hover:bg-primary/95 transition-all">
              Create Event
            </Link>
          </div>
        ) : (
          <div className="bg-card border border-border/80 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/20 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    <th className="py-4 px-6">Event Name</th>
                    <th className="py-4 px-6">Date & Category</th>
                    <th className="py-4 px-6">Seat Bookings</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {events.map((ev) => {
                    const filledRate = ev.capacity > 0 ? Math.round(((ev.registeredCount || 0) / ev.capacity) * 100) : 0;
                    return (
                      <tr key={ev._id} className="hover:bg-muted/10 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={ev.banner || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=100"}
                              className="h-10 w-16 object-cover rounded-lg bg-muted shrink-0"
                              alt={ev.title}
                              onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=100"; }}
                            />
                            <div className="min-w-0">
                              <span className="font-bold text-foreground line-clamp-1 text-sm">{ev.title}</span>
                              <span className="text-[10px] text-muted-foreground mt-0.5 block">{ev.location}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-semibold text-foreground text-xs block">{formatDate(ev.date)}</span>
                          <span className="text-[10px] text-muted-foreground capitalize mt-0.5 block">{ev.category}</span>
                        </td>
                        <td className="py-4 px-6 min-w-[200px]">
                          <div className="flex items-center justify-between text-xs font-semibold mb-1">
                            <span className="text-foreground">
                              {ev.registeredCount || 0} / {ev.capacity || 0} seats
                            </span>
                            <span className="text-muted-foreground">{filledRate}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                              style={{ width: `${Math.min(filledRate, 100)}%` }}
                            />
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => navigate(`/events/${ev._id}`)}
                              className="p-2 border border-border bg-background hover:bg-secondary/40 text-muted-foreground hover:text-primary rounded-xl transition-colors cursor-pointer"
                              title="View Event Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => handleDelete(ev._id, e)}
                              disabled={deletingId === ev._id}
                              className="p-2 border border-border bg-background hover:bg-destructive hover:text-white hover:border-destructive text-muted-foreground transition-all rounded-xl cursor-pointer disabled:opacity-50"
                              title="Delete Event"
                            >
                              {deletingId === ev._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerDashboardPanel;
