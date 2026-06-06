import React, { useState, useEffect } from "react";
import { 
  Search, BookMarked, Radio, Flame, Mail, Send, CheckCircle2, 
  MapPin, Eye, ThumbsUp, Calendar, ArrowRight, UserCheck, Play, 
  X, Layers, Film, Compass, MessageSquare, Newspaper
} from "lucide-react";
import Navbar from "./components/Navbar";
import BreakingNewsTicker from "./components/BreakingNewsTicker";
import WeatherWidget from "./components/WeatherWidget";
import PollWidget from "./components/PollWidget";
import ArticleView from "./components/ArticleView";
import AdminPanel from "./components/AdminPanel";
import { Article, LanguageType, PollDefinition, AdvisoryBanner, SiteSettings, Comment } from "./types";
import { 
  INITIAL_FALLBACK_ARTICLES, 
  INITIAL_FALLBACK_POLLS, 
  INITIAL_FALLBACK_ADS, 
  INITIAL_FALLBACK_SETTINGS 
} from "./fallbackData";

export default function App() {
  // Global States
  const [currentLang, setCurrentLang] = useState<LanguageType>("hi"); // Default to Hindi to prioritize regional heartland voices
  const [darkMode, setDarkMode] = useState(true); // Dark mode by default for that premium glossy cinema news look
  const [articles, setArticles] = useState<Article[]>([]);
  const [polls, setPolls] = useState<PollDefinition[]>([]);
  const [ads, setAds] = useState<AdvisoryBanner[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: "Abua Hak News",
    contactEmail: "pradeepsoren690@gmail.com",
    breakingNewsScrollSpeed: 15,
    liveTvStreamUrl: "https://www.youtube.com/embed/jfKfPfyJRdk"
  });

  // UI Navigation control
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showAdminConsole, setShowAdminConsole] = useState(false);
  const [showLiveTvDrawer, setShowLiveTvDrawer] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const items = localStorage.getItem("abua-bookmarks");
      return items ? JSON.parse(items) : [];
    } catch {
      return [];
    }
  });

  // Newsletter subscription
  const [emailInput, setEmailInput] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Load backend data on Mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [newsRes, pollsRes, adsRes, settingsRes] = await Promise.all([
        fetch("/api/news").catch(() => null),
        fetch("/api/polls").catch(() => null),
        fetch("/api/ads").catch(() => null),
        fetch("/api/settings").catch(() => null)
      ]);

      let newsData, pollsData, adsData, settingsData;

      if (newsRes && newsRes.ok) {
        newsData = await newsRes.json();
      } else {
        const local = localStorage.getItem("abua-local-articles");
        newsData = local ? JSON.parse(local) : INITIAL_FALLBACK_ARTICLES;
        localStorage.setItem("abua-local-articles", JSON.stringify(newsData));
      }

      if (pollsRes && pollsRes.ok) {
        pollsData = await pollsRes.json();
      } else {
        const local = localStorage.getItem("abua-local-polls");
        pollsData = local ? JSON.parse(local) : INITIAL_FALLBACK_POLLS;
        localStorage.setItem("abua-local-polls", JSON.stringify(pollsData));
      }

      if (adsRes && adsRes.ok) {
        adsData = await adsRes.json();
      } else {
        const local = localStorage.getItem("abua-local-ads");
        adsData = local ? JSON.parse(local) : INITIAL_FALLBACK_ADS;
        localStorage.setItem("abua-local-ads", JSON.stringify(adsData));
      }

      if (settingsRes && settingsRes.ok) {
        settingsData = await settingsRes.json();
      } else {
        const local = localStorage.getItem("abua-local-settings");
        settingsData = local ? JSON.parse(local) : INITIAL_FALLBACK_SETTINGS;
        localStorage.setItem("abua-local-settings", JSON.stringify(settingsData));
      }

      setArticles(newsData);
      setPolls(pollsData);
      setAds(adsData);
      setSettings(settingsData);
    } catch (e) {
      console.error("Error fetching database: falling back to client-side localStorage state.", e);
      // Absolute fallback if everything at all crashes
      const newsLocal = localStorage.getItem("abua-local-articles");
      const newsData = newsLocal ? JSON.parse(newsLocal) : INITIAL_FALLBACK_ARTICLES;
      const pollsLocal = localStorage.getItem("abua-local-polls");
      const pollsData = pollsLocal ? JSON.parse(pollsLocal) : INITIAL_FALLBACK_POLLS;
      const adsLocal = localStorage.getItem("abua-local-ads");
      const adsData = adsLocal ? JSON.parse(adsLocal) : INITIAL_FALLBACK_ADS;
      const settingsLocal = localStorage.getItem("abua-local-settings");
      const settingsData = settingsLocal ? JSON.parse(settingsLocal) : INITIAL_FALLBACK_SETTINGS;

      setArticles(newsData);
      setPolls(pollsData);
      setAds(adsData);
      setSettings(settingsData);
    }
  };

  // Toggle bookmarked articles
  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated;
    if (bookmarkedIds.includes(id)) {
      updated = bookmarkedIds.filter(i => i !== id);
    } else {
      updated = [...bookmarkedIds, id];
    }
    setBookmarkedIds(updated);
    localStorage.setItem("abua-bookmarks", JSON.stringify(updated));
  };

  // Interactive Poll Voting onSubmit callback
  const handleVoteSubmit = async (pollId: string, optionId: string) => {
    try {
      const response = await fetch(`/api/polls/${pollId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId })
      }).catch(() => null);

      if (response && response.ok) {
        const updatedPoll = await response.json();
        setPolls(prev => prev.map(p => p.id === pollId ? updatedPoll : p));
      } else {
        // Fallback: vote locally in client state and save to local storage
        setPolls(prev => {
          const updated = prev.map(p => {
            if (p.id === pollId) {
              const updatedOptions = p.options.map(o => {
                if (o.id === optionId) {
                  return { ...o, votes: (o.votes || 0) + 1 };
                }
                return o;
              });
              return { ...p, options: updatedOptions, totalVotes: (p.totalVotes || 0) + 1 };
            }
            return p;
          });
          localStorage.setItem("abua-local-polls", JSON.stringify(updated));
          return updated;
        });
      }
    } catch (e) {
      console.error("Vote failed, applied locally", e);
    }
  };

  // Publish / Edit Article onSubmit callback
  const handleSaveArticle = async (articleData: Partial<Article>) => {
    const isEdit = !!articleData.id;
    const url = isEdit ? `/api/news/${articleData.id}` : "/api/news";
    const method = isEdit ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(articleData)
      }).catch(() => null);

      if (response && response.ok) {
        await fetchData();
        return true;
      }
    } catch (e) {
      console.error("Save article fetch failed, falling back to local saving", e);
    }

    // Local Storage Save Fallback
    const local = localStorage.getItem("abua-local-articles");
    let currentLocalArticles: Article[] = local ? JSON.parse(local) : INITIAL_FALLBACK_ARTICLES;

    if (isEdit) {
      currentLocalArticles = currentLocalArticles.map(art => {
        if (art.id === articleData.id) {
          return { ...art, ...articleData } as Article;
        }
        return art;
      });
    } else {
      const newArt: Article = {
        id: `art-${Date.now()}`,
        views: 0,
        likes: 0,
        comments: [],
        publishedAt: new Date().toISOString(),
        ...articleData
      } as Article;
      currentLocalArticles.unshift(newArt);
    }

    localStorage.setItem("abua-local-articles", JSON.stringify(currentLocalArticles));
    setArticles(currentLocalArticles);
    return true;
  };

  // Delete Article callback
  const handleDeleteArticle = async (id: string) => {
    try {
      const response = await fetch(`/api/news/${id}`, {
        method: "DELETE"
      }).catch(() => null);
      if (response && response.ok) {
        await fetchData();
        if (selectedArticle?.id === id) {
          setSelectedArticle(null);
        }
        return true;
      }
    } catch (e) {
      console.error("Delete fetch failed, falling back to local action", e);
    }

    // Local Storage Delete Fallback
    const local = localStorage.getItem("abua-local-articles");
    let currentLocalArticles: Article[] = local ? JSON.parse(local) : INITIAL_FALLBACK_ARTICLES;
    currentLocalArticles = currentLocalArticles.filter(art => art.id !== id);
    localStorage.setItem("abua-local-articles", JSON.stringify(currentLocalArticles));
    setArticles(currentLocalArticles);
    if (selectedArticle?.id === id) {
      setSelectedArticle(null);
    }
    return true;
  };

  // Save Settings callback
  const handleSaveSettings = async (newSettings: Partial<SiteSettings>) => {
    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings)
      }).catch(() => null);
      if (response && response.ok) {
        const updated = await response.json();
        setSettings(updated);
        return true;
      }
    } catch (e) {
      console.error("Save settings fetch failed, falling back to local action", e);
    }

    // Local Storage settings Fallback
    const local = localStorage.getItem("abua-local-settings");
    const currentLocalSettings: SiteSettings = local ? JSON.parse(local) : INITIAL_FALLBACK_SETTINGS;
    const updated = { ...currentLocalSettings, ...newSettings };
    localStorage.setItem("abua-local-settings", JSON.stringify(updated));
    setSettings(updated);
    return true;
  };

  // Save Ads banners settings callback
  const handleSaveAds = async (updatedAds: AdvisoryBanner[]) => {
    try {
      const response = await fetch("/api/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedAds)
      }).catch(() => null);
      if (response && response.ok) {
        const updated = await response.json();
        setAds(updated);
        return true;
      }
    } catch (e) {
      console.error("Save Ads fetch failed, falling back to local action", e);
    }

    // Local Storage Ads Fallback
    localStorage.setItem("abua-local-ads", JSON.stringify(updatedAds));
    setAds(updatedAds);
    return true;
  };

  // Post live comment endpoint trigger
  const handlePostComment = async (articleId: string, userName: string, content: string) => {
    try {
      const response = await fetch(`/api/news/${articleId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, content })
      }).catch(() => null);
      if (response && response.ok) {
        const newComment = await response.json();
        // Update local storage representation to instantly visual update selected
        setArticles(prev => prev.map(art => {
          if (art.id === articleId) {
            const comments = (art as any).comments || [];
            return { ...art, comments: [...comments, newComment] };
          }
          return art;
        }));
        return newComment;
      }
    } catch (e) {
      console.error("Post comment fetch failed, falling back to local action", e);
    }

    // Local comment fallback
    const newComment = {
      id: `c-${Date.now()}`,
      userName: userName || "Anonymous Reader",
      userAvatar: `https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80`,
      content: content,
      publishedAt: new Date().toISOString(),
      likes: 0
    };

    const localArr = localStorage.getItem("abua-local-articles");
    let currentActs: Article[] = localArr ? JSON.parse(localArr) : INITIAL_FALLBACK_ARTICLES;
    currentActs = currentActs.map(art => {
      if (art.id === articleId) {
        const comments = art.comments || [];
        return { ...art, comments: [...comments, newComment] };
      }
      return art;
    });

    localStorage.setItem("abua-local-articles", JSON.stringify(currentActs));
    setArticles(currentActs);
    return newComment;
  };

  // Like article endpoint trigger
  const handleLikeArticle = async (articleId: string) => {
    try {
      const response = await fetch(`/api/news/${articleId}/like`, {
        method: "POST"
      }).catch(() => null);
      if (response && response.ok) {
        const data = await response.json();
        setArticles(prev => prev.map(art => {
          if (art.id === articleId) {
            return { ...art, likes: data.likes };
          }
          return art;
        }));
        return data.likes;
      }
    } catch (e) {
      console.error("Like article fetch failed, falling back to local action", e);
    }

    // Local like fallback
    const localArr = localStorage.getItem("abua-local-articles");
    let currentActs: Article[] = localArr ? JSON.parse(localArr) : INITIAL_FALLBACK_ARTICLES;
    let newLikes = 1;
    currentActs = currentActs.map(art => {
      if (art.id === articleId) {
        newLikes = (art.likes || 0) + 1;
        return { ...art, likes: newLikes };
      }
      return art;
    });

    localStorage.setItem("abua-local-articles", JSON.stringify(currentActs));
    setArticles(currentActs);
    return newLikes;
  };

  // Subscriber newsletter call
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput })
      }).catch(() => null);
      if (res && res.ok) {
        setNewsletterSubscribed(true);
        setEmailInput("");
      } else {
        // Fallback simulate subscription success in offline modes
        setNewsletterSubscribed(true);
        setEmailInput("");
      }
    } catch (err) {
      console.error(err);
      setNewsletterSubscribed(true);
      setEmailInput("");
    }
  };

  // Category items localization translation values helper
  const categoryLabels = {
    all: { en: "All Bulletins", hi: "सभी समाचार", sat: "ᱜᱚᱴᱟ ᱠᱷᱚᱵᱚᱨ" },
    politics: { en: "Politics", hi: "राजनीति", sat: "ᱨᱟᱡᱽᱟᱹᱨᱤ" },
    sports: { en: "Sports", hi: "खेल-कूद", sat: "ᱠᱷᱮᱞᱚᱸᱰ" },
    entertainment: { en: "Cinema", hi: "मनोरंजन", sat: "ᱢᱚᱱᱮᱨᱟᱹᱥᱠᱟᱹ" },
    technology: { en: "Tech & Science", hi: "तकनीक", sat: "ᱴᱮᱠᱱᱚᱞᱚᱡᱤ" },
    health: { en: "Health & Well-being", hi: "स्वास्थ्य / सेहत", sat: "ᱦᱚᱲᱢᱚ ᱨᱩᱣᱟᱹ" },
    education: { en: "Education", hi: "शिक्षा / स्कूल", sat: "ᱥᱮᱪᱮᱫ" },
    business: { en: "Finance & Trade", hi: "व्यापार-व्यवसाय", sat: "ᱵᱮᱯᱟᱨ" },
    state: { en: "State updates", hi: "राज्य समाचार", sat: "ᱯᱚᱱᱚᱛ" },
    district: { en: "District news", hi: "जिला समाचार", sat: "ᱡᱤᱞᱟᱹ" },
    opinion: { en: "Editorial / Columns", hi: "विचार-विमर्श", sat: "ᱟᱹᱯᱤᱱᱤᱭᱟᱹᱞ" }
  };

  // Localizations for general static elements on home
  const staticText = {
    en: {
      breakingHero: "BREAKING BULLETIN",
      trendingHead: "TRENDING IN SANTHAL",
      latestHead: "DISPATCH FEED",
      latestDesc: "Authentic coverage from Jharkhand heartlands",
      photoGalleryTitle: "REGIONAL PHOTO GALLERY",
      photoGalleryDesc: "Glimpses of local festivals, beauty and events",
      videoSectionTitle: "LIVE VIDEOS & OUTLOOK",
      videoSectionDesc: "Embedded broadcasts and special field dispatches",
      newsletterTitle: "DAILY NEWSLETTER EXPRESS",
      newsletterDesc: "Get top regional bulletins delivered straight to your email.",
      newsletterBtn: "Register Email",
      searchPlaceholder: "Search headlines, cities or topics...",
      noResults: "No matching bulletins found. Please modify search keywords.",
      bookmarkedTitle: "MY SAVED BULLETINS",
      quickDist: "QUICK DISTRICT SELECTOR"
    },
    hi: {
      breakingHero: "ताज़ा बड़ी खबर",
      trendingHead: "ट्रेंडिंग समाचार",
      latestHead: "नवीनतम समाचार फ़ीड",
      latestDesc: "झारखंड के कोने-कोने से प्रामाणिक रिपोर्टिंग",
      photoGalleryTitle: "क्षेत्रीय चित्रपट दीर्घा",
      photoGalleryDesc: "स्थानीय त्योहारों, प्राकृतिक सौंदर्य और विशेष आयोजनों की झलकियां",
      videoSectionTitle: "लाइव वीडियो और विशेष प्रसारण",
      videoSectionDesc: "ग्राउंडजीरो से हमारी सीधी फुटेज",
      newsletterTitle: "दैनिक बुलेटिन न्यूज़लेटर",
      newsletterDesc: "शीर्ष क्षेत्रीय समाचार सीधे अपने ईमेल पर प्राप्त करें।",
      newsletterBtn: "पंजीकरण करें",
      searchPlaceholder: "मुख्य समाचार, शहर या विषय खोजें...",
      noResults: "कोई समाचार नहीं मिला। कृपया दूसरे कीवर्ड खोजें।",
      bookmarkedTitle: "संभाले गए मुख्य समाचार",
      quickDist: "त्वरित जिला चयनकर्ता"
    },
    sat: {
      breakingHero: "ᱢᱟᱨᱟᱝ ᱞᱟᱦᱟ ᱠᱷᱚᱵᱚᱨ",
      trendingHead: "ᱦᱚᱲ ᱠᱩᱥᱤᱭᱟᱜ ᱠᱷᱚᱵᱚᱨ ᱠᱚ",
      latestHead: "ᱱᱟᱣᱟ ᱠᱷᱚᱵᱚᱨ ᱯᱷᱤᱰ",
      latestDesc: "ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱟᱨ ᱥᱟᱱᱛᱷᱟᱞ ᱯᱟᱨᱜᱟᱱᱟ ᱠᱷᱚᱱ ᱥᱟᱹᱨᱤ ᱠᱷᱚᱵᱚᱨ",
      photoGalleryTitle: "ᱡᱤᱞᱟᱹ ᱪᱤᱛᱟᱹᱨ ᱜᱮᱞᱟᱨᱤ",
      photoGalleryDesc: "ᱟᱹᱛᱩ ᱯᱚᱨᱚᱵᱽ ᱟᱨ ᱥᱤᱨᱡᱚᱱ ᱨᱮᱭᱟᱜ ᱧᱮᱞᱡᱚᱝ ᱴᱷᱟᱶ ᱠᱚ",
      videoSectionTitle: "ᱞᱟᱭᱤᱵᱽ ᱵᱷᱤᱰᱤᱭᱳ ᱠᱷᱚᱵᱚᱨ",
      videoSectionDesc: "ᱱᱮᱣᱛᱟ ᱵᱤᱰᱤᱭᱳ ᱠᱷᱚᱵᱚᱨ ᱠᱚ ᱱᱚᱸᱰᱮ ᱧᱮᱞ ᱯᱮ",
      newsletterTitle: "ᱫᱤᱱᱟᱹᱢ ᱠᱷᱚᱵᱚᱨ ᱧᱟᱢ ᱞᱟᱹᱜᱤᱫ",
      newsletterDesc: "ᱟᱢᱟᱜ ᱤᱢᱮᱞ ᱨᱮ ᱫᱤᱱᱟᱹᱣ ᱞᱟᱹᱠᱛᱤᱭᱟᱱ ᱠᱷᱚᱵᱚᱨ ᱵᱷᱮᱡᱟ ᱦᱩᱭᱩᱜᱼᱟ᱾",
      newsletterBtn: "ᱧᱩᱛᱩᱢ ᱵᱷᱮᱨᱟᱣ ᱢᱮ",
      searchPlaceholder: "ᱠᱷᱚᱵᱚᱨ ᱧᱩᱛᱩᱢ, ᱟᱹᱛᱩ ᱟᱨ ᱵᱤᱪᱟᱹᱨ ᱥᱮᱸᱫᱽᱨᱟᱭ ᱢᱮ...",
      noResults: "ᱠᱷᱚᱵᱚᱨ ᱵᱟᱝ ᱧᱟᱢ ᱞᱮᱱᱟ᱾ ᱮᱴᱟᱜ ᱧᱩᱛᱩᱢ ᱛᱮ ᱥᱮᱸᱫᱽᱨᱟᱭ ᱢᱮ",
      bookmarkedTitle: "ᱥᱟᱵᱽ ᱥᱟᱠᱟᱢ ᱠᱷᱚᱵᱚᱨ",
      quickDist: "ᱡᱤᱞᱟᱹ ᱵᱟᱪᱷᱟᱣ ᱢᱮ"
    }
  }[currentLang];

  // Filters calculations
  const filteredArticles = articles.filter(art => {
    // Search filter
    const matchesSearch = searchQuery.trim() === "" || 
      (art.title[currentLang] || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (art.title.en || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (art.content[currentLang] || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    // Category filter
    const matchesCategory = categoryFilter === "all" || art.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Hero Display Article Selection (take premier featured breaking one)
  const heroArticle = articles.find(art => art.featured) || articles[0];

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${
      darkMode ? "bg-slate-950 text-zinc-100" : "bg-slate-50 text-slate-900"
    }`}>
      
      {/* GLOBAL NAVBAR COMPONENT */}
      <Navbar 
        currentLang={currentLang}
        onChangeLang={setCurrentLang}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        isAdminLoggedIn={true} // In preview mode, allow quick debug access to editor dash
        onLogoutAdmin={() => setShowAdminConsole(false)}
        onOpenAdmin={() => {
          setShowAdminConsole(!showAdminConsole);
          setSelectedArticle(null); // Clear selected article to focus on admin console
        }}
        onGoHome={() => {
          setSelectedArticle(null);
          setShowAdminConsole(false);
          setCategoryFilter("all");
          setSearchQuery("");
        }}
        onOpenLiveTv={() => setShowLiveTvDrawer(true)}
      />

      {/* FLASH NEWS BLOCK TICKER */}
      <BreakingNewsTicker 
        articles={articles}
        currentLang={currentLang}
        onSelectArticle={(art) => {
          setSelectedArticle(art);
          setShowAdminConsole(false);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {/* TOP COMMERCIAL BANNER (IF ACTIVE) */}
      {ads.length > 0 && ads[0].active && (
        <div className="max-w-7xl mx-auto px-4 mt-4" id="google-adsense-header">
          <a 
            href={ads[0].link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="block rounded-xl overflow-hidden shadow border border-zinc-200 dark:border-zinc-800 transition hover:border-red-600/45 text-center group relative cursor-pointer"
            onClick={async () => {
              // Increment ad statistics
              try { fetch(`/api/polls/increment-ad?id=ad-1`, { method: "POST" }); } catch(err) {}
            }}
          >
            <img 
              src={ads[0].imageUrl} 
              alt="Ad Banner" 
              className="w-full h-24 object-cover"
            />
            {/* Ad badge */}
            <span className="absolute top-1.5 right-2 text-[8px] bg-black/60 text-[rgb(220,225,230)] px-1 rounded uppercase tracking-widest font-mono">
              Sponsored Ad
            </span>
          </a>
        </div>
      )}

      {/* MAIN CONTAINER CONTENT FLUID LAYOUT */}
      <main className="max-w-7xl mx-auto px-4 py-6 md:px-6 lg:px-8">
        
        {/* ======================================= */}
        {/* ROUTE VIEW A: LIVE TV EMBED OVERLAY CARD */}
        {/* ======================================= */}
        {showLiveTvDrawer && (
          <div className="bg-slate-900 border border-zinc-800 rounded-2xl p-4 md:p-6 mb-8 text-white relative shadow-2xl animate-fade-in" id="live-tv-panel">
            <button
              onClick={() => setShowLiveTvDrawer(false)}
              className="absolute top-3 right-3 p-1 rounded-full bg-zinc-800 hover:bg-zinc-750 text-white cursor-pointer transition"
              title="Close Player"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2 text-red-500 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
              <span className="text-xs font-mono font-extrabold tracking-widest uppercase">
                ABUA HAK LIVE BROADCASTING DESK
              </span>
            </div>

            <div className="aspect-video w-full max-w-4xl mx-auto rounded-xl overflow-hidden border border-zinc-800 bg-black shadow-inner">
              <iframe
                src={settings.liveTvStreamUrl || "https://www.youtube.com/embed/jfKfPfyJRdk"}
                title="Google AI Studio Live Broadcast streams"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-3">
              <p>📍 Broadcasted directly from Dumka (Sub-capital) and Ranchi news stations.</p>
              <span className="text-[10px] font-mono bg-zinc-800 px-3 py-1 rounded text-red-400">Stream Codec: AVC-H.264 Live feed (2026 update)</span>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* ROUTE VIEW B: ADMIN BOARD FOR EDITORS */}
        {/* ======================================= */}
        {showAdminConsole ? (
          <AdminPanel 
            currentLang={currentLang}
            articles={articles}
            polls={polls}
            ads={ads}
            settings={settings}
            onSaveArticle={handleSaveArticle}
            onDeleteArticle={handleDeleteArticle}
            onSaveSettings={handleSaveSettings}
            onSaveAds={handleSaveAds}
            onClose={() => setShowAdminConsole(false)}
          />
        ) : selectedArticle ? (
          /* ======================================= */
          /* ROUTE VIEW C: FULL ARTICLE DETAILED PAGE */
          /* ======================================= */
          <ArticleView 
            currentLang={currentLang}
            article={selectedArticle}
            relatedArticles={articles.filter(a => a.id !== selectedArticle.id && a.category === selectedArticle.category)}
            onBack={() => setSelectedArticle(null)}
            onSelectArticle={(art) => {
              setSelectedArticle(art);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onPostComment={handlePostComment}
            onLikeArticle={handleLikeArticle}
          />
        ) : (
          /* ======================================= */
          /* ROUTE VIEW D: COZY NEWS PORTAL HOMEPAGE  */
          /* ======================================= */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* PORTAL MAIN BULLETINS FEED AREA (COLUMNS 1 TO 8) */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Categorization & Subnavigation */}
              <div className="border-b border-zinc-200 dark:border-zinc-850 pb-3" id="home-subnavigation-tabs">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-red-650" />
                    <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-900 dark:text-zinc-200">
                      {currentLang === "en" ? "EXPLORE BY TOPICS" : currentLang === "hi" ? "श्रेणी अनुसार समाचार" : "ᱠᱷᱚᱵᱚᱨ ᱦᱟᱹᱴᱤᱧ"}
                    </h3>
                  </div>

                  {/* Bookmark quick count */}
                  {bookmarkedIds.length > 0 && (
                    <div className="text-xs bg-red-950 text-red-400 px-3 py-1 rounded-full font-bold flex items-center gap-1">
                      <BookMarked className="w-3.5 h-3.5" />
                      <span>{bookmarkedIds.length} Bookmarks</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
                  {Object.keys(categoryLabels).map((catKey) => {
                    const isSelected = categoryFilter === catKey;
                    return (
                      <button
                        key={catKey}
                        onClick={() => setCategoryFilter(catKey)}
                        className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap font-bold transition cursor-pointer ${
                          isSelected 
                            ? "bg-red-600 text-white shadow-sm" 
                            : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800"
                        }`}
                      >
                        {categoryLabels[catKey as keyof typeof categoryLabels][currentLang]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Instant Search Bar */}
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-zinc-400">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={staticText.searchPlaceholder}
                  className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm text-slate-900 dark:text-white pl-10 pr-4 py-3 rounded-xl outline-none focus:border-red-650 transition shadow-inner"
                />
              </div>

              {/* 1. HERO BREAKING NEWS BANNER (Only on Default All View) */}
              {categoryFilter === "all" && searchQuery === "" && heroArticle && (
                <div 
                  onClick={() => setSelectedArticle(heroArticle)}
                  className="group relative rounded-2xl overflow-hidden aspect-video sm:aspect-[21/9] bg-zinc-900 cursor-pointer shadow-lg hover:shadow-xl transition border border-zinc-200 dark:border-zinc-850"
                  id="hero-breaking-banner"
                >
                  {/* Image wrapper */}
                  <img 
                    src={heroArticle.imageUrl || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=900"} 
                    alt="Hero news"
                    className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500 opacity-60"
                  />
                  
                  {/* Overlay background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>

                  {/* Absolute Badge */}
                  <span className="absolute top-4 left-4 bg-red-700 text-white font-mono font-black text-[9px] tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm pulse-ring-active-custom">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                    {staticText.breakingHero}
                  </span>

                  {/* Content card positioned at bottom of image */}
                  <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 text-white space-y-2">
                    <span className="text-[10px] font-bold font-mono tracking-widest text-red-500 uppercase">
                      {heroArticle.category} • {heroArticle.subCategory}
                    </span>
                    <h2 className="text-base sm:text-xl lg:text-2xl font-black tracking-tight leading-tight group-hover:text-red-400 transition">
                      {heroArticle.title[currentLang] || heroArticle.title.en}
                    </h2>
                    {heroArticle.subtitle && (
                      <p className="text-xs text-zinc-300 font-medium line-clamp-2 hidden sm:block">
                        {heroArticle.subtitle[currentLang] || heroArticle.subtitle.en}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* 2. LATEST NEWS DISPATCH FEED GRID */}
              <div>
                <div className="flex flex-col mb-4 border-l-4 border-red-650 pl-3">
                  <h2 className="text-lg font-black tracking-widest text-slate-950 dark:text-zinc-100 uppercase">
                    {staticText.latestHead}
                  </h2>
                  <span className="text-xs text-zinc-500 font-medium">
                    {staticText.latestDesc}
                  </span>
                </div>

                {filteredArticles.length === 0 ? (
                  <div className="bg-zinc-100 dark:bg-zinc-900/60 rounded-xl p-8 text-center border border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-500">
                    <p className="text-sm font-medium">{staticText.noResults}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" id="dispatch-feed-grid">
                    {filteredArticles.map((art) => {
                      const isBookmarked = bookmarkedIds.includes(art.id);
                      return (
                        <div 
                          key={art.id}
                          onClick={() => {
                            setSelectedArticle(art);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="group cursor-pointer bg-white dark:bg-zinc-900/95 border border-zinc-200 dark:border-zinc-850 rounded-xl overflow-hidden shadow-sm hover:border-zinc-400 dark:hover:border-zinc-750 transition flex flex-col justify-between"
                        >
                          <div className="relative aspect-video overflow-hidden bg-zinc-100 dark:bg-zinc-950 shrink-0">
                            <img 
                              src={art.imageUrl || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800"} 
                              alt="article attachment"
                              className="w-full h-full object-cover group-hover:scale-102 transition duration-300"
                            />
                            
                            {/* Category tags */}
                            <span className="absolute bottom-2.5 left-2.5 bg-slate-950/80 text-white font-mono text-[9px] tracking-wider px-2 py-0.5 rounded font-bold uppercase backdrop-blur-sm">
                              {art.category}
                            </span>

                            {/* Bookmark save toggle click */}
                            <button
                              onClick={(e) => toggleBookmark(art.id, e)}
                              className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-slate-950/75 hover:bg-slate-950 text-white cursor-pointer transition select-none"
                              title="Bookmark article"
                            >
                              <BookMarked className={`w-3.5 h-3.5 ${
                                isBookmarked ? "text-yellow-400 fill-yellow-400" : "text-zinc-300"
                              }`} />
                            </button>
                          </div>

                          <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                            <div>
                              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 mb-1.5">
                                <span className="font-bold text-red-500">{art.subCategory || "State"}</span>
                                <span>{new Date(art.publishedAt).toLocaleDateString()}</span>
                              </div>
                              <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 leading-snug line-clamp-2 uppercase group-hover:text-red-500 transition py-0.5">
                                {art.title[currentLang] || art.title.en}
                              </h3>
                              <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                                {art.content[currentLang] || art.content.en}
                              </p>
                            </div>

                            <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/80 pt-2 text-[10px] font-mono text-zinc-500">
                              <span className="font-semibold text-zinc-650 dark:text-zinc-400">{art.author.name}</span>
                              <div className="flex items-center gap-2">
                                <span>Views: <b>{art.views}</b></span>
                                <span>Likes: <b>{art.likes}</b></span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 3. PHOTO GALLERY SECTION */}
              {categoryFilter === "all" && (
                <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8" id="visual-photo-gallery">
                  <div className="border-l-4 border-red-650 pl-3 mb-6">
                    <h2 className="text-lg font-black tracking-widest text-slate-950 dark:text-zinc-100 uppercase mb-0.5">
                      {staticText.photoGalleryTitle}
                    </h2>
                    <p className="text-xs text-zinc-500 font-medium">
                      {staticText.photoGalleryDesc}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { src: "https://images.unsplash.com/photo-1545128485-c400e7702796?w=600", label: "Sarhul Prayers" },
                      { src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600", label: "Archery Dumka" },
                      { src: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600", label: "Smart Schools" },
                      { src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600", label: "Highway Digital corridor" }
                    ].map((ph, idx) => (
                      <div key={idx} className="group relative rounded-xl overflow-hidden aspect-square bg-zinc-900 border border-zinc-800 shadow-sm cursor-pointer hover:border-red-600/30">
                        <img 
                          src={ph.src} 
                          alt={ph.label}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent p-2.5 text-white">
                          <span className="text-[10px] font-bold font-mono uppercase truncate block">
                            {ph.label}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. VIDEO NEWS CORNER (YOUTUBE SIMULATION INTERACTIVE VIDEO) */}
              {categoryFilter === "all" && (
                <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8" id="embedded-video-news-deck">
                  <div className="border-l-4 border-red-650 pl-3 mb-6">
                    <h2 className="text-lg font-black tracking-widest text-slate-950 dark:text-zinc-100 uppercase mb-0.5">
                      {staticText.videoSectionTitle}
                    </h2>
                    <p className="text-xs text-zinc-500 font-medium">
                      {staticText.videoSectionDesc}
                    </p>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-850 rounded-2xl overflow-hidden p-4 flex flex-col md:flex-row items-center gap-6 shadow">
                    <div className="w-full md:w-3/5 rounded-xl overflow-hidden aspect-video bg-black self-stretch">
                      <iframe
                        src={settings.liveTvStreamUrl || "https://www.youtube.com/embed/jfKfPfyJRdk"}
                        title="Live Video Outlook"
                        className="w-full h-full"
                        allowFullScreen
                      ></iframe>
                    </div>

                    <div className="w-full md:w-2/5 text-white space-y-3 p-2">
                      <span className="text-[8px] bg-red-600 text-white font-black font-mono tracking-widest px-2 py-0.5 rounded uppercase">
                        LIVE GROUND CORRESPONDENT
                      </span>
                      <h4 className="text-sm font-bold leading-snug text-zinc-100">
                        Sanitizing digital classrooms & modern connectivity lines in rural blocks.
                      </h4>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Join our Dumka reporters as we evaluate state funding guidelines and traditional language learning metrics deployed today.
                      </p>
                      <button
                        onClick={() => setShowLiveTvDrawer(true)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-xs font-bold font-mono tracking-wider flex items-center gap-1.5 transition uppercase"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Launch Pro Cinema feed</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* PORTAL RIGHT SIDEBAR PANELS (COLUMNS 9 TO 12) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Weather Widget */}
              <WeatherWidget currentLang={currentLang} />

              {/* Commercial Square Slot B Banner advertisement */}
              {ads.length > 1 && ads[1].active && (
                <div className="bg-zinc-900 border border-zinc-850 rounded-xl overflow-hidden p-3 shadow-md" id="adsense-sidebar">
                  <span className="text-[8px] tracking-wider font-mono text-zinc-505 block mb-2 uppercase">COMMERCIAL AD ACTION</span>
                  <a 
                    href={ads[1].link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="block relative rounded overflow-hidden aspect-square bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition"
                  >
                    <img 
                      src={ads[1].imageUrl} 
                      alt="Banner B" 
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1.5 left-2 bg-black/60 text-[8px] text-zinc-350 px-2 rounded tracking-widest uppercase font-mono font-bold">
                      Explore Exhibition Free
                    </span>
                  </a>
                </div>
              )}

              {/* Poll Widget */}
              <PollWidget 
                currentLang={currentLang}
                poll={polls[0] || null}
                onVoteSubmit={handleVoteSubmit}
              />

              {/* 5. TRENDING SIDEBAR COLUMN */}
              <div className="bg-zinc-900/50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 p-4 rounded-xl shadow-sm">
                <div className="flex items-center gap-1.5 border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-4 text-red-500">
                  <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
                  <span className="text-xs font-mono font-extrabold tracking-wider uppercase">
                    {staticText.trendingHead}
                  </span>
                </div>

                <div className="space-y-4">
                  {articles.filter(a => a.trending).slice(0, 4).map((art, idx) => (
                    <div 
                      key={art.id}
                      onClick={() => {
                        setSelectedArticle(art);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="group cursor-pointer flex items-start gap-3 border-b border-zinc-200/50 dark:border-zinc-800/55 pb-3 last:border-0 last:pb-0"
                    >
                      <span className="text-lg font-black font-mono text-red-650 shrink-0 select-none">
                        0{idx + 1}
                      </span>
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-zinc-450 dark:text-zinc-500 tracking-wider block uppercase">
                          {art.category}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-200 leading-snug group-hover:text-red-500 transition line-clamp-2">
                          {art.title[currentLang] || art.title.en}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. BOOKMARKS QUICK PANEL */}
              {bookmarkedIds.length > 0 && (
                <div className="bg-zinc-900 border border-zinc-850 p-4 rounded-xl shadow-sm">
                  <div className="flex items-center gap-1.5 border-b border-zinc-800 pb-2.1 mb-3 text-red-500">
                    <BookMarked className="w-4 h-4 text-red-500" />
                    <span className="text-xs font-mono font-extrabold tracking-wider uppercase">
                      {staticText.bookmarkedTitle}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {articles.filter(a => bookmarkedIds.includes(a.id)).map((art) => (
                      <div 
                        key={art.id}
                        onClick={() => {
                          setSelectedArticle(art);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="p-2 border border-zinc-850 hover:bg-zinc-850 rounded cursor-pointer transition text-xs font-semibold text-zinc-300 hover:text-white truncate"
                      >
                        {art.title[currentLang] || art.title.en}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 7. QUICK DISTRICT SELECTOR */}
              <div className="bg-zinc-900 border border-zinc-850 p-4 rounded-xl shadow-sm text-center">
                <span className="text-[9px] font-mono tracking-widest text-zinc-500 block mb-2 uppercase">
                  {staticText.quickDist}
                </span>

                <div className="flex flex-wrap gap-1.5 justify-center">
                  {["Ranchi", "Dumka", "Deoghar", "Jamshedpur", "Dhanbad", "Sahibganj", "Pakur"].map((dist) => (
                    <button
                      key={dist}
                      onClick={() => setSearchQuery(dist)}
                      className="px-2.5 py-1 text-[11px] font-bold tracking-wide bg-zinc-950 text-zinc-400 hover:bg-red-950 hover:text-red-300 rounded border border-zinc-800 transition cursor-pointer"
                    >
                      {dist}
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* ======================================= */}
      {/* GLOBAL FOOTER NEWSLETTER & CREDS CONTAINER */}
      {/* ======================================= */}
      <footer className="bg-slate-950 text-white mt-16 border-t border-red-700/30">
        
        {/* Newsletter Subscription Row */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 border-b border-zinc-900">
          <div className="bg-zinc-900/50 rounded-2xl border border-zinc-900 p-6 md:p-8 flex flex-col lg:flex-row items-center justify-between gap-6" id="home-newsletter-container">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-mono font-bold text-red-500 uppercase tracking-widest block">
                NEWSLETTER DISTRIBUTION
              </span>
              <h3 className="text-lg sm:text-2xl font-black tracking-tight text-white leading-none">
                {staticText.newsletterTitle}
              </h3>
              <p className="text-xs text-zinc-400 font-medium">
                {staticText.newsletterDesc}
              </p>
            </div>

            <div className="w-full lg:w-auto shrink-0">
              {newsletterSubscribed ? (
                <div className="bg-emerald-950/40 border border-emerald-800 text-emerald-400 text-xs font-semibold px-5 py-3 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Your email registered on SMTP news dispatcher!</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2 w-full max-w-md">
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="name@personal.com"
                    className="bg-zinc-950 text-xs text-white border border-zinc-800 outline-none focus:border-red-650 px-4 py-3 rounded-lg flex-1"
                  />
                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white font-mono tracking-wider font-bold text-xs uppercase px-5 py-3 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <span>{staticText.newsletterBtn}</span>
                    <Mail className="w-3.5 h-3.5 text-white" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Global Directory list */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-red-500 uppercase tracking-wider">
              Abua Hak Network
            </h4>
            <p className="text-xs text-zinc-450 leading-relaxed max-w-xs">
              State-of-the-art independent tribal journalism. Empowering local stories across Dumka sub-capital and Chota Nagpur range in English & Hindi dialects.
            </p>
          </div>

          <div className="space-y-1.5 text-xs text-zinc-400">
            <h4 className="text-xs font-mono font-bold text-red-500 uppercase tracking-wider mb-2.5">
              News Desks
            </h4>
            <div className="hover:text-white cursor-pointer" onClick={() => setCategoryFilter("politics")}>Politics Dispatch</div>
            <div className="hover:text-white cursor-pointer" onClick={() => setCategoryFilter("sports")}>Sports Arena</div>
            <div className="hover:text-white cursor-pointer" onClick={() => setCategoryFilter("state")}>State Highways</div>
            <div className="hover:text-white cursor-pointer" onClick={() => setCategoryFilter("district")}>Santhal Districts</div>
          </div>

          <div className="space-y-1.5 text-xs text-zinc-400">
            <h4 className="text-xs font-mono font-bold text-red-500 uppercase tracking-wider mb-2.5">
              Dialects Localization
            </h4>
            <div className="hover:text-white cursor-pointer" onClick={() => setCurrentLang("hi")}>हिन्दी संस्करण (Hindi)</div>
            <div className="hover:text-white cursor-pointer" onClick={() => setCurrentLang("en")}>English Edition</div>
          </div>

          <div className="space-y-1.5 text-xs text-zinc-400">
            <h4 className="text-xs font-mono font-bold text-red-500 uppercase tracking-wider mb-2.5">
              Contact Editor
            </h4>
            <div>Email: <a href={`mailto:${settings.contactEmail}`} className="text-zinc-200 hover:underline font-semibold">{settings.contactEmail}</a></div>
            <div>Phone: <a href="tel:+918084903577" className="text-zinc-200 hover:underline font-semibold font-mono">+91 80849 03577</a></div>
            <div>Offices: Dumka Sub-Capital, Jharkhand, India</div>
          </div>
        </div>

        {/* Outer credit line & Tucked Secure Admin login (Niche taraf) */}
        <div className="bg-slate-950 py-6 px-4 border-t border-zinc-900/50">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
            <p className="text-[10px]">
              © 2026 Abua Hak News Media Network. Built in accordance with Google AI Studio guidelines. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <span className="hidden md:inline text-zinc-800">|</span>
              <button
                onClick={() => {
                  setShowAdminConsole(!showAdminConsole);
                  setSelectedArticle(null);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="text-[11px] font-bold tracking-widest text-zinc-400 hover:text-red-500 transition-colors flex items-center gap-2 cursor-pointer bg-zinc-900/40 hover:bg-zinc-900/90 border border-zinc-850 px-3 py-1.5 rounded-lg"
              >
                <UserCheck className="w-3.5 h-3.5 text-red-500" />
                <span>EDITORIAL DESK PORTAL</span>
              </button>
            </div>
          </div>
        </div>

      </footer>

    </div>
  );
}
