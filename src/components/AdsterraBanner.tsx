import { useEffect, useRef } from "react";

interface AdsterraBannerProps {
  currentLang?: string;
}

export default function AdsterraBanner({ currentLang = "en" }: AdsterraBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any previous loading or stale contents
    containerRef.current.innerHTML = "";

    try {
      // 1. Assign atOptions globally for the script to read
      (window as any).atOptions = {
        key: "2f6871191b70f7601a6e1efee9727b01",
        format: "iframe",
        height: 90,
        width: 728,
        params: {}
      };

      // 2. Create the script element
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "https://www.highperformanceformat.com/2f6871191b70f7601a6e1efee9727b01/invoke.js";
      // We set async to true to make sure it doesn't block the page rendering
      script.async = true;

      // 3. Append script to the ad container DOM element
      containerRef.current.appendChild(script);
    } catch (err) {
      console.error("Error loading Adsterra ad:", err);
    }
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center my-6 px-4" id="adsterra-banner-container">
      <div className="w-full max-w-[728px] overflow-hidden rounded-xl border border-dashed border-red-500/25 bg-zinc-950/45 p-1 relative shadow-lg">
        {/* Ad Badge indicator */}
        <div className="flex justify-between items-center px-2 py-1 mb-1 border-b border-zinc-850">
          <span className="text-[9px] font-mono font-bold tracking-widest text-[#22C55E] flex items-center gap-1.5 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-red-650 animate-pulse"></span>
            {currentLang === "hi" ? "प्रायोजित विज्ञापन" : "SPONSORED ADVERTISEMENT"}
          </span>
          <span className="text-[8px] font-mono text-zinc-500">728 × 90</span>
        </div>

        {/* This element will house the dynamic ad frame loaded by the Script */}
        <div className="flex justify-center items-center overflow-x-auto min-h-[90px] w-full" id="adsterra-target-wrapper">
          <div 
            ref={containerRef} 
            className="w-[728px] h-[90px] bg-zinc-900/40 rounded flex items-center justify-center relative select-none"
          >
            {/* Soft fallback caption while loading */}
            <span className="absolute text-[11px] font-mono text-zinc-500 animate-pulse">
              {currentLang === "hi" ? "विज्ञापन लोड हो रहा है..." : "Loading premium dispatch..."}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
