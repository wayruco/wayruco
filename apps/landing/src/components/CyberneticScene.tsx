"use client";

interface CyberneticSceneProps {
  phase: number;
}

export function CyberneticScene({ phase }: CyberneticSceneProps) {
  // Calculate visual properties based on phase
  // Ship moves vertically based on milestone progress (phase)
  // Smoother tracking: -120px to +120px range as phase goes 0 to 1
  const shipY = (phase * 240) - 120 + Math.sin(Date.now() * 0.002) * 3;
  const shipRotate = Math.sin(Date.now() * 0.001) * 2 + (phase * 5);
  
  const riverOpacity = 1 - phase * 0.7;
  const particleDensity = 20 + Math.floor(phase * 80);
  const fogIntensity = 0.2 + phase * 0.6;
  
  // Color transition from cyan to icy blue
  const cyanAmount = 1 - phase;
  const icyAmount = phase;
  
  return (
    <div className="absolute inset-0 overflow-hidden perspective-[1000px]">
      {/* Fog/Vignette overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: `radial-gradient(ellipse at center, transparent 0%, rgba(10, 14, 26, ${fogIntensity}) 100%)`,
        }}
      />
      
      {/* Film grain */}
      <div 
        className="absolute inset-0 pointer-events-none z-20 mix-blend-overlay opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Digital River */}
      <div 
        className="absolute inset-x-0 bottom-0 h-full"
        style={{
          opacity: riverOpacity,
          transform: `translateZ(-200px) rotateX(60deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="relative w-full h-full">
          {/* Scanlines */}
          <div className="absolute inset-0 cyber-scanlines" />
          
          {/* Flowing data packets */}
          <div className="absolute inset-0 cyber-data-flow" />
          
          {/* Core glow */}
          <div 
            className="absolute left-1/2 top-0 w-1/3 h-full -translate-x-1/2"
            style={{
              background: `linear-gradient(to bottom, 
                rgba(0, ${Math.floor(217 * cyanAmount + 190 * icyAmount)}, ${Math.floor(255 * cyanAmount + 255 * icyAmount)}, 0.4) 0%, 
                rgba(0, ${Math.floor(217 * cyanAmount + 190 * icyAmount)}, ${Math.floor(255 * cyanAmount + 255 * icyAmount)}, 0.1) 100%)`,
              filter: 'blur(40px)',
            }}
          />
        </div>
      </div>
      
      {/* Ship */}
      <div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          transform: `translate(-50%, calc(-50% + ${shipY}px)) rotateZ(${shipRotate}deg)`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        <div className="relative w-32 h-40">
          {/* Beacon light */}
          <div 
            className="absolute -top-4 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#00d9ff] animate-pulse"
            style={{
              boxShadow: `0 0 20px rgba(0, 217, 255, ${0.8 + phase * 0.4}), 0 0 40px rgba(0, 217, 255, ${0.4 + phase * 0.2})`,
            }}
          />
          
          {/* Holographic sail */}
          <div 
            className="absolute left-1/2 top-4 -translate-x-1/2 w-16 h-24 backdrop-blur-sm"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 217, 255, 0.6) 0%, rgba(0, 217, 255, 0.3) 100%)',
              clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
              boxShadow: `0 0 30px rgba(0, 217, 255, ${0.5 + phase * 0.3})`,
              border: '1px solid rgba(0, 217, 255, 0.4)',
            }}
          />
          
          {/* Hull */}
          <div 
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-12 bg-[#1a1a2e]"
            style={{
              clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
              border: '1px solid rgba(74, 159, 184, 0.3)',
            }}
          />
          
          {/* Cabin */}
          <div 
            className="absolute bottom-3 left-1/2 -translate-x-1/2 w-12 h-8 bg-[#0a0e1a]"
            style={{
              border: '1px solid rgba(74, 159, 184, 0.4)',
            }}
          />
        </div>
      </div>
      
      {/* Abyss Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: particleDensity }).map((_, i) => {
          const x = (i * 37) % 100; // Pseudo-random distribution
          const y = (i * 73) % 100;
          const delay = (i * 0.05) % 3;
          const duration = 3 + (i % 3);
          
          return (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-[#00d9ff] animate-particle"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                opacity: 0.2 + phase * 0.4,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
                boxShadow: '0 0 4px rgba(0, 217, 255, 0.8)',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}