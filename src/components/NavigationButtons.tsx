"use client";

import { Github, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NavigationButtons() {
  return (
    <div className="fixed bottom-40 right-10 flex gap-4 z-20 pointer-events-auto">
      <Button
        variant="outline"
        size="lg"
        className="backdrop-blur-md bg-[#0a0e1a]/40 border-[#00d9ff]/30 text-[#00d9ff] hover:bg-[#00d9ff]/10 hover:border-[#00d9ff]/60 hover:scale-105 transition-all duration-200 hover:shadow-[0_0_20px_rgba(0,217,255,0.3)]"
        onClick={() => window.open("https://github.com/wayruco/wayruco", "_blank")}
      >
        <Github className="mr-2 h-5 w-5" />
        <span className="font-light tracking-wide uppercase text-xs">GitHub</span>
      </Button>
      
      <Button
        variant="outline"
        size="lg"
        className="backdrop-blur-md bg-[#0a0e1a]/40 border-[#00d9ff]/30 text-[#00d9ff] hover:bg-[#00d9ff]/10 hover:border-[#00d9ff]/60 hover:scale-105 transition-all duration-200 hover:shadow-[0_0_20px_rgba(0,217,255,0.3)]"
        onClick={() => window.open("https://docs.wayru.co", "_blank")}
      >
        <BookOpen className="mr-2 h-5 w-5" />
        <span className="font-light tracking-wide uppercase text-xs">Documentation</span>
      </Button>
    </div>
  );
}
