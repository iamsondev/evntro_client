import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import axiosInstance from "@/api/axiosInstance";
import { useAuth } from "@/context/AuthContext";
import {
  MapPin,
  Calendar,
  Users,
  Tag,
  ArrowLeft,
  Heart,
  Share2,
  CheckCircle,
  AlertCircle,
  Loader2,
  Star,
  Send,
  User,
} from "lucide-react";

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
const formatTime = (d) =>
  new Date(d).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
const formatShortDate = (d) =>
  new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

/* ── Star Picker ── */
const StarPicker = ({ value, onChange }) => (
  <div className="flex gap-2">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => onChange(star)}
        className="cursor-pointer transition-transform hover:scale-110 active:scale-95 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl"
      >
        <Star
          className={`h-7 w-7 sm:h-8 sm:w-8 ${star <= value ? "fill-accent text-accent" : "text-muted-foreground/40"}`}
        />
      </button>
    ))}
  </div>
);

/* ── Star Display ── */
const StarDisplay = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        className={`h-3.5 w-3.5 ${s <= rating ? "fill-accent text-accent" : "text-muted-foreground/30"}`}
      />
    ))}
  </div>
);

const EventDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: "" });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewMsg, setReviewMsg] = useState(null);

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

  useEffect(() => {
    const fetchReviews = async () => {
      setReviewsLoading(true);
      try {
        const res = await axiosInstance.get(`/reviews/${id}`);
        setReviews(res.data?.reviews || []);
        setAvgRating(res.data?.averageRating || 0);
      } catch {
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };
    if (id) fetchReviews();
  }, [id]);

  const handleRegister = async () => {
    if (!user) {
      setMessage({
        type: "error",
        text: "Please log in to register for this event.",
      });
      return;
    }
    setRegisterLoading(true);
    setMessage(null);
    try {
      const isFree = event.isFree ?? true;
      const price = event.price ?? 0;

      if (isFree || price <= 0) {
        await axiosInstance.post(`/events/${id}/register`);
        setMessage({
          type: "success",
          text: "You are successfully registered for this event!",
        });
      } else {
        const res = await axiosInstance.post("/payments/create-checkout-session", { eventId: id });
        if (res.data && res.data.url) {
          window.location.href = res.data.url;
        } else {
          throw new Error("Unable to create checkout session.");
        }
      }
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err.response?.data?.msg || err.message || "Registration failed. Please try again.",
      });
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleWishlist = async () => {
    if (!user) {
      setMessage({ type: "error", text: "Please log in to add to wishlist." });
      return;
    }
    setWishlistLoading(true);
    setMessage(null);
    try {
      await axiosInstance.post(`/wishlist/${id}`);
      setMessage({ type: "success", text: "Event added to your wishlist!" });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.msg || "Failed to add to wishlist.",
      });
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: event?.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setMessage({ type: "success", text: "Link copied to clipboard!" });
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setReviewMsg({ type: "error", text: "Please log in to leave a review." });
      return;
    }
    if (reviewForm.rating === 0) {
      setReviewMsg({ type: "error", text: "Please select a star rating." });
      return;
    }
    setReviewSubmitting(true);
    setReviewMsg(null);
    try {
      const res = await axiosInstance.post(`/reviews/${id}`, reviewForm);
      setReviews((prev) => [res.data, ...prev]);
      setReviewForm({ rating: 0, comment: "" });
      setReviewMsg({
        type: "success",
        text: "Your review has been submitted!",
      });
      // Recalculate avg
      setAvgRating((prev) => {
        const total = reviews.length + 1;
        return parseFloat(
          ((prev * reviews.length + reviewForm.rating) / total).toFixed(1),
        );
      });
    } catch (err) {
      setReviewMsg({
        type: "error",
        text: err.response?.data?.msg || "Failed to submit review.",
      });
    } finally {
      setReviewSubmitting(false);
    }
  };

  const isEventPast = event ? new Date(event.date) < new Date() : false;

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
        <p className="text-muted-foreground">
          This event may have been removed or the link is invalid.
        </p>
        <Link
          to="/events"
          className="flex items-center gap-2 text-primary font-bold hover:text-primary/80 transition-colors"
        >
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
          src={
            event.banner ||
            "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2000"
          }
          alt={event.title}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2000";
          }}
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
              <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground leading-tight">
                {event.title}
              </h1>
            </div>

            {/* Meta pills */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card border border-border/70 rounded-2xl px-4 py-2.5">
                <Calendar className="h-4 w-4 text-accent" />
                <span>
                  {formatDate(event.date)} · {formatTime(event.date)}
                </span>
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
              <h2 className="text-lg font-bold text-foreground mb-4">
                About this Event
              </h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* ── Reviews Section ── */}
            <div className="space-y-6">
              {/* Header + avg */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="text-xl font-extrabold text-foreground">
                    Reviews & Ratings
                  </h2>
                  {avgRating > 0 && (
                    <div className="flex items-center gap-2 mt-1">
                      <StarDisplay rating={Math.round(avgRating)} />
                      <span className="text-sm font-bold text-foreground">
                        {avgRating}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({reviews.length} review
                        {reviews.length !== 1 ? "s" : ""})
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Review Form — only show if event is past and user is logged in */}
              {user && isEventPast && (
                <form
                  onSubmit={handleReviewSubmit}
                  className="bg-card border border-border/80 rounded-3xl p-6 space-y-4"
                >
                  <h3 className="font-bold text-foreground">Leave a Review</h3>

                  {reviewMsg && (
                    <div
                      className={`flex items-start gap-2 p-3.5 rounded-2xl text-sm font-semibold ${
                        reviewMsg.type === "success"
                          ? "bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400"
                          : "bg-destructive/10 border border-destructive/20 text-destructive"
                      }`}
                    >
                      {reviewMsg.type === "success" ? (
                        <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" />
                      ) : (
                        <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                      )}
                      {reviewMsg.text}
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
                      Your Rating
                    </label>
                    <StarPicker
                      value={reviewForm.rating}
                      onChange={(r) =>
                        setReviewForm((f) => ({ ...f, rating: r }))
                      }
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
                      Comment{" "}
                      <span className="font-normal normal-case">
                        (optional)
                      </span>
                    </label>
                    <textarea
                      rows={3}
                      value={reviewForm.comment}
                      onChange={(e) =>
                        setReviewForm((f) => ({
                          ...f,
                          comment: e.target.value,
                        }))
                      }
                      placeholder="Share your experience at this event..."
                      className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={reviewSubmitting || reviewForm.rating === 0}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold text-sm rounded-2xl hover:bg-primary/95 shadow-md shadow-primary/10 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                  >
                    {reviewSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    {reviewSubmitting ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              )}

              {/* Prompt if event not past yet */}
              {user && !isEventPast && (
                <div className="bg-card border border-border/80 rounded-2xl px-5 py-4 text-sm text-muted-foreground flex items-center gap-3">
                  <Star className="h-5 w-5 text-accent shrink-0" />
                  You can leave a review after the event has taken place.
                </div>
              )}

              {/* Login prompt */}
              {!user && (
                <div className="bg-card border border-border/80 rounded-2xl px-5 py-4 text-sm text-muted-foreground">
                  <Link
                    to="/login"
                    className="text-primary font-bold hover:underline"
                  >
                    Log in
                  </Link>{" "}
                  to leave a review after attending this event.
                </div>
              )}

              {/* Reviews List */}
              {reviewsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground text-sm border border-dashed border-border rounded-2xl">
                  No reviews yet. Be the first to share your experience!
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div
                      key={review._id}
                      className="bg-card border border-border/80 rounded-2xl p-5 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          {/* Avatar */}
                          <div className="h-9 w-9 rounded-xl border border-border overflow-hidden shrink-0 bg-primary/10 flex items-center justify-center relative">
                            {review.user?.avatar ? (
                              <img
                                src={review.user.avatar}
                                alt={review.user.name}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.nextSibling.style.display = "flex";
                                }}
                              />
                            ) : null}
                            <div
                              className="h-full w-full flex items-center justify-center text-primary font-black uppercase text-xs"
                              style={{
                                display: review.user?.avatar ? "none" : "flex",
                              }}
                            >
                              {review.user?.name?.slice(0, 2) || (
                                <User className="h-4 w-4" />
                              )}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground">
                              {review.user?.name || "Anonymous"}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              {formatShortDate(review.createdAt)}
                            </p>
                          </div>
                        </div>
                        <StarDisplay rating={review.rating} />
                      </div>
                      {review.comment && (
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Right / Action Sidebar ── */}
          <div className="space-y-5">
            <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-lg sticky top-24 space-y-4">
              <h2 className="text-lg font-bold text-foreground">
                Join This Event
              </h2>

              {/* Status message */}
              {message && (
                <div
                  className={`flex items-start gap-2 p-4 rounded-2xl text-sm font-semibold ${
                    message.type === "success"
                      ? "bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400"
                      : "bg-destructive/10 border border-destructive/20 text-destructive"
                  }`}
                >
                  {message.type === "success" ? (
                    <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  ) : (
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  )}
                  {message.text}
                </div>
              )}

              {/* Status badge */}
              <div className="flex items-center justify-between text-sm pb-1">
                <span className="text-muted-foreground">Status</span>
                <span
                  className={`font-bold capitalize px-3 py-1 rounded-full text-xs ${
                    event.status === "published"
                      ? "bg-green-500/10 text-green-600 dark:text-green-400"
                      : event.status === "cancelled"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {event.status}
                </span>
              </div>

              {/* Event Price */}
              <span className="font-bold text-foreground bg-primary/5 px-2.5 py-1 rounded-lg text-xs border border-primary/10">
                {(event.isFree ?? true)
                  ? "Free"
                  : `$${event.price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}`}
              </span>

              {/* Register CTA */}
              <button
                onClick={handleRegister}
                disabled={
                  registerLoading || event.status !== "published" || isEventPast
                }
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-sm shadow-lg shadow-primary/15 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                {registerLoading && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {isEventPast
                  ? "Event Ended"
                  : registerLoading
                    ? "Registering..."
                    : "Register Now"}
              </button>

              {/* Wishlist + Share */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleWishlist}
                  disabled={wishlistLoading}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl border border-border bg-background hover:bg-secondary/40 text-foreground font-semibold text-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {wishlistLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Heart className="h-4 w-4 text-accent" />
                  )}
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
                  <Link
                    to="/login"
                    className="text-primary font-bold hover:underline"
                  >
                    Log in
                  </Link>{" "}
                  to register or save events.
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
