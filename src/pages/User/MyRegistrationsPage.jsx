import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import axiosInstance from "@/api/axiosInstance";
import { CalendarDays, MapPin, CheckCircle, XCircle, Clock, Loader2, Inbox } from "lucide-react";

const statusIcon = { confirmed:<CheckCircle className="h-4 w-4 text-green-500"/>, cancelled:<XCircle className="h-4 w-4 text-destructive"/>, pending:<Clock className="h-4 w-4 text-accent"/> };
const statusClass = { confirmed:"bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20", cancelled:"bg-destructive/10 text-destructive border-destructive/20", pending:"bg-accent/10 text-accent border-accent/20" };
const formatDate = (d) => new Date(d).toLocaleDateString("en-US", { year:"numeric", month:"short", day:"numeric" });

const MyRegistrationsPage = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axiosInstance.get("/registrations/my");
        setRegistrations(Array.isArray(res.data) ? res.data : res.data?.registrations || []);
      } catch {
        setError("Could not load your registrations.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-8 transition-colors duration-300">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-extrabold text-foreground mb-2">My Registrations</h1>
        <p className="text-muted-foreground mb-10">Events you have registered to attend.</p>

        {loading ? (
          <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : error ? (
          <div className="rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive p-6 text-sm font-semibold">{error}</div>
        ) : registrations.length === 0 ? (
          <div className="border border-dashed border-border rounded-3xl p-16 text-center flex flex-col items-center gap-4">
            <Inbox className="h-12 w-12 text-muted-foreground/60" />
            <h3 className="text-lg font-bold text-foreground">No Registrations Yet</h3>
            <p className="text-sm text-muted-foreground">Explore events and register for the ones you love.</p>
            <Link to="/events" className="mt-2 px-6 py-2.5 bg-primary text-primary-foreground font-semibold text-sm rounded-xl hover:bg-primary/95 transition-all">
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {registrations.map((reg) => {
              const ev = reg.event || reg;
              const status = reg.status || "pending";
              return (
                <div key={reg._id} className="bg-card border border-border/80 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex gap-4 items-start">
                    <img
                      src={ev.banner || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=200"}
                      className="h-16 w-24 object-cover rounded-xl shrink-0 bg-muted"
                      alt={ev.title}
                      onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=200"; }}
                    />
                    <div>
                      <h3 className="font-bold text-foreground line-clamp-1">{ev.title || "Event"}</h3>
                      <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-muted-foreground">
                        {ev.date && <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5 text-accent" />{formatDate(ev.date)}</span>}
                        {ev.location && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-accent" />{ev.location}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusClass[status] || statusClass.pending}`}>
                      {statusIcon[status] || statusIcon.pending}
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                    <Link to={`/events/${ev._id}`} className="text-xs font-bold text-primary hover:text-primary/80 transition-colors">
                      View →
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

export default MyRegistrationsPage;
