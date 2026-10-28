# Ankit Singh — Portfolio

**Beyond the Interface: the digital mind of a full stack developer.**

A one-page portfolio built with **Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Motion for React**. It compiles to a fully static site in `out/`, so you can host it anywhere.

---

## Quick start

```bash
npm install          # Node 18.18+ (tested on Node 22)
npm run dev          # http://localhost:3000
```

| Command             | What it does                                      |
| ------------------- | ------------------------------------------------- |
| `npm run dev`       | Local dev server with hot reload                  |
| `npm run build`     | Production build → static files in `out/`         |
| `npm start`         | Serves `out/` locally (`npx serve`)               |
| `npm run lint`      | ESLint (Next.js core-web-vitals + TypeScript)     |
| `npm run typecheck` | `tsc --noEmit`                                    |

## Edit your content

**Everything you'll want to change is in one file: `src/content/portfolio.ts`.**

- `profile`: name, headline, tagline, email, phone (`showPhone`), availability badge (`availability.show`), social links, intro copy, facts and numbers
- `skills` / `skillLayers`: the interactive Toolkit section
- `projects`: case studies (summary, role, what you built, problems solved, stack, `liveUrl`, `repoUrl`)
- `moreProjects`: the "More builds" list
- `experience`, `education`, `certifications`
- `principles`: the "How I work" section
- `flows` / `workshopNodes`: the Workshop request-flow scenarios

Types live in `src/content/types.ts`, so TypeScript flags a missing field.

Assets live in `public/`:
- `public/images/ankit-singh.jpg`: your portrait (replace it with a higher-resolution photo if you have one, and update `photo.width/height`)
- `public/Ankit_Singh_Resume.pdf`: the downloadable résumé
- `public/og.png`: the social share image (1200×630)

## Environment variables

Copy `.env.example` to `.env.local`:

| Variable                   | Required    | Purpose                                                                                                                                                                       |
| -------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`     | Recommended | Your live URL. Used for canonical, Open Graph, `sitemap.xml`, `robots.txt` and JSON-LD. Defaults to `http://localhost:3000`.                                                    |
| `NEXT_PUBLIC_FORMSPREE_ID` | Optional    | A [Formspree](https://formspree.io) form ID. When set, the contact form posts messages directly and shows sent/error states. When empty, the form opens the visitor's email app with the message pre-filled. |

There are no secrets in this project. A Formspree ID is public by design.

## Deploy

**Vercel (recommended):** import the repo and add the environment variables. The framework preset is detected automatically. Because of `output: "export"`, the build output is static.

**Netlify / Cloudflare Pages:** build command `npm run build`, publish directory `out`.

**Hostinger / any static host:** run `npm run build`, then upload the contents of `out/` to `public_html`. To serve the custom 404 page, add `ErrorDocument 404 /404.html` to `.htaccess`.

**GitHub Pages** (served from `/<repo>`): add `basePath: "/<repo>"` to `next.config.ts`.

> If you later need server features (API routes, server actions), remove `output: "export"` from `next.config.ts` and deploy to Vercel or Node.

## Project structure

```
src/
  app/
    layout.tsx        # fonts, metadata, Open Graph, intro-once script
    page.tsx          # section order + Person JSON-LD
    globals.css       # design tokens (@theme), utilities, keyframes
    not-found.tsx     # custom 404
    sitemap.ts · robots.ts · icon.svg
  components/
    Intro.tsx         # CSS-only intro (once per session) + ready context
    Nav.tsx           # active-section pill, live Noida clock, mobile menu, brand mark
    MotionProvider.tsx
    ui/               # MaskText / FadeUp / WipeReveal, Magnetic, Cursor, SectionHeader
    sections/
      Hero.tsx · HeroField.tsx (canvas) · Portrait.tsx
      Profile.tsx · Toolkit.tsx · Workshop.tsx
      Work.tsx · ProjectVisual.tsx · ProjectModal.tsx
      Experience.tsx · Approach.tsx · Contact.tsx
  content/
    portfolio.ts      # ← all your content
    types.ts
  lib/                # motion tokens, site config, hydration-safe reduced-motion hook
public/               # photo, résumé PDF, OG image
```

## What's inside

- **Intro:** a 1.5-second name reveal, pure CSS so it never blocks content. It plays once per browser session and never with reduced motion.
- **Hero:** masked word-by-word headline. Your real photo gets a monochrome and lime duotone treatment; a cursor or finger "lens" reveals the untouched colour photo underneath. The portrait has a 3D tilt and scanline, and the background is a canvas dot-field lit by the cursor (it drifts by itself on touch screens). Scroll parallax runs on desktop only.
- **Profile:** a paragraph whose words light up as you scroll, plus verified numbers (4 insurer APIs, 2 React Native apps, 4 role dashboards).
- **Toolkit:** skills grouped by architecture layer. Hover, focus or tap a skill to see what it's for and which projects used it. There are no skill percentages.
- **Workshop (signature section):** an interactive architecture diagram that animates a real request hop by hop for three scenarios taken from your projects: JWT/RBAC sign-in, a WebRTC video consult, and an insurer quote fan-out. It has play/pause/step controls, a request log, and node inspection. Mobile gets its own vertical layout.
- **Work:** three case studies in different layouts, each with an animated abstract illustration. These are clearly labelled as illustrations, not screenshots. Each case study opens as a full-screen dialog with a deep link (`#work/dr-dermat`), back-button support, Escape to close, and a focus trap.
- **Experience:** a timeline with a scroll-linked progress rail, plus education and certifications.
- **How I work:** a light "paper" section whose corners morph as it scrolls in.
- **Contact:** copy-email with feedback, a validated form (Formspree or email hand-off), phone and LinkedIn.

**Motion stack:** Motion for React only. GSAP and Three.js were deliberately not added, because nothing here needed them.

**Performance and accessibility:**
- The canvas and illustration loops pause when off-screen or when the tab is hidden.
- The device pixel ratio is capped at 2.
- Animations use transforms and opacity.
- `prefers-reduced-motion` disables the intro, parallax, the custom cursor and loops, and makes reveals instant.
- Semantic landmarks, a skip link, visible focus rings, ARIA on tabs, dialogs and live regions, and touch targets of 44px or more.

## Still needs your input

1. **React and Redux certification issuer:** the résumé doesn't name one. It's hidden until you fill it in (`certifications`).
2. **Homwisor and Conceive IVF:** listed under "More builds" with live links. Their descriptions say what each product is. Add your own role if you want to say what you built.
3. **Project screenshots:** add real ones if you have them. The abstract illustrations stand in until then.
4. **Next.js:** this site is built with it, but the résumé doesn't list it, so it isn't claimed in the Toolkit. Add it to `skills` if you want it shown.
5. **Availability badge:** it currently reads "Open to opportunities". Set `availability.show = false` to hide it.
6. **`NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_FORMSPREE_ID`:** set these when you deploy.
7. **Higher-resolution portrait:** the supplied photo is 413×531 px, which is fine at its displayed size but soft on large retina screens.
