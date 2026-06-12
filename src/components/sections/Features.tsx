"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, Layers, LineChart, Globe } from "lucide-react";
import { useState, useEffect } from "react";


// ─── 1. Cross-Platform Sync Visual ──────────────────────────────────────────
function SyncVisual() {
  const [syncing, setSyncing] = useState(false);
  const [synced, setSynced] = useState(false);
  const [percent, setPercent] = useState(64);

  const triggerSync = () => {
    if (syncing) return;
    setSyncing(true);
    setSynced(false);
    
    // Simulate gradual sync percentage increase
    let current = 64;
    const interval = setInterval(() => {
      current += 6;
      if (current >= 92) {
        current = 92;
        clearInterval(interval);
        setSyncing(false);
        setSynced(true);
      }
      setPercent(current);
    }, 120);
  };

  return (
    <div className="h-44 w-full bg-surface border-[0.5px] border-border rounded-[8px] flex flex-col items-center justify-between p-4 relative overflow-hidden mt-6 shadow-inner group/sync">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, var(--color-text-primary) 1px, transparent 0)',
        backgroundSize: '16px 16px'
      }} />

      <div className="flex items-center gap-2 sm:gap-4 z-10 w-full justify-around max-w-sm flex-1">
        {/* Desktop Screen mockup */}
        <div className="w-24 sm:w-28 bg-card border-[0.5px] border-border rounded-[6px] p-2 flex flex-col gap-1.5 shadow-lg select-none">
          <div className="flex gap-1">
            <div className="w-1 h-1 rounded-full bg-fresh-low/60" />
            <div className="w-1 h-1 rounded-full bg-fresh-mid/60" />
            <div className="w-1 h-1 rounded-full bg-fresh-high/60" />
          </div>
          <div className="h-7 w-full bg-surface rounded-[4px] border-[0.5px] border-border flex items-center px-1.5 justify-between relative overflow-hidden">
            <div className={`absolute left-0 top-0 bottom-0 w-[2px] transition-colors duration-300 ${synced ? "bg-fresh-high" : "bg-fresh-mid"}`} />
            <span className="text-[7.5px] text-text-primary truncate font-medium max-w-[40px] sm:max-w-[50px]">React 19 internals</span>
            <span className="text-[6px] text-text-secondary font-mono transition-all duration-300">{percent}%</span>
          </div>
        </div>

        {/* Sync Indicator with spin action */}
        <div className="flex flex-col items-center gap-1.5 relative">
          <div className="flex gap-1 sm:gap-1.5 items-center">
            <div className="h-0.5 w-4 sm:w-6 bg-border relative overflow-hidden">
              {(syncing || !synced) && (
                <motion.div 
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                  className="absolute inset-y-0 left-0 w-2.5 bg-fresh-high"
                />
              )}
            </div>
            <button 
              onClick={triggerSync}
              className={`w-5 h-5 rounded-full border-[0.5px] flex items-center justify-center cursor-pointer transition-all duration-300 ${
                syncing 
                  ? "bg-fresh-high/10 border-fresh-high text-fresh-high animate-spin" 
                  : synced 
                  ? "bg-fresh-high/20 border-fresh-high text-fresh-high scale-105" 
                  : "bg-card border-border text-text-secondary hover:text-text-primary hover:border-text-secondary/40"
              }`}
              title="Force Sync"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-2.5 h-2.5">
                {synced && !syncing ? (
                  <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                ) : (
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8m0 0V3m0 5h5M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16m0 0v5m0-5h-5" strokeLinecap="round" strokeLinejoin="round" />
                )}
              </svg>
            </button>
            <div className="h-0.5 w-4 sm:w-6 bg-border relative overflow-hidden">
              {(syncing || !synced) && (
                <motion.div 
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "linear", delay: 0.6 }}
                  className="absolute inset-y-0 left-0 w-2.5 bg-fresh-high"
                />
              )}
            </div>
          </div>
          <span className={`text-[7px] sm:text-[8px] font-mono tracking-widest uppercase transition-colors duration-300 ${
            syncing 
              ? "text-fresh-high animate-pulse" 
              : synced 
              ? "text-fresh-high/80" 
              : "text-text-tertiary"
          }`}>
            {syncing ? "Syncing" : synced ? "Synced" : "Sync Shelf"}
          </span>
        </div>

        {/* Mobile Screen mockup */}
        <div className="w-[52px] sm:w-[64px] h-[72px] sm:h-20 bg-card border-[0.5px] border-border rounded-[8px] p-1.5 sm:p-2 flex flex-col gap-1 sm:gap-1.5 shadow-lg relative select-none">
          <div className="w-6 sm:w-8 h-0.5 sm:h-1 bg-border rounded-full mx-auto" />
          <div className="h-7 w-full bg-surface rounded-[4px] border-[0.5px] border-border flex flex-col justify-center px-1 sm:px-1.5 relative overflow-hidden mt-1 sm:mt-1.5">
            <div className={`absolute left-0 top-0 bottom-0 w-[2px] transition-colors duration-300 ${synced ? "bg-fresh-high" : "bg-fresh-mid"}`} />
            <span className="text-[6px] sm:text-[6.5px] text-text-primary truncate font-medium">React 19 internals</span>
            <span className="text-[5px] sm:text-[5.5px] text-text-secondary mt-0.5 font-sans font-mono transition-all duration-300">{percent}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 2. Smart Lists Visual ──────────────────────────────────────────────────
function SmartListsVisual() {
  const [filter, setFilter] = useState<"all" | "stale" | "quick">("all");

  const mockLinks = [
    { title: "React 19 Compiler", url: "react.dev", freshness: 0.92, readTime: 8 },
    { title: "Designing Atmospheric UI", url: "design.co", freshness: 0.45, readTime: 3 },
    { title: "REST APIs are dead", url: "backend.io", freshness: 0.12, readTime: 12 },
  ];

  const filteredLinks = mockLinks.filter((link) => {
    if (filter === "stale") return link.freshness < 0.33;
    if (filter === "quick") return link.readTime <= 4;
    return true;
  });

  return (
    <div className="h-44 w-full bg-surface border-[0.5px] border-border rounded-[8px] flex flex-col p-4 mt-6 overflow-hidden relative shadow-inner">
      {/* Controls */}
      <div className="flex gap-2 mb-3.5 justify-center z-10">
        {[
          { id: "all", label: "All Lists" },
          { id: "stale", label: "Stale Only" },
          { id: "quick", label: "Quick Reads" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as "all" | "stale" | "quick")}
            className={`px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider rounded-[4px] border-[0.5px] transition-all duration-200 cursor-pointer ${
              filter === tab.id
                ? "bg-text-primary text-background border-text-primary font-medium"
                : "bg-card text-text-secondary border-border hover:text-text-primary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List container */}
      <div className="flex flex-col gap-1.5 overflow-hidden w-full max-w-sm mx-auto z-10">
        {filteredLinks.map((link) => {
          const accentColor =
            link.freshness > 0.66
              ? "bg-fresh-high"
              : link.freshness > 0.33
              ? "bg-fresh-mid"
              : "bg-fresh-low";
          return (
            <motion.div
              layout
              key={link.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="h-8 w-full bg-card rounded-[6px] border-[0.5px] border-border flex items-center px-3 justify-between relative overflow-hidden"
            >
              <div className={`absolute left-0 top-0 bottom-0 w-[2px] ${accentColor}`} />
              <div className="flex flex-col text-left">
                <span className="text-[8px] text-text-primary font-medium truncate max-w-[150px]">{link.title}</span>
                <span className="text-[6px] text-text-secondary">{link.url}</span>
              </div>
              <span className="text-[6px] text-text-secondary font-mono">{link.readTime} min read</span>
            </motion.div>
          );
        })}
        {filteredLinks.length === 0 && (
          <div className="text-center text-[10px] text-text-tertiary py-4 font-light">No matching links on shelf.</div>
        )}
      </div>
    </div>
  );
}

// ─── 3. Reading Analytics Visual ────────────────────────────────────────────
function AnalyticsVisual() {
  const [hoveredSegment, setHoveredSegment] = useState<"fresh" | "fading" | "stale" | null>(null);

  const getTooltipText = () => {
    switch (hoveredSegment) {
      case "fresh":
        return "11 active links — full freshness, read now";
      case "fading":
        return "5 fading links — losing freshness, read within 3 days";
      case "stale":
        return "2 stale links — critical state, rots in 24 hours";
      default:
        return "Hover segments to inspect shelf health";
    }
  };

  return (
    <div className="h-44 w-full bg-surface border-[0.5px] border-border rounded-[8px] flex flex-col p-4 mt-6 overflow-hidden relative justify-center gap-3 shadow-inner select-none">
      {/* 3 Metric Cards */}
      <div className="grid grid-cols-3 gap-2 w-full max-w-sm mx-auto">
        <div className="bg-card border-[0.5px] border-border rounded-[6px] p-2 flex flex-col gap-0.5 text-left">
          <span className="text-[7px] font-mono uppercase tracking-wider text-text-secondary">Streak</span>
          <span className="text-[11px] font-bold text-text-primary mt-1">12 days</span>
        </div>
        
        <div className="bg-card border-[0.5px] border-border rounded-[6px] p-2 flex flex-col gap-0.5 text-left">
          <span className="text-[7px] font-mono uppercase tracking-wider text-text-secondary">Read</span>
          <span className="text-[11px] font-bold text-text-primary mt-1">142 links</span>
        </div>

        <div className="bg-card border-[0.5px] border-border rounded-[6px] p-2 flex flex-col gap-0.5 text-left">
          <span className="text-[7px] font-mono uppercase tracking-wider text-text-secondary">Active</span>
          <span className="text-[11px] font-bold text-text-primary mt-1">18 links</span>
        </div>
      </div>

      {/* Inbox Health Distribution */}
      <div className="bg-card border-[0.5px] border-border rounded-[6px] p-2.5 w-full max-w-sm mx-auto flex flex-col gap-2 text-left relative">
        <div className="flex justify-between items-center h-3">
          <span className="text-[7px] font-mono uppercase tracking-wider text-text-secondary">Inbox Health</span>
          <span className="text-[6.5px] font-mono text-text-tertiary truncate max-w-[170px] text-right font-light transition-all duration-200">
            {getTooltipText()}
          </span>
        </div>
        
        {/* Stacked Progress Bar */}
        <div className="h-2 w-full rounded-full bg-border/20 overflow-hidden flex cursor-pointer">
          <div 
            onMouseEnter={() => setHoveredSegment("fresh")}
            onMouseLeave={() => setHoveredSegment(null)}
            className={`h-full bg-fresh-high transition-all duration-200 ${
              hoveredSegment === "fresh" ? "brightness-110 scale-y-110" : hoveredSegment !== null ? "opacity-40" : ""
            }`}
            style={{ width: "60%" }} 
          />
          <div 
            onMouseEnter={() => setHoveredSegment("fading")}
            onMouseLeave={() => setHoveredSegment(null)}
            className={`h-full bg-fresh-mid transition-all duration-200 ${
              hoveredSegment === "fading" ? "brightness-110 scale-y-110" : hoveredSegment !== null ? "opacity-40" : ""
            }`} 
            style={{ width: "25%" }} 
          />
          <div 
            onMouseEnter={() => setHoveredSegment("stale")}
            onMouseLeave={() => setHoveredSegment(null)}
            className={`h-full bg-fresh-low transition-all duration-200 ${
              hoveredSegment === "stale" ? "brightness-110 scale-y-110" : hoveredSegment !== null ? "opacity-40" : ""
            }`} 
            style={{ width: "15%" }} 
          />
        </div>

        {/* Legend */}
        <div className="flex justify-between text-[7px] font-mono text-text-secondary">
          <div 
            onMouseEnter={() => setHoveredSegment("fresh")}
            onMouseLeave={() => setHoveredSegment(null)}
            className={`flex items-center gap-1 transition-opacity duration-200 ${hoveredSegment !== null && hoveredSegment !== "fresh" ? "opacity-40" : ""}`}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-fresh-high" />
            <span>Fresh (11)</span>
          </div>
          <div 
            onMouseEnter={() => setHoveredSegment("fading")}
            onMouseLeave={() => setHoveredSegment(null)}
            className={`flex items-center gap-1 transition-opacity duration-200 ${hoveredSegment !== null && hoveredSegment !== "fading" ? "opacity-40" : ""}`}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-fresh-mid" />
            <span>Fading (5)</span>
          </div>
          <div 
            onMouseEnter={() => setHoveredSegment("stale")}
            onMouseLeave={() => setHoveredSegment(null)}
            className={`flex items-center gap-1 transition-opacity duration-200 ${hoveredSegment !== null && hoveredSegment !== "stale" ? "opacity-40" : ""}`}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-fresh-low" />
            <span>Stale (2)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 4. Extension Workflow Visual ───────────────────────────────────────────
function ExtensionVisual() {
  const [saveTriggered, setSaveTriggered] = useState(false);
  const [animating, setAnimating] = useState(false);

  const triggerSave = () => {
    if (animating) return;
    setAnimating(true);
    setSaveTriggered(true);

    // Fade toast out after 3 seconds
    setTimeout(() => {
      setSaveTriggered(false);
      // Wait for exit transition
      setTimeout(() => {
        setAnimating(false);
      }, 500);
    }, 3000);
  };

  // Run automatically once on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimating(true);
      setSaveTriggered(true);

      setTimeout(() => {
        setSaveTriggered(false);
        setTimeout(() => {
          setAnimating(false);
        }, 500);
      }, 3000);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-44 w-full bg-surface border-[0.5px] border-border rounded-[8px] flex flex-col justify-center items-center p-4 mt-6 overflow-hidden relative shadow-inner">
      {/* Mock Browser Window */}
      <div className="w-full max-w-[250px] sm:max-w-xs bg-card border-[0.5px] border-border rounded-[6px] overflow-hidden shadow-lg flex flex-col">
        {/* Address bar */}
        <div className="bg-surface h-5 border-b border-border flex items-center px-2 gap-2 justify-between select-none">
          <div className="flex gap-0.5">
            <div className="w-1 h-1 rounded-full bg-fresh-low/30" />
            <div className="w-1 h-1 rounded-full bg-fresh-mid/30" />
            <div className="w-1 h-1 rounded-full bg-fresh-high/30" />
          </div>
          <div className="bg-card w-32 sm:w-40 h-3.5 rounded-[3px] border-[0.5px] border-border flex items-center px-1.5 justify-start">
            <span className="text-[5.5px] text-text-tertiary truncate">news.ycombinator.com/item?id=405...</span>
          </div>
          <button 
            onClick={triggerSave}
            className={`w-3 h-3 rounded-[2px] flex items-center justify-center transition-all ${
              saveTriggered 
                ? "bg-fresh-high text-background" 
                : "bg-fresh-high/10 border-[0.5px] border-fresh-high/30 text-fresh-high hover:bg-fresh-high/20 cursor-pointer"
            }`}
            title="Save Page"
          >
            <div className={`w-1 h-1 rounded-full ${saveTriggered ? "bg-background" : "bg-fresh-high"}`} />
          </button>
        </div>

        {/* Browser Page Body */}
        <div className="h-16 bg-surface p-2 flex flex-col gap-1 justify-center relative">
          {/* Key shortcut overlay trigger */}
          <button 
            onClick={triggerSave}
            className="absolute top-1 right-2 bg-card border-[0.5px] border-border hover:border-text-secondary/40 active:bg-surface rounded-[3px] px-1.5 py-0.5 flex gap-0.5 text-[5px] font-mono text-text-secondary cursor-pointer transition-all hover:text-text-primary"
            title="Press to trigger capture"
          >
            <span>⌘</span><span>Shift</span><span>L</span>
          </button>

          {/* Saved Toast slide-in animation */}
          <AnimatePresence>
            {saveTriggered && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 15, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="w-40 sm:w-48 bg-card border-[0.5px] border-border rounded-[4px] p-1.5 flex flex-col gap-0.5 relative overflow-hidden self-center shadow-lg text-left select-none"
              >
                <div className="absolute left-0 top-0 bottom-0 w-[1.5px] bg-fresh-high" />
                <span className="text-[6px] text-text-primary font-semibold truncate pl-1">✓ Saved to LinkShelf</span>
                <span className="text-[5px] text-text-secondary truncate pl-1">ycombinator.com &middot; just now &middot; 4 min read</span>
              </motion.div>
            )}
          </AnimatePresence>
          
          {!saveTriggered && (
            <span className="text-[6px] text-text-tertiary text-center font-mono animate-pulse">
              Click shortcut key to trigger save
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Features Component ────────────────────────────────────────────────
const features = [
  {
    icon: <Smartphone size={20} />,
    title: "Cross-Platform Sync",
    description: "Your shelf is everywhere. Instant, real-time sync across macOS, iOS, Android, and Web.",
    visual: <SyncVisual />
  },
  {
    icon: <Layers size={20} />,
    title: "Smart Lists",
    description: "Automatically categorize content by reading time, topic, or freshness level.",
    visual: <SmartListsVisual />
  },
  {
    icon: <LineChart size={20} />,
    title: "Reading Analytics",
    description: "Insight into your consumption habits. See exactly where your attention goes.",
    visual: <AnalyticsVisual />
  },
  {
    icon: <Globe size={20} />,
    title: "Extension Workflow",
    description: "Capture links instantly from any browser with a single shortcut.",
    visual: <ExtensionVisual />
  },
];

export function Features() {
  return (
    <section className="relative py-20 md:py-32 px-6 md:px-12 max-w-6xl mx-auto z-10 bg-background">
      <div className="text-center mb-16 md:mb-24">
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-text-primary">Engineered for focus.</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
            className="p-6 md:p-8 rounded-[12px] bg-card border-[0.5px] border-border hover:border-text-secondary/30 transition-all duration-300 group hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              <div className="mb-4 md:mb-6 inline-flex p-3 rounded-[8px] bg-surface border-[0.5px] border-border text-text-secondary group-hover:text-text-primary group-hover:border-text-secondary/30 transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg md:text-xl font-medium mb-3 md:mb-4 text-text-primary">{feature.title}</h3>
              <p className="text-text-secondary font-light leading-relaxed text-xs md:text-sm">
                {feature.description}
              </p>
            </div>
            {feature.visual}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
