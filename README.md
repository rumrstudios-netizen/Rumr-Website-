# Rumr Studios — Website

Plain Vite + React + Tailwind site. No vendor platform, no auth, no backend, no lock-in.

## Run locally

```bash
npm install
npm run dev
```

Open the printed localhost URL.

## Build for production

```bash
npm run build
npm run preview   # to test the built output locally
```

`npm run build` outputs static files to `dist/`. Deploy that folder anywhere
(Netlify, Vercel, GitHub Pages, your own server) — it's plain HTML/CSS/JS.

## Structure

```
src/
  main.jsx          entry point
  App.jsx           routes (Home, About, Services, Work, Contact)
  index.css         global styles + design tokens
  pages/            one file per page
  components/       Navigation, Footer, Hero3D (Three.js), CustomCursor
  data/config.js    site content (brand, nav, services, etc.)
```

## What was removed

The original export was built on a hosted app platform ("anything.ai" /
create.xyz) and shipped with:
- a `__create/` sandbox runtime that phones home to that platform (dev
  server heartbeat, screenshot/postMessage handshake, error reporting)
- `@auth/core` + a `SessionProvider` wired to their hosted auth
- API routes wired to their hosted Postgres (Neon) + Stripe
- a whole separate Expo/React Native mobile app
- a custom `react-router-hono-server` build/serve pipeline tied to their
  infra

None of that was used by the actual site content, so it's gone. What's left
is your real pages/components/design, running on a standard Vite dev
server and building to plain static files — no external service, no
account, no API key required to run or host it.

Contact form currently simulates a submit (no email actually sends). To
wire it up for real, see the comment block in `src/pages/Contact.jsx` →
`handleSubmit` — plug in Formspree, Resend, or EmailJS, whichever you have
a free account for.
