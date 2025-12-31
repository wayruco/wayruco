"use client";

import { useEffect, useState, useRef } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { playMilestoneSound } from "@/lib/sounds";

interface TimelineEvent {
  date: string;
  title: string;
  summary: string;
  category: "Founding" | "Funding" | "Product" | "Deployment" | "Ecosystem" | "Foundation" | "Media";
  proofLinks: { label: string; url: string; type: "primary" | "secondary" }[];
}

interface Founder {
  name: string;
  role: string;
  proofUrl: string;
}

const founders: Founder[] = [
  {
    name: "Charvel Chedraui",
    role: "Founder & CEO",
    proofUrl: "https://www.linkedin.com/in/charvelchedraui",
  },
  {
    name: "Paula Ceballos",
    role: "Co-founder & CCO/CMO",
    proofUrl: "https://theorg.com/org/wayru/org-chart/paula-ceballos",
  },
  {
    name: "Edward Calderón",
    role: "Co-founder & CTO",
    proofUrl: "https://edcalderon.github.io/",
  },
];

const timelineEvents: TimelineEvent[] = [
  {
    date: "2021-03",
    title: "Idea Conceived",
    summary: "Wayru's concept is born — decentralized connectivity for underserved communities.",
    category: "Founding",
    proofLinks: [{ label: "Medium", url: "https://medium.com/@wayrunetwork", type: "secondary" }],
  },
  {
    date: "2021-04",
    title: "Landing Page Launch",
    summary: "First public presence established to gauge community interest.",
    category: "Founding",
    proofLinks: [{ label: "Medium", url: "https://medium.com/@wayrunetwork", type: "secondary" }],
  },
  {
    date: "2021-05",
    title: "Lite Paper Released",
    summary: "Initial vision document outlining the decentralized WiFi network concept.",
    category: "Product",
    proofLinks: [{ label: "Medium", url: "https://medium.com/@wayrunetwork", type: "secondary" }],
  },
  {
    date: "2021-06",
    title: "Officially Founded",
    summary: "Wayru is formally established as a startup after early traction.",
    category: "Founding",
    proofLinks: [
      { label: "Refresh Miami", url: "https://refreshmiami.com/news/with-1-96m-in-tow-wayru-spearheads-strategy-to-bring-internet-to-underserved-communities/", type: "primary" },
    ],
  },
  {
    date: "2021-09",
    title: "Team Formation",
    summary: "Co-founders Paula Ceballos and Edward Calderón join the mission.",
    category: "Founding",
    proofLinks: [
      { label: "Forbes Ecuador", url: "https://www.forbes.com.ec/innovacion/la-startup-wayru-festeja-levantamiento-us-196-millones-n16187", type: "primary" },
    ],
  },
  {
    date: "2021-11",
    title: "Algorand Accelerator",
    summary: "Selected into the Algorand blockchain accelerator program.",
    category: "Ecosystem",
    proofLinks: [{ label: "Medium", url: "https://medium.com/@wayrunetwork", type: "secondary" }],
  },
  {
    date: "2021-12",
    title: "Genesis Hardware Announced",
    summary: "Early PR push describing the project and upcoming Genesis hardware.",
    category: "Product",
    proofLinks: [{ label: "Bitcoin PR Buzz", url: "https://bitcoinprbuzz.com/", type: "primary" }],
  },
  {
    date: "2022-02",
    title: "Monte Sinaí Pilot",
    summary: "First pilot deployment in Monte Sinaí, Ecuador — real-world validation.",
    category: "Deployment",
    proofLinks: [{ label: "Medium", url: "https://medium.com/@wayrunetwork", type: "secondary" }],
  },
  {
    date: "2022-04",
    title: "AirBlocks NFT Launch",
    summary: "Launch of AirBlocks NFT collection for network participation.",
    category: "Product",
    proofLinks: [{ label: "Medium", url: "https://medium.com/@wayrunetwork", type: "secondary" }],
  },
  {
    date: "2022-05-20",
    title: "$1.96M Seed Round",
    summary: "Seed funding led by Borderless Capital to scale the mission.",
    category: "Funding",
    proofLinks: [
      { label: "Forbes Ecuador", url: "https://www.forbes.com.ec/innovacion/la-startup-wayru-festeja-levantamiento-us-196-millones-n16187", type: "primary" },
      { label: "Ledger Insights", url: "https://www.ledgerinsights.com/", type: "primary" },
      { label: "Tracxn", url: "https://tracxn.com/d/companies/wayru/__g3IiQelz3chGTCE_4Z8ULEaMO8O0ylcwPWz75RUySwc", type: "secondary" },
    ],
  },
  {
    date: "2022-06",
    title: "Presale Whitelist",
    summary: "Genesis device presale whitelist opened to the community.",
    category: "Product",
    proofLinks: [{ label: "Medium", url: "https://medium.com/@wayrunetwork", type: "secondary" }],
  },
  {
    date: "2022-08-09",
    title: "Genesis Presale Live",
    summary: "Genesis device and hotspot pool tokens presale goes public.",
    category: "Product",
    proofLinks: [
      { label: "ACCESS Newswire", url: "https://www.accessnewswire.com/", type: "primary" },
      { label: "BeInCrypto", url: "https://beincrypto.com/how-wayru-is-bringing-people-together-with-blockchain/", type: "secondary" },
    ],
  },
  {
    date: "2022-10",
    title: "Quito Network Build",
    summary: "Physical network deployment begins in Quito — fiber build and testnet.",
    category: "Deployment",
    proofLinks: [{ label: "Medium", url: "https://medium.com/@wayrunetwork", type: "secondary" }],
  },
  {
    date: "2023-11-01",
    title: "Wayru WiFi 3.0",
    summary: "Major platform update with enhanced features and capabilities.",
    category: "Product",
    proofLinks: [{ label: "Medium", url: "https://medium.com/@wayrunetwork", type: "primary" }],
  },
  {
    date: "2024-02-03",
    title: "DePIN Recognition",
    summary: "Wayru recognized as a leading decentralized ISP with WayruOS.",
    category: "Ecosystem",
    proofLinks: [{ label: "aVenture", url: "https://aventure.vc/", type: "secondary" }],
  },
  {
    date: "2024-08-22",
    title: "We Are DePIN Podcast",
    summary: "Charvel Chedraui discusses tokenizing a global WiFi network.",
    category: "Media",
    proofLinks: [
      { label: "Podcast", url: "https://shows.acast.com/we-are-depin/episodes/tokenising-a-global-wifi-network-charvel-chedraui-wayru-netw", type: "primary" },
    ],
  },
  {
    date: "2024-08-26",
    title: "DePIN Hub Feature",
    summary: "Industry analysis highlights Wayru's AirBlocks and token incentives model.",
    category: "Ecosystem",
    proofLinks: [{ label: "DePIN Hub", url: "https://depinhub.io/", type: "secondary" }],
  },
  {
    date: "2025-09-04",
    title: "White Paper Update",
    summary: "Updated documentation reflecting evolved vision and technology.",
    category: "Product",
    proofLinks: [{ label: "Wayru Docs", url: "https://docs.wayru.io/", type: "primary" }],
  },
  {
    date: "2025-11-24",
    title: "1,000 Prometheus Miners",
    summary: "Wayru Foundation donates 1,000 outdoor Wi-Fi miners to expand coverage.",
    category: "Foundation",
    proofLinks: [
      { label: "X (Twitter)", url: "https://x.com/wayrunetwork", type: "primary" },
      { label: "DePIN Digest", url: "https://depindigest.com/", type: "secondary" },
    ],
  },
  {
    date: "2025-12-01",
    title: "Wayru Inc. Shutdown",
    summary: "Wayru Inc. officially winds down operations. The mission transitions to open source.",
    category: "Foundation",
    proofLinks: [
      { label: "Wayru Network", url: "https://x.com/wayrunetwork", type: "primary" },
    ],
  },
  {
    date: "2025-12-01",
    title: "Wayruco Open Source Begins",
    summary: "The code lives on. Wayruco launches as a community-driven open source project.",
    category: "Founding",
    proofLinks: [
      { label: "GitHub", url: "https://github.com/wayruco", type: "primary" },
      { label: "Wayruco Docs", url: "https://wayru.co/", type: "primary" },
    ],
  },
];

const categoryColors: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  Founding: { bg: "bg-emerald-500/20", border: "border-emerald-400/50", text: "text-emerald-300", glow: "rgba(52, 211, 153, 0.5)" },
  Funding: { bg: "bg-amber-500/20", border: "border-amber-400/50", text: "text-amber-300", glow: "rgba(251, 191, 36, 0.5)" },
  Product: { bg: "bg-cyan-500/20", border: "border-cyan-400/50", text: "text-cyan-300", glow: "rgba(34, 211, 238, 0.5)" },
  Deployment: { bg: "bg-purple-500/20", border: "border-purple-400/50", text: "text-purple-300", glow: "rgba(168, 85, 247, 0.5)" },
  Ecosystem: { bg: "bg-blue-500/20", border: "border-blue-400/50", text: "text-blue-300", glow: "rgba(59, 130, 246, 0.5)" },
  Foundation: { bg: "bg-rose-500/20", border: "border-rose-400/50", text: "text-rose-300", glow: "rgba(244, 63, 94, 0.5)" },
  Media: { bg: "bg-indigo-500/20", border: "border-indigo-400/50", text: "text-indigo-300", glow: "rgba(99, 102, 241, 0.5)" },
};

interface WayruTimelineProps {
  phase: number;
  onMilestoneSelect?: (index: number) => void;
}

export function WayruTimeline({ phase, onMilestoneSelect }: WayruTimelineProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [prevIndex, setPrevIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isManuallySelected, setIsManuallySelected] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showFoundersModal, setShowFoundersModal] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Responsive breakpoints
  const isMobile = useMediaQuery("(max-width: 480px)");
  const isTablet = useMediaQuery("(min-width: 481px) and (max-width: 768px)");

  // Responsive sizing
  const timelineWidth = isMobile ? "w-full" : isTablet ? "w-[350px]" : "w-[420px]";
  const timelinePosition = isMobile ? "bottom-0 left-0 right-0 h-[60vh]" : "right-0 top-0 h-screen";
  const timelineGradient = isMobile 
    ? "bg-gradient-to-t from-[#0a0e1a]/95 via-[#0a0e1a]/80 to-transparent" 
    : "bg-gradient-to-l from-[#0a0e1a]/95 via-[#0a0e1a]/80 to-transparent";
  const timelineTopOffset = isMobile ? "top-0" : "top-[220px]";
  const timelineBottomOffset = isMobile ? "bottom-0" : "bottom-40";

  useEffect(() => {
    // Only show timeline when user has scrolled (phase > 0.01)
    if (phase > 0.01 && !hasScrolled) {
      setHasScrolled(true);
    }
  }, [phase, hasScrolled]);

  useEffect(() => {
    // Show timeline once scrolling has started
    setIsVisible(hasScrolled);
  }, [hasScrolled]);

  useEffect(() => {
    // Better tracking: map phase to milestone index more precisely
    // Each milestone gets equal scroll space
    const eventIndex = Math.round(phase * (timelineEvents.length - 1));
    setActiveIndex(Math.min(Math.max(eventIndex, 0), timelineEvents.length - 1));
  }, [phase]);

  useEffect(() => {
    // Play sound ONLY when milestone is manually selected (not on auto-animation)
    if (isManuallySelected && soundEnabled) {
      playMilestoneSound();
      setIsManuallySelected(false);
    }
  }, [selectedIndex, soundEnabled]);

  useEffect(() => {
    // Auto-scroll timeline to current milestone
    if (timelineRef.current && activeIndex > 0) {
      const currentElement = timelineRef.current.querySelector(`[data-milestone="${activeIndex}"]`);
      if (currentElement) {
        currentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [activeIndex]);

  const handleMilestoneClick = (index: number) => {
    const event = timelineEvents[index];
    
    // If it's a Foundation category event, show founders modal
    if (event.category === "Foundation") {
      setShowFoundersModal(true);
    }
    
    setSelectedIndex(index);
    setIsManuallySelected(true);
    playMilestoneSound();
    // Notify parent component that a milestone was selected
    if (onMilestoneSelect) {
      onMilestoneSelect(index);
    }
  };

  const getProgressToNextMilestone = () => {
    // Calculate progress within current milestone (0 to 1)
    const eventIndex = Math.round(phase * (timelineEvents.length - 1));
    const segmentSize = 1 / (timelineEvents.length - 1);
    const segmentStart = eventIndex * segmentSize;
    const segmentEnd = (eventIndex + 1) * segmentSize;
    const progressInSegment = (phase - segmentStart) / (segmentEnd - segmentStart);
    return Math.max(0, Math.min(1, progressInSegment));
  };

  const getProgressForMilestone = (index: number) => {
    // Get progress bar width for a specific milestone
    if (index < activeIndex) return 100; // Past milestones are full
    if (index === activeIndex) return getProgressToNextMilestone() * 100; // Current milestone shows progress
    return 0; // Future milestones are empty
  };

  const formatDate = (dateStr: string) => {
    const parts = dateStr.split("-");
    const year = parts[0];
    const month = parts[1] ? new Date(2000, parseInt(parts[1]) - 1).toLocaleString("en", { month: "short" }) : "";
    const day = parts[2] || "";
    return { year, month, day };
  };

  return (
    <>
      <div 
        className={`fixed ${timelinePosition} ${timelineWidth} z-20 pointer-events-auto transition-all duration-700 ${
          isVisible ? "opacity-100 translate-x-0 translate-y-0" : "opacity-0 translate-x-20 translate-y-20 pointer-events-none"
        }`}
      >
        {/* Gradient overlay for blending */}
        <div className={`absolute inset-0 ${timelineGradient} pointer-events-none`} />
        
        <div className="relative h-full overflow-hidden">
          {/* Sound Toggle Button */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="absolute top-4 right-4 z-20 p-2 rounded-lg bg-[#0a0e1a]/60 border border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-300 group"
            title={soundEnabled ? "Disable sound" : "Enable sound"}
          >
            {soundEnabled ? (
              <svg className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.26 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-500 group-hover:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13399899,1.16151496 C3.34915502,0.9 2.40734225,0.9 1.77946707,1.4429026 C0.994623095,2.0766017 0.837654326,3.1659 1.15159189,3.9513869 L3.03521743,10.3923799 C3.03521743,10.5494773 3.19218622,10.7065747 3.50612381,10.7065747 L16.6915026,11.4920616 C16.6915026,11.4920616 17.1624089,11.4920616 17.1624089,12.0349652 C17.1624089,12.5778688 16.6915026,12.4744748 16.6915026,12.4744748 Z" />
              </svg>
            )}
          </button>

        {/* Header with Founders - Only visible at Team Formation milestone (index 4) */}
        <div 
          className={`absolute top-0 left-0 right-0 p-6 z-10 transition-all duration-500 ${
            activeIndex === 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          <div className="backdrop-blur-md bg-[#0a0e1a]/60 rounded-xl p-4 border border-cyan-500/20">
            <h3 
              className="text-lg font-bold text-cyan-400 mb-3 tracking-wide"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              WAYRU FOUNDERS
            </h3>
            <div className="space-y-2">
              {founders.map((founder, i) => (
                <a
                  key={i}
                  href={founder.proofUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 group hover:bg-cyan-500/10 rounded-lg p-2 transition-all duration-300"
                >
                  <div 
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold"
                    style={{ boxShadow: "0 0 15px rgba(0, 217, 255, 0.3)" }}
                  >
                    {founder.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium group-hover:text-cyan-300 transition-colors">
                      {founder.name}
                    </p>
                    <p className="text-cyan-500/70 text-xs">{founder.role}</p>
                  </div>
                  <svg className="w-4 h-4 text-cyan-500/50 group-hover:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div 
          ref={timelineRef}
          className={`absolute ${timelineTopOffset} ${timelineBottomOffset} left-0 right-0 overflow-y-auto scrollbar-hide ${isMobile ? "px-2" : "px-4"}`}
          style={{ 
            maskImage: isMobile 
              ? "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)"
              : "linear-gradient(to bottom, transparent 0%, black 5%, black 85%, transparent 100%)",
            WebkitMaskImage: isMobile 
              ? "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)"
              : "linear-gradient(to bottom, transparent 0%, black 5%, black 85%, transparent 100%)"
          }}
        >
          {/* Auto-scroll to current milestone */}
          {timelineRef.current && (
            <script>{`
              const scrollContainer = document.querySelector('[data-timeline-scroll]');
              if (scrollContainer) {
                const currentNode = scrollContainer.querySelector('[data-milestone-current]');
                if (currentNode) {
                  currentNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }
            `}</script>
          )}
          {/* Timeline line */}
          <div className={`absolute ${isMobile ? "left-4" : "left-8"} top-0 bottom-0 w-[2px] bg-gradient-to-b from-cyan-500/50 via-cyan-400/30 to-cyan-500/50`} />
          
          {/* Events */}
          <div className="relative space-y-4 pb-16">
            {timelineEvents.map((event, index) => {
              const { year, month, day } = formatDate(event.date);
              const colors = categoryColors[event.category];
              const isActive = index <= activeIndex;
              const isCurrent = isManuallySelected ? index === selectedIndex : index === activeIndex;
              const isSelected = index === selectedIndex;
              const isHovered = hoveredIndex === index;
              
              return (
                <div
                  key={index}
                  data-milestone={index}
                  onClick={() => handleMilestoneClick(index)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`relative pl-12 transition-all duration-500 cursor-pointer group ${
                    isActive ? "opacity-100" : "opacity-40"
                  } ${
                    // Add extra margin for last few cards to avoid footer overlap
                    index >= timelineEvents.length - 3 ? "mb-8" : ""
                  }`}
                >
                  {/* Timeline node with progress indicator */}
                  <div 
                    className={`absolute ${isMobile ? "left-[14px]" : "left-[22px]"} top-3 w-4 h-4 rounded-full border-2 transition-all duration-500 ${
                      isCurrent 
                        ? `${colors.border} scale-125` 
                        : isActive 
                          ? `${colors.border} ${colors.bg}` 
                          : "border-gray-600 bg-gray-800"
                    } ${isSelected ? colors.bg : "bg-[#0a0e1a]"} ${
                      isHovered && !isCurrent ? `${colors.border} scale-110` : ""
                    }`}
                    style={{
                      boxShadow: isCurrent 
                        ? `0 0 20px ${colors.glow}, 0 0 40px ${colors.glow}` 
                        : isHovered 
                          ? `0 0 15px ${colors.glow}` 
                          : "none"
                    }}
                  >
                    {isCurrent && !isSelected && (
                      <>
                        <div className="absolute inset-0 rounded-full animate-ping opacity-50" style={{ backgroundColor: colors.glow }} />
                        {/* Progress ring */}
                        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gray-700" opacity="0.3" />
                          <circle 
                            cx="12" 
                            cy="12" 
                            r="10" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="0.5" 
                            className={colors.text}
                            strokeDasharray={`${getProgressToNextMilestone() * 62.83} 62.83`}
                            style={{ transition: 'stroke-dasharray 0.1s linear' }}
                          />
                        </svg>
                      </>
                    )}
                  </div>

                  {/* Event card */}
                  <div 
                    className={`backdrop-blur-sm rounded-lg ${isMobile ? "p-2" : "p-3"} border transition-all duration-500 relative overflow-hidden ${
                      isCurrent 
                        ? `bg-[#0a0e1a]/80 ${colors.border} shadow-lg` 
                        : isSelected
                          ? `bg-[#0a0e1a]/70 ${colors.border} shadow-md`
                          : "bg-[#0a0e1a]/40 border-gray-700/30"
                    } ${
                      isHovered && !isCurrent && !isSelected
                        ? `hover:${colors.border} hover:bg-[#0a0e1a]/60 hover:shadow-lg transform hover:scale-[1.02]`
                        : "hover:border-cyan-400/50 hover:bg-[#0a0e1a]/60"
                    } ${
                      event.category === "Foundation" ? "hover:cursor-pointer" : ""
                    }`}
                    style={{
                      boxShadow: isCurrent 
                        ? `0 4px 30px ${colors.glow}` 
                        : isSelected
                          ? `0 2px 20px ${colors.glow}`
                          : isHovered
                            ? `0 2px 15px ${colors.glow}`
                            : "none"
                    }}
                  >
                    {/* Progress bar - shows time to next milestone */}
                    <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-t-lg transition-all duration-100" style={{ width: `${getProgressForMilestone(index)}%` }} />
                    
                    {/* Date and Category */}
                    <div className={`flex items-center ${isMobile ? "flex-col gap-1 items-start" : "justify-between"} mb-2`}>
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-400 text-xs font-mono">
                          {month} {day && `${day},`} {year}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${colors.bg} ${colors.text} ${colors.border} border`}>
                          {event.category}
                        </span>
                        {event.category === "Foundation" && (
                          <span className="text-[10px] text-cyan-400/70 animate-pulse">
                            👥 Click for founders
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title */}
                    <h4 
                      className={`font-bold mb-1 transition-colors ${isMobile ? "text-sm" : "text-base"} ${isCurrent ? "text-white" : "text-gray-300"}`}
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {event.title}
                    </h4>

                    {/* Summary */}
                    <p 
                      className={`${isMobile ? "text-[10px]" : "text-xs"} text-gray-400 mb-2 leading-relaxed`}
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {event.summary}
                    </p>

                    {/* Proof links */}
                    <div className="flex flex-wrap gap-1">
                      {event.proofLinks.map((link, linkIndex) => (
                        <a
                          key={linkIndex}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] transition-all hover:scale-105 ${
                            link.type === "primary" 
                              ? "bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30" 
                              : "bg-gray-700/30 text-gray-400 hover:bg-gray-700/50"
                          }`}
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer - Timeline range - Only show at final milestone */}
        <div 
          className={`absolute ${isMobile ? "bottom-0 left-0 right-0" : "bottom-4 left-0 right-0"} p-4 transition-all duration-500 ${
            activeIndex === timelineEvents.length - 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          <div className={`backdrop-blur-md bg-[#0a0e1a]/60 rounded-lg ${isMobile ? "p-2" : "p-3"} border border-cyan-500/20`}>
            <div className={`flex items-center ${isMobile ? "flex-col gap-2" : "justify-between"} text-xs`}>
              <span className="text-cyan-500/70 font-mono text-[10px]">2021-03</span>
              <div className={`${isMobile ? "w-full" : "flex-1 mx-4"} h-1 bg-gray-800 rounded-full overflow-hidden`}>
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${phase * 100}%` }}
                />
              </div>
              <span className="text-cyan-500/70 font-mono text-[10px]">2025-11</span>
            </div>
            <p className={`text-center ${isMobile ? "text-[9px]" : "text-[10px]"} text-gray-500 mt-2`}>
              Journey complete — Wayru's mission continues
            </p>
          </div>
        </div>
        </div>
      </div>

      {/* Founders Modal */}
      {showFoundersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowFoundersModal(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-[#0a0e1a]/95 border border-cyan-500/30 rounded-xl p-8 max-w-md mx-4 backdrop-blur-md">
            {/* Close Button */}
            <button
              onClick={() => setShowFoundersModal(false)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Header */}
            <div className="mb-6">
              <h2 
                className="text-2xl font-bold text-cyan-400 mb-2"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Wayru Founders
              </h2>
              <p className="text-gray-400 text-sm">
                The visionaries who started the decentralized connectivity mission
              </p>
            </div>

            {/* Founders List */}
            <div className="space-y-4">
              {founders.map((founder, i) => (
                <div
                  key={i}
                  className="group p-4 rounded-lg bg-gray-800/30 border border-gray-700/50 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-lg font-bold flex-shrink-0"
                      style={{ boxShadow: "0 0 20px rgba(0, 217, 255, 0.3)" }}
                    >
                      {founder.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold group-hover:text-cyan-300 transition-colors">
                        {founder.name}
                      </h3>
                      <p className="text-cyan-500/70 text-sm">{founder.role}</p>
                      <a
                        href={founder.proofUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-2 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View Profile
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="mt-6 pt-4 border-t border-gray-700/50">
              <p className="text-xs text-gray-500 text-center">
                These founders laid the groundwork for decentralized internet access
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
