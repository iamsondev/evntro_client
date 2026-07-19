import { useState, useEffect } from "react";
import { Link } from "react-router";
import axiosInstance from "@/api/axiosInstance";
import { useAuth } from "@/context/AuthContext";
import {
  CalendarDays,
  Heart,
  Ticket,
  Clock,
  ExternalLink,
  MapPin,
  Loader2,
  Calendar,
  Sparkles
} from "lucide-react";

const formatDate = (d) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

const UserDashboardPanel = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [regRes, wishRes] = await Promise.all([
          axiosInstance.get("/events/my-registrations").catch(() => ({ data: [] })),
          axiosInstance.get("/wishlist").catch(() => ({ data: [] }))
        ]);
        
        setRegistrations(Array.isArray(regRes.data) ? regRes.data : regRes.data?.registrations || []);
        setWishlist(Array.isArray(wishRes.data) ? wishRes.data : wishRes.data?.wishlist || []);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const upcomingRegs = registrations
    .filter(r => r.event && new Date(r.event.date) >= new Date())
    .sort((a,b) => new Date(a.event.date) - new Date(b.event.date));

  const nextEvent = upcomingRegs[0]?.event;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Hero Grid */}
      <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 relative overflow-hidden backdrop-blur-md">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(47,62,168,0.04),transparent_50%)]" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
              Hello, {user?.name || "Attendee"}! 👋
            </h1>
            <p className="text-muted-foreground mt-1.5 max-w-xl">
              Welcome to your personal board. Find registrations, track upcoming events, and view saved plans.
            </p>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground font-bold text-sm rounded-2xl hover:bg-primary/95 shadow-lg shadow-primary/10 transition-all hover:-translate-y-0.5"
          >
            <Compass className="h-4 w-4" /> Discover Events
          </Link>
        </div>
      </div>

      {/* Stats Counter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border/80 rounded-3xl p-6 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-sm font-semibold text-muted-foreground">My Registrations</span>
            <h3 className="text-4xl font-black text-foreground mt-1.5">{registrations.length}</h3>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Ticket className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-card border border-border/80 rounded-3xl p-6 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-sm font-semibold text-muted-foreground">Saved Wishlist</span>
            <h3 className="text-4xl font-black text-foreground mt-1.5">{wishlist.length}</h3>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
            <Heart className="h-6 w-6 fill-accent" />
          </div>
        </div>

        <div className="bg-card border border-border/80 rounded-3xl p-6 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-sm font-semibold text-muted-foreground">Upcoming Attendances</span>
            <h3 className="text-4xl font-black text-foreground mt-1.5">{upcomingRegs.length}</h3>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500">
            <CalendarDays className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: next event & recent activities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Next Event spotlight */}
        <div className="lg:col-span-8 space-y-6">
          <h3 className="font-extrabold text-xl text-foreground flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent animate-pulse" /> Next Spotlight Event
          </h3>

          {nextEvent ? (
            <div className="bg-card border border-border/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row">
              <img
                src={nextEvent.banner || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600"}
                className="w-full sm:w-64 h-48 sm:h-auto object-cover bg-muted"
                alt={nextEvent.title}
              />
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                    {nextEvent.category || "Conference"}
                  </span>
                  <h4 className="font-extrabold text-xl text-foreground mt-3 line-clamp-1">{nextEvent.title}</h4>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                    {nextEvent.description}
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border/40">
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-4 w-4 text-accent" />{formatDate(nextEvent.date)}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-4 w-4 text-accent" />{nextEvent.location}</span>
                  </div>
                  <Link
                    to={`/events/${nextEvent._id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline hover:text-primary/95"
                  >
                    View details <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-border rounded-3xl p-12 text-center flex flex-col items-center gap-3">
              <Calendar className="h-10 w-10 text-muted-foreground/50" />
              <h4 className="font-bold text-foreground">No Upcoming Bookings</h4>
              <p className="text-xs text-muted-foreground max-w-xs">
                You do not have any upcoming registrations. Browse events on Evntro and reserve your seat!
              </p>
              <Link
                to="/events"
                className="mt-2 px-5 py-2.5 bg-primary text-primary-foreground font-semibold text-xs rounded-xl hover:bg-primary/95 transition-colors"
              >
                Find Events
              </Link>
            </div>
          )}
        </div>

        {/* Wishlist quick list preview */}
        <div className="lg:col-span-4 space-y-6">
          <h3 className="font-extrabold text-xl text-foreground">
            My Wishlist ({wishlist.length})
          </h3>

          <div className="bg-card border border-border/80 rounded-3xl p-6 space-y-4">
            {wishlist.slice(0, 3).map((item) => {
              const ev = item.event || item;
              return (
                <div key={item._id} className="flex gap-4 items-center justify-between group border-b border-border/40 pb-4 last:border-0 last:pb-0">
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                      <Link to={`/events/${ev._id}`}>{ev.title}</Link>
                    </h4>
                    <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" /> {ev.date ? formatDate(ev.date) : "TBD"}
                    </span>
                  </div>
                  <Link
                    to={`/events/${ev._id}`}
                    className="p-2 border border-border rounded-xl text-muted-foreground hover:text-primary hover:bg-secondary/40 transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              );
            })}

            {wishlist.length === 0 && (
              <div className="text-center py-6 text-xs text-muted-foreground">
                Your wishlist is empty.
              </div>
            )}

            {wishlist.length > 3 && (
              <Link
                to="/my-portal?tab=wishlist"
                className="block text-center text-xs font-bold text-primary hover:underline mt-2"
              >
                View all wishlist items →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Compass icon helper dependency mapping
function Compass(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

export default UserDashboardPanel;
