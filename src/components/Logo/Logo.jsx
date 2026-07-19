import React from "react";

const Logo = () => {
  return (
    <div className="flex items-center">
      <svg className="h-[42px] w-auto transition-all duration-300" viewBox="0 0 320 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <style>
          {`
            .logo-svg {
              --logo-stop-1: #4F46E5; /* Indigo 600 */
              --logo-stop-2: #1D4ED8; /* Blue 700 */
              --logo-stop-3: #0F766E; /* Teal 700 (High contrast in light mode) */
              --logo-spark-1: #D97706; /* Amber 600 */
              --logo-spark-2: #DC2626; /* Red 600 */
              --logo-txt-1: #0F172A; /* Slate 900 */
              --logo-txt-2: #3730A3; /* Indigo 800 (Rich, readable color) */
              --logo-txt-3: #475569; /* Slate 600 */
              --logo-accent: #0D9488; /* Teal 600 */
            }
            .dark .logo-svg, [data-theme="dark"] .logo-svg {
              --logo-stop-1: #6366F1; /* Indigo 500 */
              --logo-stop-2: #3B82F6; /* Blue 500 */
              --logo-stop-3: #22D3EE; /* Cyan 400 */
              --logo-spark-1: #F59E0B; /* Amber 500 */
              --logo-spark-2: #EC4899; /* Pink 500 */
              --logo-txt-1: #F8FAFC; /* Slate 50 */
              --logo-txt-2: #818CF8; /* Indigo 400 */
              --logo-txt-3: #94A3B8; /* Slate 400 */
              --logo-accent: #06B6D4; /* Cyan 500 */
            }
          `}
        </style>
        <g className="logo-svg" transform="translate(10, 5)">
          <defs>
            <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--logo-stop-1)" />
              <stop offset="50%" stopColor="var(--logo-stop-2)" />
              <stop offset="100%" stopColor="var(--logo-stop-3)" />
            </linearGradient>
            <linearGradient id="spark-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--logo-spark-1)" />
              <stop offset="100%" stopColor="var(--logo-spark-2)" />
            </linearGradient>
          </defs>
          <g transform="translate(5, 5)">
            {/* Emblem */}
            <path d="M 40 10 A 25 25 0 1 1 15 35" fill="none" stroke="url(#logo-gradient)" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M 15 35 A 25 25 0 0 1 35 12" fill="none" stroke="url(#logo-gradient)" strokeWidth="4.5" strokeLinecap="round" strokeDasharray="2 10" />
            <circle cx="40" cy="35" r="16" fill="none" stroke="url(#logo-gradient)" strokeWidth="3" strokeDasharray="40 20" transform="rotate(-45 40 35)" />
            <path d="M 40 23 L 42.5 31.5 L 51 34 L 42.5 36.5 L 40 45 L 37.5 36.5 L 29 34 L 37.5 31.5 Z" fill="url(#spark-gradient)" />
            <circle cx="40" cy="34" r="2.5" fill="#FFFFFF" />
          </g>
          {/* Text */}
          <g transform="translate(75, 48)">
            <text x="0" y="0" fill="var(--logo-txt-1)" className="transition-colors duration-300" fontFamily="system-ui, -apple-system, sans-serif" fontSize="44" fontWeight="900" letterSpacing="-1.5">Evn</text>
            <text x="78" y="0" fill="var(--logo-txt-2)" className="transition-colors duration-300" fontFamily="system-ui, -apple-system, sans-serif" fontSize="44" fontWeight="900" letterSpacing="-1.5">tro</text>
            <circle cx="145" cy="-8" r="6" fill="var(--logo-accent)" className="transition-colors duration-300" />
            <text x="2" y="18" fill="var(--logo-txt-3)" className="transition-colors duration-300" fontFamily="system-ui, -apple-system, sans-serif" fontSize="8" fontWeight="700" letterSpacing="5">MOMENTS INTO MEMORIES</text>
          </g>
        </g>
      </svg>
    </div>
  );
};

export default Logo;
