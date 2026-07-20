import React, { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router";
import axiosInstance from "@/api/axiosInstance";
import { CheckCircle2, AlertTriangle, Loader2, ArrowRight, Calendar, MapPin, Ticket } from "lucide-react";

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");
  const eventId = searchParams.get("eventId");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);

  useEffect(() => {
    const verifyAndLoad = async () => {
      if (!sessionId) {
        setError("Missing Stripe session ID from the redirection url.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Verify checkout session via backend
        await axiosInstance.post("/payments/verify-session", { sessionId });

        // Retrieve event details to show a nice confirmation card
        if (eventId) {
          try {
            const eventRes = await axiosInstance.get(`/events/${eventId}`);
            setEventDetails(eventRes.data);
          } catch (err) {
            console.error("Failed to load event details:", err);
          }
        }
      } catch (err) {
        setError(err.response?.data?.msg || "Payment verification failed. Please contact support.");
      } finally {
        setLoading(false);
      }
    };

    verifyAndLoad();
  }, [sessionId, eventId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-4 text-center">
        <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 animate-spin text-primary" />
        <h2 className="text-lg sm:text-xl font-bold text-foreground">Verifying Payment...</h2>
        <p className="text-sm text-muted-foreground max-w-xs sm:max-w-none">
          Please wait while we confirm your registration status with Stripe. Do not reload or close this page.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card border border-border/80 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.03),transparent_50%)]" />
          <div className="relative z-10 space-y-4">
            <div className="h-14 w-14 sm:h-16 sm:w-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
              <AlertTriangle className="h-7 w-7 sm:h-8 sm:w-8" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
              Verification Issue
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {error}
            </p>

            <div className="pt-4 flex flex-col gap-3">
              <Link
                to="/my-portal"
                className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground font-bold rounded-2xl hover:bg-primary/95 transition-all text-sm cursor-pointer shadow-md"
              >
                Go to My Workspace <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/events"
                className="w-full py-3 border border-border bg-background hover:bg-secondary/40 text-foreground font-bold rounded-2xl transition-all text-sm cursor-pointer"
              >
                Browse All Events
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-8">
      <div className="max-w-xl w-full bg-card border border-border/80 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden transition-all duration-500 hover:shadow-primary/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(47,62,168,0.05),transparent_50%)]" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-5 sm:space-y-6">
          {/* Animated pulsing success checkmark */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-green-500/20 blur-md animate-ping" />
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 relative z-10 shadow-inner">
              <CheckCircle2 className="h-8 w-8 sm:h-10 sm:w-10 animate-bounce" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight leading-tight">
              Registration Confirmed! 🎉
            </h1>
            <p className="text-sm text-muted-foreground max-w-xs sm:max-w-sm mx-auto">
              Your payment has been successfully processed, and your slot is reserved.
            </p>
          </div>

          {/* Event Details Card */}
          {eventDetails && (
            <div className="w-full bg-background/50 border border-border/60 rounded-2xl p-4 sm:p-5 text-left space-y-4">
              <div className="flex gap-3 sm:gap-4 items-start">
                <img
                  src={eventDetails.banner || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=200"}
                  className="h-14 w-20 sm:h-16 sm:w-24 object-cover rounded-xl shrink-0 bg-muted border border-border/20"
                  alt={eventDetails.title}
                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=200"; }}
                />
                <div className="min-w-0">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                    {eventDetails.category || "Event"}
                  </span>
                  <h3 className="font-extrabold text-foreground mt-1.5 line-clamp-1 text-sm sm:text-base">
                    {eventDetails.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-accent shrink-0" />
                    <span className="truncate">{eventDetails.location}</span>
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-border/40 flex flex-col sm:flex-row sm:justify-between gap-2.5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar className="h-4 w-4 text-accent shrink-0" />
                  {formatDate(eventDetails.date)}
                </span>
                <span className="flex items-center gap-1.5 font-bold text-foreground">
                  <Ticket className="h-4 w-4 text-accent shrink-0 animate-pulse" />
                  Slot Reserved
                </span>
              </div>
            </div>
          )}

          {/* Confirmation Message */}
          <div className="bg-primary/5 border border-primary/10 rounded-2xl px-4 sm:px-5 py-4 text-xs sm:text-sm text-foreground/80 flex items-start sm:items-center gap-3 text-left w-full">
            <span className="relative flex h-2 w-2 shrink-0 mt-1 sm:mt-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span>
              A confirmation notification and booking details have been sent to your dashboard notifications dashboard hub.
            </span>
          </div>

          {/* Bottom Actions Router Links */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3 w-full">
            <Link
              to="/my-portal?tab=registrations"
              className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-primary text-primary-foreground font-bold rounded-2xl hover:bg-primary/95 transition-all text-sm cursor-pointer shadow-lg shadow-primary/10"
            >
              My Bookings <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/events"
              className="flex-1 py-3.5 border border-border bg-background hover:bg-secondary/40 text-foreground font-bold rounded-2xl transition-all text-sm cursor-pointer"
            >
              Discover More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;