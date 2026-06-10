import React, { useState, useEffect } from "react";
import { X, Search, Mic, TrendingUp, Sparkles, AlertCircle } from "lucide-react";
import { Article, LanguageType } from "../types";

interface SearchOverlayProps {
  currentLang: LanguageType;
  articles: Article[];
  isOpen: boolean;
  onClose: () => void;
  onSelectArticle: (article: Article) => void;
}

export default function SearchOverlay({
  currentLang,
  articles,
  isOpen,
  onClose,
  onSelectArticle
}: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState<string>("all");
  const [isListening, setIsListening] = useState(false);

  const t = {
    en: {
      placeholder: "Search headlines, authors, keywords...",
      trending: "TRENDING SEARCHES",
      categories: "FILTER BY CATEGORY",
      results: "INSTANT BULLETINS FOUND",
      noResults: "No matching stories. Try another query.",
      voiceActive: "Listening for your voice...",
      voiceHelp: "Say 'Dumka', 'Sarhul', or 'Sports' to auto-fill.",
      voiceError: "Voice recognition simulation complete."
    },
    hi: {
      placeholder: "मुख्य समाचार, लेखक या कीवर्ड खोजें...",
      trending: "ट्रेंडिंग विषय",
      categories: "श्रेणी अनुसार खोजें",
      results: "खोजे गए मुख्य समाचार",
      noResults: "कोई परिणाम नहीं मिला। कृपया दूसरे कीवर्ड आज़माएं।",
      voiceActive: "आपकी आवाज़ सुनी जा रही है...",
      voiceHelp: "ऑटो-फिल के लिए 'दुमका', 'सरहुल' या 'खेल' बोलें।",
      voiceError: "आवाज पहचान सिमुलेशन पूरा हुआ।"
    }
  }[currentLang === "hi" ? "hi" : "en"];

  const trendingSearches = [
    { en: "Dumka Archery", hi: "दुमका तीरंदाजी" },
    { en: "Sarhul Festival", hi: "सरहुल पर्व" },
    { en: "Ol Chiki Language", hi: "ओल चिकी भाषा" },
    { en: "Smart Highway Jharkhand", hi: "झाखंड हाईवे" },
    { en: "Tribal Schemes", hi: "सरकारी योजनाएं" }
  ];

  const categories = ["all", "politics", "sports", "entertainment", "technology", "health", "education", "business", "opinion"];

  // Handle mock voice search trigger
  const handleVoiceSearch = () => {
    setIsListening(true);
    setTimeout(() => {
      // Randomly auto fill one of our trending phrases
      const randPhrase = trendingSearches[Math.floor(Math.random() * trendingSearches.length)];
      setQuery(currentLang === "hi" ? randPhrase.hi : randPhrase.en);
      setIsListening(false);
    }, 2000);
  };

  // Filter logic
  const filtered = articles.filter(art => {
    const textMatch = query.trim() === "" ||
      art.title[currentLang]?.toLowerCase().includes(query.toLowerCase()) ||
      art.title.en?.toLowerCase().includes(query.toLowerCase()) ||
      art.content[currentLang]?.toLowerCase().includes(query.toLowerCase()) ||
      art.tags.some(t => t.toLowerCase().includes(query.toLowerCase()));

    const catMatch = selectedCat === "all" || art.category === selectedCat;

    return textMatch && catMatch;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A]/95 backdrop-blur-xl flex flex-col p-4 md:p-8 animate-fade-in text-white overflow-hidden">
      {/* Search Header Strip */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between pb-6 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-red-500 animate-pulse" />
          <h2 className="text-lg font-black tracking-widest font-display text-white uppercase">
            {currentLang === "en" ? "GLOBAL HEADLINE DISCOVERY" : "वैश्विक समाचार खोज"}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 hover:bg-red-650 transition cursor-pointer"
          title="Close search"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Bar */}
      <div className="max-w-4xl mx-auto w-full py-8 flex-1 flex flex-col overflow-y-auto space-y-6 scrollbar-thin">
        {/* Search Input Box */}
        <div className="relative">
          <span className="absolute inset-y-0 left-4 flex items-center text-zinc-400">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.placeholder}
            className="w-full bg-white/5 border-2 border-white/10 focus:border-red-600 outline-none text-base sm:text-lg pl-12 pr-12 py-4 rounded-2xl text-white transition-all shadow-inner font-sans"
          />
          <button
            type="button"
            onClick={handleVoiceSearch}
            className={`absolute inset-y-0 right-3 px-3 my-2 rounded-xl transition flex items-center ${
              isListening ? "bg-red-600 text-white animate-pulse" : "text-zinc-400 hover:bg-white/10"
            }`}
            title="Voice Search"
          >
            <Mic className="w-5 h-5" />
          </button>
        </div>

        {/* Listening alert panel */}
        {isListening && (
          <div className="bg-red-500/20 border border-red-500/40 rounded-xl p-3 text-center text-red-300 animate-pulse">
            <p className="text-xs font-black font-mono tracking-widest uppercase mb-1">{t.voiceActive}</p>
            <p className="text-[10px] opacity-80">{t.voiceHelp}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Filters Column (Left) */}
          <div className="md:col-span-4 space-y-6">
            {/* Trending */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold font-mono tracking-widest text-[#2563EB] flex items-center gap-1.5 uppercase">
                <TrendingUp className="w-3.5 h-3.5" />
                {t.trending}
              </span>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((term, i) => {
                  const label = currentLang === "hi" ? term.hi : term.en;
                  return (
                    <button
                      key={i}
                      onClick={() => setQuery(label)}
                      className="text-xs bg-white/5 hover:bg-white/10 border border-white/5 hover:border-red-650 px-3 py-1.5 rounded-lg transition text-zinc-300 font-medium"
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category Pills */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold font-mono tracking-widest text-[#2563EB] uppercase">
                {t.categories}
              </span>
              <div className="flex flex-col gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCat(cat)}
                    className={`text-xs text-left px-3.5 py-2 rounded-xl border font-bold capitalize transition-all ${
                      selectedCat === cat
                        ? "bg-red-600 text-white border-red-500 shadow"
                        : "bg-white/5 text-zinc-300 border-transparent hover:bg-white/10"
                    }`}
                  >
                    {cat === "all" ? "All categories" : cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Column (Right) */}
          <div className="md:col-span-8 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
              <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
                {t.results} ({filtered.length})
              </span>
            </div>

            {filtered.length === 0 ? (
              <div className="bg-white/5 p-8 rounded-2xl text-center border border-dashed border-white/10 max-w-md mx-auto">
                <AlertCircle className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
                <p className="text-xs text-zinc-400 font-medium">{t.noResults}</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin">
                {filtered.map((art) => (
                  <div
                    key={art.id}
                    onClick={() => {
                      onSelectArticle(art);
                      onClose();
                    }}
                    className="group bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#2563EB]/40 p-3.5 rounded-2xl cursor-pointer transition-all duration-300 flex items-start gap-4"
                  >
                    <img
                      src={art.imageUrl}
                      alt={art.title[currentLang]}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 bg-zinc-950 border border-white/10"
                    />
                    <div className="space-y-1 w-full min-w-0">
                      <div className="flex items-center justify-between text-[9px] font-mono tracking-widest text-red-500 uppercase">
                        <span>{art.category}</span>
                        <span className="text-zinc-500">{new Date(art.publishedAt).toLocaleDateString()}</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-red-400 transition truncate">
                        {art.title[currentLang] || art.title.en}
                      </h4>
                      <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                        {art.content[currentLang] || art.content.en}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
