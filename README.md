# WAVZ for Digital Transformation — Website

Bilingual (English / Arabic) corporate website for WAVZ — an enterprise IT solutions provider serving banks, ministries, and large enterprises across MEA.

Built with **Vite + React 18 + Tailwind CSS**. Designed for handoff to development (works on Vercel out of the box, or static-export to cPanel, or convert to a custom WordPress theme).

---

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build for production

```bash
npm run build
```

Outputs to `dist/`. The `dist` folder is fully static and can be deployed to:

- **Vercel / Netlify** — zero-config drop-in
- **cPanel** — upload the contents of `dist/` to `public_html/`
- **Any static host** — S3, Cloudflare Pages, GitHub Pages, etc.

## Preview the production build locally

```bash
npm run preview
```

---

## Project structure

```
wavz-website/
├── index.html                       # Vite entry, fonts, meta tags
├── package.json
├── vite.config.js
├── tailwind.config.js               # Brand color tokens
├── postcss.config.js
└── src/
    ├── main.jsx                     # React mount
    ├── App.jsx                      # Page composition
    ├── styles/
    │   └── index.css                # Tailwind + global animations
    ├── i18n/
    │   ├── translations.js          # 🌐 ALL strings — EN + AR
    │   └── LangContext.jsx          # useLang() hook + provider
    ├── hooks/
    │   └── index.js                 # useReveal, useScrolled
    └── components/
        ├── WavzLogo.jsx             # Brand mark + wordmark (SVG)
        ├── Counter.jsx              # Scroll-triggered counting numbers
        ├── DataCenterDiagram.jsx    # Animated hero showpiece
        ├── Nav.jsx
        ├── Hero.jsx
        ├── LogoStrip.jsx            # Auto-scrolling client marquee
        ├── Offering.jsx             # 3-card "What We Deliver"
        ├── Benchmark.jsx            # Yellow OperationsCenter showcase
        ├── Platform.jsx             # 5 stacked discipline rows
        ├── Architecture.jsx         # Strategy/Operations split diagram
        ├── Results.jsx              # Stats + quote carousel
        ├── Ecosystem.jsx            # Partners / Clients / Frameworks
        ├── Comparison.jsx           # Capability matrix
        ├── FinalCTA.jsx
        └── Footer.jsx
```

---

## Brand system

Sourced from `WAVZ_Fonts___Color_Schema.pdf`. Tokens are exposed in two places:

**Tailwind classes** (`tailwind.config.js`):
- `bg-midnight` `text-midnight` (#082D4A)
- `bg-overjoy` `text-overjoy` (#FFB814)
- `bg-wavzblue` `text-wavzblue` (#1173BD)
- `bg-wavzblue-light` (#97CFFA)

**Inline hex values** are used throughout components for the ~30% of cases where a Tailwind utility would be too verbose (e.g., gradient stops, SVG fills). Search-and-replace `#082D4A`, `#FFB814`, `#1173BD`, `#97CFFA` to globally retune.

**Typography:**
- English: Inter (loaded from Google Fonts in `index.html`)
- Arabic: IBM Plex Sans Arabic (loaded from Google Fonts)
- Mono: JetBrains Mono

> **Note on the brand manual.** The PDF lists "Adobe Fan Heiti Std" as the Arabic typeface, but Adobe Fan Heiti is a CJK font and does not contain Arabic glyphs. **IBM Plex Sans Arabic** is used instead — pairs cleanly with Inter and reads as enterprise-grade. If the client formally adopts a different Arabic typeface, swap the import in `index.html` and the `font-arabic` stack in `tailwind.config.js` and `src/styles/index.css`.

---

## Bilingual (EN / AR)

The whole site flips between English (LTR) and Arabic (RTL) via the toggle in the top-right of the nav.

**How it works:**
- `LangProvider` (`src/i18n/LangContext.jsx`) holds the active language and direction.
- It writes `dir="rtl|ltr"` and `lang="en|ar"` onto `<html>` whenever the language changes.
- Components access strings via the `useLang()` hook → `t.section.key`.
- Tailwind logical properties (`ms-*` `me-*` `ps-*` `pe-*` `start-*` `end-*` `text-start` `text-end`) ensure the layout mirrors automatically.
- Direction-sensitive icons (arrows, chevrons) flip via `dir === 'rtl' ? 'rotate-180' : ''` patterns in JSX.
- Latin brand names (WAVZ, SAP, Temenos, etc.) keep `dir="ltr"` even inside Arabic text.

**To edit copy:** Open `src/i18n/translations.js`. Both languages are side-by-side; add/edit keys in pairs.

**To add a third language:** Add a key (e.g., `fr`) to `translations.js`, extend the `setLang` toggle in `Nav.jsx`, and you're done. No component changes required.

---

## Animations

All custom animations live in `src/styles/index.css`. Names:

| Class | What it does |
|---|---|
| `.led-blink` | Server rack LED blink (1.4s) |
| `.rack-bob` | Server rack gentle vertical bob (4s) |
| `.cloud-float` | Cloud node float (5s) |
| `.orch-pulse-1` / `.orch-pulse-2` | Orchestrator pulse rings (3s, staggered) |
| `.orch-rotate` | Orchestrator orbit ring rotation (20s) |
| `.animate-marquee` | Logo strip scroll (50s) |

The hero data-center diagram also uses inline `<animateMotion>` SVG elements for the data packets traveling along the connector paths — no JS required.

---

## Deployment notes

### Vercel (recommended)

```bash
npm i -g vercel
vercel
```

That's it. Vercel auto-detects Vite.

### cPanel / shared hosting

```bash
npm run build
# upload contents of dist/ to public_html/
```

You'll need to ensure SPA fallback routing if you add multi-page navigation later (e.g., `.htaccess` rewriting all routes to `index.html`).

### Custom WordPress theme

If the client needs WordPress to manage news/blog content, treat this React design as the **visual reference** and have the dev agency rebuild it as a custom theme. Use Polylang or WPML for the EN/AR multilingual layer (not the React `LangContext`).

---

## What's complete vs what's next

**Complete (homepage, this repo):**
- ✅ Nav with EN/AR toggle, scroll state, mobile menu
- ✅ Hero with animated data-center diagram
- ✅ Client/partner logo marquee
- ✅ "What We Deliver" 3-card offering
- ✅ Yellow-bordered OperationsCenter showcase
- ✅ 5-row platform discipline list
- ✅ Strategy/Operations architecture diagram
- ✅ Results stats + quote carousel
- ✅ Ecosystem grid
- ✅ Capability comparison table
- ✅ Final CTA
- ✅ Footer
- ✅ Full responsive (375 / 768 / 1440)
- ✅ Full RTL Arabic support

**Pages still to design:**
- About WAVZ
- Solutions hub
- Service detail template (one design, reused for all 5: SAP, Financial, Payments, Managed, Digital Transformation)
- Our Partners
- Press Room & News (list)
- News article detail
- Careers / Job Openings
- Contact

When you continue elsewhere, give the new tool this repo + the page list and ask for one page at a time, matching the existing aesthetic.

---

## Credits

Design system inspired by SwarmOne's editorial/technical aesthetic, retuned to WAVZ brand tokens.

© 2026 WAVZ for Digital Transformation. All rights reserved.
