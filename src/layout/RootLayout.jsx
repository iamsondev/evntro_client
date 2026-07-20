import Footer from "@/pages/shared/Footer/footer";
import Navbar from "@/pages/shared/Navbar/navbar";
import { Outlet } from "react-router";
import { ReactLenis } from "lenis/react";
import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

const RootLayout = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <ReactLenis root>
      <div className="relative">
        <Navbar />
        <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
          <Outlet />
        </main>
        <Footer />

        <button
          onClick={scrollToTop}
          className={`fixed bottom-6 right-6 z-50 p-3 bg-primary text-primary-foreground rounded-full shadow-xl hover:bg-primary/90 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
          }`}
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      </div>
    </ReactLenis>
  );
};

export default RootLayout;
