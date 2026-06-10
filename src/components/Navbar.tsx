import React from "react";
import { 
  Languages, Tv, Sun, Moon, LogIn, LogOut, Radio, LayoutDashboard, Search, User, Bell, Menu, ShieldCheck 
} from "lucide-react";
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
  onTriggerSearch: () => void;
  onTriggerProfile: () => void;
  activeView: "home" | "profile" | "article" | "admin";
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
  onOpenLiveTv,
  onTriggerSearch,
  onTriggerProfile,
  activeView
}: NavbarProps) {
  const translations = {
    en: {
      liveTv: "LIVE STREAM",
      admin: "Editorial Gate",
      logout: "Exit Desk",
      tagline: "Voice of Santhal Pargana & Jharkhand",
      home: "Front Page",
      profile: "My Desk",
      search: "Search"
    },
    hi: {
      liveTv: "लाइव स्ट्रीम",
      admin: "संपादकीय विभाग",
      logout: "लॉगआउट",
      tagline: "संथाल परगना और झारखंड की बुलंद आवाज़",
      home: "मुख्य पृष्ठ",
      profile: "मेरा डेस्क",
      search: "खोजें"
    }
  };

  const t = translations[currentLang === "hi" ? "hi" : "en"];

  const currentFormattedDate = new Date().toLocaleDateString(undefined, { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <header className="sticky top-0 z-50 w-full transition-colors duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.07)]">
      {/* Upper Brand Plate - Editorial Premium Black Header */}
      <div className="bg-[#020617] text-white py-3.5 px-4 sm:px-6 md:px-8 border-b border-red-700/25">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Metadata: Live status indicator, UTC clock, active language ticker */}
          <div className="text-xs font-mono text-zinc-400 flex flex-wrap items-center justify-center md:justify-start gap-3 order-3 md:order-1">
            <span className="inline-flex items-center gap-1.5 text-emerald-500 font-bold bg-emerald-950/40 border border-emerald-800/30 px-2.5 py-0.5 rounded-full select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              JHARKHAND MULTI Dialect
            </span>
            <span className="text-zinc-750">|</span>
            <span className="font-semibold text-zinc-300">{currentFormattedDate}</span>
          </div>

          {/* Core Master Branding - 3D Emblem with exact specs */}
          <div 
            onClick={onGoHome}
            className="flex items-center gap-3.5 cursor-pointer group order-1 md:order-2 select-none"
            id="branding-logo-wrapper"
          >
            {/* Visual Icon Badge representation */}
            <div className="relative flex items-center bg-white border-2 border-red-650 p-1 rounded-2xl shadow-[0_8px_30px_rgba(220,38,38,0.25)] transition-all duration-300 group-hover:scale-105 group-hover:rotate-1 shrink-0">
              <svg className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="116" height="116" rx="18" fill="#FFFFFF" />
                <rect x="4" y="4" width="112" height="112" rx="16" fill="#FFFFFF" stroke="#DC2626" strokeWidth="4.5" />
                <rect x="8" y="8" width="104" height="104" rx="12" fill="#FFFFFF" stroke="#FEE2E2" strokeWidth="1.5" />
                
                <text 
                  x="56" 
                  y="46" 
                  fontFamily="'Noto Sans Devanagari', 'Inter', sans-serif" 
                  fontWeight="950" 
                  fontSize="32" 
                  fill="#16A34A" 
                  textAnchor="middle"
                  style={{ 
                    filter: "drop-shadow(1.5px 1.5px 0px #FFFFFF) drop-shadow(3px 3.5px 1px #14532D)",
                    letterSpacing: "1px"
                  }}
                >
                  अबुआ
                </text>

                <text 
                  x="48" 
                  y="92" 
                  fontFamily="'Noto Sans Devanagari', 'Inter', sans-serif" 
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

                <g transform="translate(86, 52) rotate(-15)">
                  <circle cx="0" cy="0" r="13" fill="url(#micGrillFill)" stroke="#475569" strokeWidth="1" />
                  <circle cx="-3" cy="-3" r="5" fill="#E2E8F0" opacity="0.3" />
                  <rect x="-14" y="9" width="28" height="18" rx="2" fill="#DC2626" stroke="#FFFFFF" strokeWidth="1" />
                  <text 
                    x="0" 
                    y="21" 
                    fontFamily="'Inter', 'Arial', sans-serif" 
                    fontSize="8.5" 
                    fontWeight="1000" 
                    fill="#FFFFFF" 
                    textAnchor="middle"
                  >
                    NEWS
                  </text>
                  <rect x="-4.5" y="27" width="9" height="22" rx="1.5" fill="#1E293B" />
                  <path d="M0,49 L0,62" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
                </g>

                <defs>
                  <linearGradient id="micGrillFill" x1="-10" y1="-10" x2="10" y2="10" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#E2E8F0" />
                    <stop offset="60%" stopColor="#475569" />
                    <stop offset="100%" stopColor="#0F172A" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Typography core titles */}
            <div className="flex flex-col text-left">
              <h1 className="text-white font-black text-xl sm:text-2xl md:text-3xl tracking-tight leading-none group-hover:text-red-500 transition duration-300 font-display">
                ABUA HAK <span className="text-red-500 font-light text-lg sm:text-2xl">NEWS</span>
              </h1>
              <p className="text-[10px] sm:text-[11px] font-mono tracking-wider text-[#22C55E] font-bold mt-1 uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#22C55E] rounded-full animate-pulse"></span>
                अबुआ हक (संविधान की बुलंद आवाज़)
              </p>
            </div>
          </div>

          {/* Quick Right utility cluster: language picker, desk logins */}
          <div className="flex flex-wrap items-center gap-3 order-2 md:order-3">
            {/* Live desk shortcut button */}
            <button
              onClick={onOpenLiveTv}
              className="flex items-center gap-1.5 bg-red-650 hover:bg-red-700 text-white font-mono tracking-widest font-extrabold text-[10px] px-3.5 py-1.5 rounded-full shadow-lg border border-red-500/10 cursor-pointer transition uppercase"
            >
              <Radio className="w-3.5 h-3.5 text-white animate-pulse" />
              <span>{t.liveTv}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Secondary Sticky Navbelt - Glassmorphic minimal layout */}
      <div className={`py-2 px-4 sm:px-6 md:px-8 border-b ${
        darkMode 
          ? "bg-[#0F172AD9] text-white border-zinc-800/80 backdrop-blur-lg" 
          : "bg-[#FFFFFFA6] text-[#0F172A] border-zinc-200/80 backdrop-blur-lg"
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Main sections selectors */}
          <div className="flex items-center gap-5">
            <button
              onClick={onGoHome}
              className={`text-xs font-black tracking-widest uppercase cursor-pointer transition duration-200 hover:text-red-650 ${
                activeView === "home" ? "text-red-650 font-black border-b-2 border-red-600 pb-0.5" : "text-zinc-505 dark:text-zinc-350"
              }`}
            >
              {t.home}
            </button>

            <button
              onClick={onTriggerProfile}
              className={`hidden sm:flex items-center gap-1.5 text-xs font-black tracking-widest uppercase cursor-pointer transition duration-200 hover:text-[#2563EB] ${
                activeView === "profile" ? "text-[#2563EB] font-black border-b-2 border-blue-600 pb-0.5" : "text-zinc-505 dark:text-zinc-350"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>{t.profile}</span>
            </button>


          </div>

          {/* Search trigger, theme triggers and language switches */}
          <div className="flex items-center gap-3">
            {/* Search Hub Trigger */}
            <button
              onClick={onTriggerSearch}
              className="p-1.5 rounded-xl cursor-pointer bg-zinc-100 hover:bg-zinc-200 text-zinc-650 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-750 font-mono tracking-wider text-[11px] font-bold flex items-center gap-1.5 transition border border-zinc-200 dark:border-zinc-700"
              title="Search stories"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.search}</span>
            </button>

            {/* Language Switch */}
            <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-lg border border-zinc-200/50 dark:border-zinc-700">
              <button
                onClick={() => onChangeLang("en")}
                className={`px-2 py-0.5 rounded text-[10px] font-black cursor-pointer transition-colors ${
                  currentLang === "en" 
                    ? "bg-red-600 text-white shadow"
                    : "text-zinc-655 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => onChangeLang("hi")}
                className={`px-2 py-0.5 rounded text-[10px] font-black cursor-pointer transition-colors ${
                  currentLang === "hi" 
                    ? "bg-red-650 text-white shadow"
                    : "text-zinc-655 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                }`}
              >
                हिन्दी
              </button>
            </div>

            {/* Dark Light mode */}
            <button
               onClick={onToggleDarkMode}
               className="p-1.5 rounded-lg border cursor-pointer border-zinc-200 dark:border-zinc-700 hover:text-red-500 dark:hover:text-[#2563EB] bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 transition-colors"
               title="Change theme mode"
             >
               {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
             </button>
           </div>

        </div>
      </div>
    </header>
  );
}
