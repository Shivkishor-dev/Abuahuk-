import React from "react";
import { Home, Search, Bookmark, User, Compass } from "lucide-react";
import { LanguageType } from "../types";

interface MobileBottomNavProps {
  currentLang: LanguageType;
  darkMode: boolean;
  bookmarkedCount: number;
  activeView: "home" | "profile" | "category_drawer" | "article";
  onTriggerHome: () => void;
  onTriggerSearch: () => void;
  onTriggerProfile: () => void;
  onTriggerCategoryDrawer: () => void;
}

export default function MobileBottomNav({
  currentLang,
  darkMode,
  bookmarkedCount,
  activeView,
  onTriggerHome,
  onTriggerSearch,
  onTriggerProfile,
  onTriggerCategoryDrawer
}: MobileBottomNavProps) {
  const t = {
    en: {
      home: "Home",
      explore: "Explore",
      search: "Search",
      saved: "Saved",
      profile: "Profile"
    },
    hi: {
      home: "होम",
      explore: "खोजें",
      search: "खोज",
      saved: "संभाले",
      profile: "प्रोफ़ाइल"
    }
  }[currentLang === "hi" ? "hi" : "en"];

  return (
    <nav className={`md:hidden fixed bottom-0 inset-x-0 z-40 border-t flex items-center justify-around py-2.5 px-2 safe-bottom shadow-[0_-8px_24px_rgba(0,0,0,0.12)] ${
      darkMode 
        ? "bg-slate-900/95 backdrop-blur-md border-zinc-805 text-white" 
        : "bg-white/95 backdrop-blur-md border-zinc-200 text-slate-900"
    }`}>
      {/* Home Button */}
      <button
        onClick={onTriggerHome}
        className={`flex flex-col items-center gap-1 cursor-pointer transition select-none ${
          activeView === "home" ? "text-red-650" : "text-zinc-505 dark:text-zinc-400 hover:text-red-500"
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-bold tracking-tight">{t.home}</span>
      </button>

      {/* Explore / Categories Drawer Switch */}
      <button
        onClick={onTriggerCategoryDrawer}
        className={`flex flex-col items-center gap-1 cursor-pointer transition select-none ${
          activeView === "category_drawer" ? "text-red-650" : "text-zinc-505 dark:text-zinc-400 hover:text-red-500"
        }`}
      >
        <Compass className="w-5 h-5" />
        <span className="text-[10px] font-bold tracking-tight">{t.explore}</span>
      </button>

      {/* Search overlay button */}
      <button
        onClick={onTriggerSearch}
        className="flex flex-col items-center gap-1 cursor-pointer text-zinc-505 dark:text-zinc-400 hover:text-red-500 transition select-none"
      >
        <div className="bg-red-600 hover:bg-red-700 text-white rounded-full p-2 -mt-4 shadow-lg flex items-center justify-center border-4 border-slate-950/20 active:scale-95 transition-transform">
          <Search className="w-4 h-4 text-white" />
        </div>
        <span className="text-[10px] font-bold tracking-tight relative top-1">{t.search}</span>
      </button>

      {/* Bookmarks Filter Activator */}
      <button
        onClick={onTriggerProfile}
        className={`flex flex-col items-center gap-1 cursor-pointer transition select-none relative ${
          activeView === "profile" && bookmarkedCount > 0 ? "text-red-650" : "text-zinc-505 dark:text-zinc-400 hover:text-red-500"
        }`}
      >
        <div className="relative">
          <Bookmark className="w-5 h-5" />
          {bookmarkedCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-red-650 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
              {bookmarkedCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-bold tracking-tight">{t.saved}</span>
      </button>

      {/* Personal Reader Profile */}
      <button
        onClick={onTriggerProfile}
        className={`flex flex-col items-center gap-1 cursor-pointer transition select-none ${
          activeView === "profile" ? "text-red-650" : "text-zinc-505 dark:text-zinc-400 hover:text-red-500"
        }`}
      >
        <User className="w-5 h-5" />
        <span className="text-[10px] font-bold tracking-tight">{t.profile}</span>
      </button>

    </nav>
  );
}
