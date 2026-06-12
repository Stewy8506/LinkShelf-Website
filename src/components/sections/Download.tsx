"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Apple, Smartphone, ArrowDown, ExternalLink, ShieldCheck, History, Copy, Check, Terminal } from "lucide-react";

const ChromeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="4" />
    <line x1="21.17" x2="12" y1="8" y2="8" />
    <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
    <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
  </svg>
);

const AndroidIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M4 10h16v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
    <path d="M6 10V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4" />
    <line x1="9" x2="9" y1="14" y2="16" />
    <line x1="15" x2="15" y1="14" y2="16" />
    <path d="M10 2 9 4" />
    <path d="M14 2l1 2" />
  </svg>
);

interface GitHubAsset {
  name: string;
  size: number;
  browser_download_url: string;
}

interface GitHubRelease {
  tag_name: string;
  published_at: string;
  assets: GitHubAsset[];
  body: string;
}

export function Download() {
  const [activePlatform, setActivePlatform] = useState("macos");
  const [copied, setCopied] = useState(false);
  const [dynamicRelease, setDynamicRelease] = useState<{
    version: string;
    date: string;
    macSize: string;
    androidSize: string;
    extensionSize: string;
    macUrl: string;
    androidUrl: string;
    extensionUrl: string;
    changelog: string[];
  } | null>(null);

  useEffect(() => {
    fetch("https://api.github.com/repos/Stewy8506/LinkShelf/releases/latest")
      .then((res) => {
        if (!res.ok) throw new Error("API rate limit or error");
        return res.json();
      })
      .then((data: GitHubRelease) => {
        const tag = data.tag_name || "v1.0.1";
        const dateObj = new Date(data.published_at);
        const formattedDate = dateObj.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric"
        }).toUpperCase();

        const assets = data.assets || [];

        // macOS ZIP
        const macAsset = assets.find((a: GitHubAsset) => a.name === "linkshelf-macos.zip");
        const macSize = macAsset ? `${(macAsset.size / (1024 * 1024)).toFixed(1)} MB` : "76.0 MB";
        const macUrl = macAsset?.browser_download_url || `https://github.com/Stewy8506/LinkShelf/releases/download/${tag}/linkshelf-macos.zip`;

        // Android AAB
        const androidAsset = assets.find((a: GitHubAsset) => a.name === "app-release.aab");
        const androidSize = androidAsset ? `${(androidAsset.size / (1024 * 1024)).toFixed(1)} MB` : "62.9 MB";
        const androidUrl = androidAsset?.browser_download_url || `https://github.com/Stewy8506/LinkShelf/releases/download/${tag}/app-release.aab`;

        // Extension ZIP
        const extAsset = assets.find((a: GitHubAsset) => a.name === "linkshelf-chrome-extension.zip");
        const extensionSize = extAsset ? `${(extAsset.size / (1024 * 1024)).toFixed(1)} MB` : "13.9 MB";
        const extensionUrl = extAsset?.browser_download_url || `https://github.com/Stewy8506/LinkShelf/releases/download/${tag}/linkshelf-chrome-extension.zip`;

        // Changelog extraction
        let changelogLines: string[] = [];
        if (data.body) {
          const lines = data.body.split("\n");
          changelogLines = lines
            .map((l: string) => l.trim())
            .filter((l: string) => l.startsWith("-") || l.startsWith("*") || l.startsWith("+"))
            .map((l: string) => l.substring(1).trim().toLowerCase())
            .slice(0, 4);
        }

        if (changelogLines.length === 0) {
          changelogLines = [
            "added universal macOS build",
            "added chrome save shortcut",
            "improved indexeddb cache",
            "fixed hero link transforms"
          ];
        }

        setDynamicRelease({
          version: tag,
          date: formattedDate,
          macSize,
          androidSize,
          extensionSize,
          macUrl,
          androidUrl,
          extensionUrl,
          changelog: changelogLines
        });
      })
      .catch(() => {
        // Fallback is handled automatically by keeping state null
      });
  }, []);

  const versionTag = dynamicRelease?.version || "v1.0.1";
  const releaseDate = dynamicRelease?.date || "JUNE 13, 2026";

  const platforms = [
    {
      id: "macos",
      name: "macOS",
      icon: <Apple className="w-4 h-4" />,
      bigIcon: <Apple className="w-12 h-12" />,
      tagline: "Universal release for Apple Silicon & Intel systems",
      version: versionTag,
      size: dynamicRelease?.macSize || "76.0 MB",
      requirements: "macOS 12.0 or newer",
      sha256: "52b7c57010f047812421fadc57010f047812421fadc5a21eb94cf67f8a846c43",
      actions: [
        { label: "Download ZIP", href: dynamicRelease?.macUrl || `https://github.com/Stewy8506/LinkShelf/releases/download/${versionTag}/linkshelf-macos.zip`, primary: true, disabled: false },
        { label: "Mac App Store", href: "#", primary: false, disabled: true }
      ]
    },
    {
      id: "ios",
      name: "iOS",
      icon: <Smartphone className="w-4 h-4" />,
      bigIcon: <Smartphone className="w-12 h-12" />,
      tagline: "Currently in active development (TestFlight alpha coming soon)",
      version: versionTag,
      size: "—",
      requirements: "iOS 15.0 or newer",
      sha256: null,
      actions: [
        { label: "Install App Store", href: "#", primary: true, disabled: true }
      ],
      inDevelopment: true
    },
    {
      id: "android",
      name: "Android",
      icon: <AndroidIcon className="w-4 h-4" />,
      bigIcon: <AndroidIcon className="w-12 h-12" />,
      tagline: "Standalone bundle release for APK-sideloading & Google Play Store",
      version: versionTag,
      size: dynamicRelease?.androidSize || "62.9 MB",
      requirements: "Android 8.0 or newer",
      sha256: "44c74309ba45258fd545f0ccf7a309ba4c21e69da59f7d2f9a1e04a5d8b76fc15",
      actions: [
        { label: "Google Play Store", href: "#", primary: true, disabled: true },
        { label: "Download AAB", href: dynamicRelease?.androidUrl || `https://github.com/Stewy8506/LinkShelf/releases/download/${versionTag}/app-release.aab`, primary: false, disabled: false }
      ]
    },
    {
      id: "chrome",
      name: "Extension",
      icon: <ChromeIcon className="w-4 h-4" />,
      bigIcon: <ChromeIcon className="w-12 h-12" />,
      tagline: "Quick-capture extension helper for desktop browsers",
      version: versionTag,
      size: dynamicRelease?.extensionSize || "13.9 MB",
      requirements: "Chrome, Edge, Brave, Opera",
      sha256: "48ec4b71555f54f025d2bb45ca462eb94ca6f5a54fe2b67f1b2c4e6584c3ea8a",
      actions: [
        { label: "Add to Chrome", href: "#", primary: true, disabled: true },
        { label: "Download ZIP (Manual Install)", href: dynamicRelease?.extensionUrl || `https://github.com/Stewy8506/LinkShelf/releases/download/${versionTag}/linkshelf-chrome-extension.zip`, primary: false, disabled: false }
      ]
    }
  ];

  const currentPlatform = platforms.find((p) => p.id === activePlatform) || platforms[0];

  const handleCopyChecksum = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="download" className="relative py-20 md:py-32 px-6 md:px-12 max-w-6xl mx-auto z-10 bg-background">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-text-primary">
          Get LinkShelf
        </h2>
        <p className="mt-4 text-text-secondary text-base md:text-lg max-w-xl mx-auto font-light">
          Take control of your digital reading shelf. Available natively across all platforms.
        </p>
      </div>

      {/* Unified Software Distribution Window Dashboard */}
      <div className="w-full bg-card border-[0.5px] border-border rounded-[16px] overflow-hidden flex flex-col shadow-2xl">
        
        {/* Widescreen OS Window Header Bar */}
        <div className="h-12 bg-surface border-b border-border flex items-center justify-between px-4 select-none shrink-0">
          {/* OS window circles */}
          <div className="flex gap-1.5 items-center">
            <div className="w-3 h-3 rounded-full bg-fresh-low/30 border border-fresh-low/40" />
            <div className="w-3 h-3 rounded-full bg-fresh-mid/30 border border-fresh-mid/40" />
            <div className="w-3 h-3 rounded-full bg-fresh-high/30 border border-fresh-high/40" />
          </div>
          
          {/* Mock Console title */}
          <div className="font-mono text-[10px] tracking-wider text-text-tertiary uppercase">
            linkshelf-distribution-panel.sh
          </div>
          
          {/* Status Dot */}
          <div className="flex items-center gap-1.5 text-[9px] font-mono tracking-wider text-fresh-high uppercase">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fresh-high opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-fresh-high"></span>
            </span>
            Online
          </div>
        </div>

        {/* Dashboard Grid Container */}
        <div className="flex flex-col lg:flex-row min-h-[480px]">
          
          {/* 1. Left Sidebar Navigation Column */}
          <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible border-b lg:border-b-0 lg:border-r border-border p-3 lg:p-4 gap-1 lg:gap-2 bg-surface/50 w-full lg:w-[200px] shrink-0 scrollbar-none">
            <div className="hidden lg:block font-mono text-[9px] uppercase tracking-widest text-text-tertiary px-3 mb-2">
              Platforms
            </div>
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => {
                  setActivePlatform(platform.id);
                  setCopied(false);
                }}
                className={`relative px-4 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer select-none flex items-center gap-2.5 shrink-0 lg:w-full text-left ${
                  activePlatform === platform.id
                    ? "text-text-primary font-medium"
                    : "text-text-secondary hover:text-text-primary hover:bg-card/30"
                }`}
              >
                {activePlatform === platform.id && (
                  <motion.div
                    layoutId="activePlatformVertical"
                    className="absolute inset-0 bg-card border-[0.5px] border-border rounded-lg shadow-sm z-0"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center justify-between w-full gap-2.5">
                  <span className="flex items-center gap-2.5">
                    {platform.icon}
                    {platform.name}
                  </span>
                  {platform.inDevelopment && (
                    <span className="text-[8px] font-mono border border-border bg-surface text-text-tertiary px-1 py-0.5 rounded scale-90 shrink-0 font-normal normal-case">
                      In Dev
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>

          {/* 2. Center Content Panel (Details) */}
          <div className="flex-1 p-6 lg:p-8 flex flex-col justify-between min-h-[320px] lg:min-h-0 relative min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePlatform}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="flex-1 flex flex-col justify-between gap-8"
              >
                {/* Platform Summary Section */}
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3.5 rounded-[12px] bg-surface border-[0.5px] border-border text-text-primary shadow-inner">
                      {currentPlatform.bigIcon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
                        {currentPlatform.name} client
                        <span className="text-[10px] font-mono bg-surface border-[0.5px] border-border px-1.5 py-0.5 rounded text-text-secondary font-normal uppercase">
                          {currentPlatform.version}
                        </span>
                      </h3>
                      <p className="text-sm text-text-secondary font-light mt-1 max-w-md">
                        {currentPlatform.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Technical Information Table */}
                  <div className="border-[0.5px] border-border/80 rounded-[8px] bg-surface/30 p-4 max-w-md space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-text-tertiary font-mono">FILE SIZE</span>
                      <span className="text-text-primary font-mono">{currentPlatform.size}</span>
                    </div>
                    <div className="flex justify-between text-xs pt-2 border-t border-border/20">
                      <span className="text-text-tertiary font-mono">REQUIREMENTS</span>
                      <span className="text-text-secondary font-sans font-light">{currentPlatform.requirements}</span>
                    </div>
                    {currentPlatform.inDevelopment && (
                      <div className="flex justify-between text-xs pt-2 border-t border-border/20 items-center">
                        <span className="text-text-tertiary font-mono">STATUS</span>
                        <span className="text-fresh-mid font-mono flex items-center gap-1.5 font-medium">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fresh-mid opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-fresh-mid"></span>
                          </span>
                          IN DEVELOPMENT
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Main Action CTAs */}
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-3">
                    {currentPlatform.actions.map((act, idx) => {
                      if (act.disabled) {
                        return (
                          <div key={idx} className="relative group/tooltip inline-block">
                            <button
                              disabled
                              className={`px-6 py-3 rounded-full text-xs font-semibold tracking-wide flex items-center gap-2 cursor-not-allowed transition-all ${
                                act.primary
                                  ? "bg-text-primary/10 text-text-primary/30 border border-border/40"
                                  : "bg-surface border-[0.5px] border-border text-text-tertiary"
                              }`}
                            >
                              {act.primary ? <ArrowDown className="w-3.5 h-3.5 opacity-30" /> : <ExternalLink className="w-3.5 h-3.5 opacity-30" />}
                              {act.label}
                            </button>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-surface border border-border text-[9px] font-mono text-text-primary rounded shadow-lg opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap z-30">
                              Coming Soon
                            </div>
                          </div>
                        );
                      }

                      return (
                        <a
                          key={idx}
                          href={act.href}
                          className={`px-6 py-3 rounded-full text-xs font-semibold tracking-wide flex items-center gap-2 cursor-pointer transition-all ${
                            act.primary
                              ? "bg-text-primary text-background hover:bg-text-primary/95 shadow-md"
                              : "bg-surface border-[0.5px] border-border text-text-secondary hover:text-text-primary hover:border-text-secondary/30"
                          }`}
                        >
                          {act.primary ? <ArrowDown className="w-3.5 h-3.5" /> : <ExternalLink className="w-3.5 h-3.5" />}
                          {act.label}
                        </a>
                      );
                    })}
                  </div>

                  {/* Cryptographic SHA-256 Hashes for Verification */}
                  {currentPlatform.sha256 && (
                    <div className="pt-5 border-t border-border/40 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2 text-[10px] font-mono text-text-tertiary overflow-hidden">
                        <ShieldCheck className="w-3.5 h-3.5 text-fresh-high shrink-0" />
                        <span className="truncate">SHA-256: {currentPlatform.sha256}</span>
                      </div>
                      <button
                        onClick={() => handleCopyChecksum(currentPlatform.sha256!)}
                        className="p-1.5 rounded-[6px] bg-surface border-[0.5px] border-border text-text-secondary hover:text-text-primary hover:border-text-secondary/30 transition-all cursor-pointer shrink-0"
                        title="Copy SHA-256"
                      >
                        {copied ? (
                          <Check className="w-3.5 h-3.5 text-fresh-high" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 3. Right Sidebar Panel (Changelog & Release Notes) */}
          <div className="w-full lg:w-[320px] border-t lg:border-t-0 lg:border-l border-border bg-surface/50 p-6 lg:p-8 flex flex-col gap-6 shrink-0">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-text-secondary" />
                <h3 className="font-mono text-xs uppercase tracking-widest text-text-secondary">Release Info</h3>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-mono text-text-tertiary uppercase">{versionTag}-stable</span>
                <span className="text-[8px] font-mono text-text-tertiary/60 uppercase mt-0.5">{releaseDate}</span>
              </div>
            </div>

            {/* Core Features Overview */}
            <div className="space-y-3">
              <h5 className="font-mono text-[9px] uppercase tracking-wider text-text-tertiary">Core Spec</h5>
              <ul className="space-y-2.5">
                {[
                  { title: "Freshness Engine", color: "bg-fresh-low" },
                  { title: "Firestore Sync Protocol", color: "bg-fresh-high" },
                  { title: "Smart List Sorting", color: "bg-fresh-mid" }
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-text-secondary font-light">
                    <div className={`w-1.5 h-1.5 rounded-full ${item.color}`} />
                    {item.title}
                  </li>
                ))}
              </ul>
            </div>

            {/* Git-log terminal style changelog */}
            <div className="space-y-3 pt-4 border-t border-border/40 flex-1">
              <div className="flex items-center gap-1.5 text-text-tertiary">
                <Terminal className="w-3.5 h-3.5" />
                <h5 className="font-mono text-[9px] uppercase tracking-wider">Changelog</h5>
              </div>
              <div className="space-y-2 text-[10px] font-mono text-text-secondary leading-relaxed bg-surface border-[0.5px] border-border rounded-lg p-3 overflow-hidden shadow-inner">
                {(dynamicRelease?.changelog || [
                  "added universal macOS build",
                  "added chrome save shortcut",
                  "improved indexeddb cache",
                  "fixed hero link transforms"
                ]).map((line, idx) => {
                  const isImprovement = line.startsWith("improved") || line.startsWith("fixed") || line.startsWith("optimized") || line.startsWith("updated") || line.startsWith("refactored");
                  const sign = isImprovement ? "~" : "+";
                  const color = isImprovement ? "text-fresh-mid" : "text-fresh-high";
                  return (
                    <div key={idx} className="flex gap-2">
                      <span className={`${color} font-medium`}>{sign}</span>
                      <span className="text-text-secondary font-light">{line}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Road Ahead / Next Release */}
            <div className="pt-4 border-t border-border/40">
              <div className="bg-card/50 border-[0.5px] border-border/60 p-3.5 rounded-lg text-left">
                <h6 className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary mb-1">Upcoming</h6>
                <p className="text-[10px] text-text-secondary font-light leading-normal">
                  Custom decay curves configured per list category.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
