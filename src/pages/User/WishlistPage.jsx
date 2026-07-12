import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import axiosInstance from "@/api/axiosInstance";
import { MapPin, Calendar, Heart, Trash2, Loader2, Inbox } from "lucide-react";

const formatDate = (d) => new Date(d).toLocaleDateString("en-US", { year:"numeric", month:"short", day:"numeric" });

const WishlistPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [error, setError] = useState(null);

  const fetchWishlist = async () => {
    try {
      const res = await axiosInstance.get("/wishlist");
      setItems(Array.isArray(res.data) ? res.data : res.data?.wishlist || []);
    } catch {
      setError("Could not load your wishlist.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWishlist(); }, []);

  const handleRemove = async (eventId, itemId) => {
    setRemovingId(itemId);
    try {
      await axiosInstance.delete(`/wishlist/${eventId}`);
      setItems((prev) => prev.filter((i) => i._id !== itemId));
    } catch {
      // silently fail
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-8 transition-colors duration-300">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center gap-3 mb-2">
          <Heart className="h-7 w-7 text-accent" />
          <h1 className="text-3xl font-extrabold text-foreground">My Wishlist</h1>
        </div>
        <p className="text-muted-foreground mb-10">Events you've saved to revisit later.</p>

        {loading ? (
          <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : error ? (
          <div className="rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive p-6 text-sm font-semibold">{error}</div>
        ) : items.length === 0 ? (
          <div className="border border-dashed border-border rounded-3xl p-16 text-center flex flex-col items-center gap-4">
            <Heart className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="text-lg font-bold text-foreground">Your wishlist is empty</h3>
            <p className="text-sm text-muted-foreground">Browse events and heart the ones that interest you.</p>
            <Link to="/events" className="mt-2 px-6 py-2.5 bg-primary text-primary-foreground font-semibold text-sm rounded-xl hover:bg-primary/95 transition-all">
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {items.map((item) => {
              const ev = item.event || item;
              return (
                <div key={item._id} className="bg-card border border-border/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                  <div className="relative h-40 bg-muted overflow-hidden">
                    <img
                      src={ev.banner || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=600"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt={ev.title}
                      onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=600"; }}
                    />
                    <button
                      onClick={() => handleRemove(ev._id, item._id)}
                      disabled={removingId === item._id}
                      className="absolute top-3 right-3 p-2 bg-background/70 backdrop-blur-sm rounded-xl border border-border hover:bg-destructive hover:text-white hover:border-destructive transition-all cursor-pointer disabled:opacity-50"
                      title="Remove from wishlist"
                    >
                      {removingId === item._id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-foreground line-clamp-1 mb-3">{ev.title}</h3>
                    <div className="space-y-1.5 text-xs text-muted-foreground">
                      {ev.date && <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-accent" />{formatDate(ev.date)}</div>}
                      {ev.location && <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-accent" />{ev.location}</div>}
                    </div>
                    <Link
                      to={`/events/${ev._id}`}
                      className="mt-4 inline-flex items-center text-xs font-bold text-primary hover:text-primary/80 transition-colors"
                    >
                      View Event →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
