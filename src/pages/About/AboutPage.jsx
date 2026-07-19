import { CalendarDays, Users, Star, Globe } from "lucide-react";
import { Link } from "react-router";

const stats = [
  { icon: CalendarDays, label: "Events Hosted", value: "10,000+" },
  { icon: Users, label: "Happy Attendees", value: "500K+" },
  { icon: Star, label: "Avg. Rating", value: "4.9 / 5" },
  { icon: Globe, label: "Cities", value: "120+" },
];

const AboutPage = () => {
  return (
    <main className="bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden py-28 px-4 text-center">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-3xl">
          <span className="inline-block mb-4 text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full">
            Our Story
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-foreground via-foreground/90 to-muted-foreground">
            Events that bring <br />
            <span className="text-primary">people together</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto mb-8">
            Evntro is the modern platform for discovering, creating, and
            managing events — from indie meetups to stadium-scale concerts.
          </p>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/30 transition-all"
          >
            <CalendarDays className="h-4 w-4" /> Explore Events
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border/50 bg-secondary/10 py-16 px-4">
        <div className="mx-auto max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex flex-col items-center text-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <p className="text-3xl font-black text-foreground">{value}</p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 px-4">
        <div className="mx-auto max-w-4xl grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-accent">Our Mission</span>
            <h2 className="mt-3 text-3xl font-black text-foreground mb-4">
              Making great experiences accessible to everyone
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We believe every great memory starts with a great event. Whether
              you're an organizer building communities or an attendee looking for
              your next adventure, Evntro is built for you.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our platform removes the friction from event discovery and
              management — so you can focus on what matters: the experience.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {["Community First", "Secure Payments", "Real-time Updates", "Global Reach"].map((item) => (
              <div key={item} className="rounded-2xl border border-border/60 bg-card p-5 text-sm font-semibold text-foreground hover:border-primary/40 transition-colors">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
