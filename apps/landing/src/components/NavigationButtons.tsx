"use client";

import { Github, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";

export function NavigationButtons() {
  const isMobile = useMediaQuery("(max-width: 480px)");
  const isTablet = useMediaQuery("(min-width: 481px) and (max-width: 768px)");

  // Responsive positioning and sizing
  const bottomPosition = isMobile ? "bottom-20" : isTablet ? "bottom-32" : "bottom-40";
  const rightPosition = isMobile ? "right-4" : isTablet ? "right-6" : "right-10";
  const gap = isMobile ? "gap-2" : "gap-4";
  const buttonSize = isMobile ? "sm" : "lg";
  const iconSize = isMobile ? "h-4 w-4" : "h-5 w-5";
  const textSize = isMobile ? "text-xs" : "text-xs";
  const showLabel = !isMobile;

  return (
    <div className={`fixed ${bottomPosition} ${rightPosition} flex ${gap} z-20 pointer-events-auto flex-col md:flex-row`}>
      <Button
        variant="outline"
        size={buttonSize}
        className="backdrop-blur-md bg-[#0a0e1a]/40 border-[#00d9ff]/30 text-[#00d9ff] hover:bg-[#00d9ff]/10 hover:border-[#00d9ff]/60 hover:scale-105 transition-all duration-200 hover:shadow-[0_0_20px_rgba(0,217,255,0.3)] w-full md:w-auto"
        onClick={() => window.open("https://github.com/wayruco/wayruco", "_blank")}
        title="GitHub"
      >
        <Github className={`${isMobile ? "mr-0" : "mr-2"} ${iconSize}`} />
        {showLabel && <span className="font-light tracking-wide uppercase text-xs">GitHub</span>}
      </Button>
      
      <Button
        variant="outline"
        size={buttonSize}
        className="backdrop-blur-md bg-[#0a0e1a]/40 border-[#00d9ff]/30 text-[#00d9ff] hover:bg-[#00d9ff]/10 hover:border-[#00d9ff]/60 hover:scale-105 transition-all duration-200 hover:shadow-[0_0_20px_rgba(0,217,255,0.3)] w-full md:w-auto"
        onClick={() => window.open("https://docs.wayru.co", "_blank")}
        title="Documentation"
      >
        <BookOpen className={`${isMobile ? "mr-0" : "mr-2"} ${iconSize}`} />
        {showLabel && <span className="font-light tracking-wide uppercase text-xs">Documentation</span>}
      </Button>
    </div>
  );
}
