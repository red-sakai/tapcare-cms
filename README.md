# TapCare CMS Landing Page

This project is a red-themed TapCare landing page built with Next.js App Router.

## Tech Stack

### Framework
- Next.js `16.1.6` (App Router)

### Languages
- TypeScript / TSX
- CSS (Tailwind CSS v4)

### UI / Libraries
- React `19.2.3`
- React DOM `19.2.3`
- Tailwind CSS `^4`
- React Icons `^5.5.0`
- Lenis `^1.3.17` (smooth scrolling)
- Leaflet `^1.9.4` (map)
- React Leaflet `^5.0.0` (installed dependency)

## Project Sections

Main sections currently implemented in `app/page.tsx`:
- Home
- About Us
- Features
- Tutorial
- Contact (Footer + Map)

## Key Features in the Page

- Sticky pill-style navbar with active section highlighting
- Lenis smooth scroll for section navigation
- Scroll reveal (fade-in) animation using `IntersectionObserver`
- Features carousel with touch swipe and auto-advance
- Tutorial cards with section-specific assets
- Contact section with form layout + Rizal High School map

## Local Development

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Start production server:

```bash
npm run start
```

## Deployment (Vercel)

This project is ready to deploy on Vercel.

### Option 1: Vercel Dashboard
1. Push the project to GitHub/GitLab/Bitbucket.
2. Go to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import the repository.
4. Keep default Next.js build settings.
5. Click **Deploy**.

### Option 2: Vercel CLI

```bash
npm i -g vercel
vercel
```

For production deployment:

```bash
vercel --prod
```

## Scripts

- `npm run dev` – start dev server
- `npm run build` – production build
- `npm run start` – run built app
- `npm run lint` – run lint checks
