export type LanguageType = "en" | "hi";

export interface LocalizedText {
  en: string;
  hi: string;
}

export interface Author {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio?: string;
}

export interface Comment {
  id: string;
  userName: string;
  userAvatar: string;
  content: string;
  publishedAt: string;
  likes: number;
}

export interface Article {
  id: string;
  title: LocalizedText;
  subtitle?: LocalizedText;
  content: LocalizedText;
  category: "all" | "politics" | "sports" | "entertainment" | "technology" | "health" | "education" | "business" | "state" | "district" | "opinion";
  subCategory?: string;
  author: Author;
  publishedAt: string;
  readingTime: number; // in minutes
  imageUrl: string;
  tags: string[];
  views: number;
  likes: number;
  videoUrl?: string; // YouTube or live stream URL
  breaking: boolean;
  live: boolean;
  trending: boolean;
  featured: boolean;
  comments?: Comment[];
  scheduledAt?: string;
}

export interface AdvisoryBanner {
  id: string;
  title: LocalizedText;
  link: string;
  type: "top_banner" | "sidebar_square" | "inline_rectangle";
  imageUrl: string;
  active: boolean;
  clicks: number;
}

export interface PollDefinition {
  id: string;
  question: LocalizedText;
  options: {
    id: string;
    text: LocalizedText;
    votes: number;
  }[];
  active: boolean;
  totalVotes: number;
}

export interface SiteSettings {
  siteName: string;
  contactEmail: string;
  adSenseClientId?: string;
  breakingNewsScrollSpeed: number; // seconds or px/s
  liveTvStreamUrl: string; // General Live stream YouTube embedded stream
}

export interface WeatherInfo {
  temp: number;
  condition: string;
  city: string;
  humidity: number;
}
