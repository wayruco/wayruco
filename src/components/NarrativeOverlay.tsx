"use client";

interface NarrativeOverlayProps {
  phase: number;
}

export function NarrativeOverlay({ phase }: NarrativeOverlayProps) {
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

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* Text content - upper left, adjusted for timeline on right */}
      <div className="absolute top-20 left-12 max-w-md">
        <div className="backdrop-blur-sm bg-[#0a0e1a]/30 p-8 rounded-lg border border-cyan-500/10">
          <h1 
            className="text-7xl font-extrabold mb-2 text-[#00d9ff] transition-all duration-700"
            style={{ 
              fontFamily: "'Space Grotesk', sans-serif",
              textShadow: "0 0 30px rgba(0, 217, 255, 0.5)"
            }}
          >
            {content.title}
          </h1>
          <h2 
            className="text-3xl font-extrabold mb-6 text-[#4a9fb8] transition-all duration-700"
            style={{ 
              fontFamily: "'Space Grotesk', sans-serif",
              textShadow: "0 0 20px rgba(74, 159, 184, 0.3)"
            }}
          >
            {content.subtitle}
          </h2>
          <p 
            className="text-base leading-relaxed text-[#4a9fb8] transition-all duration-700"
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
        className="absolute bottom-24 left-12 transition-all duration-500"
        style={{
          opacity: phase < 0.05 ? 1 : Math.max(0.3, 1 - phase * 2),
          transform: phase < 0.05 ? 'translateY(0)' : `translateY(${phase * 20}px)`
        }}
      >
        <div 
          className="backdrop-blur-md bg-[#0a0e1a]/60 px-6 py-4 rounded-full border-2 border-cyan-500/30 shadow-lg shadow-cyan-500/20"
          style={{
            animation: phase < 0.02 ? 'pulse 3s ease-in-out infinite' : 'none'
          }}
        >
          <div className="flex items-center gap-4">
            <div className="w-7 h-12 rounded-full border-2 border-cyan-400/70 flex justify-center pt-2 bg-cyan-500/10">
              <div 
                className="w-2 h-4 bg-cyan-300 rounded-full animate-bounce shadow-lg shadow-cyan-300/50" 
                style={{
                  animationDuration: '2s',
                  animationIterationCount: 'infinite'
                }}
              />
            </div>
            <p 
              className="text-sm text-[#00d9ff] uppercase tracking-widest font-medium"
              style={{ 
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 500,
                letterSpacing: "0.15em",
                textShadow: "0 0 10px rgba(0, 217, 255, 0.3)"
              }}
            >
              Scroll to explore timeline
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
