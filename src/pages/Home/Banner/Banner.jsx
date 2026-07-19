import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
// Swiper React components & styles
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Calendar, Users, Star, ArrowRight, Search } from "lucide-react";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

const Banner = ({ searchQuery, setSearchQuery }) => {
  const containerRef = useRef(null);
  
  const sliderImages = [
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1200&auto=format&fit=crop",
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    const eventListSection = document.getElementById("event-list-section");
    if (eventListSection) {
      eventListSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade in and slide up text elements in a staggered order
      gsap.fromTo(
        ".animate-hero-item",
        { opacity: 0, y: 40 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.9, 
          stagger: 0.15, 
          ease: "power4.out",
          clearProps: "all"
        }
      );

      // Fade in and scale up the image slider slightly
      gsap.fromTo(
        ".animate-hero-slider",
        { opacity: 0, scale: 0.93 },
        { 
          opacity: 1, 
          scale: 1, 
          duration: 1.2, 
          ease: "power3.out", 
          delay: 0.3,
          clearProps: "all"
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative overflow-hidden bg-background py-20 lg:py-28 border-b border-border/40 transition-colors duration-300">
      {/* Inline styles for keyframe animations (Float effect for futuristic cards) */}
      <style>
        {`
          @keyframes float-animation {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(1deg); }
          }
          @keyframes float-animation-delayed {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-8px) rotate(-1deg); }
          }
          .animate-float-card-1 {
            animation: float-animation 6s ease-in-out infinite;
          }
          .animate-float-card-2 {
            animation: float-animation-delayed 5s ease-in-out infinite;
            animation-delay: 2s;
          }
        `}
      </style>

      {/* Futuristic Glowing Ambient Orbs */}
      <div className="absolute top-1/4 left-1/10 h-72 w-72 rounded-full bg-primary/10 dark:bg-primary/20 blur-[100px] pointer-events-none" />
      <div className="absolute top-10 right-1/4 h-80 w-80 rounded-full bg-accent/15 dark:bg-accent/25 blur-[120px] pointer-events-none" />

      {/* Decorative Grid Mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-12 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-12 lg:items-center">
          
          {/* Left Column: Heading, Badge, Description & Search */}
          <div className="lg:col-span-6 xl:col-span-7">
            <div className="max-w-xl">
              
              {/* Pulsing Futuristic Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary dark:text-cyan-300 backdrop-blur-md mb-6 hover:bg-primary/15 transition-all duration-300 animate-hero-item">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Evntro Next-Gen Platform
              </div>

              {/* Title with Gradient Text */}
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl leading-[1.1] md:leading-[1.15] animate-hero-item">
                Discover The Next <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-400 dark:via-cyan-400 dark:to-teal-300">
                  Unforgettable Event
                </span>
              </h1>

              {/* Description */}
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground font-sans animate-hero-item">
                Unlock high-end conferences, developer hackathons, live concerts, and premium classes. Evntro brings you seamless entries to leading visual and physical experiences.
              </p>

              {/* Glowing Search Box */}
              <form onSubmit={handleSearch} className="mt-10 max-w-md animate-hero-item">
                <div className="relative flex items-center group">
                  
                  {/* Search Icon */}
                  <div className="absolute left-4.5 text-muted-foreground group-focus-within:text-primary transition-colors duration-200">
                    <Search className="w-5 h-5" />
                  </div>

                  {/* Input Field */}
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search events, webinars, or concerts..."
                    className="w-full bg-card/60 border border-border rounded-2xl pl-12 pr-32 py-4 text-foreground placeholder-muted-foreground/70 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary backdrop-blur-md transition-all duration-300 shadow-lg shadow-black/5"
                  />

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="absolute right-2 top-2 bottom-2 px-6 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold text-sm rounded-xl shadow-lg shadow-primary/20 transition-all duration-200 active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  >
                    Search
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Swiper Container + Floating UI Badges */}
          <div className="lg:col-span-6 xl:col-span-5 flex items-center justify-center lg:justify-end relative">
            
            {/* Ambient Background Behind Cards */}
            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-primary/10 to-accent/15 blur-2xl opacity-70"></div>

            {/* Slider Wrapper */}
            <div className="relative p-3 rounded-3xl bg-card/45 border border-border/80 shadow-2xl backdrop-blur-md max-w-[420px] w-full aspect-[4/5] transition-colors duration-300 animate-hero-slider">
              
              {/* Floating Stat Badge 1 (Top Left) */}
              <div className="absolute -left-6 top-10 bg-background/90 dark:bg-card/90 backdrop-blur-xl border border-border rounded-2xl p-3.5 shadow-xl flex items-center gap-3 z-30 animate-float-card-1 select-none">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/10">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Live Events</p>
                  <p className="text-sm font-extrabold text-foreground">150+ Globally</p>
                </div>
              </div>

              {/* Floating Stat Badge 2 (Bottom Right) */}
              <div className="absolute -right-6 bottom-10 bg-background/90 dark:bg-card/90 backdrop-blur-xl border border-border rounded-2xl p-3.5 shadow-xl flex items-center gap-3 z-30 animate-float-card-2 select-none">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent border border-accent/10">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">COMMUNITY</p>
                  <p className="text-sm font-extrabold text-foreground">25k+ Joined</p>
                </div>
              </div>

              {/* Floating Live Badge (Top Right) */}
              <div className="absolute right-4 top-4 bg-black/60 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-1.5 z-20 text-[10px] font-bold text-white shadow-lg uppercase tracking-widest border border-white/10">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 animate-pulse" />
                FEATURED
              </div>

              {/* Swiper Slider */}
              <Swiper
                spaceBetween={0}
                effect={"fade"}
                centeredSlides={true}
                autoplay={{
                  delay: 3500,
                  disableOnInteraction: false,
                }}
                pagination={{
                  clickable: true,
                  dynamicBullets: true,
                }}
                modules={[Autoplay, EffectFade, Pagination]}
                className="w-full h-full rounded-2xl overflow-hidden root-swiper-element"
              >
                {sliderImages.map((image, index) => (
                  <SwiperSlide key={index} className="relative w-full h-full">
                    <img
                      src={image}
                      alt={`Featured Banner ${index + 1}`}
                      className="object-cover w-full h-full transform scale-100 hover:scale-105 transition-transform duration-1000 ease-out"
                    />
                    {/* Shadow overlay block */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent transition-all duration-300" />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Banner;
