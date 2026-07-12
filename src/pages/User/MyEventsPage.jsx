import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import axiosInstance from "@/api/axiosInstance";
import {
  MapPin, Calendar, Users, Pencil, Trash2, Plus,
  Loader2, Inbox, AlertCircle,
} from "lucide-react";

const formatDate = (d) => new Date(d).toLocaleDateString("en-US", { year:"numeric", month:"short", day:"numeric" });

const statusClass = {
  published: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  draft:     "bg-muted text-muted-foreground border-border",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  completed: "bg-primary/10 text-primary border-primary/20",
};

const MyEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchMyEvents = async () => {
    try {
      // Endpoint: GET /events?myEvents=true  OR  /events/my — adjust per backend
      const res = await axiosInstance.get("/events/my");
      setEvents(Array.isArray(res.data) ? res.data : res.data?.events || []);
    } catch {
      setError("Could not load your events. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMyEvents(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    setDeletingId(id);
    try {
      await axiosInstance.delete(`/events/${id}`);
      setEvents((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      alert(err.response?.data?.msg || "Delete failed.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-8 transition-colors duration-300">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-foreground">My Events</h1>
            <p className="text-muted-foreground mt-1">Manage events you have created.</p>
          </div>
          <Link
            to="/events/create"
            className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground font-bold text-sm rounded-2xl hover:bg-primary/95 shadow-lg shadow-primary/15 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus className="h-4 w-4" /> Create New Event
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : error ? (
          <div className="rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive p-6 text-sm font-semibold flex items-center gap-2">
            <AlertCircle className="h-5 w-5 shrink-0" />{error}
          </div>
        ) : events.length === 0 ? (
          <div className="border border-dashed border-border rounded-3xl p-16 text-center flex flex-col items-center gap-4">
            <Inbox className="h-12 w-12 text-muted-foreground/60" />
            <h3 className="text-lg font-bold text-foreground">No Events Yet</h3>
            <p className="text-sm text-muted-foreground">Start by creating your first event.</p>
            <Link to="/events/create" className="mt-2 px-6 py-2.5 bg-primary text-primary-foreground font-semibold text-sm rounded-xl hover:bg-primary/95 transition-all">
              Create Event
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((ev) => (
              <div key={ev._id} className="bg-card border border-border/80 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 shadow-sm hover:shadow-md transition-shadow group">
                {/* Thumbnail */}
                <img
                  src={ev.banner || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=200"}
                  className="h-20 w-32 object-cover rounded-xl shrink-0 bg-muted"
                  alt={ev.title}
                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=200"; }}
                />

                {/* Main info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground line-clamp-1 mb-1">{ev.title}</h3>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    {ev.date && <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-accent" />{formatDate(ev.date)}</span>}
                    {ev.location && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-accent" />{ev.location}</span>}
                    {ev.capacity && <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-accent" />{ev.capacity.toLocaleString()} seats</span>}
                  </div>
                </div>

                {/* Status + Actions */}
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border capitalize ${statusClass[ev.status] || statusClass.draft}`}>
                    {ev.status || "draft"}
                  </span>
                  <button
                    onClick={() => navigate(`/events/${ev._id}`)}
                    className="p-2.5 rounded-xl border border-border bg-background hover:bg-secondary/40 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    title="View"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(ev._id)}
                    disabled={deletingId === ev._id}
                    className="p-2.5 rounded-xl border border-border bg-background hover:bg-destructive hover:text-white hover:border-destructive text-muted-foreground transition-all cursor-pointer disabled:opacity-50"
                    title="Delete"
                  >
                    {deletingId === ev._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEventsPage;
