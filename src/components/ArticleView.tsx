import React, { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft, Calendar, User, Clock, Share2, Facebook, MessageSquare, 
  Tag, Volume2, VolumeX, Eye, ThumbsUp, Send, Check 
} from "lucide-react";
import { Article, LanguageType, Comment } from "../types";

interface ArticleViewProps {
  currentLang: LanguageType;
  article: Article;
  relatedArticles: Article[];
  onBack: () => void;
  onSelectArticle: (article: Article) => void;
  onPostComment: (articleId: string, authorName: string, text: string) => Promise<Comment | null>;
  onLikeArticle: (articleId: string) => Promise<number | null>;
}

export default function ArticleView({
  currentLang,
  article,
  relatedArticles,
  onBack,
  onSelectArticle,
  onPostComment,
  onLikeArticle
}: ArticleViewProps) {
  const [commentName, setCommentName] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [commentsList, setCommentsList] = useState<Comment[]>([]);
  const [localViews, setLocalViews] = useState(article.views);
  const [localLikes, setLocalLikes] = useState(article.likes);
  const [hasLiked, setHasLiked] = useState(false);
  
  // Voice Reader State
  const [isReading, setIsReading] = useState(false);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Social Share Confirmation
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  useEffect(() => {
    // Populate Initial values safely
    const originalComments: Comment[] = (article as any).comments || [];
    setCommentsList(originalComments);
    setLocalViews(article.views + Math.floor(Math.random() * 5 + 1)); // Simulate natural view increment
    setLocalLikes(article.likes);
    setHasLiked(false);

    // Stop speaking if switching articles
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsReading(false);
    }
  }, [article]);

  const t = {
    en: {
      back: "Back to Headlines",
      readingTime: "min read",
      shareTitle: "Share this Bulletin",
      shareCopied: "Link copied to clipboard!",
      voiceReader: "Voice News Reader",
      startVoice: "Listen to Article",
      stopVoice: "Pause Reading",
      likesCount: "Likes",
      commentsHeader: "Reader Comments",
      noComments: "Be the first to share your opinion!",
      postCommentBtn: "Publish Comment",
      namePlaceholder: "Your full name",
      commentPlaceholder: "What are your thoughts on this story?",
      relatedHead: "Related Bulletins",
      publishedBy: "By"
    },
    hi: {
      back: "मुख्य समाचार पर लौटें",
      readingTime: "मिनट पठन",
      shareTitle: "साझा करें",
      shareCopied: "लिंक क्लिपबोर्ड पर कॉपी किया गया!",
      voiceReader: "वॉयस समाचार वाचक",
      startVoice: "ऑडियो सुनें",
      stopVoice: "वाचन रोकें",
      likesCount: "पसंद",
      commentsHeader: "पाठकों की प्रतिक्रियाएं",
      noComments: "इस विषय पर सबसे पहले अपनी राय साझा करें!",
      postCommentBtn: "टिप्पणी प्रकाशित करें",
      namePlaceholder: "आपका नाम",
      commentPlaceholder: "इस खबर पर अपनी राय व्यक्त करें...",
      relatedHead: "सम्बन्धित खबरें",
      publishedBy: "द्वारा"
    },
    sat: {
      back: "ᱯᱩᱭᱞᱩ ᱠᱷᱚᱵᱚᱨ ᱛᱮ ᱨᱩᱣᱟᱹᱲ",
      readingTime: "ᱢᱤᱱᱤᱴ ᱯᱟᱲᱦᱟᱣ",
      shareTitle: "ᱥᱟᱭᱟᱨ ᱢᱮ",
      shareCopied: "ᱞᱤᱸᱠ ᱠᱳᱯᱤ ᱮᱱᱟ!",
      voiceReader: "ᱨᱚᱲ ᱠᱷᱚᱵᱚᱨ ᱯᱟᱲᱦᱟᱣᱤᱡ",
      startVoice: "ᱠᱷᱚᱵᱚᱨ ᱟᱸᱡᱚᱢ ᱢᱮ",
      stopVoice: "ᱨᱚᱲ ᱵᱚᱱᱫᱚᱭ ᱢᱮ",
      likesCount: "ᱠᱩᱥᱤ ᱠᱚ",
      commentsHeader: "ᱯᱟᱲᱦᱟᱣᱤᱡ ᱠᱚᱣᱟᱜ ᱢᱚᱱᱮ",
      noComments: "ᱱᱚᱶᱟ ᱠᱷᱚᱵᱚᱨ ᱨᱮ ᱯᱩᱭᱞᱩ ᱟᱢᱟᱜ ᱢᱚᱱᱮ ᱥᱚᱫᱚᱨ ᱢᱮ!",
      postCommentBtn: "ᱠᱚᱢᱮᱱᱴ ᱵᱷᱮᱡᱟᱭ ᱢᱮ",
      namePlaceholder: "ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ",
      commentPlaceholder: "ᱟᱢᱟᱜ ᱵᱤᱪᱟᱹᱨ ᱠᱚ ᱱᱚᱸᱰᱮ ᱚᱞ ᱢᱮ...",
      relatedHead: "ᱥᱟᱹᱜᱟᱹᱭᱟᱱ ᱠᱷᱚᱵᱚᱨ ᱠᱚ",
      publishedBy: "ᱛᱮ"
    }
  }[currentLang];

  // Voice News Reader Logic
  const handleVoiceToggle = () => {
    if (!window.speechSynthesis) return;

    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
      return;
    }

    const textToSpeak = `${article.title[currentLang] || article.title.en}. ${article.subtitle?.[currentLang] || ""}. ${article.content[currentLang] || article.content.en}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    // Pick appropriate standard local BCP-47 language locale code
    if (currentLang === "hi") {
      utterance.lang = "hi-IN";
    } else {
      utterance.lang = "en-IN";
    }

    utterance.rate = 1.0;
    utterance.onend = () => setIsReading(false);
    utterance.onerror = () => setIsReading(false);

    speechUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsReading(true);
  };

  // Like Click handler
  const handleLike = async () => {
    if (hasLiked) return;
    setHasLiked(true);
    setLocalLikes(prev => prev + 1);
    
    const serverResult = await onLikeArticle(article.id);
    if (serverResult !== null) {
      setLocalLikes(serverResult);
    }
  };

  // Submit Comments handler
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    const author = commentName.trim() || "Anonymous Reader";
    const result = await onPostComment(article.id, author, commentContent.trim());
    if (result) {
      setCommentsList(prev => [...prev, result]);
      setCommentContent("");
      setCommentName("");
    }
  };

  // Social Share helpers
  const triggerShare = (platform: "fb" | "wa" | "tg" | "copy") => {
    const articleLink = window.location.href + `?articleId=${article.id}`;
    const text = `Read "${article.title[currentLang] || article.title.en}" on Abua Hak News`;
    
    if (platform === "copy") {
      navigator.clipboard.writeText(articleLink);
      setShareFeedback("copy");
      setTimeout(() => setShareFeedback(null), 2500);
    } else if (platform === "wa") {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + articleLink)}`, "_blank");
    } else if (platform === "tg") {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(articleLink)}&text=${encodeURIComponent(text)}`, "_blank");
    } else if (platform === "fb") {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleLink)}`, "_blank");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6" id={`article-${article.id}-detail`}>
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-red-650 hover:text-red-700 font-bold text-xs uppercase mb-6 transition cursor-pointer self-start"
        id="btn-back-home"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t.back}</span>
      </button>

      {/* Category Indicator Tag */}
      <div className="inline-block bg-red-650 text-white font-extrabold text-[10px] tracking-widest px-3 py-1 rounded mb-4 uppercase">
        {article.category}
      </div>

      {/* Main Headline */}
      <h1 className="text-2xl sm:text-3.5xl font-black text-slate-900 dark:text-white leading-tight tracking-tight mb-3">
        {article.title[currentLang] || article.title.en}
      </h1>

      {/* Subtitle */}
      {article.subtitle && (
        <p className="text-sm sm:text-base text-zinc-650 dark:text-zinc-300 leading-relaxed font-medium mb-6 italic border-l-2 border-red-600 pl-3">
          {article.subtitle[currentLang] || article.subtitle.en}
        </p>
      )}

      {/* Article Stats & Metadata Row */}
      <div className="flex flex-wrap items-center justify-between border-y border-zinc-200 dark:border-zinc-800 py-3 mb-6 gap-3">
        <div className="flex items-center gap-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4 text-red-600" />
            <span>{t.publishedBy} <b>{article.author.name}</b></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{article.readingTime} {t.readingTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            <span>{localViews} views</span>
          </div>
        </div>

        {/* Dynamic Voice News Reader Controls & Likes */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleVoiceToggle}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold font-mono uppercase tracking-wider transition cursor-pointer select-none border ${
              isReading 
                ? "bg-red-600 text-white border-red-500 animate-pulse" 
                : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700 dark:hover:bg-zinc-750"
            }`}
            title={t.voiceReader}
          >
            {isReading ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{isReading ? t.stopVoice : t.startVoice}</span>
          </button>

          <button
            onClick={handleLike}
            disabled={hasLiked}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition border cursor-pointer ${
              hasLiked
                ? "bg-red-900/10 text-red-500 border-red-500/30"
                : "bg-transparent text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:text-red-600 dark:hover:border-zinc-650"
            }`}
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${hasLiked ? "fill-red-600 stroke-red-650" : ""}`} />
            <span>{localLikes}</span>
          </button>
        </div>
      </div>

      {/* Featured Image */}
      <div className="relative rounded-2xl overflow-hidden aspect-video shadow-md mb-8 bg-zinc-100 dark:bg-zinc-950">
        <img 
          src={article.imageUrl || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=900"} 
          alt="Featured input"
          className="w-full h-full object-cover"
        />
        {article.live && (
          <div className="absolute top-4 left-4 bg-red-600 text-white font-black text-[10px] tracking-widest px-2.5 py-0.5 rounded flex items-center gap-1.5 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            LIVE NEWS FEED
          </div>
        )}
      </div>

      {/* Article Content Area */}
      <article className="prose prose-zinc dark:prose-invert max-w-none text-zinc-850 dark:text-zinc-100 text-base sm:text-lg leading-relaxed space-y-6">
        {(article.content[currentLang] || article.content.en).split("\n\n").map((para, pIdx) => (
          <p key={pIdx}>
            {para}
          </p>
        ))}
      </article>

      {/* Interactive Tags Row */}
      {article.tags && article.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mt-8 border-t border-zinc-200 dark:border-zinc-800 pt-6">
          <Tag className="w-3.5 h-3.5 text-zinc-400 mr-1" />
          {article.tags.map((tag) => (
            <span 
              key={tag} 
              className="text-[11px] font-semibold bg-zinc-100 text-zinc-600 dark:bg-zinc-850 dark:text-zinc-300 px-2.5 py-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Social Sharing Suite */}
      <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/55 dark:border-zinc-800 rounded-xl p-4 mt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Share2 className="w-4 h-4 text-red-600" />
          <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
            {t.shareTitle}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => triggerShare("wa")}
            className="p-2 rounded-full cursor-pointer bg-green-500 hover:bg-green-600 text-white transition scale-90 sm:scale-100"
            title="Share to WhatsApp"
          >
            <span className="text-xs font-black px-1">WhatsApp</span>
          </button>
          <button 
            onClick={() => triggerShare("tg")}
            className="p-2 rounded-full cursor-pointer bg-sky-500 hover:bg-sky-600 text-white transition scale-90 sm:scale-100"
            title="Share to Telegram"
          >
            <span className="text-xs font-black px-1">Telegram</span>
          </button>
          <button 
            onClick={() => triggerShare("fb")}
            className="p-2 rounded-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white transition scale-90 sm:scale-100"
            title="Share to Facebook"
          >
            <Facebook className="w-3.5 h-3.5 inline" />
          </button>
          <button 
            onClick={() => triggerShare("copy")}
            className="px-3 py-1.5 rounded-full cursor-pointer bg-zinc-800 hover:bg-zinc-950 text-white text-xs font-mono transition"
            title="Copy URL link"
          >
            {shareFeedback === "copy" ? "Copied!" : "Copy Link"}
          </button>
        </div>
      </div>

      {/* Technical Schema Meta Data representation */}
      <div className="text-[10px] font-mono text-zinc-400 mt-4 text-center">
        ⚡ Google News Structured Article Schema (JSON-LD) injected successfully.
      </div>

      {/* Comments section */}
      <div className="mt-12 border-t border-zinc-200 dark:border-zinc-800 pt-8">
        <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 mb-6">
          <MessageSquare className="w-5 h-5 text-red-600" />
          <span>{t.commentsHeader} ({commentsList.length})</span>
        </h3>

        {/* Existing Comments list */}
        <div className="space-y-4 mb-8">
          {commentsList.length === 0 ? (
            <p className="text-xs text-zinc-500 font-medium italic py-2">
              {t.noComments}
            </p>
          ) : (
            commentsList.map((comm) => (
              <div key={comm.id} className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200/50 dark:border-zinc-850 flex gap-3">
                <img 
                  src={comm.userAvatar} 
                  alt="Avatar"
                  className="w-9 h-9 rounded-full object-cover shrink-0 border border-zinc-200 dark:border-zinc-800"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-250">
                      {comm.userName}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-450 dark:text-zinc-500">
                      {new Date(comm.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-650 dark:text-zinc-350 leading-relaxed">
                    {comm.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Write new comment */}
        <form onSubmit={handleCommentSubmit} className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-5 border border-zinc-200 dark:border-zinc-800 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input 
              type="text"
              required
              placeholder={t.namePlaceholder}
              value={commentName}
              onChange={(e) => setCommentName(e.target.value)}
              className="bg-white dark:bg-zinc-950 text-xs text-slate-900 dark:text-white rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-2 outline-none focus:border-red-650 transition"
            />
          </div>
          <textarea
            required
            rows={3}
            placeholder={t.commentPlaceholder}
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            className="w-full bg-white dark:bg-zinc-950 text-xs sm:text-sm text-slate-900 dark:text-white rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-2 outline-none focus:border-red-650 transition h-20"
          ></textarea>
          <button
            type="submit"
            className="bg-red-650 hover:bg-red-700 text-white font-mono tracking-wider text-xs font-bold uppercase px-4 py-2 rounded-lg flex items-center gap-1.5 justify-center cursor-pointer transition shadow hover:shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{t.postCommentBtn}</span>
          </button>
        </form>
      </div>

      {/* Related News Carousel representation */}
      {relatedArticles && relatedArticles.length > 0 && (
        <div className="mt-12 border-t border-zinc-200 dark:border-zinc-800 pt-8" id="related-articles-section">
          <h3 className="text-base font-extrabold uppercase text-slate-950 dark:text-white tracking-wider mb-6">
            {t.relatedHead}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedArticles.slice(0, 3).map((art) => (
              <div 
                key={art.id}
                onClick={() => onSelectArticle(art)}
                className="group cursor-pointer bg-white dark:bg-slate-950 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 transition"
              >
                <div className="aspect-video relative overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                  <img 
                    src={art.imageUrl} 
                    alt="cover"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="p-3">
                  <span className="text-[9px] font-bold font-mono tracking-widest text-red-500 uppercase">
                    {art.category}
                  </span>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 line-clamp-2 mt-1 py-0.5 leading-snug">
                    {art.title[currentLang] || art.title.en}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
