import React, { useState, useEffect, useRef } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TESTIMONIALS = [
  {
    name: "Rahel Hassan",
    role: "Software Engineer · Dhaka",
    avatar: "https://i.pravatar.cc/80?img=12",
    rating: 5,
    review:
      "Evntro changed the way I discover local tech events. I registered for three hackathons this year — all through this platform. The UI is incredibly clean and the registration flow is instant.",
    event: "National Hackathon 2026",
  },
  {
    name: "Nusrat Jahan",
    role: "Event Organizer · Chittagong",
    avatar: "https://i.pravatar.cc/80?img=49",
    rating: 5,
    review:
      "As an organizer, publishing events has never been easier. The dashboard is intuitive and the reach is amazing — our last concert sold out within 48 hours of being listed on Evntro.",
    event: "Unplugged Symphony Night",
  },
  {
    name: "Mahir Zafar",
    role: "Startup Founder · Sylhet",
    avatar: "https://i.pravatar.cc/80?img=68",
    rating: 5,
    review:
      "I found my co-founder at a Networking Summit I discovered on Evntro. The wishlist feature is great — I saved 10 events and attended 7. Cannot recommend this platform enough.",
    event: "Startup Networking Summit",
  },
  {
    name: "Tanha Binte Ali",
    role: "UX Designer · Dhaka",
    avatar: "https://i.pravatar.cc/80?img=47",
    rating: 5,
    review:
      "Beautiful design, smooooth experience. I registered for a UI/UX workshop in seconds and got an instant confirmation. The dark mode is chef's kiss—exactly what I needed for late-night browsing.",
    event: "UX Design Workshop 2026",
  },
  {
    name: "Arif Mahmud",
    role: "CS Student · BUET",
    avatar: "https://i.pravatar.cc/80?img=56",
    rating: 5,
    review:
      "The category filter and location search make it easy to find exactly what I'm looking for. I've attended 5 events this semester and have 3 more saved in my wishlist. Love Evntro!",
    event: "Global Tech Summit 2026",
  },
];

const Stars = ({ count = 5 }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: count }).map((_, i) => (
      <Star key={i} className="h-4 w-4 fill-accent text-accent" />
    ))}
  </div>
);

const TestimonialsSection = () => {
  const [active, setActive] = useState(0);
  const prev = () => setActive((a) => (a - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () => setActive((a) => (a + 1) % TESTIMONIALS.length);

  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        ".testimonials-header",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".testimonials-header",
            start: "top 85%",
            toggleActions: "play none none none",
          },
          clearProps: "all"
        }
      );

      // Card animation
      gsap.fromTo(
        ".testimonial-card-wrapper",
        { opacity: 0, scale: 0.95, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".testimonial-card-wrapper",
            start: "top 80%",
            toggleActions: "play none none none",
          },
          clearProps: "all"
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const t = TESTIMONIALS[active];

  return (
    <section ref={containerRef} className="py-24 bg-muted/20 border-y border-border/50 transition-colors duration-300 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-16 testimonials-header">
          <span className="inline-flex items-center rounded-full bg-accent/10 px-4 py-1.5 text-xs font-bold text-accent ring-1 ring-accent/20 mb-4 tracking-wider uppercase">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
            Loved by thousands
          </h2>
          <p className="mt-4 text-muted-foreground">
            Real words from real attendees and organizers who call Evntro home.
          </p>
        </div>

        {/* Featured testimonial card */}
        <div className="relative max-w-3xl mx-auto mb-10 testimonial-card-wrapper">
          <div className="bg-card border border-border/80 rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden transition-all duration-500">
            {/* Quote icon watermark */}
            <Quote className="absolute top-6 right-8 h-20 w-20 text-primary/5 dark:text-primary/10 rotate-180" />

            <Stars count={t.rating} />

            <blockquote className="mt-5 text-base sm:text-lg font-medium text-foreground leading-relaxed">
              "{t.review}"
            </blockquote>

            <div className="mt-8 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="h-12 w-12 rounded-full object-cover border-2 border-primary/20"
                />
                <div>
                  <p className="font-bold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground bg-primary/5 border border-primary/10 rounded-xl px-3 py-1.5 font-semibold hidden sm:block">
                {t.event}
              </span>
            </div>
          </div>
        </div>

        {/* Controls & dot indicators */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={prev}
            className="p-2.5 rounded-xl border border-border bg-card hover:bg-secondary/40 text-foreground transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  i === active ? "w-8 bg-primary" : "w-2 bg-border hover:bg-muted-foreground"
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="p-2.5 rounded-xl border border-border bg-card hover:bg-secondary/40 text-foreground transition-colors cursor-pointer"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
