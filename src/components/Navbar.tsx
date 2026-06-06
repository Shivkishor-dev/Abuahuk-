import React from "react";
import { Languages, Tv, Sun, Moon, LogIn, LogOut, Radio, LayoutDashboard } from "lucide-react";
import { LanguageType } from "../types";

interface NavbarProps {
  currentLang: LanguageType;
  onChangeLang: (lang: LanguageType) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  isAdminLoggedIn: boolean;
  onLogoutAdmin: () => void;
  onOpenAdmin: () => void;
  onGoHome: () => void;
  onOpenLiveTv: () => void;
}

export default function Navbar({
  currentLang,
  onChangeLang,
  darkMode,
  onToggleDarkMode,
  isAdminLoggedIn,
  onLogoutAdmin,
  onOpenAdmin,
  onGoHome,
  onOpenLiveTv
}: NavbarProps) {
  const translations = {
    en: {
      liveTv: "LIVE TV",
      admin: "Admin Hub",
      logout: "Exit Admin",
      tagline: "Voice of Santhal Pargana & Jharkhand",
      home: "Home"
    },
    hi: {
      liveTv: "लाइव टीवी",
      admin: "एडमिन हब",
      logout: "लॉगआउट",
      tagline: "संथाल परगना और झारखंड की बुलंद आवाज़",
      home: "होम"
    }
  };

  const t = translations[currentLang];

  return (
    <header className="sticky top-0 z-50 w-full transition-colors duration-200 shadow-md">
      {/* Upper Logo Strip - Glassmorphic / Premium news feel */}
      <div className="bg-slate-950 text-white py-3 px-4 sm:px-6 md:px-8 border-b border-red-700/30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Tagline / Date */}
          <div className="text-xs font-mono text-zinc-400 order-3 sm:order-1 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-red-500 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              {currentLang === "en" ? "ONLINE BULLETIN" : "ऑनलाइन बुलेटिन"}
            </span>
            <span className="text-zinc-600">|</span>
            <span>{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>

          {/* Logo Area */}
          <div 
            onClick={onGoHome}
            className="flex items-center gap-3 md:gap-4 cursor-pointer group order-1 sm:order-2 select-none"
            id="logo-container"
          >
            {/* Beautiful 3D brand logo badge, matching user uploaded asset */}
            <div className="relative flex items-center bg-white border-2 border-zinc-200 p-1 md:p-1.5 rounded-2xl shadow-[0_8px_20px_rgba(239,68,68,0.15)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_12px_24px_rgba(239,68,68,0.25)] shrink-0">
              <svg className="w-14 h-14 md:w-16 md:h-16" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Backplate background container */}
                <rect x="2" y="2" width="116" height="116" rx="18" fill="#FFFFFF" />
                
                {/* Red outline accent border */}
                <rect x="4" y="4" width="112" height="112" rx="16" fill="#FFFFFF" stroke="#DC2626" strokeWidth="4" />
                <rect x="8" y="8" width="104" height="104" rx="12" fill="#FFFFFF" stroke="#FEE2E2" strokeWidth="1.5" />
                
                {/* Green Devanagari 'अबूआ' with shadow */}
                <text 
                  x="56" 
                  y="46" 
                  fontFamily="'Inter', 'Noto Sans Devanagari', 'Outfit', sans-serif" 
                  fontWeight="950" 
                  fontSize="32" 
                  fill="#16A34A" 
                  textAnchor="middle"
                  style={{ 
                    filter: "drop-shadow(2px 2px 0px #FFFFFF) drop-shadow(4px 4px 1px #14532D)",
                    letterSpacing: "1px"
                  }}
                >
                  अबूआ
                </text>

                {/* Red Devanagari 'हक' with shadow */}
                <text 
                  x="48" 
                  y="92" 
                  fontFamily="'Inter', 'Noto Sans Devanagari', 'Outfit', sans-serif" 
                  fontWeight="950" 
                  fontSize="48" 
                  fill="#DC2626" 
                  textAnchor="middle"
                  style={{ 
                    filter: "drop-shadow(2px 2px 0px #FFFFFF) drop-shadow(5px 5px 1px #7F1D1D)",
                    letterSpacing: "1px"
                  }}
                >
                  हक
                </text>

                {/* News Mic Icon on the right side */}
                <g transform="translate(86, 52) rotate(-15)">
                  {/* Grill Head */}
                  <circle cx="0" cy="0" r="13" fill="url(#micGrillColor)" stroke="#475569" strokeWidth="1" />
                  <circle cx="-3" cy="-3" r="5" fill="#E2E8F0" opacity="0.3" />
                  
                  {/* Mic Flag with 'NEWS' */}
                  <rect x="-14" y="9" width="28" height="18" rx="2" fill="#DC2626" stroke="#FFFFFF" strokeWidth="1" />
                  <text 
                    x="0" 
                    y="21" 
                    fontFamily="'Inter', 'Outfit', 'Arial', sans-serif" 
                    fontSize="8.5" 
                    fontWeight="1000" 
                    fill="#FFFFFF" 
                    textAnchor="middle"
                  >
                    NEWS
                  </text>
                  
                  {/* Mic Body / Handle */}
                  <rect x="-4.5" y="27" width="9" height="22" rx="1.5" fill="#1E293B" />
                  <path d="M0,49 L0,62" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
                </g>

                <defs>
                  <linearGradient id="micGrillColor" x1="-10" y1="-10" x2="10" y2="10" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#E2E8F0" />
                    <stop offset="60%" stopColor="#475569" />
                    <stop offset="100%" stopColor="#0F172A" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Typography brand labels */}
            <div className="flex flex-col">
              <span className="text-white font-black text-2xl md:text-3.5xl tracking-tight leading-none group-hover:text-red-500 transition duration-300 font-display">
                ABUA HAK <span className="text-red-500 font-light text-xl md:text-2xl">NEWS</span>
              </span>
              <span className="text-[10px] font-mono tracking-widest text-[#22C55E] font-bold mt-1.5 uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-[#22C55E] rounded-full animate-pulse"></span>
                अबूआ हक (संविधान की बुलंद आवाज़)
              </span>
            </div>
          </div>

          {/* User Status / Quick controls has been moved to the bottom footer for a professional public-facing newspaper aesthetic */}
          <div className="flex items-center gap-3 order-2 sm:order-3">
            {/* Keeping only a subtle indicator or leaving it completely clean as they requested admin to be at the bottom */}
          </div>
        </div>
      </div>

      {/* Main Navigation Row - Glossy Bottom Bar */}
      <div className={`py-2 px-4 sm:px-6 md:px-8 border-b ${
        darkMode 
          ? "bg-slate-900/95 backdrop-blur-md text-white border-zinc-800" 
          : "bg-white/95 backdrop-blur-md text-slate-900 border-zinc-200"
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Live TV & Home Shortcuts */}
          <div className="flex items-center gap-4">
            <button
              onClick={onGoHome}
              className={`text-sm font-bold uppercase cursor-pointer hover:text-red-600 transition-colors`}
              id="nav-home-link"
            >
              {t.home}
            </button>

            <button
              onClick={onOpenLiveTv}
              className="flex items-center gap-1.5 bg-red-600 animate-pulse text-white font-bold text-xs tracking-wider px-3 py-1 rounded-full shadow hover:bg-red-700 cursor-pointer transition"
              id="nav-live-tv"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>{t.liveTv}</span>
            </button>
          </div>

          {/* Quick Lang Selectors & Theme toggler */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Language Picker Dropdown / Buttons */}
            <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded border border-zinc-200 dark:border-zinc-700">
              <button
                onClick={() => onChangeLang("en")}
                className={`px-2 py-0.5 rounded text-xs font-medium cursor-pointer transition ${
                  currentLang === "en" 
                    ? "bg-red-600 text-white shadow-sm" 
                    : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                }`}
                title="English"
              >
                EN
              </button>
              <button
                onClick={() => onChangeLang("hi")}
                className={`px-2 py-0.5 rounded text-xs font-medium cursor-pointer transition ${
                  currentLang === "hi" 
                    ? "bg-red-600 text-white shadow-sm" 
                    : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                }`}
                title="Hindi"
              >
                हिन्दी
              </button>
            </div>

            {/* Dark Mode Switcher */}
            <button
              onClick={onToggleDarkMode}
              className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-red-600 cursor-pointer transition border border-zinc-200 dark:border-zinc-700"
              title="Toggle theme"
              id="theme-toggler"
            >
              {darkMode ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
