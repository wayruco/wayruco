"use client";

// Test deployment workflow - December 31, 2025

import { useState, useEffect, useRef } from "react";
import { CyberneticScene } from "@/components/CyberneticScene";
import { NarrativeOverlay } from "@/components/NarrativeOverlay";
import { NavigationButtons } from "@/components/NavigationButtons";
import { WayruTimeline } from "@/components/WayruTimeline";
import { Footer } from "@/components/footer";

export default function Page() {
  const [phase, setPhase] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const autoProgressRef = useRef<NodeJS.Timeout | null>(null);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Auto-progress timeline (9 seconds per milestone = 189 seconds total for 21 milestones)
  useEffect(() => {
    if (reducedMotion || isPaused) {
      return;
    }

    const startTime = Date.now();
    const duration = 189000; // 189 seconds - 9 seconds per milestone

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = (elapsed % duration) / duration;
      
      // Linear easing for consistent milestone timing
      setPhase(progress);

      autoProgressRef.current = setTimeout(animate, 16); // ~60fps
    };

    animate();

    return () => {
      if (autoProgressRef.current) {
        clearTimeout(autoProgressRef.current);
      }
    };
  }, [reducedMotion, isPaused]);

  // Scroll-based control (overrides auto-progress temporarily)
  useEffect(() => {
    if (reducedMotion) return;

    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      // Clear auto-progress
      if (autoProgressRef.current) {
        clearTimeout(autoProgressRef.current);
      }

      // Calculate phase based on scroll
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPhase = Math.min(scrollY / Math.max(maxScroll, 1), 1);
      
      setPhase(scrollPhase);

      // If footer is visible (phase > 0.85), don't resume auto-progress - keep it paused
      if (scrollPhase > 0.85) {
        return;
      }

      // Resume auto-progress after scroll stops (only if footer not visible)
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const startTime = Date.now();
        const duration = 189000; // Match the 189 second duration

        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = ((elapsed % duration) / duration);
          
          setPhase(progress);
          autoProgressRef.current = setTimeout(animate, 16);
        };

        animate();
      }, 1000); // Resume after 1 second of no scrolling
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [reducedMotion]);

  return (
    <>
      <main className="relative w-full min-h-screen overflow-x-hidden bg-[#0a0e1a]">
        {/* Cybernetic Scene */}
        <div className="fixed inset-0 pointer-events-none">
          <CyberneticScene phase={phase} />
        </div>

        {/* Text Overlay */}
        <NarrativeOverlay phase={phase} />

        {/* Wayru Timeline */}
        <WayruTimeline 
          phase={phase} 
          onMilestoneSelect={(index) => setIsPaused(true)}
        />

        {/* Navigation Buttons */}
        <NavigationButtons />

        {/* Spacer for scroll functionality - with padding at bottom for footer */}
        <div className="h-[500vh] pb-32" />
      </main>
      <Footer phase={phase} />
    </>
  );
}
