import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: 12000, suffix: "+", label: "Events Hosted", description: "Across all categories" },
  { value: 85000, suffix: "+", label: "Happy Attendees", description: "Registered on platform" },
  { value: 340,   suffix: "+", label: "Cities Reached", description: "Across Bangladesh & beyond" },
  { value: 98,    suffix: "%", label: "Satisfaction Rate", description: "From post-event surveys" },
];

function useCountUp(target, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

const StatItem = ({ value, suffix, label, description, animate }) => {
  const count = useCountUp(value, 1800, animate);
  return (
    <div className="flex flex-col items-center text-center p-8 group stat-item">
      <div className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent tabular-nums mb-2">
        {animate ? count.toLocaleString() : "0"}{suffix}
      </div>
      <div className="text-base font-bold text-foreground mb-1">{label}</div>
      <div className="text-sm text-muted-foreground">{description}</div>
    </div>
  );
};

const StatsSection = () => {
  const [animate, setAnimate] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 85%",
        onEnter: () => {
          setAnimate(true);
        },
      });

      gsap.fromTo(
        ".stat-item",
        { opacity: 0, scale: 0.9, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            toggleActions: "play none none none"
          },
          clearProps: "all"
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative py-20 border-y border-border/50 bg-background overflow-hidden transition-colors duration-305">
      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(47,62,168,0.05),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(91,110,245,0.07),transparent_70%)] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-border/60">
          {STATS.map((stat) => (
            <StatItem key={stat.label} {...stat} animate={animate} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
