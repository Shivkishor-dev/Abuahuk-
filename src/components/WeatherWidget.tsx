import React, { useState } from "react";
import { CloudRain, Sun, Cloud, Thermometer, Wind, RefreshCw } from "lucide-react";
import { LanguageType } from "../types";

interface WeatherWidgetProps {
  currentLang: LanguageType;
}

const REGIONAL_WEATHER: Record<string, { temp: number; humidity: number; wind: string; hi: string; sat: string; en: string }> = {
  Dumka: {
    temp: 31,
    humidity: 78,
    wind: "12 km/h",
    en: "Scattered Clouds",
    hi: "आंशिक रूप से बादल",
    sat: "ᱥᱟᱨᱟ ᱫᱷᱟᱹᱨᱛᱤ ᱨᱮ ᱨᱤᱢᱤᱞ"
  },
  Ranchi: {
    temp: 28,
    humidity: 62,
    wind: "10 km/h",
    en: "Clear Skies",
    hi: "अत्यंत सुहावना मौसम",
    sat: "ᱯᱷᱟᱨᱪᱟ ᱥᱮᱨᱢᱟ"
  },
  Deoghar: {
    temp: 33,
    humidity: 55,
    wind: "8 km/h",
    en: "Sunny and Dry",
    hi: "धूप खिली है",
    sat: "ᱥᱤᱛᱩᱝ ᱫᱤᱱ"
  },
  Jamshedpur: {
    temp: 34,
    humidity: 82,
    wind: "14 km/h",
    en: "Humid & Cloudy",
    hi: "उमस और बादल",
    sat: "ᱩᱫᱽᱜᱟᱹᱨ ᱟᱨ ᱨᱤᱢᱤᱞ"
  },
  Dhanbad: {
    temp: 32,
    humidity: 70,
    wind: "11 km/h",
    en: "Light Rain showers",
    hi: "हल्की बारिश",
    sat: "ᱡᱟᱹᱯᱩᱫ ᱡᱟᱹᱨᱤ"
  }
};

export default function WeatherWidget({ currentLang }: WeatherWidgetProps) {
  const [selectedCity, setSelectedCity] = useState("Dumka");
  const [loading, setLoading] = useState(false);

  const t = {
    en: {
      title: "JHARKHAND WEATHER",
      humidity: "Humidity",
      wind: "Wind Speed",
      updated: "Updated Just Now"
    },
    hi: {
      title: "झारखंड मौसम",
      humidity: "आर्द्रता",
      wind: "हवा की गति",
      updated: "अभी-अभी अपडेट किया गया"
    },
    sat: {
      title: "ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱦᱚᱭᱼᱦᱤᱥᱤᱫ",
      humidity: "ᱫᱟᱜ ᱨᱮᱭᱟᱜ ᱦᱟᱹᱴᱤᱧ",
      wind: "ᱦᱚᱭ ᱨᱮᱭᱟᱜ ᱛᱟᱹᱯᱤᱥ",
      updated: "ᱛᱮᱦᱮᱧ ᱜᱮ ᱧᱮᱞ ᱟᱠᱟᱱᱟ"
    }
  }[currentLang];

  const cityLabel = {
    Dumka: { en: "Dumka (Capital)", hi: "दुमका (उपराजधानी)", sat: "ᱫᱩᱢᱠᱟᱹ" },
    Ranchi: { en: "Ranchi (Capital)", hi: "रांची (राजधानी)", sat: "ᱨᱟᱺᱪᱤ" },
    Deoghar: { en: "Deoghar (Holy Town)", hi: "देवघर (तीर्थस्थल)", sat: "ᱫᱮᱣᱜᱷᱚᱨ" },
    Jamshedpur: { en: "Jamshedpur", hi: "जमशेदपुर", sat: "ᱡᱟᱢᱥᱮᱫᱽᱯᱩᱨ" },
    Dhanbad: { en: "Dhanbad", hi: "धनबाद", sat: "ᱫᱷᱟᱱᱵᱟᱫᱽ" }
  }[selectedCity][currentLang];

  const info = REGIONAL_WEATHER[selectedCity];

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  const getWeatherIcon = (cond: string) => {
    if (cond.includes("Rain")) return <CloudRain className="w-8 h-8 text-blue-400 animate-pulse" />;
    if (cond.includes("Sunny") || cond.includes("Clear")) return <Sun className="w-8 h-8 text-yellow-500 animate-spin-slow" />;
    return <Cloud className="w-8 h-8 text-zinc-400" />;
  };

  return (
    <div className="bg-slate-900 border border-zinc-800 text-white rounded-xl p-4 shadow-md hover:border-zinc-700 transition" id="weather-widget">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-3">
        <span className="text-[10px] font-mono tracking-wider font-extrabold text-red-500 uppercase flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
          {t.title}
        </span>
        <button 
          onClick={handleRefresh}
          className={`${loading ? "animate-spin" : ""} text-zinc-500 hover:text-white transition cursor-pointer p-0.5`}
          title="Refresh forecast"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center justify-between mb-3">
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="bg-zinc-800 text-xs font-bold text-white rounded px-2 py-1 outline-none border border-zinc-700 focus:border-red-600 transition"
        >
          <option value="Dumka">Dumka</option>
          <option value="Ranchi">Ranchi</option>
          <option value="Deoghar">Deoghar</option>
          <option value="Jamshedpur">Jamshedpur</option>
          <option value="Dhanbad">Dhanbad</option>
        </select>

        <span className="text-xs text-zinc-400 font-medium">
          {cityLabel}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {getWeatherIcon(info.en)}
          <div>
            <div className="text-2xl font-bold font-mono tracking-tight flex items-start">
              <span>{info.temp}</span>
              <span className="text-xs text-red-500 font-extrabold">°C</span>
            </div>
            <div className="text-xs text-zinc-300 font-medium">
              {info[currentLang] || info.en}
            </div>
          </div>
        </div>

        <div className="text-right text-[10px] text-zinc-400 space-y-1">
          <div className="flex items-center justify-end gap-1">
            <Thermometer className="w-3 h-3 text-red-500" />
            <span>{t.humidity}: <b className="font-mono text-zinc-200">{info.humidity}%</b></span>
          </div>
          <div className="flex items-center justify-end gap-1">
            <Wind className="w-3 h-3 text-blue-400" />
            <span>{t.wind}: <b className="font-mono text-zinc-200">{info.wind}</b></span>
          </div>
        </div>
      </div>

      <div className="text-[9px] font-mono text-zinc-500 mt-3 text-center border-t border-zinc-800/50 pt-2">
        {t.updated}
      </div>
    </div>
  );
}
