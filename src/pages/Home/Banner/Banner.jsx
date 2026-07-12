import { useState } from "react";
// Swiper React components & styles
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

const Banner = ({ searchQuery, setSearchQuery }) => {
  // Unsplash থেকে মাল্টিপল প্রিমিয়াম ইমেজ লিংক
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

  return (
    <div className="relative overflow-hidden bg-background py-20 lg:py-28 border-b border-border/40 transition-colors duration-300">
      {/* Background Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(47,62,168,0.06),transparent_50%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(91,110,245,0.08),transparent_50%)]" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-12 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-12 lg:items-center">
          {/* Left Column: Content & Search Box */}
          <div className="lg:col-span-7">
            <div className="max-w-xl">
              {/* Badge */}
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary ring-1 ring-inset ring-primary/20 backdrop-blur-md mb-6 animate-pulse transition-all duration-300">
                Evntro Next-Gen Platform
              </span>

              {/* Main Heading */}
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl bg-clip-text">
                Explore Premium Events
              </h1>

              {/* Description */}
              <p className="mt-6 text-lg leading-8 text-muted-foreground font-sans">
                Discover the best classes, developer hackathons, live concerts, and premium conferences. Unlock your experience with seamless online registration.
              </p>

              {/* Modern Search Box */}
              <form onSubmit={handleSearch} className="mt-10 max-w-md">
                <div className="relative flex items-center group">
                  {/* SVG Search Icon */}
                  <div className="absolute left-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-200">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>

                  {/* Input Field */}
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search events, webinars, or concerts..."
                    className="w-full bg-card border border-border rounded-2xl pl-12 pr-32 py-4 text-foreground placeholder-muted-foreground/80 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary backdrop-blur-md transition-all duration-305 shadow-sm"
                  />

                  {/* Search Button Inside Input */}
                  <button
                    type="submit"
                    className="absolute right-2 top-2 bottom-2 px-5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm rounded-xl shadow-md transition-all duration-200 active:scale-95 cursor-pointer"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Swiper Container */}
          <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
            <div className="relative p-4 rounded-3xl bg-card border border-border/80 shadow-2xl backdrop-blur-md overflow-hidden max-w-[450px] w-full aspect-[4/5] transition-colors duration-300">
              {/* Glowing Background Glow */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary to-accent opacity-15 dark:opacity-25 blur-xl transition-all duration-300"></div>

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
                className="w-full h-full rounded-2xl overflow-hidden"
              >
                {sliderImages.map((image, index) => (
                  <SwiperSlide key={index} className="relative w-full h-full">
                    <img
                      src={image}
                      alt={`Slide ${index + 1}`}
                      className="object-cover w-full h-full transform scale-100 hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    {/* Image overlay to blend with background theme */}
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
