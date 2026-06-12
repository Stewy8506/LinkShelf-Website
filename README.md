# LinkShelf — Landing Page

> Your reading list, decaying in real time.

This is the premium landing page for **LinkShelf**, a cross-platform read-later application where saved links decay over time using a dynamic freshness scoring system.

## 🌟 Philosophy

Most read-later apps become infinite graveyards of unread articles. LinkShelf introduces urgency through exponential freshness decay, visual staleness, time pressure, and dynamic prioritization.

This website is designed to embody that philosophy, serving as a psychological and atmospheric introduction to the product.

## 🛠 Tech Stack

The site is engineered for high-performance motion, 3D atmospheric effects, and a premium tactile feel.

- **Framework**: [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) & [GSAP](https://gsap.com/)
- **Smooth Scrolling**: [Lenis](https://lenis.studiofreight.com/)
- **3D Atmosphere**: [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) & [Three.js](https://threejs.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🎨 Design System (The Friction Engine)

The site uses a strict "Freshness" color palette synced with the mobile app to communicate the decay mechanics visually:

- **Freshness High (Day 1)**: `#86EFAC` (Muted sage-green)
- **Freshness Mid (Day 7)**: `#FBBF24` (Warm amber)
- **Freshness Low (Day 30)**: `#FCA5A5` (Dusty rose)

## 🚀 Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. The 3D atmosphere canvas requires WebGL enabled in your browser.

## 🏗 Structure

- `src/app/page.tsx`: The main assembly of the landing page.
- `src/components/sections/`: Individual semantic sections (Hero, Philosophy, Features, Architecture, etc).
- `src/components/AtmosphereCanvas.tsx`: The persistent WebGL 3D particle cloud running behind the site.
- `src/components/SmoothScroll.tsx`: The Lenis smooth scrolling wrapper.
- `src/components/DecayingLink.tsx`: The reusable UI component simulating the decay of a saved link.
