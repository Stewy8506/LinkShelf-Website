# 🚀 LinkShelf — Official Launch Website

> *"Your reading list, decaying in real time."*

This repository contains the official **launch and marketing website** for **LinkShelf** — a cross-device read-later application designed with mathematical decay curves to fight reading list hoarding and digital clutter. 

This site is built to serve as the front door to the LinkShelf app, featuring interactive 3D elements, dynamic scroll animations, and a real-time decay simulator to visually communicate the core value proposition of the app.

---

## ✦ Purpose

While the LinkShelf application itself is where users save and manage their decaying links, **this repository is solely dedicated to the landing page and promotional website**. It is engineered to provide a premium, high-trust first impression through:

* **Interactive Demonstrations**: Allowing users to play with the decay physics before downloading the app.
* **Feature Showcases**: Highlighting key application features like the Inbox Decay Simulator and mathematical decay curves.
* **App Downloads**: Funneling users toward downloading the actual cross-device LinkShelf application.

---

## ✦ Design & Aesthetics

The interface is inspired by high-trust productivity products (e.g., Linear, Raycast, Notion) and implements the following visual guidelines:
* **Atmospheric Mood**: A dark charcoal canvas background overlayed with slow-drifting "entropy particles" that respond dynamically to scroll speed and page physics.
* **Psychological Tension**: Color-coded urgency indicators matching the application's decay bands:
  - `> 0.80` **Fresh** (🟢 Emerald Green)
  - `0.50 – 0.80` **Fading** (🟡 Amber Yellow)
  - `0.25 – 0.50` **Stale** (🟠 Burning Orange)
  - `< 0.25` **Critical** (🔴 Crimson Red)
* **Rot & Entropy Texturing**: Critical unread links are rendered with visual "wear-and-tear" effects to trigger action.

---

## ✦ Key Marketing Features

### 1. Real-Time Inbox Decay Simulator
A functional sandbox in the hero section displaying links that age and decay in real time, serving as a live preview of the app's core mechanic.
* **Speed Tickers**: Accelerate time from `1x` up to `50,000x` to witness long-term decay transitions in seconds.
* **Interactable Cards**: Users can **Snooze** or **Read** simulated links to see how the app behaves.

### 2. Fully Scrolling 3D Mockup
As users scroll down the page, a physical, custom-extruded 3D device mockup rotates in three-dimensional space to showcase the app interface.
* **Hardware Accelerated**: Powered by WebGL and Three.js for buttery-smooth 60fps performance.
* **Tab Synchronization**: The device's active mockup tabs transition in sync with the page's narrative scroll position.

### 3. Interactive Engine Graph
An SVG line graph displaying the active mathematical decay curve. Users can drag the global half-life slider and see how the math behind LinkShelf works under the hood.

---

## ✦ Architecture & Technology Stack

The launch site leverages a modern frontend stack to deliver an app-like promotional experience:
* **Framework**: [Next.js](https://nextjs.org/) & React 19
* **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
* **3D Graphics**: [Three.js](https://threejs.org/) & [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/) for the scroll-linked device mockups.
* **Animations**: [GSAP](https://gsap.com/) & [Framer Motion](https://www.framer.com/motion/) for fluid page transitions.
* **Smooth Scrolling**: [Lenis](https://lenis.darkroom.engineering/) for seamless scroll interpolation.

---

## ✦ Local Development

To run the launch website locally:

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Launch development server**:
   ```bash
   npm run dev
   ```
   
3. **View the site**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.
