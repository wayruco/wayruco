"use client";

import { useMediaQuery } from "@/hooks/use-media-query";

interface NarrativeOverlayProps {
  phase: number;
}

export function NarrativeOverlay({ phase }: NarrativeOverlayProps) {
  const isMobile = useMediaQuery("(max-width: 480px)");
  const isTablet = useMediaQuery("(min-width: 481px) and (max-width: 768px)");

  // Content changes based on phase
  const getContent = () => {
    if (phase < 0.2) {
      return {
        title: "Wayru",
        subtitle: "The Beginning",
        body: "March 2021 — A vision is born. Decentralized connectivity for the underserved. The ship sets sail into uncharted waters.",
      };
    } else if (phase < 0.4) {
      return {
        title: "Building",
        subtitle: "Foundation & Funding",
        body: "From concept to reality. Co-founders unite, accelerators embrace the vision, and $1.96M fuels the mission forward.",
      };
    } else if (phase < 0.6) {
      return {
        title: "Deploying",
        subtitle: "Genesis Hardware",
        body: "Monte Sinaí, Ecuador becomes the proving ground. AirBlocks NFTs launch. The network begins to breathe.",
      };
    } else if (phase < 0.8) {
      return {
        title: "Expanding",
        subtitle: "DePIN Recognition",
        body: "Wayru WiFi 3.0 emerges. The world takes notice. Decentralized infrastructure finds its champion.",
      };
    } else {
      return {
        title: "Legacy",
        subtitle: "1,000 Prometheus Miners",
        body: "November 2025 — The Foundation donates 1,000 outdoor miners. The mission transcends the company. The code lives on.",
      };
    }
  };

  const content = getContent();

  // Responsive sizing
  const titleSize = isMobile ? "text-4xl" : isTablet ? "text-5xl" : "text-7xl";
  const subtitleSize = isMobile ? "text-lg" : isTablet ? "text-2xl" : "text-3xl";
  const bodySize = isMobile ? "text-xs" : isTablet ? "text-sm" : "text-base";
  const padding = isMobile ? "p-4" : isTablet ? "p-6" : "p-8";
  const topPosition = isMobile ? "top-4" : isTablet ? "top-8" : "top-20";
  const leftPosition = isMobile ? "left-4" : isTablet ? "left-8" : "left-12";
  const maxWidth = isMobile ? "max-w-xs" : isTablet ? "max-w-sm" : "max-w-md";

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* Text content - responsive positioning and sizing */}
      <div className={`absolute ${topPosition} ${leftPosition} ${maxWidth}`}>
        <div className={`backdrop-blur-sm bg-[#0a0e1a]/30 ${padding} rounded-lg border border-cyan-500/10`}>
          <h1 
            className={`${titleSize} font-extrabold mb-2 text-[#00d9ff] transition-all duration-700`}
            style={{ 
              fontFamily: "'Space Grotesk', sans-serif",
              textShadow: "0 0 30px rgba(0, 217, 255, 0.5)"
            }}
          >
            {content.title}
          </h1>
          <h2 
            className={`${subtitleSize} font-extrabold mb-6 text-[#4a9fb8] transition-all duration-700`}
            style={{ 
              fontFamily: "'Space Grotesk', sans-serif",
              textShadow: "0 0 20px rgba(74, 159, 184, 0.3)"
            }}
          >
            {content.subtitle}
          </h2>
          <p 
            className={`${bodySize} leading-relaxed text-[#4a9fb8] transition-all duration-700`}
            style={{ 
              fontFamily: "'JetBrains Mono', monospace",
              lineHeight: "1.6"
            }}
          >
            {content.body}
          </p>
        </div>
      </div>

      {/* Scroll indicator - bottom left - more visible when not scrolling */}
      <div 
        className={`absolute ${isMobile ? "bottom-4 left-4" : isTablet ? "bottom-8 left-8" : "bottom-24 left-12"} transition-all duration-500`}
        style={{
          opacity: phase < 0.05 ? 1 : Math.max(0.3, 1 - phase * 2),
          transform: phase < 0.05 ? 'translateY(0)' : `translateY(${phase * 20}px)`
        }}
      >
        <div 
          className={`backdrop-blur-md bg-[#0a0e1a]/60 ${isMobile ? "px-3 py-2" : "px-6 py-4"} rounded-full border-2 border-cyan-500/30 shadow-lg shadow-cyan-500/20`}
          style={{
            animation: phase < 0.02 ? 'pulse 3s ease-in-out infinite' : 'none'
          }}
        >
          <div className={`flex items-center ${isMobile ? "gap-2" : "gap-4"}`}>
            <div className={`${isMobile ? "w-5 h-10" : "w-7 h-12"} rounded-full border-2 border-cyan-400/70 flex justify-center pt-2 bg-cyan-500/10`}>
              <div 
                className={`${isMobile ? "w-1.5 h-3" : "w-2 h-4"} bg-cyan-300 rounded-full animate-bounce shadow-lg shadow-cyan-300/50`}
                style={{
                  animationDuration: '2s',
                  animationIterationCount: 'infinite'
                }}
              />
            </div>
            <p 
              className={`${isMobile ? "text-xs" : "text-sm"} text-[#00d9ff] uppercase tracking-widest font-medium whitespace-nowrap`}
              style={{ 
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 500,
                letterSpacing: "0.15em",
                textShadow: "0 0 10px rgba(0, 217, 255, 0.3)"
              }}
            >
              {isMobile ? "Scroll" : "Scroll to explore timeline"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
