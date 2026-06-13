"use client";

export function Footer() {
  return (
    <footer className="relative py-8 md:py-12 px-6 md:px-12 z-10 bg-transparent border-t border-foreground/10 mt-16 md:mt-24">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Left: Brand name and tiny tagline */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2 select-none">
            <span className="font-semibold text-base tracking-tight text-text-primary">LinkShelf</span>
            <div className="w-1.5 h-1.5 rounded-full bg-fresh-high animate-pulse" />
          </div>
          <span className="hidden sm:inline text-text-tertiary">|</span>
          <p className="text-foreground/50 text-xs font-light">
            Your reading list, decaying in real time.
          </p>
        </div>

        {/* Right: Quick Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-mono">
          {[
            { name: "Concept", href: "#philosophy" },
            { name: "Features", href: "#features" },
            { name: "Specs", href: "#architecture" },
            { name: "Download", href: "#download" },
            { name: "GitHub", href: "https://github.com/Stewy8506/LinkShelf", external: true }
          ].map((item) => (
            <a
              key={item.name}
              href={item.href}
              {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              {item.name}
            </a>
          ))}
        </div>
      </div>

      {/* Sub-footer for Copyright */}
      <div className="max-w-6xl mx-auto mt-6 pt-6 border-t border-foreground/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-text-tertiary text-center sm:text-left">
        <span>&copy; {new Date().getFullYear()} LinkShelf. All rights reserved.</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-text-secondary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-text-secondary transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

