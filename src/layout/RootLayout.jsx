import Footer from "@/pages/shared/Footer/footer";
import Navbar from "@/pages/shared/Navbar/navbar";
import { Outlet } from "react-router";
import { ReactLenis } from "lenis/react";

const RootLayout = () => {
  return (
    <ReactLenis root>
      <div>
        <Navbar />
        <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
          <Outlet />
        </main>
        <Footer />
      </div>
    </ReactLenis>
  );
};

export default RootLayout;
