# LinkShelf Website — "Your reading list, decaying in real time."

This repository contains the premium, interactive landing website for **LinkShelf** — a cross-device read-later application designed with mathematical decay curves to fight reading list hoarding and digital clutter.

The site is built with **zero heavy frameworks or compile-time dependencies** to achieve sub-second load times, visual pixel precision, and seamless scroll-linked 3D animations.

---

## ✦ Design & Aesthetics

The interface is inspired by high-trust productivity products (e.g., Linear, Raycast, Notion) and implements the following visual guidelines:
* **Atmospheric Mood**: A dark charcoal canvas background (`#08090A`) overlayed with slow-drifting "entropy particles" that respond dynamically to scroll speed and page physics.
* **Psychological Tension**: Color-coded urgency indicators matching the application's decay bands:
  - `> 0.80` **Fresh** (🟢 Emerald Green)
  - `0.50 – 0.80` **Fading** (🟡 Amber Yellow)
  - `0.25 – 0.50` **Stale** (🟠 Burning Orange)
  - `< 0.25` **Critical** (🔴 Crimson Red)
* **Rot & Entropy Texturing**: Critical unread links are rendered with a custom **SVG Fractal Noise filter** overlayed with CSS masking, creating a digital "wear-and-tear" rot effect to visually trigger action.

---

## ✦ Key Features

### 1. Real-Time Inbox Decay Simulator
A functional sandbox in the hero section displaying links that age and decay in real time.
* **Equation Profiles**: Supports toggling between **Exponential Decay** ($0.5^{t/t_{half}}$) and **Linear Decay** ($1.0 - t/(2t_{half})$).
* **Speed Tickers**: Accelerate time from `1x` up to `50,000x` to witness long-term decay transitions in seconds.
* **Queue Priority**: Links sort dynamically, automatically bubbling decaying elements to the top of the pile.
* **Interactable Cards**: Users can **Snooze** links (pausing their decay timer for 5 days of simulated time) or **Read** them (triggering smooth swipe-out transitions).

### 2. Fully Scrolling 3D Mockup
As you scroll down the page, a physical, custom-extruded 3D device mockup rotates in three-dimensional space using hardware-accelerated CSS transformations:
* **Perspective Bounds**: Anchored in a `perspective: 1200px` container.
* **Tab Synchronization**: The device's active mockup tabs (Inbox, Smart Lists, Diagnostics Drawer) transition in sync with the page's narrative scroll position.

### 3. Interactive Engine Graph
An SVG line graph displaying the active mathematical decay curve. Users can drag the global half-life slider from 1 to 21 days, and the SVG path updates dynamically. Moving the mouse across the graph charts the precise coordinates along the curve.

---

## ✦ Architecture & Technology Stack

The landing page leverages modern browser capabilities natively:
* **HTML5**: Semantic tags, accessibility layouts (`aria-label`, correct heading hierarchy).
* **CSS3**: CSS Custom Properties (Variables), modern Flexbox/Grid layouts, and CSS transitions.
* **ES6 Javascript**: Vanilla requestAnimationFrame rendering loops, canvas interaction, and scroll velocity listeners.
* **SVG Filters**: Inline `<feTurbulence>` fractal noise engine mapping realistic rot coordinates onto text.
* **Fallback Systems**: Employs an `IntersectionObserver` scroll listener fallback for browsers without native scroll-driven animations.

---

## ✦ Local Development & Run Guide

To view the landing page locally:

1. **Install dependencies** (uses standard lightweight static file server):
   ```bash
   npm install
   ```

2. **Launch development server**:
   ```bash
   npm run dev
   ```
   This will start hosting the files locally on [http://localhost:3000](http://localhost:3000).
