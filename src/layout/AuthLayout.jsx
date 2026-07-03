import Logo from "@/components/Logo/Logo";
import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div className="relative min-h-screen w-full flex flex-col lg:flex-row bg-slate-50 text-slate-900 dark:bg-[#0B0F19] dark:text-white transition-colors duration-300 overflow-x-hidden">
      {/* 1. Animated Media Section */}
      <div className="relative w-full h-[250px] sm:h-[350px] md:h-[400px] lg:w-[50%] lg:h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-12 border-b lg:border-b-0 lg:border-r border-slate-200/50 dark:border-white/[0.04] bg-slate-100/50 dark:bg-white/[0.01] backdrop-blur-3xl overflow-hidden">
        <video
          autoPlay
          loop
          muted
          className="absolute inset-0 w-full h-full object-cover opacity-60 dark:opacity-40 transition-opacity duration-300"
        >
          <source
            src="https://media.istockphoto.com/id/1388514101/video/party-crowd-with-confetti-and-sparkles.mp4?s=mp4-640x640-is&k=20&c=K5x7FwM5N1U1F5C5R4H7Z4V_B0QG1G5J3Y1_Z4l1_Yw="
            type="video/mp4"
          />
        </video>

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        <div className="relative z-10 self-start p-2.5 sm:p-3 rounded-xl bg-transparent dark:bg-white/80 dark:backdrop-blur-md dark:shadow-md transition-all duration-300">
          <Logo />
        </div>

        <div className="relative z-10 mt-auto lg:my-auto max-w-md">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-white lg:text-slate-900 lg:dark:text-white">
            Dive into <br />
            <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 dark:from-violet-400 dark:via-fuchsia-400 dark:to-cyan-400 bg-clip-text text-transparent">
              Legendary Moments.
            </span>
          </h2>
          <p className="mt-2 lg:mt-4 text-white/90 lg:text-slate-600 lg:dark:text-gray-300 text-xs sm:text-sm leading-relaxed max-w-sm">
            From exclusive music festivals to tech summits, discover the events
            that will shape your year. Secure your spot now.
          </p>
        </div>

        <div className="hidden lg:block relative z-10 text-xs text-slate-400 dark:text-gray-500">
          © 2026 EventApp. Join the Experience.
        </div>
      </div>

      {/* 2. Auth Content Area */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-8 md:px-12 lg:px-16 py-12 lg:py-24 relative z-10">
        <div className="absolute top-[-10%] right-[-10%] h-[300px] w-[300px] sm:h-[500px] sm:w-[500px] rounded-full bg-gradient-to-tr from-violet-600/10 to-fuchsia-600/10 blur-[100px] pointer-events-none hidden dark:block" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[300px] w-[300px] sm:h-[500px] sm:w-[500px] rounded-full bg-gradient-to-br from-cyan-500/10 to-blue-600/10 blur-[100px] pointer-events-none hidden dark:block" />

        <div className="w-full max-w-[100%] sm:max-w-md transition-all duration-300">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
