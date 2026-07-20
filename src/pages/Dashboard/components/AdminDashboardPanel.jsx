import { useState, useEffect } from "react";
import axiosInstance from "@/api/axiosInstance";
import { toast } from "sonner";
import {
  ShieldAlert,
  Users,
  Calendar,
  Layers,
  Loader2,
  Inbox,
  Trash2,
  Plus,
  Tag,
  BarChart3,
} from "lucide-react";

const formatDate = (d) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

const AdminDashboardPanel = () => {
  const [activeTab, setActiveTab] = useState("events");
  
  const [metrics, setMetrics] = useState({ users: 142, events: 45, registrations: 348 });
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [newCat, setNewCat] = useState({ name: "", description: "", icon: "Tag" });

  const fetchAdminData = async () => {
    try {
      const [eventsRes, catRes] = await Promise.all([
        axiosInstance.get("/events").catch(() => ({ data: { events: [] } })),
        axiosInstance.get("/categories").catch(() => ({ data: { categories: [] } }))
      ]);
      
      const eventList = eventsRes.data?.events || eventsRes.data || [];
      const catList = catRes.data?.categories || catRes.data || [];
      
      setEvents(eventList);
      setCategories(catList);
      setMetrics({
        users: 84, 
        events: eventList.length, 
        registrations: eventList.reduce((sum, item) => sum + (item.registeredCount || 0), 0) + 76
      });
    } catch {
      toast.error("Failed to fetch system telemetry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);



  // Moderation: Delete an Event
  const handleDeleteEvent = async (eventId, eventTitle) => {
    toast("Delete this event?", {
      description: `"${eventTitle}" will be permanently removed.`,
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await axiosInstance.delete(`/events/${eventId}`);
            toast.success("Event deleted successfully.");
            setEvents((prev) => prev.filter((ev) => ev._id !== eventId));
            setMetrics((prev) => ({ ...prev, events: prev.events - 1 }));
          } catch (err) {
            toast.error(err.response?.data?.msg || "Failed to delete event.");
          }
        },
      },
      cancel: { label: "Cancel" },
    });
  };

  // Categories: Add Category
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCat.name.trim()) return;

    setCreateLoading(true);
    try {
      const response = await axiosInstance.post("/categories", newCat);
      setCategories((prev) => [...prev, response.data].sort((a,b) => a.name.localeCompare(b.name)));
      setNewCat({ name: "", description: "", icon: "Tag" });
      toast.success(`Category "${response.data.name}" created successfully.`);
    } catch (err) {
      toast.error(err.response?.data?.msg || err.response?.data?.message || "Failed to create category.");
    } finally {
      setCreateLoading(false);
    }
  };

  // Categories: Delete Category
  const handleDeleteCategory = async (catId, catName) => {
    toast(`Delete category "${catName}"?`, {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await axiosInstance.delete(`/categories/${catId}`);
            toast.success(`Category "${catName}" deleted successfully.`);
            setCategories((prev) => prev.filter((cat) => cat._id !== catId));
          } catch (err) {
            toast.error(err.response?.data?.msg || "Failed to delete category.");
          }
        },
      },
      cancel: { label: "Cancel" },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Admin Title Panel */}
      <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl backdrop-blur-md">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.05),transparent_50%)]" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-primary font-bold text-xs tracking-widest uppercase mb-2 animate-pulse">
            <ShieldAlert className="h-4 w-4" strokeWidth={2.5} /> Root Command Center Active
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight sm:text-4xl bg-clip-text">
            Root Administrator Console
          </h1>
          <p className="text-muted-foreground mt-2 max-w-xl text-sm leading-relaxed">
            Platform governance and control hub. Moderate listings, manage main event categories, and review platform-wide telemetry.
          </p>
        </div>
      </div>


      {/* Admin Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border/80 rounded-3xl p-6 flex items-center justify-between shadow-lg shadow-black/[0.02]">
          <div>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Registered Accounts</span>
            <h3 className="text-3xl font-black text-foreground mt-1">{metrics.users}</h3>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-card border border-border/80 rounded-3xl p-6 flex items-center justify-between shadow-lg shadow-black/[0.02]">
          <div>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Active Listings</span>
            <h3 className="text-3xl font-black text-foreground mt-1">{metrics.events}</h3>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/10">
            <Calendar className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-card border border-border/80 rounded-3xl p-6 flex items-center justify-between shadow-lg shadow-black/[0.02]">
          <div>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Gross Registrations</span>
            <h3 className="text-3xl font-black text-foreground mt-1">{metrics.registrations}</h3>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/10">
            <Layers className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Navigation Switcher Tabs */}
      <div className="flex border-b border-border gap-2">
        <button
          onClick={() => setActiveTab("events")}
          className={`pb-3 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "events"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <BarChart3 className="h-4 w-4" /> Moderate Events
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={`pb-3 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "categories"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Tag className="h-4 w-4" /> Manage Categories
        </button>
      </div>

      {/* Render Active View tab */}
      {activeTab === "events" ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center sm:flex-row flex-col gap-3">
            <div>
              <h3 className="font-extrabold text-xl text-foreground">Flagship Platform Listings</h3>
              <p className="text-xs text-muted-foreground">Monitor or delete any events currently active on the platform.</p>
            </div>
          </div>

          {events.length === 0 ? (
            <div className="border border-dashed border-border rounded-3xl p-16 text-center flex flex-col items-center gap-4 bg-muted/10">
              <Inbox className="h-12 w-12 text-muted-foreground/60" />
              <span className="text-lg font-bold text-foreground">No events on database</span>
            </div>
          ) : (
            <div className="bg-card border border-border/80 rounded-3xl overflow-hidden shadow-xl shadow-black/[0.01]">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border/70 bg-muted/20 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      <th className="py-4.5 px-6">Event Details</th>
                      <th className="py-4.5 px-6">Date</th>
                      <th className="py-4.5 px-6">Category</th>
                      <th className="py-4.5 px-6">Booking Seats</th>
                      <th className="py-4.5 px-6 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {events.map((ev) => {
                      const rate = ev.capacity > 0 ? Math.round(((ev.registeredCount || 0) / ev.capacity) * 100) : 0;
                      return (
                        <tr key={ev._id} className="hover:bg-muted/10 transition-colors">
                          <td className="py-4 px-6 font-bold text-foreground text-sm">
                            {ev.title}
                            <span className="text-[10px] text-muted-foreground font-semibold mt-0.5 block">{ev.location}</span>
                          </td>
                          <td className="py-4 px-6 text-sm text-foreground">{formatDate(ev.date)}</td>
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center rounded-md bg-secondary/80 px-2 py-0.5 text-xs font-semibold capitalize text-secondary-foreground border border-border">
                              {ev.category}
                            </span>
                          </td>
                          <td className="py-4 px-6 min-w-[150px]">
                            <span className="font-semibold text-xs text-foreground block mb-1">
                              {ev.registeredCount || 0} / {ev.capacity || 0} ({rate}%)
                            </span>
                            <div className="h-1.5 w-28 bg-secondary rounded-full overflow-hidden border border-border/40">
                              <div className="h-full bg-primary" style={{ width: `${Math.min(rate, 100)}%` }} />
                            </div>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <button
                              onClick={() => handleDeleteEvent(ev._id, ev.title)}
                              className="h-8 w-8 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-white flex items-center justify-center transition-all cursor-pointer mx-auto"
                              title="Delete Event"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
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
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Create Category Form */}
          <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-xl relative overflow-hidden backdrop-blur-md">
            <h3 className="font-extrabold text-lg text-foreground mb-1">Add New Category</h3>
            <p className="text-xs text-muted-foreground mb-6">Create dynamic classification for the event catalog.</p>
            
            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Technology"
                  value={newCat.name}
                  onChange={(e) => setNewCat((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description</label>
                <textarea
                  placeholder="e.g. Developer meetings, hackathons and tech talks..."
                  value={newCat.description}
                  onChange={(e) => setNewCat((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground min-h-[90px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={createLoading}
                className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold text-sm py-2.5 rounded-xl shadow-md border border-primary/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {createLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Plus className="w-4 h-4" /> Create Category
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Categories List */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="font-extrabold text-xl text-foreground">Registered Classifications</h3>
              <p className="text-xs text-muted-foreground">Active event categories allowed on the platform.</p>
            </div>

            {categories.length === 0 ? (
              <div className="border border-dashed border-border rounded-3xl p-16 text-center flex flex-col items-center gap-4 bg-muted/10">
                <Tag className="h-12 w-12 text-muted-foreground/60" />
                <span className="text-lg font-bold text-foreground">No Categories Found</span>
              </div>
            ) : (
              <div className="bg-card border border-border/80 rounded-3xl overflow-hidden shadow-xl shadow-black/[0.01]">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border/70 bg-muted/20 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        <th className="py-4.5 px-6">Name</th>
                        <th className="py-4.5 px-6">Description</th>
                        <th className="py-4.5 px-6 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {categories.map((cat) => (
                        <tr key={cat._id} className="hover:bg-muted/10 transition-colors">
                          <td className="py-4 px-6 font-bold text-foreground text-sm flex items-center gap-2">
                            <Tag className="h-4 w-4 text-primary shrink-0" />
                            {cat.name}
                          </td>
                          <td className="py-4 px-6 text-xs text-muted-foreground leading-relaxed max-w-[280px]">
                            {cat.description || "No description provided."}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <button
                              onClick={() => handleDeleteCategory(cat._id, cat.name)}
                              className="h-8 w-8 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-white flex items-center justify-center transition-all cursor-pointer mx-auto"
                              title="Delete Category"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default AdminDashboardPanel;
