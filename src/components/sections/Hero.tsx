"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { DecayingLink } from "../DecayingLink";

export function Hero() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.05], [0.6, 0]);

  const [platform, setPlatform] = useState("macos");
  const [version, setVersion] = useState("v1.0.1");
  const [downloadUrl, setDownloadUrl] = useState("https://github.com/Stewy8506/LinkShelf/releases/latest/download/linkshelf-macos.zip");

  useEffect(() => {
    // 1. Detect OS
    if (typeof window !== "undefined") {
      const userAgent = window.navigator.userAgent.toLowerCase();
      if (userAgent.indexOf("win") !== -1) {
        setPlatform("windows");
      } else if (userAgent.indexOf("android") !== -1) {
        setPlatform("android");
      } else if (userAgent.indexOf("iphone") !== -1 || userAgent.indexOf("ipad") !== -1) {
        setPlatform("ios");
      } else if (userAgent.indexOf("linux") !== -1) {
        setPlatform("chrome");
      } else {
        setPlatform("macos");
      }
    }

    // 2. Fetch latest version from GitHub
    fetch("https://api.github.com/repos/Stewy8506/LinkShelf/releases/latest")
      .then((res) => {
        if (!res.ok) throw new Error("API rate limit or error");
        return res.json();
      })
      .then((data) => {
        const tag = data.tag_name || "v1.0.1";
        setVersion(tag);
        
        const assets = data.assets || [];
        
        // Find macOS asset URL dynamically
        const macAsset = assets.find((a: any) => a.name === "linkshelf-macos.zip");
        const macUrl = macAsset?.browser_download_url || `https://github.com/Stewy8506/LinkShelf/releases/download/${tag}/linkshelf-macos.zip`;
        
        // Find Android asset URL dynamically
        const androidAsset = assets.find((a: any) => a.name === "app-release.aab");
        const androidUrl = androidAsset?.browser_download_url || `https://github.com/Stewy8506/LinkShelf/releases/download/${tag}/app-release.aab`;

        const extAsset = assets.find((a: any) => a.name === "linkshelf-chrome-extension.zip");
        const extensionUrl = extAsset?.browser_download_url || `https://github.com/Stewy8506/LinkShelf/releases/download/${tag}/linkshelf-chrome-extension.zip`;

        if (platform === "macos") {
          setDownloadUrl(macUrl);
        } else if (platform === "android") {
          setDownloadUrl(androidUrl);
        } else if (platform === "chrome") {
          setDownloadUrl(extensionUrl);
        } else {
          setDownloadUrl("#download");
        }
      })
      .catch(() => {
        // Fallback
      });
  }, [platform]);

  const getButtonConfig = () => {
    switch (platform) {
      case "windows":
        return {
          text: "Windows App (Coming Soon)",
          subtext: "WinUI3",
          href: "#download",
          isExternal: false
        };
      case "ios":
        return {
          text: "iOS App (Coming Soon)",
          subtext: "TestFlight",
          href: "#download",
          isExternal: false
        };
      case "android":
        return {
          text: "Download for Android",
          subtext: version,
          href: downloadUrl,
          isExternal: true
        };
      case "chrome":
        return {
          text: "Get Chrome Extension",
          subtext: version,
          href: downloadUrl,
          isExternal: true
        };
      case "macos":
      default:
        return {
          text: "Download for macOS",
          subtext: version,
          href: downloadUrl,
          isExternal: true
        };
    }
  };

  const buttonConfig = getButtonConfig();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 xs:pt-28 md:pt-36 pb-12 md:pb-24 px-4 xs:px-6 md:px-12 overflow-hidden">
      <div className="max-w-5xl w-full z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 md:mb-8 flex items-center gap-2 px-3 py-1 rounded-full border-[0.5px] border-border bg-surface shadow-md"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fresh-high opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-fresh-high"></span>
          </span>
          <span className="text-[10px] font-mono tracking-[0.12em] text-text-secondary uppercase">
            LinkShelf <span className="text-text-primary font-medium">{version}</span>
          </span>
        </motion.div>

        <motion.h1
          style={{ y: y1, opacity }}
          initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl xs:text-5xl sm:text-6xl md:text-8xl xl:text-[100px] font-semibold tracking-tighter leading-[0.9] text-foreground mix-blend-difference"
        >
          Your reading list, <br />
          <span className="text-foreground/50 italic font-light tracking-tight">decaying in real time.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-6 md:mt-12 text-sm xs:text-base md:text-xl text-text-secondary max-w-2xl font-light tracking-wide mix-blend-difference"
        >
          A highly opinionated cross-platform read-later application where saved links lose their freshness, pressure your attention, and eventually rot.
        </motion.p>

        {/* Primary Download CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-6 md:mt-10 flex flex-col sm:flex-row items-center gap-3.5 md:gap-4 z-20 w-full sm:w-auto px-4 sm:px-0"
        >
          <a
            href={buttonConfig.href}
            className="block sm:inline-block w-full sm:w-auto"
            {...(buttonConfig.isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-6 py-3.5 bg-text-primary text-background rounded-full font-semibold text-sm hover:bg-text-primary/95 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              {buttonConfig.text}
              <span className="text-[10px] opacity-60 font-mono">{buttonConfig.subtext}</span>
            </motion.button>
          </a>
          
          <a
            href="#features"
            className="block sm:inline-block w-full sm:w-auto px-6 py-3.5 border-[0.5px] border-border hover:border-text-secondary/40 text-text-secondary hover:text-text-primary bg-card/30 rounded-full font-medium text-sm transition-all text-center justify-center flex items-center gap-2 cursor-pointer"
          >
            Explore features
          </a>
        </motion.div>
        
        {/* Supported Platforms Metadata */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-4 flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-[10px] font-mono uppercase tracking-wider text-text-tertiary z-20 px-4"
        >
          <span>macOS Zip</span>
          <span>&middot;</span>
          <span>Windows App</span>
          <span>&middot;</span>
          <span>Android APK</span>
          <span>&middot;</span>
          <span>Chrome Extension</span>
        </motion.div>
      </div>

      {/* Floating Interactive Links Simulation */}
      <div className="absolute inset-0 z-0 pointer-events-none perspective-1000 hidden xl:block">
        <div className="max-w-[1440px] h-full mx-auto relative">
          <div className="absolute top-[16%] left-[2%] 2xl:left-[6%] rotate-[-8deg] opacity-80 scale-90 2xl:scale-100 pointer-events-auto">
            <DecayingLink title="How to build an atmospheric website" url="design.engineering/atmospheric" freshness={0.92} delay={0.4} className="w-[280px] lg:w-[300px]" />
          </div>
          <div className="absolute top-[62%] right-[1%] 2xl:right-[4%] rotate-[8deg] opacity-70 scale-90 2xl:scale-100 pointer-events-auto">
            <DecayingLink title="The Psychology of Information Overload" url="behavior.io/info-overload" freshness={0.45} delay={0.6} className="w-[300px] lg:w-[320px]" />
          </div>
          <div className="absolute top-[76%] left-[1%] 2xl:left-[5%] rotate-[-4deg] opacity-50 scale-90 2xl:scale-100 pointer-events-auto">
            <DecayingLink title="React 19 compiler internals" url="react.dev/compiler" freshness={0.12} delay={0.8} className="w-[260px] lg:w-[280px]" />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        style={{ opacity: scrollIndicatorOpacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-text-tertiary select-none pointer-events-none hidden md:flex"
      >
        <span className="animate-pulse">Scroll to decay</span>
        <div className="w-5 h-8 rounded-full border border-border/60 flex justify-center p-1.5 bg-card/10">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            className="w-1.5 h-1.5 bg-text-secondary rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}

