import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import axiosInstance from "@/api/axiosInstance";
import { useAuth } from "@/context/AuthContext";
import {
  MapPin, Calendar, Users, Tag, ArrowLeft,
  Heart, Share2, CheckCircle, AlertCircle, Loader2,
} from "lucide-react";

const formatDate = (d) => new Date(d).toLocaleDateString("en-US", { weekday:"long", year:"numeric", month:"long", day:"numeric" });
const formatTime = (d) => new Date(d).toLocaleTimeString("en-US", { hour:"2-digit", minute:"2-digit" });

const EventDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success'|'error', text: string }

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/events/${id}`);
        setEvent(res.data);
      } catch {
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    if (!user) { setMessage({ type:"error", text:"Please log in to register for this event." }); return; }
    setRegisterLoading(true);
    setMessage(null);
    try {
      await axiosInstance.post(`/events/${id}/register`);
      setMessage({ type:"success", text:"You are successfully registered for this event!" });
    } catch (err) {
      setMessage({ type:"error", text: err.response?.data?.msg || "Registration failed. Please try again." });
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleWishlist = async () => {
    if (!user) { setMessage({ type:"error", text:"Please log in to add to wishlist." }); return; }
    setWishlistLoading(true);
    setMessage(null);
    try {
      await axiosInstance.post("/wishlist", { eventId: id });
      setMessage({ type:"success", text:"Event added to your wishlist!" });
    } catch (err) {
      setMessage({ type:"error", text: err.response?.data?.msg || "Failed to add to wishlist." });
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: event?.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setMessage({ type:"success", text:"Link copied to clipboard!" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-5 px-4 text-center">
        <AlertCircle className="h-16 w-16 text-destructive/70" />
        <h1 className="text-2xl font-bold text-foreground">Event Not Found</h1>
        <p className="text-muted-foreground">This event may have been removed or the link is invalid.</p>
        <Link to="/events" className="flex items-center gap-2 text-primary font-bold hover:text-primary/80 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Events
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Hero Banner */}
      <div className="relative h-72 sm:h-96 lg:h-[480px] w-full overflow-hidden bg-muted">
        <img
          src={event.banner || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2000"}
          alt={event.title}
          className="h-full w-full object-cover"
          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2000"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-6 left-6 sm:left-10">
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-xs font-bold bg-background/70 backdrop-blur-md border border-border text-foreground hover:bg-background/90 rounded-xl px-4 py-2 transition-all"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> All Events
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* ── Left / Main Info ── */}
          <div className="lg:col-span-2 space-y-8">
            {/* Category badge + Title */}
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary ring-1 ring-primary/20 mb-4">
                <Tag className="h-3.5 w-3.5" /> {event.category}
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground leading-tight">{event.title}</h1>
            </div>

            {/* Meta pills */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card border border-border/70 rounded-2xl px-4 py-2.5">
                <Calendar className="h-4 w-4 text-accent" />
                <span>{formatDate(event.date)} · {formatTime(event.date)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card border border-border/70 rounded-2xl px-4 py-2.5">
                <MapPin className="h-4 w-4 text-accent" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card border border-border/70 rounded-2xl px-4 py-2.5">
                <Users className="h-4 w-4 text-accent" />
                <span>{event.capacity.toLocaleString()} capacity</span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-card border border-border/80 rounded-3xl p-7">
              <h2 className="text-lg font-bold text-foreground mb-4">About this Event</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{event.description}</p>
            </div>
          </div>

          {/* ── Right / Action Sidebar ── */}
          <div className="space-y-5">
            <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-lg sticky top-24 space-y-4">
              <h2 className="text-lg font-bold text-foreground">Join This Event</h2>

              {/* Status message */}
              {message && (
                <div className={`flex items-start gap-2 p-4 rounded-2xl text-sm font-semibold ${
                  message.type === "success"
                    ? "bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400"
                    : "bg-destructive/10 border border-destructive/20 text-destructive"
                }`}>
                  {message.type === "success"
                    ? <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    : <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />}
                  {message.text}
                </div>
              )}

              {/* Status badge */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <span className={`font-bold capitalize px-3 py-1 rounded-full text-xs ${
                  event.status === "published" ? "bg-green-500/10 text-green-600 dark:text-green-400"
                    : event.status === "cancelled" ? "bg-destructive/10 text-destructive"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {event.status}
                </span>
              </div>

              {/* Register CTA */}
              <button
                onClick={handleRegister}
                disabled={registerLoading || event.status !== "published"}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-sm shadow-lg shadow-primary/15 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                {registerLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {registerLoading ? "Registering..." : "Register Now"}
              </button>

              {/* Wishlist + Share */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleWishlist}
                  disabled={wishlistLoading}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl border border-border bg-background hover:bg-secondary/40 text-foreground font-semibold text-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {wishlistLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className="h-4 w-4 text-accent" />}
                  Wishlist
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl border border-border bg-background hover:bg-secondary/40 text-foreground font-semibold text-sm transition-all cursor-pointer"
                >
                  <Share2 className="h-4 w-4 text-accent" /> Share
                </button>
              </div>

              {!user && (
                <p className="text-xs text-center text-muted-foreground pt-2">
                  <Link to="/login" className="text-primary font-bold hover:underline">Log in</Link> to register or save events.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
