import React, { useState } from "react";
import { 
  User, Mail, ShieldAlert, Award, Calendar, Bookmark, History, Bell, CheckCircle2, Save, LogIn, ArrowRight
} from "lucide-react";
import { Article, LanguageType } from "../types";

interface UserProfileProps {
  currentLang: LanguageType;
  darkMode: boolean;
  bookmarkedIds: string[];
  articles: Article[];
  readingHistory: string[];
  onSelectArticle: (article: Article) => void;
  onClearHistory: () => void;
  onLogout: () => void;
  onUpdateName: (newName: string) => void;
}

export default function UserProfile({
  currentLang,
  darkMode,
  bookmarkedIds,
  articles,
  readingHistory,
  onSelectArticle,
  onClearHistory,
  onLogout,
  onUpdateName
}: UserProfileProps) {
  // Mock login and details
  const [name, setName] = useState(() => localStorage.getItem("abua-user-name") || "Pradeep Soren");
  const [email, setEmail] = useState(() => localStorage.getItem("abua-user-email") || "pradeepsoren690@gmail.com");
  const [notificationPref, setNotificationPref] = useState({
    breaking: true,
    daily: false,
    districtAlerts: true
  });
  const [isSaved, setIsSaved] = useState(false);

  // Localization
  const t = {
    en: {
      heading: "MY ABUA NEWSROOM",
      tagline: "Your custom dashboard, bookmark archives, and newsletter preferences.",
      userStats: "JOURNALISM INVOLVEMENT",
      badges: "Contributor Rating",
      savedHeading: "My Saved Articles",
      historyHeading: "Recent Reading History",
      prefHeading: "Personal Alerts Setup",
      saveBtn: "Save Settings",
      clearHistBtn: "Clear Reading Logs",
      noSaved: "You haven't bookmarked any bulletins, read other blogs and click standard bookmark buttons.",
      noHistory: "No recently visited articles found on this device.",
      notifyBreaking: "Send breaking news notifications",
      notifyDaily: "Send daily editorial digest newsletter",
      notifyDist: "Send Dumka district exclusive newsletters"
    },
    hi: {
      heading: "मेरा अबुआ न्यूज़रुम",
      tagline: "आपका व्यक्तिगत फ़ीड, संभाले गए लेख और सूचनाएं।",
      userStats: "सहयोगी स्थिति",
      badges: "योगदानकर्ता स्तर",
      savedHeading: "संभाले गए मुख्य समाचार",
      historyHeading: "हाल ही में पढ़े गए समाचार",
      prefHeading: "अलर्ट वरीयताएं",
      saveBtn: "वरीयता सहेजें",
      clearHistBtn: "हिस्ट्री साफ करें",
      noSaved: "आपने अभी कोई लेख नहीं सहेज रखा है, लेखों पर जाकर बुकमार्क बटन दबाएं।",
      noHistory: "इस ब्राउज़र में आपके द्वारा पढ़ा गया कोई हालिया लेख नहीं है।",
      notifyBreaking: "ब्रेकिंग न्यूज़ की त्वरित अधिसूचना भेजें",
      notifyDaily: "दैनिक संपादकीय न्यूज़लेटर प्राप्त करें",
      notifyDist: "दुमका जिला विशेष समाचार अलर्ट भेजें"
    }
  }[currentLang === "hi" ? "hi" : "en"];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("abua-user-name", name);
    localStorage.setItem("abua-user-email", email);
    onUpdateName(name);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  // Find actual items
  const savedArticles = articles.filter(a => bookmarkedIds.includes(a.id));
  const historyArticles = articles.filter(a => readingHistory.includes(a.id));

  return (
    <div className={`max-w-4xl mx-auto p-4 md:p-6 rounded-2xl border ${
      darkMode 
        ? "bg-slate-900/90 border-zinc-800 text-white" 
        : "bg-white border-zinc-200 text-slate-900"
    } shadow-2xl animate-fade-in`}>
      
      {/* Title */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black font-display text-red-600 flex items-center gap-2">
            <User className="w-6 h-6 shrink-0" />
            <span>{t.heading}</span>
          </h2>
          <p className="text-xs text-zinc-500 font-medium mt-1">
            {t.tagline}
          </p>
        </div>

        <button
          onClick={onLogout}
          className="text-xs bg-red-650/15 text-red-500 hover:bg-red-650 hover:text-white font-mono font-bold px-4 py-2 rounded-xl transition cursor-pointer shrink-0"
        >
          Sign Out / Switch Desk
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Profile Details & Alerts Settings Form (Left, 5 cols) */}
        <form onSubmit={handleSave} className="lg:col-span-5 space-y-6">
          
          {/* User Badge Info Box */}
          <div className="bg-gradient-to-br from-red-950/20 to-slate-950/40 p-4 rounded-xl border border-red-500/10 space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150" 
                  alt="Member profile portrait" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-red-500 shadow"
                />
                <span className="absolute -bottom-1 -right-1 bg-yellow-500 text-black text-[8px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                  ★
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold font-mono tracking-widest text-[#2563EB] uppercase block">
                  {t.userStats}
                </span>
                <span className="text-sm font-black tracking-tight">{name}</span>
                <span className="text-[10px] font-mono text-zinc-500 block">Joined: June 2026</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/5 pt-2 text-[10px] font-semibold text-zinc-400">
              <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5 text-yellow-500" /> Gold Reader Tier</span>
              <span className="bg-red-600/20 text-red-400 px-2 py-0.5 rounded uppercase tracking-wider font-mono">Abua Member</span>
            </div>
          </div>

          {/* Edit Details Input Fields */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono tracking-widest text-zinc-500 block uppercase">
              RECLASSIFY CREDENTIALS
            </span>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold block text-zinc-455">Change Display Name</label>
              <input 
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-100 dark:bg-zinc-950 text-xs sm:text-sm text-slate-900 dark:text-white rounded-lg border border-zinc-200 dark:border-zinc-800 px-3 py-2 outline-none focus:border-red-600 transition"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold block text-zinc-455">Verify Email Anchor</label>
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-100 dark:bg-zinc-950 text-xs sm:text-sm text-slate-900 dark:text-white rounded-lg border border-zinc-200 dark:border-zinc-800 px-3 py-2 outline-none focus:border-red-600 transition"
              />
            </div>
          </div>

          {/* Preferences Switches */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono tracking-widest text-[#2563EB] block uppercase flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5" />
              {t.prefHeading}
            </span>
            <div className="space-y-3 p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-100 dark:border-zinc-850">
              
              <label className="flex items-start gap-2.5 text-xs font-semibold cursor-pointer select-none text-zinc-600 dark:text-zinc-300">
                <input 
                  type="checkbox"
                  checked={notificationPref.breaking}
                  onChange={(e) => setNotificationPref(prev => ({...prev, breaking: e.target.checked}))}
                  className="mt-0.5 rounded border-zinc-300 text-red-650"
                />
                <span>{t.notifyBreaking}</span>
              </label>

              <label className="flex items-start gap-2.5 text-xs font-semibold cursor-pointer select-none text-zinc-600 dark:text-zinc-300">
                <input 
                  type="checkbox"
                  checked={notificationPref.daily}
                  onChange={(e) => setNotificationPref(prev => ({...prev, daily: e.target.checked}))}
                  className="mt-0.5 rounded border-zinc-300 text-red-650"
                />
                <span>{t.notifyDaily}</span>
              </label>

              <label className="flex items-start gap-2.5 text-xs font-semibold cursor-pointer select-none text-zinc-600 dark:text-zinc-300">
                <input 
                  type="checkbox"
                  checked={notificationPref.districtAlerts}
                  onChange={(e) => setNotificationPref(prev => ({...prev, districtAlerts: e.target.checked}))}
                  className="mt-0.5 rounded border-zinc-300 text-red-650"
                />
                <span>{t.notifyDist}</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-mono tracking-wider font-bold text-xs uppercase py-3 rounded-lg flex items-center gap-1.5 justify-center cursor-pointer transition shadow hover:shadow-md"
          >
            {isSaved ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? "Saved Successfully!" : t.saveBtn}</span>
          </button>

        </form>

        {/* Content Lists Bookmarks & History (Right, 7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Saved Articles List */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 border-b border-zinc-200 dark:border-zinc-800 pb-2 text-red-600">
              <Bookmark className="w-4 h-4" />
              <h3 className="text-xs font-black uppercase tracking-wider font-display">
                {t.savedHeading} ({savedArticles.length})
              </h3>
            </div>

            {savedArticles.length === 0 ? (
              <div className="bg-zinc-50 dark:bg-zinc-950 p-6 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 text-center text-zinc-500">
                <p className="text-xs font-medium">{t.noSaved}</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1 scrollbar-thin">
                {savedArticles.map((art) => (
                  <div
                    key={art.id}
                    onClick={() => onSelectArticle(art)}
                    className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-850 hover:border-red-650/40 rounded-xl cursor-pointer transition flex items-center justify-between gap-3 group"
                  >
                    <div className="truncate min-w-0">
                      <span className="text-[9px] font-bold text-[#16A34A] uppercase mr-2">{art.category}</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 group-hover:text-red-500 transition line-clamp-1 py-0.5">
                        {art.title[currentLang] || art.title.en}
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0 text-zinc-400 group-hover:text-red-500 transition-transform group-hover:translate-x-0.5" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reading Logs History List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
              <div className="flex items-center gap-1.5 text-[#2563EB]">
                <History className="w-4 h-4" />
                <h3 className="text-xs font-black uppercase tracking-wider font-display">
                  {t.historyHeading} ({readingHistory.length})
                </h3>
              </div>
              {readingHistory.length > 0 && (
                <button
                  type="button"
                  onClick={onClearHistory}
                  className="text-[9px] font-mono tracking-widest text-zinc-500 hover:text-red-500 font-bold transition uppercase"
                  title="Clear history results"
                >
                  {t.clearHistBtn}
                </button>
              )}
            </div>

            {historyArticles.length === 0 ? (
              <div className="bg-zinc-50 dark:bg-zinc-950 p-6 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 text-center text-zinc-500">
                <p className="text-xs font-medium">{t.noHistory}</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1 scrollbar-thin">
                {historyArticles.map((art) => (
                  <div
                    key={art.id}
                    onClick={() => onSelectArticle(art)}
                    className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-850 hover:border-blue-500/40 rounded-xl cursor-pointer transition flex items-center justify-between gap-3 group"
                  >
                    <div className="truncate min-w-0">
                      <span className="text-[9px] font-bold text-[#2563EB] uppercase mr-2">{art.category}</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 group-hover:text-[#2563EB] transition line-clamp-1 py-0.5">
                        {art.title[currentLang] || art.title.en}
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0 text-zinc-400 group-hover:text-blue-500 transition-transform group-hover:translate-x-0.5" />
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
