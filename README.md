# Wishlys Free — Premium Cinematic Invitation Websites

> An open-source, 100% free recreation and clone of [Wishlys](https://wishlys.com/), engineered with [REA (Reverse Engineer Anything)](https://github.com/morluto/rea).

---

## 🌟 Overview

**Wishlys Free** is a luxury web platform that turns weddings, engagements, birthdays, and celebrations into interactive cinematic websites. Instead of sending static paper cards or flat PDFs, hosts can create an animated, parallax website that:
- Plays custom ambient soundtracks or synthesized palace harmonies.
- Features physical-feel opening reveals (Gold Foil Scratch Cards, Royal Wax Seal Breaks, Velvet Ring Boxes, Teak Doorbells).
- Unfurls into a rich WhatsApp preview card.
- Gathers live RSVPs, headcounts, dietary requirements, and DJ song requests directly into a private Host Dashboard.
- Exports as a **standalone, single-file offline HTML invitation** with zero server dependencies.

---

## 🔬 How REA Was Used for Reverse Engineering

Using **REA (Reverse Engineer Anything)** (`morluto/rea`), we systematically extracted and mapped the core technical architecture of Wishlys:

1. **Passive Browser Scenario & DOM Capture (`capture_browser_scenario`)**:
   - Analyzed the client-side Next.js DOM tree and accessibility hierarchy.
   - Decoded route handlers: `/studio/wedding`, `/studio/engagement`, `/studio/birthday`, `/studio/housewarming`, `/studio/house-party`, `/studio/baby-shower`, `/studio/annaprashan`, `/studio/holy-communion`.

2. **Client Chunks & Component Archaeology**:
   - Inspected minified bundles (`3s-39s536qmjk.js`, `10p7-swpf9a5_.js`, etc.) to extract:
     - **16 Signature Color Palettes** (Ivory, Champagne, Obsidian, Emerald Noir, Royal Sapphire, Ruby Velvet, Pearl Blush, Midnight Amethyst, Olive Sage, Desert Rose, Plum Velvet, Dusty Blue, Rose Gold, Diamond, Wine Velvet, Wisteria Dream).
     - **Reveal Mechanism Specs** (Canvas gold-foil scratching calculations, wax crack audio triggers, box latch animations).
     - **State Schema & Data Models** (Hosts, Multi-day Events, Story Milestones, Guest Groups, RSVP form options).

3. **Reconstruction & Elevation**:
   - Replaced proprietary paywalls (₹1,899 – ₹3,999) with an open, client-side React + Tailwind CSS v4 architecture.
   - Built a custom **Web Audio synthesizer** for realistic sound effects (cracking wax, scratch noise, doorbell chime) and ambient music tracks without external CORS audio dependencies.

---

## ✨ Features

- **Occasion Studio Hub**:
  - Weddings & Save the Dates
  - Engagements & Sagai
  - Birthdays (Kids, Teens, Milestones)
  - Housewarmings & Griha Pravesh
  - House Parties & Diwali Nights
  - Baby Showers & Godh Bharai
  - Annaprashans & Mukhebhat
  - Holy Communions & Baptisms

- **Interactive Reveal Styles**:
  - **Gold Foil Scratch Card**: Canvas-based scrub reveal with real particle friction and threshold detection (>38% triggers completion).
  - **Royal Wax Seal**: Embossed crest on letterpress paper that cracks with satisfying acoustic feedback.
  - **Velvet Ring Box**: 3D velvet jewelry box with gold latch and engraved initials.
  - **Doorbell & Teak Doors**: Ringing doorbell chime with illuminated button and swinging wooden doors.

- **Celebration Particle Engine**:
  - Cascading metallic confetti
  - Marigold & rose flower petals
  - Glowing gold dust sparkles
  - Celebration fireworks

- **Private Host Dashboard**:
  - Live RSVP metrics (Attending headcount, decline count, confirmation rate).
  - Catering breakdown by dietary preference (Vegetarian, Jain, Non-Veg, Vegan).
  - DJ Song Request Jukebox.
  - 1-Click **CSV Export** for wedding planners and caterers.

- **Offline Independence**:
  - 1-Click export to standalone `.html` file that can be opened locally in any browser or hosted on GitHub Pages / Netlify / Vercel for free.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation & Run

```bash
# Navigate to project directory
cd "C:\Users\Amar's PC\.gemini\antigravity\scratch\wishlys-free"

# Install dependencies (already completed)
npm install

# Start local development server
npm run dev

# Build optimized production bundle
npm run build
```

---

## 📂 Project Structure

```
wishlys-free/
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   │   └── HostDashboard.jsx       # Private RSVP & Guest Manager
│   │   ├── invitation/
│   │   │   └── InvitationExperience.jsx # Full Guest Invitation Page
│   │   ├── landing/
│   │   │   └── LandingPage.jsx          # Luxury Homepage & Showcase
│   │   ├── reveals/
│   │   │   ├── ScratchCard.jsx         # Canvas Gold Foil Scratch
│   │   │   ├── WaxSeal.jsx             # Royal Wax Seal Breaking
│   │   │   ├── RingBox.jsx             # Velvet Jewelry Box
│   │   │   └── Doorbell.jsx            # Doorbell & Grand Teak Doors
│   │   └── studio/
│   │       └── StudioWizard.jsx        # 4-Step Studio Editor & Device Simulator
│   ├── data/
│   │   └── presets.js                  # 16 Palettes, Templates, Presets, Defaults
│   ├── utils/
│   │   ├── audio.js                    # Web Audio Synthesizer & SFX Engine
│   │   └── confetti.js                 # Celebration Petal & Sparkle Particles
│   ├── App.jsx                         # Main Routing & State Bridge
│   ├── index.css                       # Luxury Fonts & Tailwind V4 Rules
│   └── main.jsx                        # React Root Mount
├── index.html                          # HTML5 Entry with Cinzel & Cormorant Fonts
├── package.json
└── vite.config.js
```

---

## 📜 License
MIT License. Free for personal, non-commercial, and celebration use.
