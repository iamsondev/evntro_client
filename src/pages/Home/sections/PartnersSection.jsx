import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PARTNERS = [
  { name: "TechBD", logo: "https://ui-avatars.com/api/?name=TechBD&background=2F3EA8&color=fff&size=64&bold=true&rounded=true" },
  { name: "Google DevGroups", logo: "https://ui-avatars.com/api/?name=GDG&background=9C7A2E&color=fff&size=64&bold=true&rounded=true" },
  { name: "BASIS", logo: "https://ui-avatars.com/api/?name=BASIS&background=5B6EF5&color=fff&size=64&bold=true&rounded=true" },
  { name: "BdOSN", logo: "https://ui-avatars.com/api/?name=BdOSN&background=2F3EA8&color=fff&size=64&bold=true&rounded=true" },
  { name: "a2i", logo: "https://ui-avatars.com/api/?name=a2i&background=C9A876&color=0C0D14&size=64&bold=true&rounded=true" },
  { name: "BRAC IT", logo: "https://ui-avatars.com/api/?name=BRAC&background=5B6EF5&color=fff&size=64&bold=true&rounded=true" },
  { name: "ShurjoMukhi", logo: "https://ui-avatars.com/api/?name=SM&background=9C7A2E&color=fff&size=64&bold=true&rounded=true" },
  { name: "Next Ventures", logo: "https://ui-avatars.com/api/?name=NV&background=2F3EA8&color=fff&size=64&bold=true&rounded=true" },
];

const PartnersSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 90%",
            toggleActions: "play none none none",
          },
          clearProps: "all"
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 bg-background border-b border-border/50 transition-colors duration-300 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-bold tracking-widest uppercase text-muted-foreground mb-10">
          Trusted by leading organizations & communities
        </p>

        {/* Infinite scroll strip */}
        <div className="relative overflow-hidden">
          {/* Fade-out edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <div className="flex animate-[marquee_30s_linear_infinite] gap-12 w-max">
            {[...PARTNERS, ...PARTNERS].map((p, i) => (
              <div
                key={i}
                className="flex items-center gap-3 shrink-0 group"
              >
                <img
                  src={p.logo}
                  alt={p.name}
                  className="h-10 w-10 rounded-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300 grayscale group-hover:grayscale-0"
                />
                <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                  {p.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
