import { useState } from "react";
// Swiper React components & styles
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

const Banner = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Unsplash থেকে মাল্টিপল প্রিমিয়াম ইমেজ লিংক
  const sliderImages = [
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1200&auto=format&fit=crop",
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // এখানে আপনার সার্চ লজিক বা ফিল্টারিং ফাংশন কল করতে পারেন
  };

  return (
    <div className="relative overflow-hidden bg-slate-950 py-20 lg:py-28">
      {/* Background Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent_50%)]" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-12 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-12 lg:items-center">
          {/* Left Column: Content & Search Box (Takes 7 Cols on Large Screen) */}
          <div className="lg:col-span-7">
            <div className="max-w-xl">
              {/* Badge */}
              <span className="inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-500/30 backdrop-blur-md mb-6 animate-pulse">
                Next-Gen Platform
              </span>

              {/* Main Heading */}
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                Explore the Tech Frontier
              </h1>

              {/* Description */}
              <p className="mt-6 text-lg leading-8 text-slate-400">
                Find the best resources, developer tools, and cutting-edge
                insights. Empower your workflow with automated pipelines and
                dynamic architectures.
              </p>

              {/* Modern Search Box */}
              <form onSubmit={handleSearch} className="mt-10 max-w-md">
                <div className="relative flex items-center group">
                  {/* SVG Search Icon */}
                  <div className="absolute left-4 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200">
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
                    placeholder="Search courses, projects or docs..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-32 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 backdrop-blur-md transition-all duration-300 shadow-inner"
                  />

                  {/* Search Button Inside Input */}
                  <button
                    type="submit"
                    className="absolute right-2 top-2 bottom-2 px-5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-xl shadow-md shadow-blue-600/20 transition-all duration-200 active:scale-95"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Swiper Container (Takes 5 Cols on Large Screen) */}
          <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
            <div className="relative p-4 rounded-3xl bg-white/5 border border-white/10 shadow-2xl backdrop-blur-md overflow-hidden max-w-[450px] w-full aspect-[4/5]">
              {/* Glowing Background Glow */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-500 to-indigo-600 opacity-20 blur-xl"></div>

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
                    {/* Image overlay to blend with dark theme */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
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
