import React, { useState } from "react";
import { Play, Pause, Zap } from "lucide-react";
import { Article, LanguageType } from "../types";

interface BreakingNewsTickerProps {
  articles: Article[];
  currentLang: LanguageType;
  onSelectArticle: (article: Article) => void;
}

export default function BreakingNewsTicker({
  articles,
  currentLang,
  onSelectArticle
}: BreakingNewsTickerProps) {
  const [isPlaying, setIsPlaying] = useState(true);

  const breakingCountText = {
    en: "FLASH NEWS",
    hi: "ताज़ा खबर",
    sat: "ᱞᱟᱦᱟ ᱠᱷᱚᱵᱚᱨ"
  }[currentLang];

  const breakingArticles = articles.filter(a => a.breaking);

  if (breakingArticles.length === 0) return null;

  return (
    <div className="bg-red-700 text-white border-y border-red-800 flex items-center select-none" id="breaking-ticker-container">
      {/* Ticker Header Badge */}
      <div className="bg-slate-950 px-4 py-2 flex items-center gap-1.5 text-xs font-black tracking-widest uppercase border-r border-red-800 shrink-0 z-10 shadow-lg">
        <Zap className="w-3.5 h-3.5 text-yellow-400 animate-bounce" />
        <span>{breakingCountText}</span>
      </div>

      {/* Ticker Content Row */}
      <div className="overflow-hidden relative flex-1 flex items-center h-9">
        <div 
          className={`whitespace-nowrap flex gap-12 items-center ${
            isPlaying ? "animate-[marquee_25s_linear_infinite]" : ""
          } hover:[animation-play-state:paused]`}
          style={{
            animationPlayState: isPlaying ? "running" : "paused"
          }}
        >
          {/* Repeat text to assure a continuous look */}
          {[...breakingArticles, ...breakingArticles, ...breakingArticles].map((art, idx) => (
            <div 
              key={`${art.id}-${idx}`}
              onClick={() => onSelectArticle(art)}
              className="inline-flex items-center gap-2 cursor-pointer text-sm font-semibold hover:text-yellow-300 hover:underline transition-colors py-1"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-ping shrink-0"></span>
              <span>{art.title[currentLang] || art.title.en}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="px-3 self-stretch bg-red-850 hover:bg-red-800 text-red-200 hover:text-white flex items-center justify-center cursor-pointer transition border-l border-red-800/50"
        title={isPlaying ? "Pause scroll" : "Resume scroll"}
        id="ticker-toggle-play"
      >
        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}
